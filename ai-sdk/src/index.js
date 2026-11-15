/**
 * @socialsforai/ai-sdk: SocialsForAI as tools for the Vercel AI SDK.
 *
 *   import { generateText } from "ai";
 *   import { socialsTools } from "@socialsforai/ai-sdk";
 *   const { text } = await generateText({ model, tools: socialsTools(), prompt: "Announce our launch on LinkedIn and Bluesky" });
 *
 * The tools are the same ones the Python package offers (defined once in tools.json). Errors come
 * back to the model as {error: {code, message, fix}} so it can act on the fix.
 */
import { jsonSchema, tool } from "ai";
import { SocialsForAI, SocialsError } from "@socialsforai/sdk";
import spec from "./tools.json" with { type: "json" };

export const TOOL_DEFINITIONS = spec.tools;

const randomKey = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

/** Run one tool against the API. Exported for custom agents and tests. */
export async function runTool(client, name, args = {}) {
  const def = TOOL_DEFINITIONS.find((t) => t.name === name);
  if (!def) return { error: { code: "unknown_tool", message: `No tool named ${name}.` } };
  const input = { ...args };
  const req = def.request;
  let path = req.path;
  for (const key of (path.match(/\{(\w+)\}/g) ?? []).map((k) => k.slice(1, -1))) {
    if (input[key] === undefined) return { error: { code: "missing_argument", message: `${name} needs ${key}.` } };
    path = path.replace(`{${key}}`, encodeURIComponent(String(input[key])));
    delete input[key];
  }
  const q = new URLSearchParams();
  for (const k of req.query ?? []) {
    const v = input[k];
    delete input[k];
    if (v === undefined || v === null) continue;
    q.set(k, Array.isArray(v) ? v.join(",") : String(v));
  }
  let body;
  if (req.body === "*") body = { ...(req.defaults ?? {}), ...input };
  else if (Array.isArray(req.body)) body = Object.fromEntries(req.body.filter((k) => input[k] !== undefined).map((k) => [k, input[k]]));
  const headers = {};
  if (req.idempotency && !body?.dry_run) {
    headers["Idempotency-Key"] = body?.idempotency_key ?? randomKey();
    if (body) delete body.idempotency_key;
  }
  const qs = q.toString();
  try {
    return (await client.request(req.method, `${path}${qs ? `?${qs}` : ""}`, { body, headers, auth: name !== "list_platforms" })) ?? {};
  } catch (e) {
    if (e instanceof SocialsError) {
      return { error: { code: e.code, message: e.message, ...(e.fix ? { fix: e.fix } : {}), ...(e.issues ? { issues: e.issues } : {}), ...(e.requestId ? { request_id: e.requestId } : {}) } };
    }
    throw e;
  }
}

/**
 * SocialsForAI tools for generateText / streamText / Agent.
 * @param {object} [options]
 * @param {SocialsForAI} [options.client] A client; defaults to one using SOCIALSFORAI_API_KEY.
 * @param {string} [options.apiKey] Or just the key.
 * @param {string[]} [options.tools] Only these tools.
 * @param {boolean} [options.includeDestructive] Include delete_post (off unless named in `tools`).
 */
export function socialsTools({ client, apiKey, tools, includeDestructive = false } = {}) {
  const c = client ?? new SocialsForAI(apiKey ? { apiKey } : {});
  const wanted = tools ? new Set(tools) : null;
  if (wanted) {
    const unknown = [...wanted].filter((n) => !TOOL_DEFINITIONS.some((t) => t.name === n));
    if (unknown.length) throw new Error(`Unknown tools: ${unknown.join(", ")}. Available: ${TOOL_DEFINITIONS.map((t) => t.name).join(", ")}.`);
  }
  const out = {};
  for (const def of TOOL_DEFINITIONS) {
    if (wanted ? !wanted.has(def.name) : def.destructive && !includeDestructive) continue;
    out[def.name] = tool({
      description: def.description,
      inputSchema: jsonSchema(def.input),
      execute: (args) => runTool(c, def.name, args),
    });
  }
  return out;
}

export default socialsTools;
