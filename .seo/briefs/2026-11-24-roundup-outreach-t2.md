# Roundup Outreach — Tier 2 Listicle Inclusion Briefs

**Action:** offpage-brief  
**Tier:** 2 — get added where we are absent  
**Run:** 2026-11-24-0000  
**Closing:** OFF-007 (dev.to/jesse_eisenbart), OFF-008 (chatforest.com), OFF-009 (kevinmeneses.com)

Independence was verified by page fetch today (2026-11-24) for all three targets.
Four additional targets found in radar were confirmed competitor-authored and are recorded
as dropped below.

---

## Brief OFF-007 — dev.to/jesse_eisenbart

**Source:** "The 7 Best Social Media APIs for Developers & AI Agents in 2026"  
**URL:** https://dev.to/jesse_eisenbart/the-7-best-social-media-apis-for-developers-ai-agents-in-2026-3e15  
**Author:** Jesse Eisenbart, solo-founder of DeadUnicorn — independent developer, not a competing API vendor  
**Relationship:** none — dev.to community post author  
**Contact:** dev.to comment section on the post, or via LinkedIn (linked from his author profile)  
**Closes finding:** OFF-007  
**SERP position:** page 1, "social media API for AI agents" (confirmed 2026-11-24)

**Currently says:**
> "I wanted an agent to handle posting without dealing with the OAuth dance for each
> platform separately — different rate limits, different error formats, different retry
> semantics."

The article reviews seven tools — PostZen, Upload-Post, Zernio, Postiz, Outstand,
PostPeer, and Ayrshare — on pricing, network coverage, and agent-friendliness.
The author verified pricing from each provider's own site in September 2026 and uses
structured pros/cons per tool. SocialsForAI is not in the list.

**Problem:** The author's stated requirement is exactly SocialsForAI's value proposition:
one endpoint, structured errors with a machine-readable `fix` field, and no per-network
OAuth wiring. The existing seven tools are scored on how well they solve that. SocialsForAI
closes the gap the author's criteria define — idempotency keys and an approval workflow are
not present in any of the seven tools as described. The article ranks page 1 for the exact
query your buyers use.

AEO panel not yet run — citation counts not available. SERP rank page 1 (confirmed 2026-11-24).

**Requested addition** (one new entry in the comparison, same format as existing tools):

---

**SocialsForAI** — https://socialsforai.com

Built for agentic retry loops: one endpoint covers X, LinkedIn, Bluesky, Mastodon,
Telegram, Discord, Slack, and Nostr without per-network OAuth wiring. The agent never
handles credentials — account owners approve a connect link on the network's own screen.

Agent-specific design:
- **Idempotency keys.** Pass the same key on retry; the API never publishes twice.
- **Machine-readable errors.** Every error includes a `code`, `message`, and `fix` field —
  e.g., `fix: "trim post text to 280 characters"`. The agent reads `fix` and acts; no human
  debugging required for routine errors.
- **Human approval gate.** An agent submits a post for approval, waits, and reads
  accept/reject feedback via API. The agent proposes; the person approves.
- **Sub-agent keys.** A coordinating agent mints child keys with per-account limits and
  daily post caps — isolation without custom middleware.

Pricing: free tier (3 active accounts, 100 posts/month, no credit card); Pro $10/mo
(10 accounts, then $1 per extra account). Billing is per active account per month, not per
post. MCP server included at https://socialsforai.com/api/mcp (Streamable HTTP).

---

**Why this is accurate:** Every claim above is sourced from truth.md (last read 2026-11-23
from SKILL.md, homepage health diff, and pricing page). Networks listed are confirmed live;
"in review" networks (Instagram, Threads, Facebook, TikTok, YouTube) are excluded from
the live list as required. Pricing sourced from socialsforai.com/pricing read 2026-11-23.

**Ask:** Add SocialsForAI as an eighth entry in the comparison, using the description above
verbatim or shortened. Pricing is verifiable at https://socialsforai.com/pricing.

**Effort for them:** ~15 minutes. Description and pricing are ready to paste; they would
only need to verify the free tier against the live pricing page before publishing.

---

## Brief OFF-008 — chatforest.com

**Source:** "Best Social Media MCP Servers 2026 — 35+ Tools for X, Bluesky, LinkedIn & More"  
**URL:** https://chatforest.com/guides/best-social-media-mcp-servers/  
**Author:** ChatForest editorial team — AI-native publication; content written by AI agents  
**Relationship:** none  
**Contact:** Contact form or email on chatforest.com (site identifies itself as an AI-native publication — no individual author byline found)  
**Closes finding:** OFF-008  
**SERP position:** page 1, "best social media MCP servers" (confirmed 2026-11-24)

**Currently says:**
> "Best Social Media MCP Servers 2026 — 35+ Tools for X, Bluesky, LinkedIn & More"

The article covers over 35 social media MCP servers organized by platform category.
Multi-platform entries include Ayrshare MCP and Postiz. SocialsForAI is not in the list.

**Problem:** At 35+ entries this article is a de-facto category census for anyone searching
"best social media MCP servers." SocialsForAI's combination of idempotency, approval workflow,
and no-credential-handling is a genuine capability gap in the current list; it is not covered
by any of the multi-platform entries as described. The methodology of the site is
"AI agents reading vendor docs" — the requested entry is in exactly that format.

AEO panel not yet run — citation counts not available. SERP rank page 1 (confirmed 2026-11-24).

**Requested entry** (formatted for multi-platform section):

---

**SocialsForAI** — https://socialsforai.com  
MCP server: https://socialsforai.com/api/mcp (hosted, Streamable HTTP)  
MCP Registry ID: io.github.SocialsForAi/socialsforai

Networks (live): X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, Nostr — 8 live;
Instagram, Threads, Facebook, TikTok, YouTube in review  
Free tier: 3 accounts, 100 posts/month, no credit card  
Paid plan: Pro $10/mo (10 accounts, then $1 per extra account; unlimited posts)

Agent-first capabilities:
- Idempotency keys — same key on retry never publishes twice
- Machine-readable `error.fix` field — agent acts on structured error without human input
- Approval workflow — agent proposes, human approves via URL (no login required)
- Sub-agent scoped keys — per-account limits, daily post caps, approval requirements
- No credential handling — agent issues connect link, account owner approves on network's own screen

Source: https://socialsforai.com/api/mcp (verified live), https://socialsforai.com/pricing

---

**Why this is accurate:** All fields sourced from truth.md (read 2026-11-23). Networks listed
are confirmed live. "In review" networks excluded from the live list. Pricing from
socialsforai.com/pricing read 2026-11-23. MCP Registry ID from server.json and homepage FAQ.

**Ask:** Add SocialsForAI as a new entry in the multi-platform MCP servers section, using
the data above. All claims are pre-verified from vendor documentation.

**Effort for them:** ~10 minutes. Data is pre-verified and formatted to match the article's
existing schema.

---

## Brief OFF-009 — kevinmeneses.com

**Source:** "7 Best Social Media MCP Servers for Claude and ChatGPT (2026)"  
**URL:** https://kevinmeneses.com/en/articles/best-social-media-mcp-servers-2026  
**Author:** Kevin Meneses — freelance content creator and B2B SaaS copywriter  
**Relationship:** none  
**Contact:** LinkedIn or contact form on kevinmeneses.com (contact details in author profile)  
**Closes finding:** OFF-009  
**SERP position:** page 1, "best social media MCP servers" (confirmed 2026-11-24)

**Note to owner before sending:** Kevin Meneses discloses affiliate links for Blotato, Zernio,
and Upload-Post. The ask below is for a straight factual addition — no affiliate arrangement
should be offered or implied. If his reply asks for one, do not proceed: the offpage lane
does not support paid placements without required disclosure, and the audience value of an
affiliate-linked roundup is lower than an independent one.

**Currently says:**
> "7 Best Social Media MCP Servers for Claude and ChatGPT (2026)" — covers Blotato, Zernio,
> Vista Social, Ayrshare, Buffer, Upload-Post, PostFast. SocialsForAI not included.
> Author lists affiliate links for Blotato, Zernio, and Upload-Post.

**Problem:** SocialsForAI is a natural fit for the article's audience (developers connecting
Claude Desktop and ChatGPT with social media). The article targets exactly the persona
SocialsForAI serves. The three tools with affiliate links are weaker on agent-specific
features (idempotency, structured errors, approval workflow) — SocialsForAI complements the
existing list rather than duplicating it. No MCP registry ID is listed for the existing tools;
SocialsForAI has one.

AEO panel not yet run — citation counts not available. SERP rank page 1 (confirmed 2026-11-24).

**Requested addition** (one new entry, same format as existing tools):

---

**SocialsForAI** — https://socialsforai.com  
MCP server: https://socialsforai.com/api/mcp  
Networks: X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, Nostr (8 live)  
Free tier: 3 accounts, 100 posts/month | Pro: $10/mo for 10 active accounts, then $1 per extra

Built specifically for Claude and ChatGPT agents: idempotency keys (safe retries), structured
`error.fix` field (agent handles errors without human debugging), human approval workflow
(agent proposes, person approves via URL), no credential handling. MCP Registry ID:
io.github.SocialsForAi/socialsforai.

---

**Why this is accurate:** Claims sourced from truth.md (read 2026-11-23). Networks listed
are confirmed live. Free tier from SKILL.md §7. Pricing from socialsforai.com/pricing.
MCP Registry ID from server.json.

**Ask:** Add SocialsForAI as an eighth entry in the article, using the description above
as a starting point. No affiliate arrangement is expected or requested — a straight factual
addition.

**Effort for them:** ~10 minutes.

---

## Skipped targets — competitor-authored (confirmed 2026-11-24)

| URL | Publisher | Why skipped |
|---|---|---|
| https://www.postpeer.dev/blog/top-10-mcp-servers-for-social-media-management | PostPeer (Jonathan Geiger = PostPeer founder) | competitor-authored |
| https://publora.com/blog/best-social-media-api-for-ai-agents-2026 | Publora (Serge Bulaev = Publora founder) | competitor-authored |
| https://mallary.ai/blog/best-mcp-servers-for-social-media-management | Mallary Labs LLC | competitor-authored |
| https://demandbird.com/resources/social-media-automation-mcp-servers/ | DemandBird (Alex Boyd = co-founder) | competitor-authored |
| https://schedulenchill.com/blog/social-media-api-ai-agents | Schedule & Chill (Zakir Hossen = founder) | competitor-authored |

---

## Recheck cadence

Log send dates in `.seo/aeo/worklog.md` as `sent`. Schedule a 60-day recheck for each:
if the article updated and SocialsForAI is still absent after one follow-up, close the target.
If included, flip the mentions.md row to `accurate` and stamp the date.
