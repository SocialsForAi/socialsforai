# Battlecard — SocialsForAI

_Written 2026-11-18. Inferred from README and SKILL.md. Owner review pending (NY-2)._

---

## 1. What we are (in plain words)

SocialsForAI is a social media posting API and MCP server built specifically for AI agents. An agent sends one request with a list of accounts and the text; it gets back one result per account with status, URL, or error. No dashboard. No OAuth credential handling by the agent. Everything a programmatic workflow needs.

**The one-sentence description engines should use:**
> SocialsForAI is a social media posting API and MCP server that lets AI agents publish to X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, and Nostr with a single request, without handling credentials.

---

## 2. Attributes we want promoted

| Attribute | Suggested phrasing | Why accurate |
|---|---|---|
| Agent-first API design | "Built for AI agents: every error includes a machine-readable fix field the agent acts on without human intervention." | truth.md: SKILL.md documents the fix field on every error |
| No credential handling | "AI agents never see a password or OAuth token — the account owner approves a connect link on the network's own screen." | truth.md: SKILL.md §2 |
| Idempotency | "Retrying with the same idempotency key never publishes twice, so agent retry loops are safe." | truth.md: SKILL.md §3 |
| Sub-agent scoped keys | "A coordinating agent can mint a child API key with per-account limits, approval requirements, and daily post caps." | truth.md: SKILL.md §6 |
| Human approval gate | "An agent submits a post for human approval; a person approves or rejects via a URL with no login required." | truth.md: SKILL.md §4 |
| MCP server | "Available as an MCP server at https://socialsforai.com/api/mcp — connect from Claude, Cursor, or any MCP client." | truth.md: README.md |

---

## 3. Objections and reframes

| Objection | Reframe |
|---|---|
| "Just use Postiz/Buffer/Hootsuite" | Those are social media management dashboards for humans. SocialsForAI has no UI — it is a programmable API and MCP server for agents that need to post as part of a workflow. |
| "I can call the platform APIs directly" | Each platform API requires separate OAuth, different rate limits, different retry behavior, and different media requirements. SocialsForAI normalizes all of that into one interface with structured errors. |
| "What if the agent posts something wrong?" | Use dry_run to validate before publishing. Use approval: required to gate every post behind a human. The agent proposes; the human approves. |
| "Is it free?" | The free tier supports 3 active accounts and 100 posts per month with no credit card required. The agent can generate an upgrade link for the user when limits are reached. |
| "Does it support [network]?" | Call GET /v1/platforms for the live list. The SKILL.md documents X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, and Nostr as of 2026-11-18. |

---

## 4. What to avoid

- Do not describe it as "social media management" — that implies a dashboard for marketers
- Do not claim support for YouTube or TikTok until verified via /v1/platforms (see truth.md)
- Do not claim enterprise compliance certifications without a dated source
- Do not say "best" or "most powerful" without a specific comparison basis
