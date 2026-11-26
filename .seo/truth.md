# Truth ledger — SocialsForAI

_Sources read: README.md, AGENTS.md, skills/socialsforai/SKILL.md, sdk/package.json, python/pyproject.toml. Date: 2026-11-18._
_Updated: homepage socialsforai.com (health diff 2026-11-19) — network status table added; "8 of 16 networks live" claim confirmed._
_Updated 2026-11-23: homepage FAQ verified — company address, contact email, MCP Registry ID, credentials-at-rest, data deletion URL added. Pricing page read — plan pricing and billing model added._
_Updated 2026-11-25: pricing changed on 2026-11-24 (v5). Free (3 active accounts) and Pro ($10/mo for 10 active accounts, then $1 each) are the only plans; Hobby, Growth, Scale and the $29 Pro are retired._
_Confirmed 2026-11-26 against live pricing.md and the owner note; no change needed. Outreach brief 2026-11-24 corrected._
_Re-derive whenever pricing, plans, integrations, or network support changes._

---

## Claims table

| Claim | Value | Source | Read |
|---|---|---|---|
| Free plan — active accounts | 3 | skills/socialsforai/SKILL.md §7 | 2026-11-18 |
| Free plan — posts per month | 100 | skills/socialsforai/SKILL.md §7 | 2026-11-18 |
| Free plan — rate limit | 60 req/min | skills/socialsforai/SKILL.md §7 | 2026-11-18 |
| Paid plan names | pro (the only paid plan) | skills/socialsforai/SKILL.md §7; socialsforai.com/pricing | 2026-11-25 |
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
| Company address | 1421 B St, Eureka, CA 95501, USA | homepage FAQ ("Who runs SocialsForAI?") | 2026-11-23 |
| Contact email | lee@socialsforai.com | homepage FAQ; python/pyproject.toml | 2026-11-23 |
| MCP Registry ID | io.github.SocialsForAi/socialsforai | homepage FAQ; server.json | 2026-11-23 |
| Data deletion URL | /data-deletion | homepage FAQ ("you can disconnect any account or delete all your data at /data-deletion") | 2026-11-23 |
| Credentials encrypted at rest | yes | homepage FAQ ("Credentials are encrypted at rest") | 2026-11-23 |
| Free plan | $0 — 3 active accounts, 100 posts/month, no card | socialsforai.com/pricing (read 2026-11-25) | 2026-11-25 |
| Pro plan price | $10/mo | socialsforai.com/pricing (read 2026-11-25) | 2026-11-25 |
| Pro plan account limit | 10 active accounts included | socialsforai.com/pricing | 2026-11-25 |
| Pro plan overage | +$1 per extra active account (no cap, no other tiers) | socialsforai.com/pricing | 2026-11-25 |
| Other paid plans | none — Hobby, Growth, Scale and the $29 Pro were retired on 2026-11-24 | socialsforai.com/pricing; socialsforai.com/llms.txt | 2026-11-25 |
| Worked prices | 10 accounts $10 · 25 $25 · 50 $50 · 100 $100 | GET socialsforai.com/v1/pricing?accounts=N | 2026-11-25 |
| Paid plans billing | monthly by card through Stripe, from dashboard Billing page | socialsforai.com/pricing | 2026-11-23 |
| Paid plans meter | active accounts (accounts that published this month); unlimited posts | socialsforai.com/pricing | 2026-11-23 |
| Agent cannot connect accounts alone | no — a person approves access on each network via connect link | homepage FAQ | 2026-11-23 |
| Agent cannot pay for plan | no — agent requests upgrade link, human pays via Stripe Checkout | homepage FAQ | 2026-11-23 |
| SDK: JavaScript | @socialsforai/sdk v0.2.1 | sdk/package.json | 2026-11-25 |
| SDK: Python | socialsforai v0.1.0 | python/pyproject.toml | 2026-11-18 |
| SDK: Vercel AI | @socialsforai/ai-sdk v0.1.0 | ai-sdk/package.json | 2026-11-18 |
| CLI | @socialsforai/cli v0.2.1 | cli/package.json | 2026-11-25 |
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
| Paid plan price (Pro $10/mo for 10 active accounts, then $1 each) | Revenue | Pricing read from socialsforai.com/pricing on 2026-11-25 (changed 2026-11-24). Never quote Hobby, Growth, Scale or Pro $29 — they are retired. Re-verify whenever a plan change is announced. Do not state different prices in content without re-reading the pricing page. |
| Contact email (lee@socialsforai.com) | Trust | Used in product FAQ and pyproject.toml. Must match across all public content. |
| MCP Registry ID (io.github.SocialsForAi/socialsforai) | Trust | From server.json and homepage FAQ. Must be quoted exactly when directing users to the MCP Registry. |

---

## Disagreements found (code vs. marketing site)

1. **Resolved 2026-11-19**: YouTube, TikTok, and Instagram are now explicitly labeled "In review" on the homepage network table. The earlier "unverified" label in this file is superseded. The /instagram-api page on the live site should be checked for a disclaimer that Instagram is in review (requires website repo access — see NY-3).

No active disagreements as of 2026-11-19.
