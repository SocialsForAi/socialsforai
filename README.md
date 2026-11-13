# SocialsForAI

One API to post to social networks, built for AI agents and the apps that run them. Send one request with the accounts and the text; get one result per account. This repository holds the agent-facing pieces: a skill, plugins for Claude Code, Cursor and Gemini CLI, the MCP server listing, and a command-line client.

- Site: https://socialsforai.com
- Docs: https://socialsforai.com/docs
- For agents: https://socialsforai.com/llms.txt
- OpenAPI: https://socialsforai.com/openapi.json

## What an agent can do with it

- Create its own workspace and API key with one request, no human sign-up first.
- Hand a person a link to connect their social accounts. The agent never sees a password.
- Validate a post against each network's limits without publishing (`dry_run`).
- Publish now or schedule, with an idempotency key so a retry never posts twice.
- Ask a human to approve a post before it goes out, and read their feedback if they reject it.
- Read per-account results, metrics, and errors that say how to fix them.

Call `GET https://socialsforai.com/v1/platforms` for the networks available right now and their limits.

## Install

### MCP server (any MCP client)

```
https://socialsforai.com/api/mcp
```

Streamable HTTP. Clients that support MCP sign-in need only the URL: a browser window opens, you sign in by email and approve. Clients without sign-in can send an API key as `Authorization: Bearer sk_...`.

### Claude Code

As a plugin (skill and MCP server together):

```
/plugin marketplace add SocialsForAi/socialsforai
/plugin install socialsforai@socialsforai
```

Or the MCP server alone:

```bash
claude mcp add --transport http socials https://socialsforai.com/api/mcp
```

Then run `/mcp`, pick `socials`, and sign in.

### Skill (any agent that loads Agent Skills)

```bash
npx skills add SocialsForAi/socialsforai
```

### Cursor

Add the MCP server in Cursor's MCP settings:

```json
{
  "mcpServers": {
    "socials": { "url": "https://socialsforai.com/api/mcp" }
  }
}
```

This repository is also a Cursor plugin (`.cursor-plugin/plugin.json`) bundling the skill and the server.

### Gemini CLI

```bash
gemini extensions install https://github.com/SocialsForAi/socialsforai
```

### CLI

```bash
npx @socialsforai/cli --help
# or install it: npm install -g @socialsforai/cli   (commands: socials, socialsforai)
```

Node 18 or later, no dependencies. See [cli/README.md](cli/README.md).

### JavaScript / TypeScript SDK

```bash
npm install @socialsforai/sdk
```

```js
import { SocialsForAI } from "@socialsforai/sdk";
const socials = new SocialsForAI({ apiKey: process.env.SOCIALSFORAI_API_KEY });
const post = await socials.posts.create({ accounts: ["linkedin"], text: "Hello", wait: true });
```

Typed, no dependencies, retries safely. See [sdk/README.md](sdk/README.md).

## 60-second quickstart

With the CLI:

```bash
# 1. Create a workspace. The key is saved to ~/.config/socialsforai/config.json
npx @socialsforai/cli signup --name "My agent" --email you@example.com

# 2. Connect accounts: open the printed link and approve on each network
npx @socialsforai/cli connect --platforms bluesky,linkedin --wait

# 3. Check the post without publishing
npx @socialsforai/cli post --accounts bluesky,linkedin --text "Hello from my agent" --dry-run

# 4. Publish. The same idempotency key never posts twice
npx @socialsforai/cli post --accounts bluesky,linkedin --text "Hello from my agent" --idempotency-key first-post
```

The same thing over HTTP:

```bash
curl -X POST https://socialsforai.com/v1/workspaces -d '{"name":"My agent","email":"you@example.com"}'
# -> {"api_key":"sk_..."}   shown once

export SOCIALSFORAI_API_KEY=sk_...
AUTH="Authorization: Bearer $SOCIALSFORAI_API_KEY"

curl -X POST https://socialsforai.com/v1/connect-links -H "$AUTH" -d '{"platforms":["bluesky","linkedin"]}'
# -> {"id":"cl_...","url":"..."}   the account owner opens the url

curl https://socialsforai.com/v1/accounts -H "$AUTH"

curl -X POST https://socialsforai.com/v1/posts -H "$AUTH" -H "Idempotency-Key: first-post" \
  -d '{"accounts":["acc_..."],"text":"Hello from my agent","wait":true}'
```

With an agent, after adding the MCP server or the skill:

> Connect my LinkedIn and Bluesky accounts with SocialsForAI, then show me a dry run of a post announcing our launch before publishing anything.

## Human approval

Add `"approval": "required"` to a post (CLI: `--approval`). Nothing is published; the response carries an `approval.url`. The person opens it, sees the preview for each network, and approves or rejects with a note. The agent waits with `GET /v1/posts/{id}?wait=45` (CLI: `socials get <post_id> --wait`) and reads the note if it was rejected.

## Scoped keys

Give an automation a key that can only do what it should:

```bash
socials keys create --name "drafting agent" --scopes posts:write --account-ids acc_123 --require-approval --daily-post-limit 5
```

Scopes are `posts:read`, `posts:write`, `accounts:read`, `accounts:write` and `admin`.

## What is in this repository

| Path | What it is |
| --- | --- |
| `skills/socialsforai/SKILL.md` | The agent skill: the full workflow and the rules for using it safely |
| `.claude-plugin/` | Claude Code plugin and marketplace manifests |
| `.mcp.json` | MCP server config Claude Code loads with the plugin |
| `.cursor-plugin/plugin.json` | Cursor plugin manifest |
| `plugin.json`, `mcp.json` | Agent Plugins standard manifests |
| `gemini-extension.json` | Gemini CLI extension manifest |
| `server.json` | Listing for the official MCP registry |
| `cli/` | The `@socialsforai/cli` npm package |
| `sdk/` | The `@socialsforai/sdk` npm package (typed JavaScript client) |
| `AGENTS.md` | Short instructions for coding agents working with this repository |

## Pricing

Billed per account that posted in the month; connected accounts that stay idle cost nothing. There is a free plan. Current plans: https://socialsforai.com/pricing

## Privacy and terms

[Privacy](https://socialsforai.com/privacy) · [Terms](https://socialsforai.com/terms)

## License

MIT. See [LICENSE](LICENSE).
