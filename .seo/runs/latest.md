# Daily SEO run — 2026-11-18 (run 2 of day, 01:30 UTC)

**Site:** socialsforai.com — social media posting API and MCP server for AI agents  
**Branch:** seo/daily  
**Previous run:** 2026-11-18-0000 (Product Hunt brief OFF-001)

---

## What this run did

This run drafted the **AlternativeTo directory listing brief** for SocialsForAI (finding id OFF-002). AlternativeTo is a comparison directory where developers search for alternatives to tools they already know; Postiz and Ayrshare (the two head competitors) are listed there today, and SocialsForAI is not. The brief includes the exact description to submit to https://alternativeto.net/software/add/ and the follow-up step of marking SocialsForAI as an alternative to Postiz, Ayrshare, and Post Bridge from each competitor's AlternativeTo page. This listing earns a backlink from a ~DR 70 domain and places the product in the discovery path of developers researching social API alternatives — the site's exact target audience. It scored higher than the G2 listing brief (the next candidate) because it requires less effort from the owner (~15 min vs ~20 min) and the acceptance is more predictable. It scored higher than seeding the truth-checks.json file because a directory backlink directly addresses the site's primary bottleneck: zero domain authority with no rankings on any target query.

The run is the second of the day. The first run (00:00 UTC, same branch) drafted the Product Hunt brief. All site measurement panels are unchanged since that run (health diff cached, GSC not connected, no product changes).

---

## Verified

- **Brief wording matches truth.md:** checked. All networks in the description (X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, Nostr) are verified in SKILL.md §2. YouTube, TikTok, and Instagram are intentionally omitted — each is flagged "unverified" in truth.md. Free tier claims (3 accounts, 100 posts/month, no credit card) are verified in SKILL.md §7. All feature claims (idempotency, dry run, approval gate, batch posting, media upload, scheduling, scoped sub-agent keys) are verified in SKILL.md §§3-6.
- **No invented positioning:** checked. Description derived from battlecard and truth.md; no speculative or marketing-only claims.
- **No contact or posting:** checked. Brief written; a human submits.
- **No astroturfing or incentivized listing:** checked. Genuine directory submission only.
- **Finding id, source URL, requested wording, and effort estimate all present in brief:** checked.
- **Build check:** not applicable — no TypeScript, JavaScript, or TSX files were touched. Only `.seo/` Markdown files changed.
- **Citation impact claim with sample size:** not applicable — no citation impact was claimed. The brief frames the value as a backlink and discovery argument; no AI panel data exists yet.

---

## Left for the next run

1. **Seed truth-checks.json** — the mechanical truth-checking rules file is still empty. The truth-check script runs every run but enforces nothing without rules. The five high-risk claims in truth.md (free plan limits, idempotency, unverified networks) need mechanical grep rules. This was the third-ranked candidate today (scored 16); next run it will score higher as freshness rises.
2. **Run the link check** — `health_diff.py --check-links` establishes the internal-link baseline and may find broken or orphan pages among the 46 live URLs. Weekly cadence; due now (first run was same day).
3. **Add competitor sitemap URLs** — all six competitors in config.json have `sitemap_url: null`, preventing the weekly competitor delta panel from running. Next run: look up each competitor's sitemap and populate the config.
4. **Keyword research re-seeding** — the first run's keyword seeds returned mostly unrelated rows; better seeds were noted in the previous run record.

---

## Needs you (items added this run)

- **NY-6** (opened 2026-11-18): AlternativeTo listing brief ready to send — see §Decisions below

---

## Spend

All panels cached or free. 0 paid calls made this run.

---

## Decisions waiting on you

**The Search Console connection is still missing, blocking most measurement.** The OpenSEO project for socialsforai.com has no Search Console property linked. Without it, the skill cannot see which pages have impressions or clicks, which pages are close to ranking, or what queries are sending traffic. Everything that follows is a guess: which pages to refresh, whether a directory backlink moved the needle, whether a page is gaining or losing position. Options: (a) connect Search Console — go to the OpenSEO dashboard for project ba51c7a8-d290-4772-8bbb-70c6c2c505f5, add the GSC property for socialsforai.com, and reply "connected"; (b) skip for now. Recommend (a): the site has 46 pages and zero measured organic presence; every future run will be flying blind without it. It takes about five minutes to connect. (NY-1)

**The brand positioning and product truth need owner confirmation.** The brand file and truth ledger were inferred from the README and skill documentation on the first run. Three specific questions need answers: (a) Is the positioning sentence accurate — "social media posting API and MCP server for AI agent developers who need to publish programmatically to multiple networks from a single call"? (b) Do YouTube and TikTok belong in the supported-network list — they appear in the SDK's package.json keywords but not in the documented API; the skill is currently omitting them from all briefs and content to avoid a false claim; (c) Is Instagram supported — there is an /instagram-api page on the live site but the API documentation does not list it; the skill is also omitting this. Reply with corrections to (a), (b), and (c) and the next run updates the brand file, truth ledger, and any briefs that need revision. (NY-2)

**Two technical violations on the live site need a fix in the website repo.** The site's sitemap lists all 46 URLs with the same lastmod date (2026-11-01), which is a build date, not a content date — this tells Google every page was last updated on the same day, suppressing crawl priority signals. Separately, the /privacy and /terms pages share the homepage meta description instead of having their own. Both fixes require access to the website repository (the marketing site code is not in this repo). No action needed from you here unless you want to fix these; just noting they remain open. (NY-3)

**The Product Hunt launch brief from this morning is ready to send.** The brief is at `.seo/briefs/2026-11-18-product-hunt-t2.md` and includes the tagline ("One API to post to every social platform from AI agents"), description, topics, and media guidance. Product Hunt requires a human to submit and to coordinate on launch day (Tuesday through Thursday is best; expect 2-3 hours available that day). Reply "sent" once submitted and the skill will log the send date and schedule a 30-day check on whether the page appeared and linked back. (NY-4)

**The AlternativeTo listing brief from this run is ready to send.** The brief is at `.seo/briefs/2026-11-18-alternativeto-t2.md` and includes the exact text to enter into the submission form and the follow-up step of adding SocialsForAI as an alternative to Postiz, Ayrshare, and Post Bridge. The whole submission takes about 15 minutes. Reply "sent" once submitted and the skill will log the send date and schedule a 30-day recheck. (NY-6)

**Other directories in the starter stack are still pending.** G2 (domain rating ~92, requires a screenshot and company email verification, ~20 min), Capterra/GetApp/Software Advice (Gartner Digital Markets, one submission form, ~20 min), SaaSHub (free, ~5 min), Indie Hackers products page (free, ~10 min), and Crunchbase basic profile (free, ~10 min) are all queued. The skill will draft briefs for each in future runs. If you want to submit any of these before the brief is drafted, reply with "do G2 next" or whichever you prefer and the next run prioritizes it. (NY-5)

---

## How the run ended

Git mode: commit. Files changed: 7 (brief, worklog, mentions, ledger, needs-you, run record, latest.md). Run record: `.seo/runs/2026-11-18-0130.md`. Committing to branch seo/daily.

---

## Connections

Still missing (unchanged from first run): Search Console (most valuable — unlocks page-level click/impression data), GA4 (unlocks conversion data and AI referral attribution), Bing Webmaster API (unlocks Bing and Copilot panel). No new connections made or declined this run.
