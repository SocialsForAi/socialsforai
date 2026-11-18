# Run record — 2026-11-18-0000

**Mode:** unattended daily  
**Branch:** seo/daily  
**Repo:** socialsforai (github.com/SocialsForAi/socialsforai)

---

## Measured

**Panels run:**

| Panel | Source | Result | Notes |
|---|---|---|---|
| Site health diff | health_diff.py vs https://socialsforai.com/sitemap.xml | 2 violations found | First run; baseline written to .seo/health/2026-11-18.json |
| Sitemap inventory | health_diff.py | 46 pages discovered | Full inventory in link-inventory.md |
| Keyword research | OpenSEO / DataForSEO | 3 seeds × 75 rows | Blended source; see keyword-research.json |
| SERP check | OpenSEO / DataForSEO | 3 queries | socialsforai.com not in top 15 on any |
| Domain overview | OpenSEO / DataForSEO | hasData:false | New/low-authority domain; no ranked keywords |
| Search Console | OpenSEO | not_connected | GSC not linked to this project |
| Truth check | truth_check.py | 0 contradictions, 0 rules | truth-checks.json empty (first run) |
| Product changes | repo_changes.py | 0 commits in watched paths | Nothing changed in last 14 days |
| Bing | — | skipped | No Bing API key configured |
| GA4 | — | skipped | Not connected |
| AI panel | — | skipped | Not on cadence (first run); $0 saved |
| Backlinks | — | skipped | Not on cadence (first run) |
| Seasonality | — | skipped | Not on cadence (first run) |

**Vitals block:**

| Vital | State | Notes |
|---|---|---|
| Speed | unchecked | No PSI key; no PageSpeed data |
| Keyword relevance | poor | 0/3 core queries ranking; site has 46 pages but no authority |
| CTR | unmeasured | GSC not connected |
| Link health | unchecked | No link check run (first run baseline only) |

**Violations found:**

1. `[build-date-lastmod]` — 46/46 sitemap URLs share lastmod 2026-11-01 (build date). Affects crawl priority signals.
2. `[duplicate-meta-description]` — /privacy and /terms share the homepage meta description "one api and mcp server to post to every social platform from your app ". Minor quality signal.

**Foundation state:** fresh on start → built from templates + filled with detected data. First run.

---

## Candidates

| Rank | Action | Target | Evidence | Movement est. | Effort | Score |
|---|---|---|---|---|---|---|
| 1 | offpage-brief | Product Hunt listing | Zero SERP presence; DR 88; Postiz is listed; first backlink opportunity | First DR 88+ backlink; dev traffic | S | >9 |
| 2 | repair | sitemap lastmod | 46/46 share 2026-11-01 | Crawl quality improvement | S | blocked (website repo) |
| 3 | repair | /privacy + /terms meta description | 3 pages share homepage desc | Minor | S | blocked (website repo) |
| 4 | offpage-brief | AlternativeTo listing | Postiz, Ayrshare listed; DR 70; free | Backlink + discovery | S | >9 |

No fixed override triggered (no index regressions, no truth violations, no live harm).

**Website code not in this repo:** both repair candidates (violations #1 and #2) require the website codebase. Blocked → needs-you.md.

---

## Chose

**Action:** offpage-brief  
**Target:** Product Hunt (OFF-001)  
**Run was unattended. Reason:** The two technical violations cannot be executed from this repo (website code is separate). The site has zero organic visibility on three core queries. For a new site with no authority, the highest-ROI executable action is the first directory listing that earns a DR 88 backlink and places the product in the discovery path of its exact developer audience. Product Hunt is the most impactful single directory for a new developer tool. Demand evidence: Reddit thread "social media scheduling API and MCP?" (rank 3 on "mcp server social media posting") confirms the audience exists and is looking.

---

## Did

- **Built foundation** (Step 0, first run):
  - `.seo/config.json` — filled with domain, stack, tools, competitors, radar seeds, git mode: commit
  - `.seo/brand.md` — positioning, voice, competitors, anti-positioning (inferred, flagged for review)
  - `.seo/truth.md` — 30 claims from README + SKILL.md; 3 unverified network claims flagged (Instagram, YouTube, TikTok)
  - `.seo/truth-checks.json` — empty (first run; no rules yet)
  - `.seo/attributes.md` — attribute matrix, P1/P2/P3 tiers
  - `.seo/keyword-research.json` — seed data from DataForSEO; gsc_baseline null
  - `.seo/link-inventory.md` — all 46 pages from health diff
  - `.seo/content-ledger.md` — initialized with backlog
  - `.seo/roadmap.md` — 4 phases; Phases 0-2 blocked on external work
  - `.seo/needs-you.md` — 5 items (NY-1 through NY-5)
  - `.seo/aeo/battlecard.md` — positioning card
  - `.seo/aeo/mentions.md` — empty inventory
  - `.seo/aeo/worklog.md` — OFF-001 logged as drafted
  - `.seo/backlink-targets.json` — 7 directories + 2 listicles + 1 community target
  - `.seo/health/2026-11-18.json` — baseline fingerprint (46 pages)

- **Executed: offpage-brief OFF-001**
  - `.seo/briefs/2026-11-18-product-hunt-t2.md` — Product Hunt submission brief
  - Tagline: "One API to post to every social platform from AI agents" (55 chars)
  - Description: 254 chars, accurate against truth.md
  - Topics, media, effort, and recheck date documented

**Gates:**

| Gate | Result |
|---|---|
| Brief wording matches truth.md | PASSED — all claims verified against truth.md entries |
| No invented positioning | PASSED — wording derived from README and SKILL.md; unverified claims omitted |
| No contact or posting | PASSED — brief written, human sends |
| No astroturfing | PASSED — genuine directory listing only |
| No mass outreach | PASSED — one brief |
| Finding id present | PASSED — OFF-001 |
| Source URL present | PASSED — producthunt.com/posts/new |
| Requested wording present | PASSED — tagline and description in brief |
| Effort for recipient stated | PASSED — ~20 min + 2-3 hours launch day |
| Citation impact with n | UNCHECKED — no AI panel run, no citation data yet. Brief does not claim citation impact; it makes an authority-building argument instead. |

---

## Not done

1. **GSC not connected** (NY-1) — the skill cannot measure page states, CTR gaps, or striking-distance opportunities until GSC is linked to the OpenSEO project.
2. **sitemap lastmod fix** (NY-3) — website code is in a separate repo; cannot fix from here. Next run: re-check for the violation and remind if unresolved.
3. **duplicate meta description** (NY-3) — same blocker as above.
4. **Truth checks not seeded** — `truth-checks.json` is empty. Next run: add at least one mechanical check (idempotency claim, free plan limits) to `truth-checks.json` so `truth_check.py` has rules to enforce.
5. **Keyword research needs tighter seeds** — the three seeds used ("social media api for ai agents", "post to social media api", "mcp server social media") returned mostly unrelated rows (Instagram templates, timing questions). Next run: re-seed with "social posting api developers", "bluesky mcp", "schedule posts api code".
6. **No link check run** — health_diff.py --check-links not run on first run (expensive; queued for next weekly cadence).
7. **Competitor sitemap URLs not populated** — config.json competitors all have `sitemap_url: null`. Next run: add competitor sitemap URLs to enable the weekly competitor delta panel.
8. **AI panel not run** — no citation data for attributes. Run after first backlinks land (probably 60+ days).

---

## Needs you (items added this run)

- **NY-1** (opened 2026-11-18): GSC not connected — see §Decisions in final message
- **NY-2** (opened 2026-11-18): Brand and truth review — see §Decisions in final message  
- **NY-3** (opened 2026-11-18): Two live-site violations requiring website repo access
- **NY-4** (opened 2026-11-18): Product Hunt brief ready to send
- **NY-5** (opened 2026-11-18): Directory starter stack (AlternativeTo, G2, Capterra, SaaSHub, Indie Hackers, Crunchbase)

---

## Spend

| Call | Tool | Credits / cost | Notes |
|---|---|---|---|
| list_projects | OpenSEO | 0 | Free |
| whoami | OpenSEO | 0 | Free |
| get_project_context | OpenSEO | 0 | Free |
| get_search_console_performance | OpenSEO | 0 | Free (not connected, returned error) |
| get_domain_overview | OpenSEO | ~200 credits | hasData:false; domain too new |
| research_project_website | OpenSEO | 0 | Blocked (missing OPENROUTER_API_KEY) |
| research_keywords (3 seeds) | OpenSEO/DFS | ~162 credits | 3 × ~54 |
| get_serp_results (3 queries) | OpenSEO/DFS | ~15 credits | 3 × ~5 |
| list_search_console_sites | OpenSEO | 0 | Free |

Estimated total: ~377 credits. No USD cost tracking available (self-hosted instance; creditsRemaining: null). No paid AI panel calls made. Well within $2.00 budget.

**Skipped for budget:**
- research_project_website (blocked by missing OPENROUTER_API_KEY — not a budget skip)
- Backlink competitor sweep (Recipe F) — deferred; no competitor domain data available
- AI panel — not on cadence
