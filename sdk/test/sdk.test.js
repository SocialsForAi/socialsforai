import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { createServer } from "node:http";
import { after, before, beforeEach, test } from "node:test";
import { SocialsError, SocialsForAI, verifyWebhook } from "../src/index.js";

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
      const record = { method: req.method, path: url.pathname, query: Object.fromEntries(url.searchParams), headers: req.headers, body, json: body.length && req.headers["content-type"]?.includes("json") ? JSON.parse(body) : undefined };
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
beforeEach(() => {
  routes = {};
  seen = [];
});

const client = (opts = {}) => new SocialsForAI({ apiKey: "sk_test", baseUrl: base, maxRetries: 2, ...opts });

test("sends the key, a user agent and JSON; returns the parsed body", async () => {
  routes["GET /v1/usage"] = () => ({ json: { object: "usage", posts: 3 }, headers: { "RateLimit-Limit": "300", "RateLimit-Remaining": "299", "RateLimit-Reset": "60" } });
  const s = client();
  assert.deepEqual(await s.usage.get(), { object: "usage", posts: 3 });
  assert.equal(seen[0].headers.authorization, "Bearer sk_test");
  assert.match(seen[0].headers["user-agent"], /^socialsforai-sdk-js\//);
  assert.deepEqual(s.rateLimit, { limit: 300, remaining: 299, reset: 60 });
});

test("signs up without a key and starts using the new one", async () => {
  routes["POST /v1/workspaces"] = (r) => ({ status: 201, json: { object: "workspace", id: "ws_1", plan: "free", api_key: "sk_new", name: r.json.name } });
  routes["GET /v1/workspace"] = () => ({ json: { object: "workspace", id: "ws_1" } });
  const s = new SocialsForAI({ baseUrl: base, apiKey: undefined });
  s.apiKey = undefined;
  const ws = await s.workspaces.create({ name: "Agent", email: "owner@example.com" });
  assert.equal(ws.api_key, "sk_new");
  assert.equal(seen[0].headers.authorization, undefined);
  await s.workspace.get();
  assert.equal(seen[1].headers.authorization, "Bearer sk_new");
});

test("without a key, authenticated calls fail before any request", async () => {
  const s = new SocialsForAI({ baseUrl: base });
  s.apiKey = undefined;
  await assert.rejects(s.accounts.list(), (e) => e instanceof SocialsError && e.code === "missing_api_key");
  assert.equal(seen.length, 0);
});

test("posts.create adds an idempotency key and reuses it on retry", async () => {
  let calls = 0;
  routes["POST /v1/posts"] = () => (++calls === 1 ? { status: 503, json: { error: { code: "internal_error", message: "boom" } } } : { status: 201, json: { object: "post", id: "post_1", status: "published" } });
  const p = await client().posts.create({ accounts: ["acc_1"], text: "Hi", wait: true });
  assert.equal(p.id, "post_1");
  assert.equal(seen.length, 2);
  assert.ok(seen[0].headers["idempotency-key"]);
  assert.equal(seen[0].headers["idempotency-key"], seen[1].headers["idempotency-key"]);
});

test("a dry run has no idempotency key; a caller's key wins", async () => {
  routes["POST /v1/posts"] = () => ({ json: { object: "preflight", ok: true, issues: [], preview: [] } });
  const s = client();
  await s.posts.create({ accounts: ["acc_1"], text: "Hi", dry_run: true });
  assert.equal(seen[0].headers["idempotency-key"], undefined);
  await s.posts.create({ accounts: ["acc_1"], text: "Hi" }, { idempotencyKey: "launch-1" });
  assert.equal(seen[1].headers["idempotency-key"], "launch-1");
});

test("honours Retry-After on 429, then gives up with the error", async () => {
  routes["GET /v1/accounts"] = () => ({ status: 429, headers: { "Retry-After": "1" }, json: { error: { code: "rate_limited", message: "Too many", fix: "Wait", request_id: "req_1" } } });
  const t0 = Date.now();
  await assert.rejects(client({ maxRetries: 1 }).accounts.list(), (e) => e.code === "rate_limited" && e.status === 429 && e.requestId === "req_1" && e.fix === "Wait");
  assert.equal(seen.length, 2);
  assert.ok(Date.now() - t0 >= 900);
});

test("never retries a client error; surfaces code, fix and issues", async () => {
  const issues = [{ code: "text_too_long", message: "Too long", severity: "error", fix: "Shorten it" }];
  routes["POST /v1/posts"] = () => ({ status: 422, json: { error: { code: "preflight_failed", message: "Would fail", fix: "Fix the issues", issues, request_id: "req_2" } } });
  await assert.rejects(client().posts.create({ accounts: ["x"], text: "y" }), (e) => {
    assert.equal(e.code, "preflight_failed");
    assert.deepEqual(e.issues, issues);
    return true;
  });
  assert.equal(seen.length, 1);
});

test("lists unwrap data; query strings drop empty values and join arrays", async () => {
  routes["GET /v1/accounts"] = (r) => ({ json: { object: "list", data: [{ id: "acc_1", q: r.query }] } });
  routes["DELETE /v1/posts/post_1"] = (r) => ({ json: { id: "post_1", q: r.query } });
  const s = client();
  const [a] = await s.accounts.list({ platform: "x", external_ref: undefined });
  assert.deepEqual(a.q, { platform: "x" });
  const d = await s.posts.delete("post_1", { accounts: ["acc_1", "acc_2"] });
  assert.deepEqual(d.q, { accounts: "acc_1,acc_2" });
});

test("update sends PATCH; waitForApproval long-polls until a decision", async () => {
  routes["PATCH /v1/posts/post_1"] = (r) => ({ json: { object: "post", id: "post_1", text: r.json.text } });
  let polls = 0;
  routes["GET /v1/posts/post_1"] = (r) => {
    assert.equal(r.query.wait, "60");
    return { json: { object: "post", id: "post_1", status: ++polls < 3 ? "pending_approval" : "scheduled", approval: { status: polls < 3 ? "pending" : "approved" } } };
  };
  const s = client();
  assert.equal((await s.posts.update("post_1", { text: "v2" })).text, "v2");
  const p = await s.posts.waitForApproval("post_1");
  assert.equal(p.approval.status, "approved");
  assert.equal(polls, 3);
});

test("connectLinks.waitFor long-polls until connected", async () => {
  let n = 0;
  routes["GET /v1/connect-links/cl_1"] = (r) => {
    assert.equal(r.query.wait, "60");
    return { json: { id: "cl_1", status: ++n < 2 ? "waiting" : "connected", connected: [] } };
  };
  assert.equal((await client().connectLinks.waitFor("cl_1")).status, "connected");
});

test("media.upload sends raw bytes with their type; a string is sent as base64 JSON", async () => {
  routes["POST /v1/media"] = (r) => ({ status: 201, json: { url: "https://socialsforai.com/m/1", type: r.headers["content-type"], len: r.body.length } });
  const s = client();
  const a = await s.media.upload(new Uint8Array([1, 2, 3]), "image/png");
  assert.deepEqual([a.type, a.len], ["image/png", 3]);
  await s.media.upload("AQID", "image/png");
  assert.deepEqual(seen[1].json, { data_base64: "AQID", content_type: "image/png" });
});

test("health and platforms need no key; health returns its body on 503", async () => {
  routes["GET /v1/health"] = () => ({ status: 503, json: { object: "status", status: "outage" } });
  routes["GET /v1/platforms"] = () => ({ json: { object: "list", data: [{ id: "x" }] } });
  const s = new SocialsForAI({ baseUrl: base });
  s.apiKey = undefined;
  assert.equal((await s.health.get()).status, "outage");
  assert.deepEqual(await s.platforms.list(), [{ id: "x" }]);
  assert.equal(seen[0].headers.authorization, undefined);
});

test("network errors are retried, then reported with a fix", async () => {
  const s = new SocialsForAI({ apiKey: "k", baseUrl: "http://127.0.0.1:9", maxRetries: 1 });
  await assert.rejects(s.usage.get(), (e) => e.code === "network_error" && e.status === 0 && Boolean(e.fix));
});

test("verifyWebhook accepts a fresh, correct signature and rejects the rest", async () => {
  const secret = "whsec_test";
  const body = JSON.stringify({ type: "post.published", data: { post: { id: "post_1" } } });
  const t = Math.floor(Date.now() / 1000);
  const v1 = createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");
  assert.equal(await verifyWebhook(secret, `t=${t},v1=${v1}`, body), true);
  assert.equal(await verifyWebhook(secret, `t=${t},v1=${v1}`, new TextEncoder().encode(body)), true);
  assert.equal(await verifyWebhook("wrong", `t=${t},v1=${v1}`, body), false);
  assert.equal(await verifyWebhook(secret, `t=${t},v1=${v1}`, body + " "), false);
  assert.equal(await verifyWebhook(secret, `t=${t - 3600},v1=${createHmac("sha256", secret).update(`${t - 3600}.${body}`).digest("hex")}`, body), false);
  assert.equal(await verifyWebhook(secret, "garbage", body), false);
});

test("analytics.get passes its filters as a query", async () => {
  routes["GET /v1/analytics"] = (r) => ({ json: { object: "analytics", q: r.query } });
  const a = await client().analytics.get({ days: 7, timezone: "America/New_York", platform: undefined });
  assert.deepEqual(a.q, { days: "7", timezone: "America/New_York" });
});

test("batch create, replies, events and series delete", async () => {
  routes["POST /v1/posts/batch"] = () => ({ json: { object: "batch", total: 2, succeeded: 2, failed: 0, results: [] } });
  routes["GET /v1/posts/post_1/replies"] = () => ({ json: { object: "post_replies", post_id: "post_1", total: 0, targets: [] } });
  routes["GET /v1/events"] = () => ({ json: { object: "list", data: [], has_more: false, last_id: "evt_9" } });
  routes["DELETE /v1/posts/post_1"] = () => ({ json: { id: "post_1", object: "post", series_canceled: 3 } });
  const c = client();
  const batch = await c.posts.createMany({ posts: [{ accounts: ["acc_1"], text: "a" }, { accounts: ["acc_1"], text: "b" }] });
  assert.equal(batch.succeeded, 2);
  assert.ok(seen[0].headers["idempotency-key"], "a batch gets an idempotency key");
  assert.equal(seen[0].json.posts.length, 2);
  await c.posts.replies("post_1");
  const ev = await c.events.list({ after: "evt_1", types: ["post.failed", "post.published"], waitSeconds: 30 });
  assert.equal(ev.last_id, "evt_9");
  assert.deepEqual(seen[2].query, { after: "evt_1", types: "post.failed,post.published", wait: "30" });
  const del = await c.posts.delete("post_1", { series: true });
  assert.equal(del.series_canceled, 3);
  assert.deepEqual(seen[3].query, { series: "true" });
});
