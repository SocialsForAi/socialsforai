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

<!-- Append one row per piece at Step 5. Type in guide / how-to / listicle / definition / comparison / data-study / resource / opinion / case-study / tool -->

---

## Performance

| Date | Action | Slug / URL | Pre-state | 21-day read | 90-day read | State |
|---|---|---|---|---|---|---|
| _(no measurable performance yet — first run)_ | | | | | | |
| 2026-11-20 | repair | .seo/config.json (competitors) | Pre: 6 competitors, all sitemap_url: null; competitor delta panel disabled | n/a — config change, no GSC URL target | n/a | n/a |

---

## Candidate backlog

_Scored shortlist from run 2026-11-20. Re-score each run from live GSC + health diff data._

| Rank | Action | Target | Evidence | Score | Effort | Blocked on |
|---|---|---|---|---|---|---|
| 1 | offpage-brief | Roundup outreach: 6 "best MCP servers for social media" roundup pages (Blotato, Upload-Post, postpeer.dev, dev.to, eden.so, postplanify.com) | Radar 2026-11-20: SocialsForAI absent from all 6 page-1 roundups for "best social media MCP servers" | 23 | S | — |
| 2 | offpage-brief | Indie Hackers product page | DR ~72, founder community, free submission, 10 min; carried 3 runs | 20 | S | — |
| 3 | verify-product | truth.md: add company address, contact email, MCP Registry ID | Homepage FAQ added 2026-11-20; terms effective 2026-11-19 | 17 | S | — |
| 4 | repair | sitemap lastmod (build-date-lastmod violation) | 46/46 URLs share 2026-11-01 | 15 | S | NY-3 (website repo needed) |
| 5 | offpage-brief | G2 + Capterra listing | Ayrshare on G2; DR 92/91 | 15 | M | NY-5 (human sends) |

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
