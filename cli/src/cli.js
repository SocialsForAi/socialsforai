import { chmodSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, extname, join } from "node:path";
import { integer, jsonFlag, list, parseArgs, UsageError } from "./args.js";

const DEFAULT_BASE_URL = "https://socialsforai.com";
const MCP_PATH = "/api/mcp";
const SMALL_UPLOAD_MAX = 4 * 1024 * 1024;
const PLANS = ["hobby", "pro", "growth", "scale"];

const CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
};

const HELP = `socials: command-line client for the SocialsForAI API (https://socialsforai.com)

Usage: socials <command> [options]        (also installed as: socialsforai)

Setup
  signup [--name N] [--email E]           Create a workspace and save its API key (no account needed first)
  login --key sk_...                      Save an existing API key
  whoami                                  Show the workspace this key belongs to
  platforms                               Networks and their limits (no key needed)
  usage                                   Active accounts, posts, plan and estimated cost this month
  upgrade <hobby|pro|growth|scale>        Get a checkout link for a human to pay

Accounts
  accounts [--platform P] [--ref R] [--status S]
  connect [--platforms x,linkedin] [--ref R] [--redirect-url U] [--expires-in SEC] [--wait] [--until all|any]
                                          Create a link the account owner opens to connect accounts
  connect-account --platform P --credentials '{...}' [--ref R]
                                          Connect Bluesky, Mastodon or Telegram with credentials

Posts
  post --accounts a,b --text "..." [--media URL]... [--link URL] [--schedule ISO] [--timezone TZ]
       [--dry-run] [--approval] [--idempotency-key K] [--no-wait] [--json '{...}']
                                          Publish now or schedule. --text - reads the text from stdin
  posts [--status S] [--limit N] [--before post_id]
  get <post_id> [--wait]                  --wait holds while the post is pending approval
  delete <post_id> [--accounts a,b]       Cancel unpublished copies, delete published ones
  metrics <post_id>
  upload <file> [--content-type T]        Upload an image or video; prints a url for --media

Keys and webhooks
  keys list
  keys create [--name N] [--scopes a,b] [--account-ids a,b] [--require-approval] [--daily-post-limit N]
  keys revoke <key_id>
  webhooks list
  webhooks create --url U [--events a,b]
  webhooks delete <webhook_id>

Agents
  mcp-config [--client claude-code|cursor|vscode|json]
                                          Print how to add the MCP server to a client

Global options
  --api-key sk_...    Use this key (default: SOCIALSFORAI_API_KEY, SOCIALS_API_KEY, then the saved config)
  --base-url URL      API base (default: SOCIALSFORAI_BASE_URL, then ${DEFAULT_BASE_URL})
  --timeout SEC       Give up waiting after this many seconds with --wait (default 600)
  --help, --version

Output is JSON on stdout. API errors print the error JSON (with its "fix") on stderr and exit 1.
Usage mistakes exit 2. Docs: ${DEFAULT_BASE_URL}/llms.txt
`;

class ApiFailure extends Error {
  constructor(status, body) {
    super(`HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

function version() {
  return JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).version;
}

function configPath(env) {
  if (env.SOCIALSFORAI_CONFIG) return env.SOCIALSFORAI_CONFIG;
  const root = env.XDG_CONFIG_HOME || join(homedir(), ".config");
  return join(root, "socialsforai", "config.json");
}

function readConfig(env) {
  try {
    return JSON.parse(readFileSync(configPath(env), "utf8"));
  } catch {
    return {};
  }
}

function writeConfig(env, config) {
  const file = configPath(env);
  mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
  writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });
  chmodSync(file, 0o600); // writeFileSync keeps the old mode when the file already existed
  return file;
}

/** Everything a command needs: parsed flags, the resolved base URL and key, and request helpers. */
function createContext(flags, io) {
  const env = io.env;
  const config = readConfig(env);
  const baseUrl = String(flags["base-url"] ?? env.SOCIALSFORAI_BASE_URL ?? config.base_url ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
  const apiKey = flags["api-key"] ?? env.SOCIALSFORAI_API_KEY ?? env.SOCIALS_API_KEY ?? config.api_key;

  async function request(method, path, opts = {}) {
    const { body, query, auth = true, headers = {}, raw } = opts;
    if (auth && !apiKey) {
      throw new UsageError("No API key. Run `socials signup` to create a workspace, `socials login --key sk_...`, or set SOCIALSFORAI_API_KEY.");
    }
    const url = new URL(baseUrl + path);
    for (const [k, v] of Object.entries(query ?? {})) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
    const init = {
      method,
      headers: {
        Accept: "application/json",
        "User-Agent": `socialsforai-cli/${version()}`,
        ...(auth && apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        ...headers,
      },
    };
    if (raw !== undefined) {
      init.body = raw;
    } else if (body !== undefined) {
      init.body = JSON.stringify(body);
      init.headers["Content-Type"] = "application/json";
    }
    let res;
    try {
      res = await fetch(url, init);
    } catch (e) {
      throw new ApiFailure(0, { error: { code: "network_error", message: `Could not reach ${url.origin}: ${e?.cause?.message ?? e.message}`, fix: "Check the network connection and --base-url, then retry." } });
    }
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { error: { code: "non_json_response", message: `The server answered ${res.status} with a body that is not JSON.` } };
      if (res.ok) throw new ApiFailure(res.status, data);
    }
    if (!res.ok) {
      const requestId = res.headers.get("request-id");
      if (data?.error && requestId && !data.error.request_id) data.error.request_id = requestId;
      const retryAfter = res.headers.get("retry-after");
      if (data?.error && retryAfter) data.error.retry_after_seconds = Number(retryAfter);
      throw new ApiFailure(res.status, data?.error ? data : { error: { code: `http_${res.status}`, message: text.slice(0, 500) } });
    }
    return data;
  }

  return { flags, env, config, baseUrl, apiKey, request, io };
}

function need(value, message) {
  if (value === undefined || value === null || value === "" || value === true) throw new UsageError(message);
  return value;
}

async function readStdin(io) {
  const chunks = [];
  for await (const chunk of io.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8").replace(/\n$/, "");
}

function waitBudget(flags) {
  const seconds = integer(flags.timeout, "timeout") ?? 600;
  return Date.now() + seconds * 1000;
}

const commands = {
  async signup(ctx) {
    if (ctx.config.api_key && !ctx.flags.force && !ctx.flags["no-save"]) {
      throw new UsageError(`A key is already saved in ${configPath(ctx.env)}. Pass --force to replace it, or --no-save to leave it alone.`);
    }
    const body = {};
    if (ctx.flags.name) body.name = ctx.flags.name;
    if (ctx.flags.email) body.email = ctx.flags.email;
    const res = await ctx.request("POST", "/v1/workspaces", { body, auth: false });
    if (ctx.flags["no-save"]) return res;
    const saved = writeConfig(ctx.env, { ...ctx.config, api_key: res.api_key, workspace_id: res.id, ...(ctx.flags["base-url"] ? { base_url: ctx.baseUrl } : {}) });
    return { ...res, saved_to: saved };
  },

  async login(ctx) {
    const key = need(ctx.flags.key ?? ctx.flags["api-key"], "Pass the key: socials login --key sk_...");
    const workspace = await createContext({ ...ctx.flags, "api-key": key }, ctx.io).request("GET", "/v1/workspace");
    const saved = writeConfig(ctx.env, { ...ctx.config, api_key: key, workspace_id: workspace.id, ...(ctx.flags["base-url"] ? { base_url: ctx.baseUrl } : {}) });
    return { ...workspace, saved_to: saved };
  },

  whoami: (ctx) => ctx.request("GET", "/v1/workspace"),
  platforms: (ctx) => ctx.request("GET", "/v1/platforms", { auth: false }),
  usage: (ctx) => ctx.request("GET", "/v1/usage"),

  async upgrade(ctx, [plan]) {
    if (!PLANS.includes(plan)) throw new UsageError(`Name a plan: socials upgrade <${PLANS.join("|")}>`);
    return ctx.request("POST", "/v1/upgrade-links", { body: { plan } });
  },

  accounts: (ctx) =>
    ctx.request("GET", "/v1/accounts", { query: { platform: ctx.flags.platform, external_ref: ctx.flags.ref, status: ctx.flags.status } }),

  async connect(ctx) {
    const body = {};
    const platforms = list(ctx.flags.platforms);
    if (platforms) body.platforms = platforms;
    if (ctx.flags.ref) body.external_ref = ctx.flags.ref;
    if (ctx.flags["redirect-url"]) body.redirect_url = ctx.flags["redirect-url"];
    const expires = integer(ctx.flags["expires-in"], "expires-in");
    if (expires !== undefined) body.expires_in = expires;
    const link = await ctx.request("POST", "/v1/connect-links", { body });
    if (!ctx.flags.wait) return link;
    // The owner needs the link while we wait, and stdout is reserved for the final JSON.
    ctx.io.stderr.write(`Open this link to connect accounts: ${link.url}\n`);
    const until = ctx.flags.until === "any" ? "any" : "all";
    const deadline = waitBudget(ctx.flags);
    let result;
    do {
      result = await ctx.request("GET", `/v1/connect-links/${encodeURIComponent(link.id)}`, { query: { wait: 45, until } });
    } while ((result.status === "waiting" || (until === "all" && result.status === "partially_connected")) && Date.now() < deadline);
    return { ...link, result };
  },

  async "connect-account"(ctx) {
    const platform = need(ctx.flags.platform, "Pass --platform bluesky|mastodon|telegram.");
    const credentials = need(jsonFlag(ctx.flags.credentials, "credentials"), "Pass --credentials as JSON, for example '{\"identifier\":\"me.bsky.social\",\"app_password\":\"...\"}'.");
    return ctx.request("POST", "/v1/accounts", { body: { platform, credentials, ...(ctx.flags.ref ? { external_ref: ctx.flags.ref } : {}) } });
  },

  async post(ctx) {
    const f = ctx.flags;
    const body = { ...(jsonFlag(f.json, "json") ?? {}) };
    const accounts = list(f.accounts);
    if (accounts) body.accounts = accounts;
    if (f.text !== undefined) body.text = f.text === "-" ? await readStdin(ctx.io) : String(f.text);
    if (f.media) body.media = [...(body.media ?? []), ...f.media.map((url) => ({ url }))];
    if (f.link) body.link = { ...(body.link ?? {}), url: f.link };
    if (f.schedule) body.scheduled_at = f.schedule;
    if (f.timezone) body.timezone = f.timezone;
    if (f["dry-run"]) body.dry_run = true;
    if (f.approval) body.approval = "required";
    if (f["no-wait"]) body.wait = false;
    else if (body.wait === undefined) body.wait = true;
    if (!body.accounts?.length) throw new UsageError("Pass --accounts with account ids or network names, for example --accounts acc_123,linkedin.");
    const headers = f["idempotency-key"] ? { "Idempotency-Key": String(f["idempotency-key"]) } : {};
    return ctx.request("POST", "/v1/posts", { body, headers });
  },

  posts: (ctx) =>
    ctx.request("GET", "/v1/posts", { query: { status: ctx.flags.status, limit: integer(ctx.flags.limit, "limit"), before: ctx.flags.before } }),

  async get(ctx, [id]) {
    need(id, "Pass the post id: socials get post_...");
    const path = `/v1/posts/${encodeURIComponent(id)}`;
    if (!ctx.flags.wait) return ctx.request("GET", path);
    const deadline = waitBudget(ctx.flags);
    let post;
    do {
      post = await ctx.request("GET", path, { query: { wait: 45 } });
    } while (post.status === "pending_approval" && Date.now() < deadline);
    return post;
  },

  async delete(ctx, [id]) {
    need(id, "Pass the post id: socials delete post_...");
    return ctx.request("DELETE", `/v1/posts/${encodeURIComponent(id)}`, { query: { accounts: list(ctx.flags.accounts)?.join(",") } });
  },

  async metrics(ctx, [id]) {
    need(id, "Pass the post id: socials metrics post_...");
    return ctx.request("GET", `/v1/posts/${encodeURIComponent(id)}/metrics`);
  },

  async upload(ctx, [file]) {
    need(file, "Pass a file: socials upload ./image.png");
    if (!existsSync(file)) throw new UsageError(`No such file: ${file}`);
    const contentType = ctx.flags["content-type"] ?? CONTENT_TYPES[extname(file).toLowerCase()];
    if (!contentType) {
      throw new UsageError(`Can't tell the type of ${file}. Pass --content-type (one of: ${[...new Set(Object.values(CONTENT_TYPES))].join(", ")}).`);
    }
    const size = statSync(file).size;
    const bytes = readFileSync(file);
    if (size <= SMALL_UPLOAD_MAX) {
      return ctx.request("POST", "/v1/media", { raw: bytes, headers: { "Content-Type": contentType } });
    }
    const upload = await ctx.request("POST", "/v1/media/uploads", { body: { content_type: contentType, size_bytes: size } });
    let put;
    try {
      put = await fetch(upload.upload_url, { method: upload.method ?? "PUT", headers: upload.headers ?? { "Content-Type": contentType }, body: bytes });
    } catch (e) {
      throw new ApiFailure(0, { error: { code: "upload_failed", message: `The upload could not be sent: ${e?.cause?.message ?? e.message}`, fix: "Retry the upload." } });
    }
    if (!put.ok) {
      throw new ApiFailure(put.status, { error: { code: "upload_failed", message: `The storage upload answered ${put.status}.`, fix: "Run the upload again to get a fresh upload URL." } });
    }
    return { object: "media", url: upload.url, content_type: contentType, size_bytes: size };
  },

  async keys(ctx, [action, id]) {
    if (action === "list" || action === undefined) return ctx.request("GET", "/v1/keys");
    if (action === "create") {
      const body = {};
      if (ctx.flags.name) body.name = ctx.flags.name;
      const scopes = list(ctx.flags.scopes);
      if (scopes) body.scopes = scopes;
      const accountIds = list(ctx.flags["account-ids"]);
      if (accountIds) body.account_ids = accountIds;
      if (ctx.flags["require-approval"]) body.require_approval = true;
      const limit = integer(ctx.flags["daily-post-limit"], "daily-post-limit");
      if (limit !== undefined) body.daily_post_limit = limit;
      return ctx.request("POST", "/v1/keys", { body });
    }
    if (action === "revoke") {
      need(id, "Pass the key id: socials keys revoke key_...");
      return ctx.request("DELETE", `/v1/keys/${encodeURIComponent(id)}`);
    }
    throw new UsageError("Usage: socials keys list | create | revoke <key_id>");
  },

  async webhooks(ctx, [action, id]) {
    if (action === "list" || action === undefined) return ctx.request("GET", "/v1/webhooks");
    if (action === "create") {
      const url = need(ctx.flags.url, "Pass --url https://your-server.example/hook");
      const events = list(ctx.flags.events);
      return ctx.request("POST", "/v1/webhooks", { body: { url, ...(events ? { events } : {}) } });
    }
    if (action === "delete") {
      need(id, "Pass the webhook id: socials webhooks delete wh_...");
      return ctx.request("DELETE", `/v1/webhooks/${encodeURIComponent(id)}`);
    }
    throw new UsageError("Usage: socials webhooks list | create --url U [--events a,b] | delete <webhook_id>");
  },

  async "mcp-config"(ctx) {
    const url = ctx.baseUrl + MCP_PATH;
    const client = ctx.flags.client ?? "json";
    if (client === "claude-code") return `claude mcp add --transport http socials ${url}`;
    if (client === "cursor" || client === "json") return { mcpServers: { socials: { url } } };
    if (client === "vscode") return { servers: { socials: { type: "http", url } } };
    throw new UsageError("--client must be one of: claude-code, cursor, vscode, json");
  },
};

function print(stream, value) {
  stream.write(typeof value === "string" ? `${value}\n` : `${JSON.stringify(value, null, 2)}\n`);
}

/** Run the CLI. Returns the exit code: 0 ok, 1 API or network error, 2 usage error. */
export async function main(argv, io = { stdout: process.stdout, stderr: process.stderr, stdin: process.stdin, env: process.env }) {
  let parsed;
  try {
    parsed = parseArgs(argv);
  } catch (e) {
    print(io.stderr, { error: { code: "usage", message: e.message, fix: "Run `socials --help`." } });
    return 2;
  }
  const { positionals, flags } = parsed;
  const [name, ...rest] = positionals;
  if (flags.version) {
    print(io.stdout, version());
    return 0;
  }
  if (flags.help || !name || name === "help") {
    io.stdout.write(HELP);
    return 0;
  }
  const command = commands[name];
  if (!command) {
    print(io.stderr, { error: { code: "usage", message: `Unknown command "${name}".`, fix: "Run `socials --help` for the list of commands." } });
    return 2;
  }
  try {
    print(io.stdout, await command(createContext(flags, io), rest));
    return 0;
  } catch (e) {
    if (e instanceof UsageError) {
      print(io.stderr, { error: { code: "usage", message: e.message, fix: "Run `socials --help`." } });
      return 2;
    }
    if (e instanceof ApiFailure) {
      print(io.stderr, e.body);
      return 1;
    }
    throw e;
  }
}
