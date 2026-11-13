# @socialsforai/sdk

A typed JavaScript client for the [SocialsForAI](https://socialsforai.com) API: publish and schedule to X, LinkedIn, Bluesky, Mastodon, Telegram and more with one request, and get a result for every account.

No dependencies. Works anywhere `fetch` does: Node 18+, Bun, Deno, edge runtimes and browsers. TypeScript types are included.

```bash
npm install @socialsforai/sdk
```

## Quickstart

```js
import { SocialsForAI } from "@socialsforai/sdk";

const socials = new SocialsForAI({ apiKey: process.env.SOCIALSFORAI_API_KEY });

// Check first: every network's rules, the exact text each account would get, nothing published.
const check = await socials.posts.create({ accounts: ["linkedin", "bluesky"], text: "We just shipped webhooks.", dry_run: true });
if (!check.ok) console.log(check.issues);

// Publish and wait for the result on every account.
const post = await socials.posts.create({ accounts: ["linkedin", "bluesky"], text: "We just shipped webhooks.", wait: true });
for (const t of post.targets) console.log(t.platform, t.status, t.url);
```

No key yet? An agent can sign itself up; the client starts using the new key:

```js
const socials = new SocialsForAI();
const ws = await socials.workspaces.create({ name: "My agent", email: "owner@example.com" });
// store ws.api_key somewhere safe: it is shown once
```

## Connecting accounts

A person approves each network on its own screen. Create a link, give it to them, and wait:

```js
const link = await socials.connectLinks.create({ platforms: ["x", "linkedin"], external_ref: "client-42" });
console.log("Open this to connect:", link.url);
const result = await socials.connectLinks.waitFor(link.id);
```

Bluesky, Mastodon and Telegram can also connect with credentials the owner gives you: `socials.accounts.connect({ platform: "bluesky", credentials: { identifier, app_password } })`.

## Approval before publishing

```js
const post = await socials.posts.create({ accounts: ["acc_..."], text: "Draft for review", approval: "required" });
console.log("Approve here:", post.approval.url);
const decided = await socials.posts.waitForApproval(post.id);
if (decided.approval.status === "rejected") console.log("Feedback:", decided.approval.note);
```

## Editing, deleting, metrics

```js
await socials.posts.update(post.id, { text: "Fixed a typo", scheduled_at: "2026-12-01T09:00:00-08:00" });
await socials.posts.delete(post.id);
const stats = await socials.posts.metrics(post.id);

// What worked over the last 30 days: per account, top posts, best hours in your time zone.
const { top_posts, best_times } = await socials.analytics.get({ days: 30, timezone: "America/New_York" });
```

## Media

```js
const { url } = await socials.media.upload(bytes, "image/png");            // up to 4 MB
const { url: video } = await socials.media.uploadLarge(videoBytes, "video/mp4"); // up to 200 MB
await socials.posts.create({ accounts: ["x"], text: "Look", media: [{ url, alt: "A chart" }] });
```

## Limited keys for other agents

```js
const { key } = await socials.keys.create({
  name: "drafting agent",
  scopes: ["posts:write"],
  account_ids: ["acc_..."],
  require_approval: true,
  daily_post_limit: 5,
});
```

## Errors

Every failure is a `SocialsError` with a stable `code`, a `message`, a `fix` that says what to do, `issues` for failed checks, and a `requestId`:

```js
import { SocialsError } from "@socialsforai/sdk";

try {
  await socials.posts.create({ accounts: ["x"], text: "..." });
} catch (e) {
  if (e instanceof SocialsError) console.error(e.code, e.fix, e.issues);
}
```

The client retries rate limits (honouring `Retry-After`), server errors and network failures, up to `maxRetries` (default 2). `posts.create` sends an idempotency key automatically, so a retry can never publish twice; pass `{ idempotencyKey }` to make your own retries safe as well. `socials.rateLimit` holds the latest `RateLimit-*` values.

## Webhooks

```js
import { verifyWebhook } from "@socialsforai/sdk";

// rawBody: the request body exactly as received, before JSON parsing
const ok = await verifyWebhook(process.env.SOCIALS_WEBHOOK_SECRET, req.headers["socials-signature"], rawBody);
```

## Reference

| Area | Methods |
| --- | --- |
| Workspace | `workspaces.create`, `workspace.get`, `workspace.update`, `usage.get`, `analytics.get`, `upgradeLinks.create` |
| Accounts | `accounts.list`, `accounts.get`, `accounts.connect`, `accounts.disconnect`, `connectLinks.create`, `connectLinks.get`, `connectLinks.waitFor` |
| Posts | `posts.create`, `posts.list`, `posts.get`, `posts.update`, `posts.delete`, `posts.metrics`, `posts.waitForApproval` |
| Media | `media.upload`, `media.createUpload`, `media.uploadLarge` |
| Webhooks and keys | `webhooks.list`, `webhooks.create`, `webhooks.delete`, `keys.list`, `keys.create`, `keys.revoke`, `verifyWebhook` |
| Service | `platforms.list`, `health.get` |

Full API reference: [socialsforai.com/docs](https://socialsforai.com/docs) · OpenAPI: [socialsforai.com/openapi.json](https://socialsforai.com/openapi.json)

## License

MIT
