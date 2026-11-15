# @socialsforai/ai-sdk

[SocialsForAI](https://socialsforai.com) tools for the [Vercel AI SDK](https://ai-sdk.dev): let a model publish, schedule and measure posts on X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, Nostr and more.

```bash
npm install @socialsforai/ai-sdk ai
```

```ts
import { generateText, stepCountIs } from "ai";
import { socialsTools } from "@socialsforai/ai-sdk";

const { text } = await generateText({
  model,
  tools: socialsTools(), // reads SOCIALSFORAI_API_KEY
  stopWhen: stepCountIs(8),
  prompt: "Announce our webhooks launch on LinkedIn and Bluesky. Dry-run first and show me the text.",
});
```

It works the same with `streamText` and the `Agent` class.

## Tools

| Tool | What it does |
| --- | --- |
| `list_accounts` | Connected accounts and their ids |
| `list_platforms` | Networks, their limits and what each supports |
| `create_connect_link` | A link for the account owner to connect accounts |
| `create_post` | Publish or schedule (dry runs, threads, `auto_thread`, `scheduled_at: "best"`, `repeat`, approvals, replies) |
| `create_posts` | Up to 50 posts at once, such as a content calendar |
| `get_post`, `list_posts` | Status and links per account |
| `get_post_metrics` | Likes, reposts, replies, views |
| `list_replies` | What people replied under a post, so the model can answer them |
| `list_events` | What happened since last time: failures, approvals, reconnections |
| `delete_post` | Off by default; pass `includeDestructive: true` or name it in `tools` |

Errors come back to the model as `{ error: { code, message, fix } }`, so it can read the fix and act on it. Publishing sends an idempotency key, so a retried call never posts twice.

```ts
socialsTools({ tools: ["list_accounts", "create_post"] }); // only some tools
socialsTools({ apiKey: "sk_..." });                         // an explicit key
socialsTools({ client: new SocialsForAI({ apiKey }) });     // your own client
```

To keep a person in the loop, give the model a key that requires approval. Every post then waits until someone approves it at a link:

```ts
const socials = new SocialsForAI({ apiKey: process.env.SOCIALSFORAI_ADMIN_KEY });
const { key } = await socials.keys.create({ name: "agent", scopes: ["posts:write"], require_approval: true });
socialsTools({ apiKey: key });
```

The same tools are available in Python for LangChain, CrewAI and the OpenAI Agents SDK (`pip install socialsforai`), and over MCP at `https://socialsforai.com/api/mcp`.
