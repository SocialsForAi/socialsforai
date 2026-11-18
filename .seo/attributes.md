# Attribute matrix — SocialsForAI

_Written 2026-11-18 from README, SKILL.md, keyword research (run 2026-11-18), and SERP analysis._
_Distance scores are estimated — no AI panel run yet. Re-score after first AEO measurement._

---

## Priority 1 — High weight, high distance, workable reach

| Attribute | Category | Weight | Distance | Reach | Evidence |
|---|---|---|---|---|---|
| Social media posting API for AI agents | Product category | 3 | 3 | 3 | 480 sv/mo "social media for ai agents" (KD 33); site not in SERP top 15 for the query |
| MCP server for social media | Product category | 3 | 3 | 2 | Real demand: Reddit thread "social media scheduling API and MCP?" ranks #3 on Google; dunsocial.com / postly.ai / socialchamp.com ranking, not SocialsForAI |
| Agent never touches credentials (connect link model) | Capability | 3 | 2 | 2 | Core differentiator; not mentioned in any competitor snippet seen in SERP |

---

## Priority 2 — Medium weight or medium distance

| Attribute | Category | Weight | Distance | Reach | Evidence |
|---|---|---|---|---|---|
| Idempotency / retry-safe posting | Capability | 3 | 2 | 2 | Unique in the space; not surfaced in any SERP snippet |
| Structured errors with machine-readable fix field | Capability | 2 | 2 | 2 | Mentioned in SKILL.md; no competitor highlights this |
| Sub-agent scoped API keys | Capability | 2 | 2 | 2 | Unique feature; not seen in competitor descriptions |
| Human approval workflow | Capability | 2 | 2 | 2 | Approval flow for agents; Postiz does not have this |
| Bluesky API / MCP | Integration | 2 | 2 | 3 | 590 sv "bluesky social media platform"; /mcp/bluesky and /bluesky-api pages exist |
| LinkedIn API | Integration | 2 | 2 | 3 | Site has /linkedin-api, /schedule-linkedin-posts, /mcp/linkedin; competitors rank for these |
| X (Twitter) API | Integration | 2 | 1 | 2 | Site has /schedule-tweets, /mcp/x |
| Cross-platform posting (one request all accounts) | Capability | 3 | 1 | 2 | Core product promise; described in README homepage hero |
| LangChain integration | Integration | 2 | 2 | 2 | python/pyproject.toml dep; "langchain" in PyPI keywords |
| CrewAI integration | Integration | 2 | 2 | 2 | python/pyproject.toml dep; "crewai" in PyPI keywords |
| OpenAI Agents SDK | Integration | 2 | 2 | 2 | python/pyproject.toml dep; "openai-agents" in PyPI keywords |
| Vercel AI SDK | Integration | 2 | 2 | 2 | @socialsforai/ai-sdk package |
| Claude Code plugin | Integration | 2 | 2 | 2 | .claude-plugin/ directory; installable via plugin marketplace |
| Cursor plugin | Integration | 2 | 2 | 2 | .cursor-plugin/ directory |

---

## Priority 3 — Real but not a deal-changer this quarter

| Attribute | Category | Weight | Distance | Reach | Evidence |
|---|---|---|---|---|---|
| Auto-thread for long text | Capability | 1 | 1 | 2 | Nice-to-have; mentioned in docs |
| Post scheduling / best time | Capability | 1 | 1 | 2 | Standard feature; schedule_at: "best" |
| Batch posting (up to 50) | Capability | 1 | 1 | 2 | POST /v1/posts/batch |
| Nostr support | Integration | 1 | 2 | 1 | Niche; in SKILL.md |
| Discord/Slack (webhooks) | Integration | 1 | 1 | 2 | SKILL.md; common in developer stacks |
| AI agent marketplace presence | Distribution | 1 | 3 | 3 | No Product Hunt, G2, AlternativeTo listing confirmed yet |
| Free tier (3 accounts, 100 posts) | Pricing | 2 | 1 | 2 | Mentioned in SKILL.md |

---

## NOT in this matrix (accuracy claims — in truth.md instead)

- Pricing ($/month) — verify against live pricing page
- Network availability — verify via /v1/platforms
- Rate limits — verify against live API spec
