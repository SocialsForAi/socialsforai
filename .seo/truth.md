# Truth ledger — SocialsForAI

_Sources read: README.md, AGENTS.md, skills/socialsforai/SKILL.md, sdk/package.json, python/pyproject.toml. Date: 2026-11-18._
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
| Networks: X (Twitter) | yes | skills/socialsforai/SKILL.md §2 | 2026-11-18 |
| Networks: LinkedIn | yes | skills/socialsforai/SKILL.md §2 | 2026-11-18 |
| Networks: Bluesky | yes | skills/socialsforai/SKILL.md §2 | 2026-11-18 |
| Networks: Mastodon | yes | skills/socialsforai/SKILL.md §2 | 2026-11-18 |
| Networks: Telegram | yes | skills/socialsforai/SKILL.md §2 | 2026-11-18 |
| Networks: Discord | yes (webhook) | skills/socialsforai/SKILL.md §2 | 2026-11-18 |
| Networks: Slack | yes (webhook) | skills/socialsforai/SKILL.md §2 | 2026-11-18 |
| Networks: Nostr | yes | skills/socialsforai/SKILL.md §2 | 2026-11-18 |
| Networks: YouTube | unverified — appears in sdk/package.json keywords only | sdk/package.json | 2026-11-18 |
| Networks: TikTok | unverified — appears in sdk/package.json keywords only | sdk/package.json | 2026-11-18 |
| Networks: Instagram | unverified — /instagram-api page exists on live site but SKILL.md does not list it | health diff 2026-11-18 | 2026-11-18 |
| Networks: live list | GET /v1/platforms — always check this, not this table | skills/socialsforai/SKILL.md §2 | 2026-11-18 |
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
| YouTube / TikTok support | Reputation | Currently unverified. Do not claim in content until confirmed via /v1/platforms. |
| Instagram support | Reputation | /instagram-api page exists on the site but SKILL.md does not mention it. Verify before citing. |

---

## Disagreements found (code vs. marketing site)

1. **YouTube and TikTok**: sdk/package.json keywords include "youtube" and "tiktok" but SKILL.md's supported-network list does not. The SKILL.md instructs agents to call `/v1/platforms` for the live list. Marketing pages at `/instagram-api` suggest Instagram support but SKILL.md omits it. **Resolution needed from owner** (see NY-2 in needs-you.md).

No other disagreements detected on first read.
