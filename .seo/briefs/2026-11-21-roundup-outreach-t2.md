# Roundup Outreach — Tier 2 Listicle Inclusion Briefs

**Action:** offpage-brief  
**Tier:** 2 — get added where we are absent  
**Run:** 2026-11-21-0000  
**Closing:** OFF-004 (dev.to), OFF-005 (shapelessai.com)  

SocialsForAI is absent from every page-1 SERP result for "best social media MCP servers" and
"social media API for AI agents". Two independent, non-competitor roundup pages were confirmed
by page fetch on 2026-11-21. Both source facts from vendor documentation and both explicitly
invite corrections or additions. Two briefs are ready to send; a triage list follows.

---

## Brief OFF-004 — dev.to community post

**Source:** "Social media posting APIs for AI agents: Buffer, Ayrshare, Blotato, Postiz, Zernio, and dropspace compared"  
**URL:** https://dev.to/jclvsh/social-media-posting-apis-for-ai-agents-buffer-ayrshare-blotato-postiz-zernio-and-dropspace-4an8  
**Author:** JC Lopez Vázquez (@jclvsh) on dev.to  
**Relationship:** none — community post author  
**Contact:** dev.to comment section on the post, or @jclvsh on X/Bluesky if discoverable  
**Closes finding:** OFF-004  
**SERP position:** page 1, "social media API for AI agents" (confirmed 2026-11-19 and 2026-11-21)

**Currently says:**  
> "I wanted an agent to publish the same announcement to several social platforms without me
> wiring up an OAuth flow, a media upload API, and a rate limiter for each one."

The article compares six tools — Buffer, Ayrshare, Blotato, Postiz, Zernio, and dropspace —
and concludes with a decision matrix. SocialsForAI is not included. The author discloses
building dropspace and notes: "flag inaccuracies for correction."

**Problem:** The author's stated requirement is exactly SocialsForAI's value proposition:
one endpoint, no per-network OAuth wiring, structured errors with machine-readable `fix`
fields. The existing six tools are compared on how well they solve that problem. SocialsForAI
is a gap: it ships the approval workflow and idempotency guarantees those tools lack.
Post ranks page 1 on dev.to for the exact search term your buyers use.

**Requested addition** (one new section in the comparison, same format as other tools):

---

**SocialsForAI** — https://socialsforai.com  
Posts to X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, and Nostr from one
endpoint. Built for agentic retry loops: passing the same idempotency key never publishes
twice. Every error includes a machine-readable `fix` field — `text_too_long`, `rate_limited`,
`account_needs_reauth` — so the agent handles it without human intervention. The agent never
sees a password; account owners approve a connect link on the network's own OAuth screen.
Optional: post for human approval before publishing, with the agent reading accept/reject
feedback via API. Free tier: 3 connected accounts, 100 posts per month. MCP server at
https://socialsforai.com/api/mcp.

Fits the decision matrix under: "agents that need to discover, post, and retry safely
without credential handling."

---

**Why this is accurate:** Every claim above is sourced from SKILL.md and the live homepage
(truth.md, read 2026-11-19). Networks are those confirmed live; "in review" networks
(Instagram, Threads, Facebook, TikTok, YouTube) are not claimed.

**Ask:** Add SocialsForAI as a seventh option in the comparison, using the description above
verbatim or shortened. The entry fits cleanly alongside the existing decision matrix.

**Effort for them:** ~15 minutes. The description is ready to paste; they would only need
to verify the free tier against the pricing page (https://socialsforai.com/pricing).

---

## Brief OFF-005 — shapelessai.com comprehensive MCP server list

**Source:** "Best Social Media MCP Servers 2026 — 26 tools + theirs, measured"  
**URL:** https://shapelessai.com/best-social-media-mcp-servers  
**Author:** ShapelessAI team (tool-builder, discloses their own inclusion)  
**Relationship:** none  
**Contact:** Contact page or social link at shapelessai.com  
**Closes finding:** OFF-005  
**SERP position:** page 1, "best social media MCP servers" (confirmed 2026-11-21)

**Currently says:**  
> "26 social media MCP servers plus ours, read from their own docs, pricing pages or
> repositories on the date under it. Listicles were used to find names, never to source
> a fact."

The page covers 27 tools. SocialsForAI is not in the list. The methodology statement —
"read from their own docs" — is exactly the evidence trail required by the brief template.

**Problem:** At 27 entries this is effectively the category census for anyone searching
"best social media MCP servers." SocialsForAI's combination of idempotency, approval
workflow, and no-credential-handling is a genuine capability gap in the current list;
none of the 27 tools are described as offering all three in combination for agentic workflows.

**Requested entry** (table row, matching their format — read from vendor docs):

| Field | Value |
|---|---|
| Name | SocialsForAI |
| URL | https://socialsforai.com |
| MCP server URL | https://socialsforai.com/api/mcp |
| Transport | Streamable HTTP (hosted) |
| Networks | X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, Nostr (8 live; Instagram/Threads/Facebook/TikTok/YouTube in review) |
| Free tier | 3 accounts, 100 posts/month |
| Key agent features | Idempotency key (no duplicate on retry), machine-readable error.fix field, approval workflow (agent proposes → human approves via URL), sub-agent scoped keys, no credential handling |
| Source | https://socialsforai.com/api/mcp (MCP endpoint, verified 2026-11-21), SKILL.md |

**Why this is accurate:** All fields sourced from truth.md (read 2026-11-19 from README,
SKILL.md, and live homepage). Networks listed are confirmed live; "in review" networks are
excluded from the live list as required.

**Ask:** Add SocialsForAI as a new row using the data above. No claim requires verification
beyond loading the MCP URL to confirm it resolves, and checking the free tier at
https://socialsforai.com/pricing.

**Effort for them:** ~10 minutes. Data is pre-verified and formatted to their table schema.

---

## Remaining targets — verify before sending

The following roundup pages rank page 1 for the same queries but were not fetched this run.
Check each before sending: confirm it is not competitor-authored, confirm SocialsForAI is
still absent, and use the same requested wording from OFF-004 or OFF-005 above.

| URL | Last seen | Category | Note |
|---|---|---|---|
| https://chatforest.com/guides/best-social-media-mcp-servers/ | 2026-11-21 | MCP servers (35+ tools) | Independent-looking, fetch to confirm |
| https://kevinmeneses.com/en/articles/best-social-media-mcp-servers-2026 | 2026-11-21 | MCP servers | Personal tech blog, independent |
| https://www.postpeer.dev/blog/top-10-mcp-servers-for-social-media-management | 2026-11-20 | MCP servers | Verify independence — postpeer may sell a product |
| https://dev.to/jesse_eisenbart/the-7-best-social-media-apis-for-developers-ai-agents-in-2026-3e15 | 2026-11-19 | Social APIs | High DR, independent post on dev.to — good target |
| https://publora.com/blog/best-social-media-api-for-ai-agents-2026 | 2026-11-19 | Social APIs | Verify: Publora may sell a competing product |

Skip (competitor-authored, confirmed 2026-11-21): blotato.com, upload-post.com, breakreach.com, eden.so, scrapecreators.com (wrong category: research/scraping, not posting APIs).

---

## Recheck cadence

Log send dates in `.seo/aeo/worklog.md` as `sent`. Schedule a 60-day recheck for each:
if the article updated and SocialsForAI is still absent, one follow-up is appropriate.
If included, flip the mentions.md row to `accurate` and stamp the date.
