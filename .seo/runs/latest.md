# Daily SEO run — 2026-11-19 (run 1 of day, ~09:00 UTC)

**Site:** socialsforai.com — social media posting API and MCP server for AI agents
**Branch:** seo/daily
**Previous run:** 2026-11-18-0908 (SaaSHub directory brief OFF-003)

---

## What this run did

The homepage of socialsforai.com changed overnight — it gained 134 words and a new "8 of 16 networks live" section with an explicit status table showing every network as Live, In review, or Coming soon. The truth file for this project previously labeled Instagram, YouTube, and TikTok as "unverified," which was the best available information at the time. The homepage now resolves this directly: Instagram, YouTube, and TikTok are "In review" — meaning they are planned but not yet live. Four new networks (Threads and Facebook, also "In review"; Pinterest and Reddit as "Coming soon") are now documented. The updated truth file also adds the total network count (16) and the live count (8) as citable claims.

The same run also seeded the mechanical truth-checking rules file (truth-checks.json) with six rules that the truth-check script will enforce on every future run: the free plan's 3-account limit, the free plan's 100-posts-per-month limit, the idempotency guarantee, and "must not be described as live" rules for Instagram, YouTube, and TikTok. Before today, this file was empty and the daily check ran 0 rules against 0 claims. These two tasks were combined because they touch the same files and seeding the checks was the second-ranked action today.

This action won as a tier-2 override (a live source was re-read and it changed, requiring the accuracy file to be updated) and also as the top-scoring candidate. Keeping the truth file accurate is the foundation for every piece of content the site produces — every brief, guide, and directory listing is sourced from this file.

---

## Verified

- **truth_check.py with the 6 new rules:** passed — 0 contradictions, 0 missing on the repo and on the rendered pages captured in the health snapshot.
- **truth.md has dated sources:** checked — all new network entries cite the homepage, observed 2026-11-19.
- **Sibling pages:** the /instagram-api page was checked and already correctly says "Instagram publishing isn't live on our API yet." No correction needed there.
- **Briefs from previous runs:** all three directory briefs (Product Hunt, AlternativeTo, SaaSHub) already omitted Instagram, YouTube, and TikTok intentionally — no correction needed.
- **Build/type check:** not applicable — only .seo/ Markdown and JSON files changed.
- **Rendered check of the corrected pages:** not fully checked — text was read from the health fingerprint (which captures rendered body text), but no headless browser is available. Noted as degraded.

---

## Left for the next run

1. **Indie Hackers product page brief** — next directory in the offpage stack. DR ~72, founder-and-developer community, free submission, about 10 minutes to complete. This was scored second today and was not executed only because the network status update took the slot. It should be the first candidate next run.
2. **Add social-api.ai to the competitor list** — the demand radar spotted a new competitor (social-api.ai, "Unified Social Media API for AI Agents & Developers, 75+ tools, OAuth 2.1") that is currently absent from the competitor configuration. Adding it enables the weekly competitor delta panel to track it.
3. **Add competitor sitemap URLs** — all six existing competitors in the config have no sitemap URL set, so the weekly competitor page-change panel cannot run for any of them.
4. **Connect Search Console** — the skill still cannot see which pages have impressions, which are close to ranking, or whether this week's directory submissions have changed organic presence. Every GSC-dependent panel remains blank.
5. **Two technical fixes on the live site** — sitemap lastmod is a build date (all 46 URLs share 2026-11-01) and two pages share the homepage meta description — both require access to the website repository, which is not present here.

---

## Decisions waiting on you

**Search Console is still not connected, blocking almost all measurement.** Without it the skill cannot see which pages have impressions, which are close to ranking, whether the directory submissions this week changed anything, or what queries are sending traffic. Options: (a) connect now — go to the OpenSEO dashboard for project ba51c7a8-d290-4772-8bbb-70c6c2c505f5, add the GSC property for socialsforai.com, and reply "connected"; (b) skip for now. Recommend (a): takes about five minutes; every future run is significantly more useful with it. (NY-1)

**Brand positioning and product truth still need owner confirmation on two points.** Questions (b) and (c) from the previous request are now auto-answered by the homepage — YouTube, TikTok, and Instagram are "In review," not fully supported. Two questions remain open: (a) Is the positioning sentence accurate — "social media posting API and MCP server for AI agent developers who need to publish programmatically to multiple networks from a single call"? (d) Are there any proprietary data assets (aggregate stats, error rate data, aggregate post volumes) that could become public content? Reply with any corrections to (a) and (d). (NY-9)

**Two technical violations on the live site need a fix in the website repository.** (1) All 46 URLs in the sitemap share lastmod 2026-11-01 — this is a build date, not a content date, suppressing crawl priority signals. The sitemap generator should either omit lastmod or use each page's actual last-updated date. (2) The pages /privacy and /terms share the homepage meta description ("one api and mcp server to post to every social platform from your app ") — each needs its own unique meta description. Both fixes require access to the website repo. No action needed unless you want to fix them. (NY-3)

**The /instagram-api page meta description could be clearer.** The page body already correctly says "Instagram publishing isn't live on our API yet." But the meta description reads as a general Instagram API guide ("How Instagram's Content Publishing API works: account types, login options, App Review, the two-step container flow, media specs and the daily post limit") with no mention that SocialsForAI does not yet support Instagram. A reader who sees this in search results could arrive expecting to set up Instagram posting. Consider updating the meta description to something like: "Instagram posting is in review on SocialsForAI. This guide covers Meta's Content Publishing API — account types, App Review, the container flow, and media specs." Low urgency; the page body is correct. Requires website repo access. (NY-8)

**The Product Hunt launch brief is ready to send.** The brief is at `.seo/briefs/2026-11-18-product-hunt-t2.md` and includes the tagline ("One API to post to every social platform from AI agents"), description, topics, and media guidance. Product Hunt requires a human to submit and to coordinate on launch day (Tuesday through Thursday is best; expect 2-3 hours available that day). Reply "sent" once submitted and the skill will log the send date and schedule a 30-day check. (NY-4)

**Three directory briefs are queued and ready to send.** The offpage starter stack from the previous three runs:
- **Product Hunt** (brief at `.seo/briefs/2026-11-18-product-hunt-t2.md`, ~2-3 hours on launch day, DR 88, requires launch coordination) — NY-4
- **AlternativeTo** (brief at `.seo/briefs/2026-11-18-alternativeto-t2.md`, ~15 minutes, DR 70, also mark as alternative to Postiz/Ayrshare/Post Bridge) — NY-6
- **SaaSHub** (brief at `.seo/briefs/2026-11-18-saashub-t2.md`, ~5 minutes, DR 65, open submission form) — NY-7

Additional directories still pending briefs: Indie Hackers (~10 min, brief to be drafted next run), G2 (~20 min, requires screenshot + verification), Capterra/GetApp/Software Advice (~20 min), Crunchbase (~10 min). Reply "done" with which directories were submitted and the skill logs them and schedules rechecks. (NY-5)

---

## How the run ended

Git mode: commit. Files changed this run: 6 (.seo/ state files only: truth.md, truth-checks.json, evidence file, content-ledger.md, needs-you.md, radar.md). Run record: `.seo/runs/2026-11-19-0000.md`. Committing to branch seo/daily.

---

## Connections

Still missing (unchanged): Search Console (most valuable — unlocks page-level click/impression data), GA4 (unlocks conversion data and AI referral attribution), Bing Webmaster API (unlocks Bing and Copilot panel). No new connections made or declined this run.
