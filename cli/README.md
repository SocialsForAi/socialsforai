# @socialsforai/cli

Command-line client for the [SocialsForAI](https://socialsforai.com) API: post to social networks from a shell, a script or an AI agent. JSON in, JSON out. Node 18 or later, no dependencies.

```bash
npx @socialsforai/cli --help
# or
npm install -g @socialsforai/cli    # installs the commands `socials` and `socialsforai`
```

## Quickstart

```bash
socials signup --name "My agent" --email you@example.com   # creates a workspace, saves the key
socials connect --platforms bluesky,linkedin --wait        # open the printed link and approve
socials post --accounts bluesky,linkedin --text "Hello" --dry-run
socials post --accounts bluesky,linkedin --text "Hello" --idempotency-key first-post
```

## Authentication

The key is read from, in order: `--api-key`, `SOCIALSFORAI_API_KEY`, `SOCIALS_API_KEY`, then `~/.config/socialsforai/config.json` (written by `signup` and `login`, mode 0600; `XDG_CONFIG_HOME` and `SOCIALSFORAI_CONFIG` move it).

`--base-url` or `SOCIALSFORAI_BASE_URL` points the CLI at another server. The default is `https://socialsforai.com`.

## Commands

| Command | What it does |
| --- | --- |
| `signup [--name] [--email]` | Create a workspace and save its key. `--no-save` prints without saving; `--force` replaces a saved key |
| `login --key sk_...` | Check a key and save it |
| `whoami` | The workspace this key belongs to |
| `platforms` | Networks and their limits (no key needed) |
| `usage` | Active accounts, posts, plan and estimated cost this month |
| `upgrade <hobby\|pro\|growth\|scale>` | A checkout link for a person to pay |
| `accounts [--platform] [--ref] [--status]` | Connected accounts |
| `connect [--platforms a,b] [--ref] [--redirect-url] [--expires-in] [--wait] [--until all\|any]` | A link the account owner opens. `--wait` prints the link on stderr and holds until they finish |
| `connect-account --platform P --credentials '{...}' [--ref]` | Connect Bluesky, Mastodon or Telegram with credentials |
| `post --accounts a,b --text "..."` | Publish or schedule. See the options below |
| `posts [--status] [--limit] [--before]` | List posts |
| `get <post_id> [--wait]` | One post. `--wait` holds while it is pending approval |
| `delete <post_id> [--accounts a,b]` | Cancel unpublished copies and delete published ones |
| `metrics <post_id>` | Engagement per published copy, plus totals |
| `upload <file> [--content-type]` | Upload an image or video; prints a `url` for `--media` |
| `keys list` / `keys create` / `keys revoke <key_id>` | API keys. `create` takes `--name`, `--scopes a,b`, `--account-ids a,b`, `--require-approval`, `--daily-post-limit N` |
| `webhooks list` / `webhooks create --url U [--events a,b]` / `webhooks delete <id>` | Webhook endpoints |
| `mcp-config [--client claude-code\|cursor\|vscode\|json]` | How to add the MCP server to a client |

### `post` options

| Option | Meaning |
| --- | --- |
| `--accounts a,b` | Account ids, or a network name when the workspace has exactly one account on it |
| `--text "..."` | The text. `--text -` reads it from stdin |
| `--media URL` | A public image or video URL. Repeat for several |
| `--link URL` | Share a URL as a preview card |
| `--schedule ISO` | When to publish: an ISO time with an offset, or a local time together with `--timezone` |
| `--timezone TZ` | IANA zone for a local `--schedule`, for example `America/Los_Angeles` |
| `--dry-run` | Validate only; nothing is published |
| `--approval` | Hold the post until a person approves it at the returned `approval.url` |
| `--idempotency-key K` | Sent as the `Idempotency-Key` header, so a retry never posts twice |
| `--no-wait` | Return as soon as the post is accepted instead of waiting for the result |
| `--json '{...}'` | Extra request fields (threads, polls, `platform_options`, `metadata`). Flags override matching fields |

## Output and exit codes

- Success: JSON on stdout, exit code 0. A dry run that finds problems is still a successful request; read `ok` and `issues`.
- API or network error: the error JSON on stderr, exit code 1. It has a `code`, a `message`, usually a `fix`, and a `request_id`. A 429 adds `retry_after_seconds`.
- Usage mistake: `{"error":{"code":"usage",...}}` on stderr, exit code 2.

```bash
socials post --accounts x --text "$(cat post.txt)" || echo "failed: see the fix above"
```

## Development

```bash
npm test    # node --test, against a local mock server; no network
```

MIT licensed. Full API reference: https://socialsforai.com/llms.txt
