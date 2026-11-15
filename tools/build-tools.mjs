/**
 * The agent tools shared by the framework packages (Python: LangChain, CrewAI, OpenAI Agents;
 * JavaScript: Vercel AI SDK). One definition per tool: what the model reads, the JSON Schema of its
 * input, and the API request it makes. Run `node tools/build-tools.mjs` after editing to write
 * tools.json and copy it into each package.
 */
import { mkdirSync, writeFileSync } from "node:fs";

const str = (description, extra = {}) => ({ type: "string", description, ...extra });
const ids = (description) => ({ type: "array", items: { type: "string" }, description });
const media = {
  type: "array",
  description: "Images, videos or a document, by public URL. The URL must be the file itself, not a share page.",
  items: {
    type: "object",
    properties: { url: str("Public URL of the file."), type: { type: "string", enum: ["image", "video", "document"] }, alt: str("Alt text.") },
    required: ["url"],
  },
};

const postFields = {
  accounts: ids('Account ids (acc_...) from list_accounts, or a network name like "linkedin" when there is exactly one account on it.'),
  text: str("The post's text."),
  media,
  link: { type: "object", description: "Share a URL as a preview card.", properties: { url: str("The page to link to.") }, required: ["url"] },
  thread: { type: "array", description: "Follow-up posts, each a reply to the one before (X, Bluesky, Mastodon, Telegram, Nostr).", items: { type: "object", properties: { text: { type: "string" } }, required: ["text"] } },
  auto_thread: { type: "boolean", description: "Split text that is over a network's limit into a thread there instead of failing." },
  scheduled_at: str('When to publish: ISO-8601 with an offset, a local time together with timezone, or "best" for the hour that has worked best. Omit to publish now.'),
  timezone: str('IANA time zone for a local scheduled_at, e.g. "America/New_York".'),
  repeat: { type: "object", description: "Repeat the post: count posts, every day, week or month, at the same local time.", properties: { every: { type: "string", enum: ["day", "week", "month"] }, count: { type: "integer", minimum: 2, maximum: 52 }, interval: { type: "integer", minimum: 1 } }, required: ["every", "count"] },
  reply_to: str("A post id (post_...) to reply to, on the same accounts."),
  reply_to_comment: str("With reply_to: the id of someone's reply under that post (from list_replies), to answer them. One account only."),
  first_comment: str("Posted as a comment right after the post (LinkedIn), e.g. to hold a link."),
  platform_options: { type: "object", description: 'Per-network settings, e.g. {"x": {"text": "shorter version"}, "reddit": {"subreddit": "test"}}. See https://socialsforai.com/llms.txt.' },
  approval: { type: "string", enum: ["required"], description: "Hold the post until a person approves it at approval.url." },
  dry_run: { type: "boolean", description: "Check everything without publishing. Returns ok, issues (each with a fix) and the exact text per network." },
  idempotency_key: str("Send the same key when retrying the same post, so it is never published twice."),
};

export const TOOLS = [
  {
    name: "list_accounts",
    description: "List the social accounts connected to this workspace. Use their ids in create_post. If the one you need is missing, call create_connect_link.",
    request: { method: "GET", path: "/v1/accounts", query: ["platform"] },
    input: { type: "object", properties: { platform: str('Only accounts on this network, e.g. "x".') } },
    readOnly: true,
  },
  {
    name: "list_platforms",
    description: "Which networks are available and what each supports: character and media limits, threads, polls, delete, metrics.",
    request: { method: "GET", path: "/v1/platforms" },
    input: { type: "object", properties: {} },
    readOnly: true,
  },
  {
    name: "create_connect_link",
    description: "Create a link the account owner opens to connect social accounts (they approve on the network's own page). Give them the url, then check list_accounts.",
    request: { method: "POST", path: "/v1/connect-links", body: ["platforms", "external_ref"] },
    input: { type: "object", properties: { platforms: ids('Networks to offer, e.g. ["x", "linkedin"]. Omit for all.'), external_ref: str("Your label for whose accounts these are.") } },
  },
  {
    name: "create_post",
    description:
      "Publish or schedule a post to one or more accounts and get one result per account. Run it with dry_run: true first and show the person the text per network. Every error includes a fix: act on it. Reuse idempotency_key when retrying.",
    request: { method: "POST", path: "/v1/posts", body: "*", defaults: { wait: true }, idempotency: true },
    input: { type: "object", properties: postFields, required: ["accounts"] },
  },
  {
    name: "create_posts",
    description: "Create up to 50 posts in one call, such as a week or month of scheduled content. Each is checked and created by itself; results come back per item.",
    request: { method: "POST", path: "/v1/posts/batch", body: "*", idempotency: true },
    input: { type: "object", properties: { posts: { type: "array", items: { type: "object", properties: postFields, required: ["accounts"] }, minItems: 1, maxItems: 50 }, dry_run: postFields.dry_run }, required: ["posts"] },
  },
  {
    name: "get_post",
    description: "A post's status and, per account, its link or error with a fix.",
    request: { method: "GET", path: "/v1/posts/{id}" },
    input: { type: "object", properties: { id: str("The post id (post_...).") }, required: ["id"] },
    readOnly: true,
  },
  {
    name: "list_posts",
    description: "Recent posts, newest first. Filter by status, e.g. scheduled or failed.",
    request: { method: "GET", path: "/v1/posts", query: ["status", "limit"] },
    input: { type: "object", properties: { status: { type: "string", enum: ["pending_approval", "scheduled", "publishing", "published", "partially_published", "failed", "canceled", "deleted"] }, limit: { type: "integer", minimum: 1, maximum: 100 } } },
    readOnly: true,
  },
  {
    name: "delete_post",
    description: "Delete a post everywhere it went out, or cancel it if it hasn't. Permanent: confirm with the person first. series: true also cancels the rest of a repeat series.",
    request: { method: "DELETE", path: "/v1/posts/{id}", query: ["accounts", "series"] },
    input: { type: "object", properties: { id: str("The post id."), accounts: ids("Only delete it from these accounts."), series: { type: "boolean" } }, required: ["id"] },
    destructive: true,
  },
  {
    name: "get_post_metrics",
    description: "Likes, reposts, replies, views and more for each published copy of a post, plus totals. Cached 15 minutes; X bills per read, so don't poll it in a loop.",
    request: { method: "GET", path: "/v1/posts/{id}/metrics" },
    input: { type: "object", properties: { id: str("The post id.") }, required: ["id"] },
    readOnly: true,
  },
  {
    name: "list_replies",
    description: "What people replied under each published copy of a post. Answer one with create_post (one account, reply_to, reply_to_comment). Show the person your answer first.",
    request: { method: "GET", path: "/v1/posts/{id}/replies" },
    input: { type: "object", properties: { id: str("The post id.") }, required: ["id"] },
    readOnly: true,
  },
  {
    name: "list_events",
    description: "What happened since you last looked: posts that failed, approvals, accounts needing reconnection. Pass the last_id from the previous call as after.",
    request: { method: "GET", path: "/v1/events", query: ["after", "types", "limit"] },
    input: { type: "object", properties: { after: str("An event id (evt_...)."), types: ids("Only these event types."), limit: { type: "integer", minimum: 1, maximum: 200 } } },
    readOnly: true,
  },
];

const json = JSON.stringify({ version: 1, tools: TOOLS }, null, 2) + "\n";
const here = new URL(".", import.meta.url).pathname;
for (const dest of ["tools.json", "../python/src/socialsforai/tools.json", "../ai-sdk/src/tools.json"]) {
  const path = here + dest;
  mkdirSync(path.slice(0, path.lastIndexOf("/")), { recursive: true });
  writeFileSync(path, json);
}
console.log(`[tools] ${TOOLS.length} tools written`);
