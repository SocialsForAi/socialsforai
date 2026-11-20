# SEO run — 2026-11-20

## What this run did

The competitor intelligence panel has been broken since the first SEO run three days ago: all six competitor entries in the tool's config had no sitemap URL, so the weekly comparison (which competitor pages are growing? which new pages appeared on rivals' sites?) could never run. This run fixed that by finding the sitemap for each of the six existing competitors — Postiz, Ayrshare, Post Bridge, Blotato, Upload Post, and Zernio — and adding a seventh, Social API AI (social-api.ai), a direct "social media API for AI agents" product spotted on the demand radar yesterday but not yet in the tracking list. With the URLs in place, the tool immediately took a 30-page baseline snapshot for each. Next week's run will diff against those baselines and report which competitor pages appeared, changed, or grew.

This was the explore-slot pick for today's run (run five of five, where the tool intentionally takes its second-best action to avoid falling into a fixed daily pattern). The highest-scoring candidate today was an outreach brief to get SocialsForAI added to the six "best social media MCP servers" roundup pages that rank on page one of Google but don't mention the product at all — that brief scored 23 and is the top priority for the next run.

## Verified

- config.json is valid JSON: passed.
- All 7 competitors now have a sitemap URL (not null): passed.
- All 7 baseline fingerprints written (30 pages each): passed.
- No files over 20 MB committed: passed.
- Competitor diff (competitor_diff.py): not applicable — this is the first baseline, nothing to compare against yet. First diff due on or after 2026-11-27.
- Build/type check: not applicable — only internal SEO state files changed, no code.

## Left for the next run

1. **Write an outreach brief for the six "best social media MCP servers" roundup pages on Google page one.** Blotato, Upload-Post, postpeer.dev, a DEV Community comparison post, eden.so, and postplanify.com all published "best MCP servers for social media" lists in 2026 and none include SocialsForAI. A pitch to the authors of those six pages is the highest-value action on the site right now (scored 23). The brief gets written next run; you send it.

2. **Indie Hackers product page brief** — a free directory listing on a founder and developer community with a domain rating around 72. Ten minutes to write the brief; you submit it. This has been the second-ranked action for three runs in a row.

3. **Update the product truth file with new facts added to the homepage today.** The homepage FAQ now names the company address (Codehorts LLC, 1421 B St, Eureka, CA 95501, USA), a contact email (lee@socialsforai.com), and the MCP Registry identifier (io.github.SocialsForAi/socialsforai). The terms page also went live as of November 19, 2026 (it previously said "Draft"). These facts are not yet in the tool's internal claim ledger; they will be added in the next available run.

## Decisions waiting on you

**Search Console is not connected, which blocks most measurement.** Without it the tool cannot see which pages are ranking and how close they are, cannot measure click-through rates, and cannot detect when a page falls out of the index. To connect it: go to the OpenSEO dashboard for project ba51c7a8-d290-4772-8bbb-70c6c2c505f5 and add the Search Console property for socialsforai.com. Options: (a) connect now — takes about two minutes; (b) skip for now. Recommend (a): connecting it is the single change that unlocks the most measurement. Reply with "connected" and the next run will verify and use it. (NY-1)

**The brand positioning sentence needs your confirmation.** The tool drafted it from the README as: "social media posting API and MCP server for AI agent developers who need to publish programmatically." Two sub-questions remain open: (a) Is that sentence accurate, or would you describe the product differently? (b) Does the company have any aggregate statistics or usage data — error rates, post volume, platform distribution — that could become public content? Reply with any corrections to (a) and a yes or no to (b). (NY-2 / NY-9)

**Two technical fixes require the website source code.** The website code lives in a separate repository that the tool cannot access. Fix 1: all 46 sitemap URLs share the lastmod date 2026-11-01, which is the build date, not a content date — Google treats this as a signal that nothing on the site has changed, which can slow crawling of real updates. Fix 2: the /privacy and /terms pages both show the same meta description as the homepage. Both fixes are in the site's template or sitemap generator. Reply "fixed" once the website repo is updated and the next run will re-check. (NY-3)

**Four directory briefs are ready for you to submit.** (a) Product Hunt launch brief at .seo/briefs/2026-11-18-product-hunt-t2.md — requires a human to submit and monitor launch day, best on Tuesday through Thursday, about 2-3 hours available. (b) AlternativeTo listing brief at .seo/briefs/2026-11-18-alternativeto-t2.md — about 15 minutes to submit and mark SocialsForAI as an alternative to Postiz, Ayrshare, and Post Bridge. (c) SaaSHub listing brief at .seo/briefs/2026-11-18-saashub-t2.md — about 5 minutes to submit. (d) G2 and Capterra/GetApp are the next directory tier — not yet briefed, needs a screenshot and about 20 minutes; the full target list is in .seo/backlink-targets.json. Reply "sent" listing which you submitted and the next run will log the dates and schedule 30-day rechecks. (NY-4, NY-5, NY-6, NY-7)

**The /instagram-api page meta description could be more specific.** The page body correctly says Instagram posting is not yet live. The meta description does not say this, which could mislead someone who reads only the snippet in search results. The proposed replacement: "Instagram posting is in review on SocialsForAI. This guide covers how Meta's own Content Publishing API works: account types, App Review, container flow, and media specs." Low urgency — the page body is correct. Requires website repo access. Reply "done" once updated. (NY-8)

## How the run ended

Git mode: commit. 11 files changed, all under `.seo/` (config, 7 competitor baselines, site health fingerprint, demand radar, evidence file). Run record: `.seo/runs/2026-11-20-0912.md`.

## Connections

Still missing (unchanged): Search Console (most valuable — unlocks page-level click/impression data, see NY-1 above), GA4 (unlocks AI referral attribution and on-site search signals), Bing Webmaster API (unlocks Bing and Copilot panel), PageSpeed Insights API key (unlocks Lighthouse scores on top pages weekly).
