/**
 * @socialsforai/sdk: a typed client for the SocialsForAI API (https://socialsforai.com/docs).
 * No dependencies; works in Node 18+, Bun, Deno, edge runtimes and browsers (anything with fetch).
 *
 *   import { SocialsForAI } from "@socialsforai/sdk";
 *   const socials = new SocialsForAI({ apiKey: process.env.SOCIALSFORAI_API_KEY });
 *   const post = await socials.posts.create({ accounts: ["linkedin"], text: "Hello", wait: true });
 */

export const DEFAULT_BASE_URL = "https://socialsforai.com";
export const VERSION = "0.2.2";

/** An error the API returned. `code` is stable; `fix` says what to do; `issues` lists failed checks. */
export class SocialsError extends Error {
  constructor({ status, code, message, fix, issues, requestId, headers }) {
    super(message ?? code ?? `HTTP ${status}`);
    this.name = "SocialsError";
    this.status = status;
    this.code = code ?? "http_error";
    this.fix = fix;
    this.issues = issues;
    this.requestId = requestId;
    this.headers = headers;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Web Crypto's SubtleCrypto. Browsers, Deno, Bun, workers and Node 20+ have it on globalThis;
 * Node 18 only exposes it as node:crypto's webcrypto (loaded lazily, so browser bundles never see it).
 */
async function subtle() {
  if (globalThis.crypto?.subtle) return globalThis.crypto.subtle;
  const { webcrypto } = await import("node:crypto");
  return webcrypto.subtle;
}

function randomKey() {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
}

function query(params) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v === undefined || v === null) continue;
    q.set(k, Array.isArray(v) ? v.join(",") : String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export class SocialsForAI {
  /**
   * @param {object} [options]
   * @param {string} [options.apiKey] An API key (sk_...). Falls back to SOCIALSFORAI_API_KEY in Node. Not needed for workspaces.create, platforms.list or health.get.
   * @param {string} [options.baseUrl] Defaults to https://socialsforai.com.
   * @param {number} [options.maxRetries] Retries for rate limits, 5xx and network errors. Default 2.
   * @param {number} [options.timeoutMs] Per-request timeout. Default 330 s, enough for posts with wait: true.
   * @param {typeof fetch} [options.fetch] A fetch implementation, for tests or custom agents.
   */
  constructor(options = {}) {
    const env = typeof process !== "undefined" && process.env ? process.env : {};
    this.apiKey = options.apiKey ?? env.SOCIALSFORAI_API_KEY ?? env.SOCIALS_API_KEY;
    this.baseUrl = (options.baseUrl ?? env.SOCIALSFORAI_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.maxRetries = options.maxRetries ?? 2;
    this.timeoutMs = options.timeoutMs ?? 330_000;
    this._fetch = options.fetch ?? globalThis.fetch.bind(globalThis);
    /** The rate limit as of the last response: { limit, remaining, reset } or null. */
    this.rateLimit = null;

    const r = this.request.bind(this);
    this.workspaces = {
      /** Create a workspace and get an API key. Needs no key: agents can sign themselves up. The client starts using the new key. */
      create: async (body = {}) => {
        const ws = await r("POST", "/v1/workspaces", { body, auth: false });
        if (ws?.api_key && !this.apiKey) this.apiKey = ws.api_key;
        return ws;
      },
    };
    this.workspace = {
      get: () => r("GET", "/v1/workspace"),
      /** Attach the owner's email (only while none is set). */
      update: (body) => r("PATCH", "/v1/workspace", { body }),
    };
    this.usage = { get: () => r("GET", "/v1/usage") };
    /** Totals per account, top posts and the best posting hours, from metrics already read. Free. */
    this.analytics = { get: (params) => r("GET", `/v1/analytics${query(params)}`) };
    this.platforms = { list: async () => (await r("GET", "/v1/platforms", { auth: false })).data };
    this.health = { get: () => r("GET", "/v1/health", { auth: false, okStatuses: [503] }) };
    this.upgradeLinks = { create: (body = {}) => r("POST", "/v1/upgrade-links", { body }) };

    this.accounts = {
      list: async (params) => (await r("GET", `/v1/accounts${query(params)}`)).data,
      get: (id) => r("GET", `/v1/accounts/${encodeURIComponent(id)}`),
      /** Connect Bluesky, Mastodon or Telegram with credentials the owner gave you. */
      connect: (body) => r("POST", "/v1/accounts", { body }),
      disconnect: (id) => r("DELETE", `/v1/accounts/${encodeURIComponent(id)}`),
    };

    this.connectLinks = {
      create: (body = {}) => r("POST", "/v1/connect-links", { body }),
      /** The link's status. With waitSeconds (max 120) it long-polls until the owner finishes. */
      get: (id, { waitSeconds, until } = {}) => r("GET", `/v1/connect-links/${encodeURIComponent(id)}${query({ wait: waitSeconds, until })}`),
      /** Keep long-polling until the link is connected (or any network is, with until: "any") or expired. */
      waitFor: async (id, { until = "all", timeoutMs = 15 * 60_000 } = {}) => {
        const deadline = Date.now() + timeoutMs;
        for (;;) {
          const st = await this.connectLinks.get(id, { waitSeconds: 60, until });
          const done = st.status === "connected" || st.status === "expired" || (until === "any" && st.connected?.length > 0);
          if (done || Date.now() >= deadline) return st;
        }
      },
    };

    this.posts = {
      /**
       * Publish now or schedule. An idempotency key is generated when you don't pass one, so the
       * SDK's own retries can never publish twice; pass your own to make your retries safe too.
       */
      create: (body, { idempotencyKey } = {}) => {
        const key = idempotencyKey ?? body?.idempotency_key ?? (body?.dry_run ? undefined : randomKey());
        return r("POST", "/v1/posts", { body, headers: key ? { "Idempotency-Key": key } : {} });
      },
      list: (params) => r("GET", `/v1/posts${query(params)}`),
      /** Up to 50 posts in one request; each is checked and created by itself. An idempotency key covers the whole batch (applied per item). */
      createMany: (body, { idempotencyKey } = {}) => {
        const key = idempotencyKey ?? (body?.dry_run ? undefined : randomKey());
        return r("POST", "/v1/posts/batch", { body, headers: key ? { "Idempotency-Key": key } : {} });
      },
      get: (id) => r("GET", `/v1/posts/${encodeURIComponent(id)}`),
      /** Edit a post that hasn't started publishing. Fields left out stay; scheduled_at: null publishes now. */
      update: (id, body) => r("PATCH", `/v1/posts/${encodeURIComponent(id)}`, { body }),
      /** Delete everywhere it went out (or only from some accounts). */
      delete: (id, { accounts, series } = {}) => r("DELETE", `/v1/posts/${encodeURIComponent(id)}${query({ accounts, series })}`),
      /** What people replied under each published copy. Answer one with create({ accounts: [one], reply_to: id, reply_to_comment: reply.id, text }). */
      replies: (id) => r("GET", `/v1/posts/${encodeURIComponent(id)}/replies`),
      metrics: (id) => r("GET", `/v1/posts/${encodeURIComponent(id)}/metrics`),
      /** Wait while the post is pending_approval. Resolves with the post once a person decides (or the timeout passes). */
      waitForApproval: async (id, { timeoutMs = 60 * 60_000 } = {}) => {
        const deadline = Date.now() + timeoutMs;
        for (;;) {
          const p = await r("GET", `/v1/posts/${encodeURIComponent(id)}?wait=60`);
          if (p.status !== "pending_approval" || Date.now() >= deadline) return p;
        }
      },
    };

    this.media = {
      /** Upload a file of up to 4 MB (bytes, a Blob or base64) and get a URL to use in posts. */
      upload: async (data, contentType) => {
        if (typeof data === "string") return r("POST", "/v1/media", { body: { data_base64: data, content_type: contentType } });
        const type = contentType ?? data.type;
        if (!type) throw new TypeError("media.upload needs a content type, e.g. image/png.");
        return r("POST", "/v1/media", { raw: data, headers: { "Content-Type": type } });
      },
      /** A signed upload URL for files up to 200 MB. PUT the bytes to upload_url, then use url. */
      createUpload: (body) => r("POST", "/v1/media/uploads", { body }),
      /** createUpload, then PUT the bytes. Returns the url to use in posts. */
      uploadLarge: async (data, contentType) => {
        const size = data.byteLength ?? data.size;
        const up = await r("POST", "/v1/media/uploads", { body: { content_type: contentType, size_bytes: size } });
        const res = await this._fetch(up.upload_url, { method: up.method ?? "PUT", headers: up.headers ?? { "Content-Type": contentType }, body: data });
        if (!res.ok) throw new SocialsError({ status: res.status, code: "upload_failed", message: `The upload returned HTTP ${res.status}.`, fix: "Request a new upload URL and try again." });
        return { url: up.url };
      },
    };

    this.events = {
      /** What happened since `after`, oldest first; keep last_id for the next call. */
      list: ({ after, types, limit, waitSeconds } = {}) => r("GET", `/v1/events${query({ after, types, limit, wait: waitSeconds })}`),
    };

    this.webhooks = {
      list: async () => (await r("GET", "/v1/webhooks")).data,
      create: (body) => r("POST", "/v1/webhooks", { body }),
      delete: (id) => r("DELETE", `/v1/webhooks/${encodeURIComponent(id)}`),
    };

    this.keys = {
      list: async () => (await r("GET", "/v1/keys")).data,
      /** Create a key, optionally limited: scopes, account_ids, require_approval, daily_post_limit. */
      create: (body = {}) => r("POST", "/v1/keys", { body }),
      revoke: (id) => r("DELETE", `/v1/keys/${encodeURIComponent(id)}`),
    };
  }

  /** Low-level request. Retries 429, 5xx and network errors (honouring Retry-After); never retries other errors. */
  async request(method, path, { body, raw, headers = {}, auth = true, okStatuses = [] } = {}) {
    if (auth && !this.apiKey) {
      throw new SocialsError({ status: 0, code: "missing_api_key", message: "No API key.", fix: "Pass { apiKey } or set SOCIALSFORAI_API_KEY. Get one with socials.workspaces.create()." });
    }
    const init = {
      method,
      headers: {
        Accept: "application/json",
        "User-Agent": `socialsforai-sdk-js/${VERSION}`,
        ...(auth ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      ...(raw !== undefined ? { body: raw } : body !== undefined ? { body: JSON.stringify(body) } : {}),
    };
    for (let attempt = 0; ; attempt++) {
      let res;
      try {
        res = await this._fetch(`${this.baseUrl}${path}`, { ...init, signal: AbortSignal.timeout(this.timeoutMs) });
      } catch (e) {
        if (attempt < this.maxRetries) {
          await sleep(500 * 2 ** attempt);
          continue;
        }
        throw new SocialsError({ status: 0, code: "network_error", message: `Could not reach ${this.baseUrl}: ${e?.message ?? e}`, fix: "Check the network and retry; post creation is safe to retry with the same idempotency key." });
      }
      const limit = res.headers.get("ratelimit-limit");
      if (limit) this.rateLimit = { limit: Number(limit), remaining: Number(res.headers.get("ratelimit-remaining")), reset: Number(res.headers.get("ratelimit-reset")) };

      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }
      if (res.ok || okStatuses.includes(res.status)) return data;

      const retryable = res.status === 429 || res.status >= 500;
      if (retryable && attempt < this.maxRetries) {
        const after = Number(res.headers.get("retry-after"));
        await sleep(Number.isFinite(after) && after > 0 ? Math.min(after, 60) * 1000 : 500 * 2 ** attempt);
        continue;
      }
      const err = data?.error ?? {};
      throw new SocialsError({
        status: res.status,
        code: err.code,
        message: err.message ?? `HTTP ${res.status}`,
        fix: err.fix,
        issues: err.issues,
        requestId: err.request_id ?? res.headers.get("request-id") ?? undefined,
        headers: Object.fromEntries(res.headers),
      });
    }
  }
}

/**
 * Check a webhook delivery's Socials-Signature header ("t=<unix>,v1=<hex>"): HMAC-SHA256 of
 * "<t>.<raw body>" with the endpoint's secret. Rejects signatures older than toleranceSeconds.
 * Pass the raw request body as received, before any JSON parsing.
 */
export async function verifyWebhook(secret, header, rawBody, { toleranceSeconds = 300, now = Date.now() } = {}) {
  const parts = Object.fromEntries(
    String(header ?? "")
      .split(",")
      .map((p) => p.trim().split("="))
      .filter((kv) => kv.length === 2),
  );
  const t = Number(parts.t);
  if (!parts.v1 || !Number.isFinite(t)) return false;
  if (Math.abs(now / 1000 - t) > toleranceSeconds) return false;
  const enc = new TextEncoder();
  const sc = await subtle();
  const key = await sc.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const body = typeof rawBody === "string" ? rawBody : new TextDecoder().decode(rawBody);
  const mac = new Uint8Array(await sc.sign("HMAC", key, enc.encode(`${t}.${body}`)));
  const expected = Array.from(mac, (b) => b.toString(16).padStart(2, "0")).join("");
  if (expected.length !== parts.v1.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ parts.v1.charCodeAt(i);
  return diff === 0;
}

export default SocialsForAI;
