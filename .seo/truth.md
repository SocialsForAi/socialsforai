# Truth ledger — SocialsForAI

_Sources read: README.md, AGENTS.md, skills/socialsforai/SKILL.md, sdk/package.json, python/pyproject.toml. Date: 2026-11-18._
_Updated: homepage socialsforai.com (health diff 2026-11-19) — network status table added; "8 of 16 networks live" claim confirmed._
_Re-derive whenever pricing, plans, integrations, or network support changes._

---

## Claims table

| Claim | Value | Source | Read |
|---|---|---|---|
| Free plan — active accounts | 3 | skills/socialsforai/SKILL.md §7 | 2026-11-18 |
| Free plan — posts per month | 100 | skills/socialsforai/SKILL.md §7 | 2026-11-18 |
| Free plan — rate limit | 60 req/min | skills/socialsforai/SKILL.md §7 | 2026-11-18 |
| Paid plan names | hobby, pro, growth, scale | skills/socialsforai/SKILL.md §7 | 2026-11-18 |
| Pricing page | https://socialsforai.com/pricing.md | skills/socialsforai/SKILL.md §7 | 2026-11-18 |
| API key shown once | yes — shown once at signup | skills/socialsforai/SKILL.md §1 | 2026-11-18 |
| Agent can self-register | yes — POST /v1/workspaces, no auth | skills/socialsforai/SKILL.md §1 | 2026-11-18 |
| Networks: total on roadmap | 16 | homepage "8 of 16 networks live" | 2026-11-19 |
| Networks: currently live count | 8 | homepage "8 of 16 networks live" | 2026-11-19 |
| Networks: X (Twitter) | live | SKILL.md §2; homepage network table | 2026-11-19 |
| Networks: LinkedIn | live | SKILL.md §2; homepage network table | 2026-11-19 |
| Networks: Bluesky | live | SKILL.md §2; homepage network table | 2026-11-19 |
| Networks: Mastodon | live | SKILL.md §2; homepage network table | 2026-11-19 |
| Networks: Telegram | live | SKILL.md §2; homepage network table | 2026-11-19 |
| Networks: Discord | live (webhook) | SKILL.md §2; homepage network table | 2026-11-19 |
| Networks: Slack | live (webhook) | SKILL.md §2; homepage network table | 2026-11-19 |
| Networks: Nostr | live | SKILL.md §2; homepage example workspace | 2026-11-19 |
| Networks: Instagram | in review — not yet live | homepage network table ("In review") | 2026-11-19 |
| Networks: Threads | in review — not yet live | homepage network table ("In review") | 2026-11-19 |
| Networks: Facebook | in review — not yet live | homepage network table ("In review") | 2026-11-19 |
| Networks: TikTok | in review — not yet live | homepage network table ("In review") | 2026-11-19 |
| Networks: YouTube | in review — not yet live | homepage network table ("In review") | 2026-11-19 |
| Networks: Pinterest | coming soon | homepage network table ("Coming soon") | 2026-11-19 |
| Networks: Reddit | coming soon | homepage network table ("Coming soon") | 2026-11-19 |
| Networks: live list (dynamic) | GET /v1/platforms — authoritative real-time source | SKILL.md §2 | 2026-11-18 |
| Networks: homepage table authoritative | "status is read from the API's own configuration, so it only says live when it can post" | homepage | 2026-11-19 |
| Sandbox account | yes — platform: "sandbox", credentials: {} | skills/socialsforai/SKILL.md §2 | 2026-11-18 |
| MCP transport | Streamable HTTP | README.md | 2026-11-18 |
| MCP URL | https://socialsforai.com/api/mcp | README.md | 2026-11-18 |
| Idempotency | yes — same key = no duplicate post | skills/socialsforai/SKILL.md §3 | 2026-11-18 |
| Dry run | yes — validates without publishing | skills/socialsforai/SKILL.md §3 | 2026-11-18 |
| Approval workflow | yes — approval: "required", human approves via URL | skills/socialsforai/SKILL.md §4 | 2026-11-18 |
| Scoped sub-agent keys | yes — per-account, per-scope, daily post limit | skills/socialsforai/SKILL.md §6 | 2026-11-18 |
| Auto-thread on long text | yes — auto_thread: true | skills/socialsforai/SKILL.md §3 | 2026-11-18 |
| Media upload | yes — POST to upload endpoint, returns URL | skills/socialsforai/SKILL.md §3 | 2026-11-18 |
| Post scheduling | yes — scheduled_at, timezone, or "best" | skills/socialsforai/SKILL.md §3 | 2026-11-18 |
| Repeating posts | yes — repeat: {every, count} | skills/socialsforai/SKILL.md §3 | 2026-11-18 |
| Batch posting | yes — POST /v1/posts/batch, up to 50 | skills/socialsforai/SKILL.md §3 | 2026-11-18 |
| Author / company | Codehorts LLC | python/pyproject.toml | 2026-11-18 |
| SDK: JavaScript | @socialsforai/sdk v0.2.0 | sdk/package.json | 2026-11-18 |
| SDK: Python | socialsforai v0.1.0 | python/pyproject.toml | 2026-11-18 |
| SDK: Vercel AI | @socialsforai/ai-sdk v0.1.0 | ai-sdk/package.json | 2026-11-18 |
| CLI | @socialsforai/cli v0.2.0 | cli/package.json | 2026-11-18 |
| LangChain integration | yes | python/pyproject.toml optional-dep | 2026-11-18 |
| CrewAI integration | yes | python/pyproject.toml optional-dep | 2026-11-18 |
| OpenAI Agents SDK integration | yes | python/pyproject.toml optional-dep | 2026-11-18 |

---

## HIGH-RISK claims

Claims where being wrong is a revenue or trust problem:

| Claim | Risk | Note |
|---|---|---|
| "Agent never sees a password" | Trust / security | Core differentiator. Must remain true as new networks are added. |
| Free plan limits (3 accounts, 100 posts) | Revenue | Could cause unexpected billing if wrong. Verify against live /v1/workspace on plan changes. |
| Idempotency guarantee | Correctness | An agent that retries under the belief this holds and gets a duplicate post is a severe bug. Keep this in truth-checks.json. |
| Instagram / YouTube / TikTok support | Reputation | These are "in review" per the homepage as of 2026-11-19. Do NOT claim they are live. The /instagram-api page on the site may need a disclaimer that the network is in review. |
| "8 of 16 networks live" count | Reputation | Do not state a different network count in content without re-checking /v1/platforms or the homepage. |

---

## Disagreements found (code vs. marketing site)

1. **Resolved 2026-11-19**: YouTube, TikTok, and Instagram are now explicitly labeled "In review" on the homepage network table. The earlier "unverified" label in this file is superseded. The /instagram-api page on the live site should be checked for a disclaimer that Instagram is in review (requires website repo access — see NY-3).

No active disagreements as of 2026-11-19.
