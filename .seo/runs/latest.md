# Daily SEO run — 2026-11-18 (run 3 of day, 09:08 UTC)

**Site:** socialsforai.com — social media posting API and MCP server for AI agents  
**Branch:** seo/daily  
**Previous run:** 2026-11-18-0130 (AlternativeTo brief OFF-002)

---

## What this run did

This run drafted the **SaaSHub directory listing brief** for SocialsForAI (finding id OFF-003). SaaSHub is a developer-oriented software discovery directory where developers search for SaaS tools and APIs. SocialsForAI is not currently listed there, and no competitors were found in the directory, making this a first-mover opportunity. The brief contains the exact text to enter into the SaaSHub submission form at https://www.saashub.com/submit — product name, website URL, one-line description, full description, category tags, and pricing model. It earns a backlink from a ~DR 65 domain and places the product in the discovery path of developers searching for social media APIs and MCP server tools — exactly the audience the product serves. It scored highest this run because it is free, takes ~5 minutes to submit, is near-certain to be accepted (open submission), and addresses the site's primary bottleneck: zero domain authority with no measured organic presence.

This is the third run of the day. The first (00:00 UTC) drafted the Product Hunt brief; the second (01:30 UTC) drafted the AlternativeTo brief. All three offpage briefs are queued for the owner to submit. The run also established the **internal link health baseline** (link check had never been run before): 0 broken links, 0 redirecting links among 46 live pages.

---

## Verified

- **Brief wording matches truth.md:** checked. All networks in the description (X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, Nostr) are verified in SKILL.md §2. YouTube, TikTok, and Instagram are intentionally omitted — each is flagged "unverified" in truth.md. Free tier claims (3 accounts, 100 posts/month, no credit card) are verified in SKILL.md §7. All feature claims (idempotency, dry run, approval gate, batch posting, media upload, scheduling, scoped sub-agent keys, MCP server URL) are verified in SKILL.md §§3-6 and README.md.
- **No invented positioning:** checked. Description derived from battlecard and truth.md; no speculative claims.
- **No contact or posting:** checked. Brief written; a human submits.
- **No astroturfing:** checked. Genuine directory submission only.
- **Finding id, source URL, requested wording, and effort estimate all present:** checked.
- **Health diff re-run:** checked. The previous run's health file was saved as a directory (`.seo/health/2026-11-18.json/`) due to a wrong `--out` path; renamed to `.seo/health/2026-11-18-run1.bak/` and re-ran cleanly. Output now at `.seo/health/2026-11-18.json` (file, not directory).
- **Link check baseline:** checked. First run of link check: 6 off-sitemap targets, 0 broken, 0 redirecting. Clean baseline.
- **Build check:** not applicable — no TypeScript, JavaScript, or TSX files touched. Only `.seo/` Markdown and JSON files changed.
- **Citation impact claim with n:** not applicable — no citation impact was claimed. Brief frames value as a backlink and developer discovery play.
- **Speed, census, brand split, outcomes:** not checked — PSI key missing (speed), no GSC connected (census, brand split, outcomes). No change since previous run.

---

## Left for the next run

1. **Seed truth-checks.json** — the mechanical truth-checking rules file is still empty. The truth-check script runs every run but enforces nothing without rules. Five high-risk claims in truth.md (free plan limits, idempotency, unverified networks) need mechanical grep rules. Scored 19 this run (rank #4); the offpage candidates still score higher. Next run, if the Indie Hackers brief (also scored 21) is executed, truth-checks.json (19) moves to the top in-repo action.
2. **Indie Hackers product page brief** — the next directory in the stack. DR ~72, founder community, free, ~10 min. Scored 21 (tied with SaaSHub this run; not executed because SaaSHub went first).
3. **Add competitor sitemap URLs** — all six competitors in config.json have `sitemap_url: null`, preventing the weekly competitor delta panel from running.
4. **Connect Search Console** — without it the skill cannot measure page states, CTR gaps, or striking-distance opportunities (see NY-1 below).
5. **Sitemap lastmod and duplicate meta** fixes require the website repository, which is not present here (NY-3).

---

## Decisions waiting on you

**Search Console is still not connected, blocking almost all measurement.** The OpenSEO project for socialsforai.com has no Search Console property linked. Without it the skill cannot see which pages have impressions or clicks, which pages are close to ranking, whether any offpage action this week changed the site's organic presence, or what queries are sending traffic. Everything that follows is a guess. Options: (a) connect now — go to the OpenSEO dashboard for project ba51c7a8-d290-4772-8bbb-70c6c2c505f5, add the GSC property for socialsforai.com, and reply "connected"; (b) skip for now. Recommend (a): takes about five minutes; every future run is flying blind without it. (NY-1)

**The brand positioning and product truth need owner confirmation.** The brand file and truth ledger were inferred from the README and skill documentation on the first run. Three specific questions: (a) Is the positioning accurate — "social media posting API and MCP server for AI agent developers who need to publish programmatically to multiple networks from a single call"? (b) Do YouTube and TikTok belong in the supported-network list — they appear in sdk/package.json keywords but not in the documented API; the skill is currently omitting them from all briefs to avoid a false claim; (c) Is Instagram supported — there is an /instagram-api page on the live site but the API documentation does not list it; the skill is also omitting this. Reply with corrections to (a), (b), and (c) and the next run updates the brand file, truth ledger, and any briefs that need revision. (NY-2)

**Two technical violations on the live site need a fix in the website repo.** (1) All 46 URLs in the sitemap share lastmod 2026-11-01 — this is a build date, not a content date, suppressing crawl priority signals. The sitemap generator should either omit lastmod or use each page's actual last-updated date. (2) The pages /privacy and /terms share the homepage meta description ("one api and mcp server to post to every social platform from your app") — each needs its own unique meta description. Both fixes require access to the website repo (not this repo). No action needed unless you want to fix them. (NY-3)

**The Product Hunt launch brief is ready to send.** The brief is at `.seo/briefs/2026-11-18-product-hunt-t2.md` and includes the tagline ("One API to post to every social platform from AI agents"), description, topics, and media guidance. Product Hunt requires a human to submit and to coordinate on launch day (Tuesday through Thursday is best; expect 2-3 hours available that day). Reply "sent" once submitted and the skill will log the send date and schedule a 30-day check on whether the page appeared and linked back. (NY-4)

**Three directory briefs are queued and ready to send.** The offpage starter stack is building up:
- **Product Hunt** (brief at `.seo/briefs/2026-11-18-product-hunt-t2.md`, ~2-3 hours on launch day, DR 88, requires launch coordination) — NY-4
- **AlternativeTo** (brief at `.seo/briefs/2026-11-18-alternativeto-t2.md`, ~15 minutes, DR 70, also mark as alternative to Postiz/Ayrshare/Post Bridge) — NY-6
- **SaaSHub** (brief at `.seo/briefs/2026-11-18-saashub-t2.md`, ~5 minutes, DR 65, open submission form) — NY-7

Additional directories still pending briefs: G2 (DR 92, ~20 min, requires screenshot + verification), Capterra/GetApp/Software Advice (~20 min), Indie Hackers (~10 min), Crunchbase (~10 min). Reply "done" with which directories were submitted and the skill logs them and schedules rechecks. (NY-5)

**SaaSHub listing brief is ready to send.** See above — submit at https://www.saashub.com/submit using the exact text in `.seo/briefs/2026-11-18-saashub-t2.md`. ~5 minutes. Reply "sent" and the skill logs the send date and schedules a 30-day recheck. (NY-7)

---

## How the run ended

Git mode: commit. Files changed this run: 8 (brief, worklog, mentions, ledger, needs-you, health fingerprint, run record, latest.md). Run record: `.seo/runs/2026-11-18-0908.md`. Committing to branch seo/daily.

---

## Connections

Still missing (unchanged): Search Console (most valuable — unlocks page-level click/impression data), GA4 (unlocks conversion data and AI referral attribution), Bing Webmaster API (unlocks Bing and Copilot panel). No new connections made or declined this run.
