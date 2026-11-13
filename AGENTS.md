# Instructions for coding agents

This repository packages SocialsForAI (a social media posting API) for agents. If you were sent here to use the product, you do not need to read the source.

## To use SocialsForAI

1. Read `skills/socialsforai/SKILL.md`. It is the complete workflow: get a key, connect accounts, dry run, post, approvals, metrics, errors.
2. Pick one surface:
   - MCP: add `https://socialsforai.com/api/mcp` (Streamable HTTP, OAuth sign-in).
   - CLI: `npx @socialsforai/cli --help`. JSON on stdout, error JSON on stderr, exit 1 on API errors and 2 on usage mistakes.
   - HTTP: `https://socialsforai.com/v1`, `Authorization: Bearer sk_...`. Reference at https://socialsforai.com/llms.txt and https://socialsforai.com/openapi.json.
3. You can create a workspace and key yourself: `npx @socialsforai/cli signup --email <the user's email>`. A person still has to approve each social account through a connect link.

Rules: run a dry run before publishing; reuse the same idempotency key when retrying; never print the API key; do not publish text the user has not seen unless they asked for unattended posting.

## To change this repository

- `cli/` is a dependency-free Node package (ESM, Node 18+, no build step). Run `npm test` inside `cli/`; the tests use a local mock server and never touch the network.
- Keep versions in step when releasing: `cli/package.json`, `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`, `plugin.json`, `gemini-extension.json`, `server.json`.
- `.mcp.json` is read by Claude Code and needs `"type": "http"`. `mcp.json` follows the Agent Plugins schema and uses `"type": "streamable-http"`. Both point at the same server; change them together.
- Check the plugin with `claude plugin validate .`.
- Every statement about the product in `README.md` and `SKILL.md` must match the live API. Do not add claims about networks, limits or prices; point to `/v1/platforms` and the pricing page instead.
