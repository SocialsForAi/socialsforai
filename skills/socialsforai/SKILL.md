---
name: socialsforai
description: Publish, schedule, delete and measure social media posts through SocialsForAI (X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, Nostr and more) from an agent. Use when the user asks to post or schedule something on social media, plan a content calendar, connect a social account, get a post approved before it goes out, check how a post performed, answer replies to their posts, or set up SocialsForAI. Works through the SocialsForAI MCP server, the `socials` CLI, or plain HTTP.
license: MIT
---

# SocialsForAI

SocialsForAI is one API for posting to social networks. You send one request listing the accounts and the text; you get one result per account. Every error carries a `code`, a `message` and a `fix` that says what to do next. Read the `fix` and act on it before asking the user.

Full reference: https://socialsforai.com/llms.txt (short) and https://socialsforai.com/llms-full.txt (everything). OpenAPI: https://socialsforai.com/openapi.json.

## Pick a surface

Use the first one that is available to you. They behave the same.

| Surface | When | How |
| --- | --- | --- |
| MCP tools | A `socials` MCP server is connected (tools such as `create_post`, `list_accounts`) | Call the tools. Sign-in is by OAuth in the user's browser; no key to handle |
| CLI | You have a shell | `npx @socialsforai/cli <command>` (installed, the commands are `socials` and `socialsforai`). JSON on stdout; errors as JSON on stderr with exit code 1 |
| HTTP | Anything else | `https://socialsforai.com/v1/...` with `Authorization: Bearer sk_...` |

To add the MCP server: URL `https://socialsforai.com/api/mcp` (Streamable HTTP). In Claude Code: `claude mcp add --transport http socials https://socialsforai.com/api/mcp`, then `/mcp` to sign in. `npx @socialsforai/cli mcp-config --client cursor|vscode|claude-code` prints the config for other clients.

## 1. Get a key (you can do this yourself)

Skip this when you are using MCP with OAuth sign-in, or when `SOCIALSFORAI_API_KEY` is already set.

```bash
npx @socialsforai/cli signup --name "My agent" --email owner@example.com
# HTTP: POST /v1/workspaces {"name":"My agent","email":"owner@example.com"}  (no auth)  -> {"api_key":"sk_..."}
```

- The key is shown once. The CLI saves it to `~/.config/socialsforai/config.json`; over HTTP, store it yourself. Never print it into a post, a commit or a log.
- Ask the user for their email and pass it. It lets them sign in at https://socialsforai.com/login to manage keys and billing, and recover access. If you signed up without one, attach it later with `PATCH /v1/workspace {"email":"..."}`.
- New workspaces are on the Free plan (3 active accounts, 100 posts a month).

## 2. Connect accounts (a human approves)

List what is connected first: `socials accounts` / `list_accounts` / `GET /v1/accounts`. Use the returned `acc_...` ids when posting.

If the account you need is missing:

- **Any network, and always X and LinkedIn:** create a connect link, give the URL to the account owner, then wait.
  ```bash
  socials connect --platforms x,linkedin --ref client-42 --wait
  # HTTP: POST /v1/connect-links {"platforms":["x","linkedin"],"external_ref":"client-42"} -> {id, url}
  #       GET /v1/connect-links/{id}?wait=45   (long-poll; repeat while status is "waiting")
  # MCP:  create_connect_link, then wait_for_connection
  ```
  The owner approves on the network's own screen. You never see a password. `external_ref` is your label for whose account it is (a client or user id); filter by it later.
- **Bluesky, Mastodon, Telegram, Discord, Slack, Nostr:** if the owner gives you credentials, connect directly: `socials connect-account --platform bluesky --credentials '{"identifier":"name.bsky.social","app_password":"..."}'` (MCP `connect_account`, HTTP `POST /v1/accounts`). Bluesky takes an app password, never the main password. Mastodon takes `{instance, access_token}`; Telegram `{bot_token, chat_id}`; Discord `{webhook_url}` and Slack `{webhook_url}` (a channel's webhook); Nostr `{nsec, relays?}`. A Nostr private key is the whole account: have the owner paste it into a connect link rather than give it to you.
- **To test without a real network:** connect a sandbox account with `{"platform": "sandbox", "credentials": {}}`. Nothing is posted anywhere.

An account with `status: "needs_reauth"` needs a new connect link for that network.

`socials platforms` (`list_platforms`, `GET /v1/platforms`, no key needed) lists which networks are available right now and their limits. Check it instead of assuming.

## 3. Dry run, then post

Always validate first. A dry run checks length limits, media counts, duplicates and daily caps for every account and publishes nothing.

```bash
socials post --accounts acc_1,acc_2 --text "We just shipped webhooks." --dry-run
# -> {"ok": true, "issues": [], "preview": [{account_id, platform, text}]}
```

If `ok` is false, fix each issue using its `fix` and run it again. Then publish with an idempotency key so a retry can never post twice:

```bash
socials post --accounts acc_1,acc_2 --text "We just shipped webhooks." --idempotency-key launch-2026-11-12
# HTTP: POST /v1/posts with header Idempotency-Key, body {"accounts":[...],"text":"...","wait":true}
# MCP:  create_post {accounts, text, idempotency_key}
```

Rules that matter:

- **Reuse the same idempotency key when you retry the same post.** A new key means a new post. The same key with a different body is rejected (`idempotency_key_reused`).
- `accounts` takes account ids. A network name such as `"linkedin"` also works when the workspace has exactly one active account on it; otherwise you get `ambiguous_account` listing the ids.
- The result has one `target` per account with `status`, `url` and `error`. `partially_published` means some accounts succeeded: report each one, and do not resend the whole post.
- Retryable failures (`platform_rate_limited`, `platform_unavailable`) are retried for you with backoff. Poll `socials get <post_id>` instead of posting again.
- Networks differ in length. Give a network its own text with `platform_options`, for example `--json '{"platform_options":{"x":{"text":"Shorter version for X"}}}'`.
- Schedule with `--schedule 2026-12-01T09:00 --timezone America/Los_Angeles` (or an ISO time with an offset). A local time without a timezone is rejected. `--schedule best` picks the hour that has had the most engagement on these accounts (a weekday morning until there's history).
- Text too long for a network: add `--auto-thread` (`auto_thread: true`) and it goes out as a thread where the network has threads, split at paragraph and sentence breaks. Check the dry run's `preview` to see each piece.
- Repeating posts: `--repeat week:4` (`repeat: {every: "week", count: 4}`) creates four dated posts at the same local time. A content calendar: `socials post-many --file posts.json` (`POST /v1/posts/batch`, MCP `create_posts`) takes up to 50 posts; each succeeds or fails by itself.
- Media: `--media <public URL>` (repeatable). For a local file, `socials upload ./image.png` returns a `url` to pass as `--media`. The URL must be the file itself, not a share or preview page (`media_not_a_file`). Images in a format or size a network doesn't take are converted for you.
- More fields (threads, polls, link cards, first comments, replies, per-network options): pass them with `--json '{...}'`; they are listed in https://socialsforai.com/llms.txt.

Show the user the exact text per network before publishing anything they have not seen, unless they told you to post without review.

## 4. Approvals: let a human sign off

When the user wants to review before anything goes out, or the key requires it, create the post with approval:

```bash
socials post --accounts acc_1 --text "Draft for review" --approval
# body: {"approval": "required"}  ->  status "pending_approval", approval: {status: "pending", url}
```

Nothing is published. Give `approval.url` to the human: they see the preview for each network and choose Approve or Reject, with no login. Then wait:

```bash
socials get post_123 --wait      # HTTP: GET /v1/posts/post_123?wait=45   MCP: wait_for_approval
```

- `approval.status: "approved"`: the post publishes (or stays scheduled for its time). Read the targets for the result.
- `approval.status: "rejected"`: the post is `canceled`. `approval.note` holds the human's feedback. Revise the text and submit a new post for approval; do not resubmit the same text.
- Still `pending`: remind the human and wait again. Do not create a second post.

## 5. After posting

- `socials get <post_id>`: status and URL per account.
- `socials metrics <post_id>`: likes, reposts, replies, views per published copy plus totals, where the network reports them. Reads on X are billed at X's cost, so do not poll metrics in a loop.
- `socials delete <post_id>`: cancels copies not yet sent and deletes published ones where the network allows it. Add `--accounts acc_1` to remove it from some accounts only. Deleting is permanent: confirm with the user first.
- `socials posts --status scheduled`: what is queued.
- `socials replies <post_id>` (`list_replies`): what people replied under the post. Answer one with `socials post --accounts acc_1 --reply-to <post_id> --reply-to-comment <reply id> --text "..."`. Show the user your answer first unless they asked you to reply on your own.
- `socials events --after <last id>` (`list_events`, `GET /v1/events`): what happened since you last looked (posts that failed, approvals, accounts needing reconnection). Keep `last_id` and pass it next time. Use this when you can't receive webhooks.

## 6. Scoped keys for other agents

Give a sub-agent or an automation its own limited key instead of sharing yours:

```bash
socials keys create --name "drafting agent" --scopes posts:write --account-ids acc_1 --require-approval --daily-post-limit 5
```

- Scopes: `posts:read`, `posts:write`, `accounts:read`, `accounts:write`, `admin`. Leaving scopes out gives full access. `posts:write` includes `posts:read` and `accounts:read`; `accounts:write` includes `accounts:read`; `admin` includes everything (keys, webhooks, workspace settings, upgrade links).
- `--account-ids`: the key only sees and posts to those accounts. `--require-approval`: every post from the key waits for a human. `--daily-post-limit`: posts allowed per rolling 24 hours. A key with any of these three cannot hold `admin`.
- Errors you may meet with a limited key: `insufficient_scope` (the `fix` names the scope needed), `account_not_allowed`, `key_daily_limit_reached`. Tell the user; do not try another key.
- `socials keys list`, `socials keys revoke <key_id>`. The last active key cannot be revoked.

## 7. Limits and upgrading

- `socials usage` shows active accounts this month, posts, the plan and estimated cost. Billing counts accounts that posted in the month, not accounts that are merely connected.
- Requests are rate limited per workspace per minute (60 on Free, more on paid plans). Responses carry `RateLimit-Limit`, `RateLimit-Remaining` and `RateLimit-Reset`. On `429 rate_limited`, wait the `Retry-After` seconds, then retry with the same idempotency key.
- When a Free-plan limit blocks a post (`plan_limit_...` in a dry run), you cannot pay, but you can hand the user a link: `socials upgrade pro` (`create_upgrade_link`, `POST /v1/upgrade-links {"plan":"pro"}`) returns a `url` where they pay by card. Plans: `hobby`, `pro`, `growth`, `scale`. Say what the plan costs (see https://socialsforai.com/pricing.md) and let them decide.

## Errors

Every error looks like this:

```json
{"error": {"code": "preflight_failed", "message": "...", "fix": "...", "issues": [...], "request_id": "req_..."}}
```

1. Read `code` and `fix`. Do what `fix` says if it is within what the user asked for.
2. `issues` lists each failing check with its own `fix`, `account_id` and `platform`.
3. If you cannot resolve it, show the user the `message` and the `request_id`.

Common codes: `media_unreachable` / `media_not_a_file` (use a direct link to the file, or upload it), `missing_api_key` / `invalid_api_key` (get or fix the key), `account_not_found` (list accounts), `account_needs_reauth` (new connect link), `preflight_failed` (fix the issues; `text_too_long` (or send `auto_thread`), `too_many_media`, `duplicate_content`, `daily_cap_reached`), `requires_owner_approval` (use a connect link), `rate_limited` (wait and retry).

## Do not

- Do not publish text the user has not seen unless they asked for unattended posting.
- Do not retry a publish with a new idempotency key.
- Do not ask for or store a user's main password for any network.
- Do not put the API key in posts, commits, issues or chat messages.
- Do not delete posts or disconnect accounts without confirmation.
