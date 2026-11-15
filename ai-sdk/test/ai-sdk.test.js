import assert from "node:assert/strict";
import { createServer } from "node:http";
import { after, before, beforeEach, test } from "node:test";
import { generateText, stepCountIs } from "ai";
import { MockLanguageModelV3 } from "ai/test";
import { SocialsForAI } from "@socialsforai/sdk";
import { runTool, socialsTools, TOOL_DEFINITIONS } from "../src/index.js";

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
      const body = Buffer.concat(chunks).toString();
      const rec = { method: req.method, path: url.pathname, query: Object.fromEntries(url.searchParams), headers: req.headers, json: body ? JSON.parse(body) : undefined };
      seen.push(rec);
      const out = routes[`${req.method} ${url.pathname}`]?.(rec) ?? { status: 404, json: { error: { code: "not_found", message: "No such endpoint." } } };
      res.writeHead(out.status ?? 200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(out.json));
    });
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((r) => server.close(r)));
beforeEach(() => {
  routes = {};
  seen = [];
});
const client = () => new SocialsForAI({ apiKey: "sk_test", baseUrl: base, maxRetries: 0 });
const usage = { inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 }, outputTokens: { total: 1, text: 1, reasoning: 0 } };

test("a model can call the tools through generateText", async () => {
  routes["GET /v1/accounts"] = () => ({ json: { object: "list", data: [{ id: "acc_1", platform: "linkedin" }] } });
  routes["POST /v1/posts"] = (r) => ({ status: 201, json: { object: "post", id: "post_1", status: "published", text: r.json.text } });
  let step = 0;
  const model = new MockLanguageModelV3({
    doGenerate: async () => {
      step++;
      if (step === 1) return { content: [{ type: "tool-call", toolCallId: "c1", toolName: "list_accounts", input: "{}" }], finishReason: { unified: "tool-calls", raw: undefined }, usage, warnings: [] };
      if (step === 2) return { content: [{ type: "tool-call", toolCallId: "c2", toolName: "create_post", input: JSON.stringify({ accounts: ["acc_1"], text: "We launched" }) }], finishReason: { unified: "tool-calls", raw: undefined }, usage, warnings: [] };
      return { content: [{ type: "text", text: "Posted." }], finishReason: { unified: "stop", raw: undefined }, usage, warnings: [] };
    },
  });
  const res = await generateText({ model, tools: socialsTools({ client: client() }), prompt: "post it", stopWhen: stepCountIs(5) });
  assert.equal(res.text, "Posted.");
  const post = seen.find((s) => s.path === "/v1/posts");
  assert.deepEqual(post.json, { wait: true, accounts: ["acc_1"], text: "We launched" });
  assert.ok(post.headers["idempotency-key"], "publishing sends an idempotency key");
  const results = res.steps.flatMap((s) => s.toolResults);
  assert.equal(results.at(-1).output.id, "post_1");
});

test("tool choice, destructive opt-in, schemas and errors the model can act on", async () => {
  const all = socialsTools({ client: client() });
  assert.ok(!("delete_post" in all), "delete_post needs opting in");
  assert.deepEqual(Object.keys(socialsTools({ client: client(), tools: ["create_post", "delete_post"] })), ["create_post", "delete_post"]);
  assert.ok("delete_post" in socialsTools({ client: client(), includeDestructive: true }));
  assert.throws(() => socialsTools({ client: client(), tools: ["nope"] }), /Unknown tools: nope/);
  assert.equal(Object.keys(all).length, TOOL_DEFINITIONS.length - 1);

  routes["GET /v1/posts/post_9"] = () => ({ status: 404, json: { error: { code: "not_found", message: "No post post_9.", fix: "List posts first." } } });
  assert.deepEqual(await runTool(client(), "get_post", { id: "post_9" }), { error: { code: "not_found", message: "No post post_9.", fix: "List posts first." } });
  routes["DELETE /v1/posts/post_9"] = () => ({ json: { id: "post_9" } });
  await runTool(client(), "delete_post", { id: "post_9", accounts: ["a", "b"], series: true });
  assert.deepEqual(seen.at(-1).query, { accounts: "a,b", series: "true" });
  routes["POST /v1/posts"] = () => ({ json: { object: "preflight", ok: true } });
  await runTool(client(), "create_post", { accounts: ["a"], text: "x", dry_run: true });
  assert.equal(seen.at(-1).headers["idempotency-key"], undefined, "dry runs don't need a key");
});
