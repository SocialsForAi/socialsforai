import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";

const BIN = fileURLToPath(new URL("../bin/socials.js", import.meta.url));

/** A local stand-in for the API. Each test sets `routes`; every request is recorded in `seen`. */
let server;
let base;
let routes = {};
let seen = [];

before(async () => {
  server = createServer((req, res) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const url = new URL(req.url, "http://mock");
      const body = Buffer.concat(chunks);
      const record = { method: req.method, path: url.pathname, query: Object.fromEntries(url.searchParams), headers: req.headers, body };
      seen.push(record);
      const handler = routes[`${req.method} ${url.pathname}`];
      const out = handler ? handler(record) : { status: 404, json: { error: { code: "not_found", message: "No such endpoint." } } };
      res.writeHead(out.status ?? 200, { "Content-Type": "application/json", ...(out.headers ?? {}) });
      res.end(out.json === undefined ? "" : JSON.stringify(out.json));
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

let configHome;
beforeEach(() => {
  routes = {};
  seen = [];
  configHome = mkdtempSync(join(tmpdir(), "socials-cli-"));
});

function run(args, { env = {}, input } = {}) {
  return new Promise((resolve) => {
    const child = execFile(
      process.execPath,
      [BIN, ...args],
      {
        env: {
          PATH: process.env.PATH,
          XDG_CONFIG_HOME: configHome,
          SOCIALSFORAI_BASE_URL: base,
          ...env,
        },
      },
      (error, stdout, stderr) => resolve({ code: error ? error.code : 0, stdout, stderr }),
    );
    if (input !== undefined) child.stdin.end(input);
  });
}

const KEY = { SOCIALSFORAI_API_KEY: "sk_test_key" };
const configFile = () => join(configHome, "socialsforai", "config.json");

test("signup creates a workspace without a key and saves it with mode 0600", async () => {
  routes["POST /v1/workspaces"] = () => ({ status: 201, json: { object: "workspace", id: "ws_1", api_key: "sk_new" } });
  const r = await run(["signup", "--name", "My agent", "--email", "owner@example.com"]);
  assert.equal(r.code, 0, r.stderr);
  assert.equal(seen[0].headers.authorization, undefined);
  assert.deepEqual(JSON.parse(seen[0].body), { name: "My agent", email: "owner@example.com" });
  assert.equal(JSON.parse(r.stdout).saved_to, configFile());
  assert.equal(JSON.parse(readFileSync(configFile(), "utf8")).api_key, "sk_new");
  assert.equal(statSync(configFile()).mode & 0o777, 0o600);

  // The saved key is used by later commands, and a second signup refuses to overwrite it.
  routes["GET /v1/workspace"] = () => ({ json: { object: "workspace", id: "ws_1" } });
  await run(["whoami"]);
  assert.equal(seen.at(-1).headers.authorization, "Bearer sk_new");
  const again = await run(["signup"]);
  assert.equal(again.code, 2);
  assert.match(JSON.parse(again.stderr).error.message, /already saved/);
});

test("login verifies the key before saving it", async () => {
  routes["GET /v1/workspace"] = (req) =>
    req.headers.authorization === "Bearer sk_good" ? { json: { object: "workspace", id: "ws_9" } } : { status: 401, json: { error: { code: "invalid_api_key", message: "bad", fix: "Check the key." } } };
  const bad = await run(["login", "--key", "sk_bad"]);
  assert.equal(bad.code, 1);
  assert.equal(JSON.parse(bad.stderr).error.code, "invalid_api_key");
  const good = await run(["login", "--key", "sk_good"]);
  assert.equal(good.code, 0, good.stderr);
  assert.equal(JSON.parse(readFileSync(configFile(), "utf8")).api_key, "sk_good");
});

test("a command that needs a key says how to get one", async () => {
  const r = await run(["accounts"]);
  assert.equal(r.code, 2);
  assert.match(JSON.parse(r.stderr).error.message, /socials signup/);
  assert.equal(seen.length, 0);
});

test("SOCIALS_API_KEY is accepted, and SOCIALSFORAI_API_KEY wins over it", async () => {
  routes["GET /v1/usage"] = () => ({ json: { object: "usage" } });
  await run(["usage"], { env: { SOCIALS_API_KEY: "sk_short" } });
  assert.equal(seen.at(-1).headers.authorization, "Bearer sk_short");
  await run(["usage"], { env: { SOCIALS_API_KEY: "sk_short", SOCIALSFORAI_API_KEY: "sk_long" } });
  assert.equal(seen.at(-1).headers.authorization, "Bearer sk_long");
});

test("platforms needs no key", async () => {
  routes["GET /v1/platforms"] = () => ({ json: { object: "list", data: [{ id: "bluesky" }] } });
  const r = await run(["platforms"]);
  assert.equal(r.code, 0, r.stderr);
  assert.equal(JSON.parse(r.stdout).data[0].id, "bluesky");
  assert.equal(seen[0].headers.authorization, undefined);
});

test("post builds the request body, waits by default and sends the idempotency key", async () => {
  routes["POST /v1/posts"] = () => ({ status: 201, json: { object: "post", id: "post_1", status: "published" } });
  const r = await run(
    ["post", "--accounts", "acc_1, linkedin", "--text", "Hello", "--media", "https://x.test/a.png", "--media", "https://x.test/b.png", "--link", "https://x.test", "--schedule", "2026-12-01T09:00", "--timezone", "America/Los_Angeles", "--approval", "--idempotency-key", "launch-1", "--json", '{"metadata":{"campaign":"q4"},"text":"overridden"}'],
    { env: KEY },
  );
  assert.equal(r.code, 0, r.stderr);
  assert.equal(seen[0].headers["idempotency-key"], "launch-1");
  assert.equal(seen[0].headers.authorization, "Bearer sk_test_key");
  assert.deepEqual(JSON.parse(seen[0].body), {
    metadata: { campaign: "q4" },
    text: "Hello",
    accounts: ["acc_1", "linkedin"],
    media: [{ url: "https://x.test/a.png" }, { url: "https://x.test/b.png" }],
    link: { url: "https://x.test" },
    scheduled_at: "2026-12-01T09:00",
    timezone: "America/Los_Angeles",
    approval: "required",
    wait: true,
  });
  assert.equal(JSON.parse(r.stdout).id, "post_1");
});

test("post --dry-run --no-wait, with the text read from stdin", async () => {
  routes["POST /v1/posts"] = () => ({ json: { object: "preflight", ok: true, issues: [] } });
  const r = await run(["post", "--accounts", "x", "--text", "-", "--dry-run", "--no-wait"], { env: KEY, input: "From stdin\n" });
  assert.equal(r.code, 0, r.stderr);
  assert.deepEqual(JSON.parse(seen[0].body), { accounts: ["x"], text: "From stdin", dry_run: true, wait: false });
});

test("post without accounts is a usage error and sends nothing", async () => {
  const r = await run(["post", "--text", "Hello"], { env: KEY });
  assert.equal(r.code, 2);
  assert.equal(seen.length, 0);
});

test("API errors go to stderr with the fix and request id, and exit 1", async () => {
  routes["POST /v1/posts"] = () => ({
    status: 422,
    headers: { "Request-Id": "req_abc" },
    json: { error: { code: "preflight_failed", message: "The post would fail on 1 check(s).", fix: "Fix the issues below.", issues: [{ code: "text_too_long", severity: "error" }] } },
  });
  const r = await run(["post", "--accounts", "x", "--text", "long"], { env: KEY });
  assert.equal(r.code, 1);
  assert.equal(r.stdout, "");
  const err = JSON.parse(r.stderr).error;
  assert.equal(err.code, "preflight_failed");
  assert.equal(err.fix, "Fix the issues below.");
  assert.equal(err.issues[0].code, "text_too_long");
  assert.equal(err.request_id, "req_abc");
});

test("a 429 reports Retry-After", async () => {
  routes["GET /v1/accounts"] = () => ({ status: 429, headers: { "Retry-After": "17" }, json: { error: { code: "rate_limited", message: "Too many requests.", request_id: "req_1" } } });
  const r = await run(["accounts"], { env: KEY });
  assert.equal(r.code, 1);
  assert.equal(JSON.parse(r.stderr).error.retry_after_seconds, 17);
});

test("accounts passes its filters as query parameters", async () => {
  routes["GET /v1/accounts"] = () => ({ json: { object: "list", data: [] } });
  await run(["accounts", "--platform", "x", "--ref", "client-42"], { env: KEY });
  assert.deepEqual(seen[0].query, { platform: "x", external_ref: "client-42" });
});

test("connect --wait prints the link on stderr and polls until connected", async () => {
  let polls = 0;
  routes["POST /v1/connect-links"] = () => ({ status: 201, json: { id: "cl_1", url: "https://connect.test/abc" } });
  routes["GET /v1/connect-links/cl_1"] = () => ({ json: ++polls < 3 ? { status: "waiting", connected: [] } : { status: "connected", connected: [{ id: "acc_1" }] } });
  const r = await run(["connect", "--platforms", "x,linkedin", "--ref", "client-42", "--wait"], { env: KEY });
  assert.equal(r.code, 0, r.stderr);
  assert.deepEqual(JSON.parse(seen[0].body), { platforms: ["x", "linkedin"], external_ref: "client-42" });
  assert.match(r.stderr, /https:\/\/connect\.test\/abc/);
  assert.equal(polls, 3);
  assert.deepEqual(seen[1].query, { wait: "45", until: "all" });
  const out = JSON.parse(r.stdout);
  assert.equal(out.url, "https://connect.test/abc");
  assert.equal(out.result.status, "connected");
});

test("connect-account sends parsed credentials", async () => {
  routes["POST /v1/accounts"] = () => ({ status: 201, json: { id: "acc_2" } });
  const r = await run(["connect-account", "--platform", "bluesky", "--credentials", '{"identifier":"me.bsky.social","app_password":"abcd"}'], { env: KEY });
  assert.equal(r.code, 0, r.stderr);
  assert.deepEqual(JSON.parse(seen[0].body), { platform: "bluesky", credentials: { identifier: "me.bsky.social", app_password: "abcd" } });
  const bad = await run(["connect-account", "--platform", "bluesky", "--credentials", "{not json"], { env: KEY });
  assert.equal(bad.code, 2);
});

test("get --wait long-polls while the post is pending approval", async () => {
  let polls = 0;
  routes["GET /v1/posts/post_1"] = () => ({ json: ++polls < 2 ? { id: "post_1", status: "pending_approval" } : { id: "post_1", status: "published", approval: { status: "approved" } } });
  const r = await run(["get", "post_1", "--wait"], { env: KEY });
  assert.equal(r.code, 0, r.stderr);
  assert.equal(polls, 2);
  assert.deepEqual(seen[0].query, { wait: "45" });
  assert.equal(JSON.parse(r.stdout).approval.status, "approved");
});

test("delete, metrics and posts hit the right endpoints", async () => {
  routes["DELETE /v1/posts/post_1"] = () => ({ json: { id: "post_1", status: "deleted" } });
  routes["GET /v1/posts/post_1/metrics"] = () => ({ json: { totals: { likes: 3 } } });
  routes["GET /v1/posts"] = () => ({ json: { object: "list", data: [] } });
  await run(["delete", "post_1", "--accounts", "acc_1,acc_2"], { env: KEY });
  assert.deepEqual(seen[0].query, { accounts: "acc_1,acc_2" });
  const m = await run(["metrics", "post_1"], { env: KEY });
  assert.equal(JSON.parse(m.stdout).totals.likes, 3);
  await run(["posts", "--status", "scheduled", "--limit", "5"], { env: KEY });
  assert.deepEqual(seen[2].query, { status: "scheduled", limit: "5" });
});

test("upload sends a small file as raw bytes with its content type", async () => {
  const file = join(configHome, "pic.png");
  writeFileSync(file, Buffer.from([1, 2, 3, 4]));
  routes["POST /v1/media"] = () => ({ status: 201, json: { url: "https://socialsforai.com/m/1" } });
  const r = await run(["upload", file], { env: KEY });
  assert.equal(r.code, 0, r.stderr);
  assert.equal(seen[0].headers["content-type"], "image/png");
  assert.deepEqual([...seen[0].body], [1, 2, 3, 4]);
  assert.equal(JSON.parse(r.stdout).url, "https://socialsforai.com/m/1");
});

test("upload sends a large file through a signed upload URL", async () => {
  const file = join(configHome, "clip.mp4");
  const size = 4 * 1024 * 1024 + 10;
  writeFileSync(file, Buffer.alloc(size, 7));
  routes["POST /v1/media/uploads"] = () => ({ status: 201, json: { upload_url: `${base}/storage/put`, method: "PUT", headers: { "Content-Type": "video/mp4" }, url: "https://socialsforai.com/m/2" } });
  routes["PUT /storage/put"] = () => ({ status: 200 });
  const r = await run(["upload", file], { env: KEY });
  assert.equal(r.code, 0, r.stderr);
  assert.deepEqual(JSON.parse(seen[0].body), { content_type: "video/mp4", size_bytes: size });
  assert.equal(seen[1].body.length, size);
  assert.equal(seen[1].headers["content-type"], "video/mp4");
  assert.equal(seen[1].headers.authorization, undefined, "the API key must not be sent to storage");
  assert.equal(JSON.parse(r.stdout).url, "https://socialsforai.com/m/2");
});

test("upload refuses a file type it can't name", async () => {
  const file = join(configHome, "notes.txt");
  writeFileSync(file, "hi");
  const r = await run(["upload", file], { env: KEY });
  assert.equal(r.code, 2);
  assert.equal(seen.length, 0);
});

test("keys create sends scopes and restrictions; revoke and list work", async () => {
  routes["POST /v1/keys"] = () => ({ status: 201, json: { id: "key_2", key: "sk_scoped" } });
  routes["DELETE /v1/keys/key_2"] = () => ({ json: { id: "key_2", revoked: true } });
  routes["GET /v1/keys"] = () => ({ json: { object: "list", data: [] } });
  await run(["keys", "create", "--name", "drafts", "--scopes", "posts:write,accounts:read", "--account-ids", "acc_1", "--require-approval", "--daily-post-limit", "5"], { env: KEY });
  assert.deepEqual(JSON.parse(seen[0].body), { name: "drafts", scopes: ["posts:write", "accounts:read"], account_ids: ["acc_1"], require_approval: true, daily_post_limit: 5 });
  const revoked = await run(["keys", "revoke", "key_2"], { env: KEY });
  assert.equal(JSON.parse(revoked.stdout).revoked, true);
  const listed = await run(["keys", "list"], { env: KEY });
  assert.equal(listed.code, 0);
});

test("webhooks create, list and delete", async () => {
  routes["POST /v1/webhooks"] = () => ({ status: 201, json: { id: "wh_1", secret: "whsec" } });
  routes["GET /v1/webhooks"] = () => ({ json: { object: "list", data: [] } });
  routes["DELETE /v1/webhooks/wh_1"] = () => ({ json: { id: "wh_1", deleted: true } });
  await run(["webhooks", "create", "--url", "https://hooks.test/x", "--events", "post.published,post.failed"], { env: KEY });
  assert.deepEqual(JSON.parse(seen[0].body), { url: "https://hooks.test/x", events: ["post.published", "post.failed"] });
  assert.equal((await run(["webhooks", "list"], { env: KEY })).code, 0);
  assert.equal(JSON.parse((await run(["webhooks", "delete", "wh_1"], { env: KEY })).stdout).deleted, true);
});

test("upgrade asks for a checkout link and rejects unknown plans", async () => {
  routes["POST /v1/upgrade-links"] = () => ({ status: 201, json: { object: "upgrade_link", plan: "pro", url: "https://checkout.test/x" } });
  const r = await run(["upgrade", "pro"], { env: KEY });
  assert.deepEqual(JSON.parse(seen[0].body), { plan: "pro" });
  assert.equal(JSON.parse(r.stdout).url, "https://checkout.test/x");
  assert.equal((await run(["upgrade", "platinum"], { env: KEY })).code, 2);
});

test("mcp-config prints a command or config per client", async () => {
  const cc = await run(["mcp-config", "--client", "claude-code", "--base-url", "https://socialsforai.com"]);
  assert.equal(cc.stdout.trim(), "claude mcp add --transport http socials https://socialsforai.com/api/mcp");
  const vs = await run(["mcp-config", "--client", "vscode", "--base-url", "https://socialsforai.com"]);
  assert.deepEqual(JSON.parse(vs.stdout), { servers: { socials: { type: "http", url: "https://socialsforai.com/api/mcp" } } });
  const cur = await run(["mcp-config", "--client", "cursor", "--base-url", "https://socialsforai.com"]);
  assert.deepEqual(JSON.parse(cur.stdout), { mcpServers: { socials: { url: "https://socialsforai.com/api/mcp" } } });
});

test("--help, --version and unknown commands", async () => {
  const help = await run(["--help"]);
  assert.equal(help.code, 0);
  assert.match(help.stdout, /Usage: socials <command>/);
  const version = await run(["--version"]);
  assert.match(version.stdout.trim(), /^\d+\.\d+\.\d+$/);
  const unknown = await run(["frobnicate"]);
  assert.equal(unknown.code, 2);
  const missing = await run(["post", "--accounts"], { env: KEY });
  assert.equal(missing.code, 2);
});

test("an unreachable server is reported as a network error", async () => {
  const r = await run(["usage"], { env: { ...KEY, SOCIALSFORAI_BASE_URL: "http://127.0.0.1:1" } });
  assert.equal(r.code, 1);
  assert.equal(JSON.parse(r.stderr).error.code, "network_error");
});

test("edit sends only the fields given, and --schedule now clears the time", async () => {
  routes["PATCH /v1/posts/post_1"] = () => ({ json: { object: "post", id: "post_1", status: "publishing" } });
  const r = await run(["edit", "post_1", "--text", "Fixed typo", "--schedule", "now"], { env: KEY });
  assert.equal(r.code, 0, r.stderr);
  assert.deepEqual(JSON.parse(seen[0].body), { text: "Fixed typo", scheduled_at: null });
  const bare = await run(["edit", "post_1"], { env: KEY });
  assert.equal(bare.code, 2);
  assert.match(bare.stderr, /Say what to change/);
});

test("edit reports a post that already went out", async () => {
  routes["PATCH /v1/posts/post_1"] = () => ({ status: 409, json: { error: { code: "post_not_editable", message: "Already published.", fix: "Delete it and post again." } } });
  const r = await run(["edit", "post_1", "--text", "Late"], { env: KEY });
  assert.equal(r.code, 1);
  assert.equal(JSON.parse(r.stderr).error.code, "post_not_editable");
});

test("status needs no key", async () => {
  routes["GET /v1/health"] = () => ({ json: { object: "status", status: "operational" } });
  const r = await run(["status"]);
  assert.equal(r.code, 0, r.stderr);
  assert.equal(JSON.parse(r.stdout).status, "operational");
  assert.equal(seen[0].headers.authorization, undefined);
});
