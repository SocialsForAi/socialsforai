# SocialsForAI — Content Ledger

> The memory of the engine. Read first on every /seo run: the **Shipped** table is the dedup record (never re-write a covered topic); the **Performance** table is the scoreboard (did the last pieces actually work?); the **Candidate backlog** is the scored shortlist so each run starts warm. Updated in the same edit batch as every piece shipped.

---

## Shipped

| Date | Title | Type | Slug / URL | Target keyword | Vol | Bucket | Original data (source · n · as-of) | Refresh due | Primary internal links | Commit / PR |
|---|---|---|---|---|---|---|---|---|---|---|
| 2026-11-18 | Product Hunt submission brief | offpage-brief | .seo/briefs/2026-11-18-product-hunt-t2.md | — | — | — | none | n/a | — | uncommitted |
| 2026-11-18 | AlternativeTo listing brief | offpage-brief | .seo/briefs/2026-11-18-alternativeto-t2.md | — | — | — | none | n/a | — | uncommitted |
| 2026-11-18 | SaaSHub listing brief | offpage-brief | .seo/briefs/2026-11-18-saashub-t2.md | — | — | — | none | n/a | — | uncommitted |
| 2026-11-19 | Network status verify-product | verify-product | .seo/truth.md + truth-checks.json | — | — | — | none | n/a | — | uncommitted |
| 2026-11-20 | Competitor config repair: 7 sitemap URLs + social-api.ai added | repair | .seo/config.json + .seo/competitors/* | — | — | — | none | n/a | — | uncommitted |
| 2026-11-21 | Roundup outreach briefs (dev.to/jclvsh + shapelessai.com) | offpage-brief | .seo/briefs/2026-11-21-roundup-outreach-t2.md | — | — | — | radar 2026-11-20/21 | n/a | — | uncommitted |
| 2026-11-22 | Indie Hackers product listing brief | offpage-brief | .seo/briefs/2026-11-22-indie-hackers-t2.md | — | — | — | none | n/a | — | uncommitted |
| 2026-11-23 | verify-product: company address, contact email, MCP Registry ID, full plan pricing | verify-product | .seo/truth.md + .seo/truth-checks.json | — | — | — | re-verify on plan change | n/a | — | uncommitted |
| 2026-11-24 | Roundup outreach briefs (dev.to/jesse_eisenbart + chatforest.com + kevinmeneses.com) | offpage-brief | .seo/briefs/2026-11-24-roundup-outreach-t2.md | — | — | — | radar 2026-11-24 | n/a | — | uncommitted |
| 2026-11-25 | Directory listing briefs (G2 DR 92, Capterra/GetApp/Software Advice DR 91, Crunchbase DR 91) | offpage-brief | .seo/briefs/2026-11-25-directory-listings-t2.md | — | — | — | backlink-targets.json 2026-11-18 | n/a | — | uncommitted |
| 2026-11-26 | Stale pricing ('from $9/mo') corrected in roundup brief; retired-plan truth-check rule added | correct | .seo/briefs/2026-11-24-roundup-outreach-t2.md + .seo/truth-checks.json | — | — | — | owner fact 2026-11-25 + live pricing.md read 2026-11-26 | n/a | — | committed |

<!-- Append one row per piece at Step 5. Type in guide / how-to / listicle / definition / comparison / data-study / resource / opinion / case-study / tool -->

---

## Performance

| Date | Action | Slug / URL | Pre-state | 21-day read | 90-day read | State |
|---|---|---|---|---|---|---|
| _(no measurable performance yet — first run)_ | | | | | | |
| 2026-11-20 | repair | .seo/config.json (competitors) | Pre: 6 competitors, all sitemap_url: null; competitor delta panel disabled | n/a — config change, no GSC URL target | n/a | n/a |

---

## Candidate backlog

_Scored shortlist from run 2026-11-25. Re-score each run from live GSC + health diff data._

| Rank | Action | Target | Evidence | Score | Effort | Blocked on |
|---|---|---|---|---|---|---|
| 0 | create-editorial (x4 agent queries) | MCP server comparison (Buffer/Postiz/Late/Ayrshare, say Threads in review); Ayrshare pricing/alternative retrievable; cost-for-12-clients page | distribution eval 2026-11-26, 0/24 retrieved | — | M | NY-18 (website repo absent; /vs/ayrshare and pricing.md 12-client table already exist) |
| 1 | repair | sitemap lastmod + duplicate meta description | 7 days unchanged, 2 violations | 15 | S | NY-3 (website repo) |
| 2 | offpage-brief | aidelly.ai — "Best Agentic Social Media Tools in 2026" (Feb 2026, rank #7 on target query) | backlink-targets.json priority 2 | — | S | verify independence first |
| 3 | aeo-fix | llms.txt: 4 links missing descriptions, 1 URL not in sitemap | robots_check.py 2026-11-25 | 8 | S | NY-3 (website repo) |

---

## Coverage map

| Topic / cluster | Owner URL | Status | Notes |
|---|---|---|---|
| Social media API for AI agents | https://socialsforai.com/ | pre-existing | Homepage is the owner; not ranking yet |
| MCP server for social media | https://socialsforai.com/mcp | pre-existing | /mcp page exists; not ranking yet |
| Cross-platform posting | https://socialsforai.com/crosspost | pre-existing | Feature page |
| LinkedIn posting API | https://socialsforai.com/linkedin-api | pre-existing | Network page |
| Bluesky API | https://socialsforai.com/bluesky-api | pre-existing | Network page |
| Schedule tweets / X posts | https://socialsforai.com/schedule-tweets | pre-existing | Feature page |
| Schedule LinkedIn posts | https://socialsforai.com/schedule-linkedin-posts | pre-existing | Feature page |
| Comparison vs Postiz | https://socialsforai.com/vs/postiz | pre-existing | Comparison page |
| Comparison vs Ayrshare | https://socialsforai.com/vs/ayrshare | pre-existing | Comparison page |
| Character limits reference | https://socialsforai.com/bluesky-character-limit | pre-existing | Reference page |
| Free tools | https://socialsforai.com/tools/* | pre-existing | 4 tools |
| Agent integrations | https://socialsforai.com/agents/* | pre-existing | 6 agent pages |
