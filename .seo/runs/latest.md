# SEO run — 2026-11-21

## What this run did

The search results for "best social media MCP servers" and "social media API for AI agents" show 10+ page-1 roundup articles — none of them include SocialsForAI. Today's run identified the two best independent targets and wrote ready-to-send outreach briefs for both.

**OFF-004 — dev.to community post** (https://dev.to/jclvsh/social-media-posting-apis-for-ai-agents-buffer-ayrshare-blotato-postiz-zernio-and-dropspace-4an8): An independent developer (who builds dropspace, one of the reviewed tools — disclosed) compared six social media posting APIs for AI agents. The article's framing is a direct match: "I wanted an agent to publish to several platforms without wiring up an OAuth flow, a media upload API, and a rate limiter for each one." SocialsForAI is built exactly for that. The author explicitly invites corrections. The brief asks them to add SocialsForAI as a seventh option; the exact text to paste is included. Dev.to has domain authority around 90 and this article ranks page 1 for the phrase your buyers search.

**OFF-005 — shapelessai.com 27-tool census** (https://shapelessai.com/best-social-media-mcp-servers): An independent comparison site published a list of 27 MCP servers for social media, sources every fact from vendor documentation, and explicitly states it used listicles only to find tool names, not to source claims. SocialsForAI is a genuine gap: none of the 27 tools are described as offering idempotency, approval workflow, and no-credential-handling in combination for agentic workflows. The brief includes the full table row in their format, ready to paste.

The brief file at `.seo/briefs/2026-11-21-roundup-outreach-t2.md` also lists five more roundup pages to verify and brief next run (chatforest.com, kevinmeneses.com, postpeer.dev, dev.to/jesse_eisenbart, publora.com).

This action was the highest-scoring candidate for two consecutive runs (score 23). It was deferred yesterday by the 1-in-5 explore slot rule (yesterday's run fixed the competitor tracking config instead). Today it took the top position.

## Verified

- Brief claims against truth.md: **passed** — all 8 live networks (X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, Nostr) confirmed in truth.md; Instagram/Threads/Facebook/TikTok/YouTube not claimed live; free tier (3 accounts, 100 posts/month), MCP URL, idempotency, approval workflow, error.fix field, sub-agent keys all sourced from SKILL.md via truth.md
- Target independence verified by page fetch: **passed** — dev.to/jclvsh (independent, invites corrections); shapelessai.com (independent, 27-tool census sourced from vendor docs)
- Competitor-authored roundups identified and excluded: **passed** — blotato.com, upload-post.com, breakreach.com, eden.so confirmed as product blogs; scrapecreators.com excluded (wrong category: data scraping, not posting APIs)
- No auto-submit, no contact made: **passed** — briefs only, human sends
- Health diff (46 pages): **passed** — 1 change (/status live data), 2 violations unchanged, 0 new violations
- Truth check (6 rules): **passed** — 0 contradictions, 0 missing
- Build/type check: **not applicable** — only .seo/ Markdown files changed
- GSC panel: **not checked** — Search Console not connected (NY-1)
- Census: **not checked** — requires GSC
- SERP features: **not checked** — within 168h cadence (due 2026-11-27)
- Link opportunities: **not checked** — within 168h cadence (due 2026-11-27)
- Backlinks: **not checked** — within 7d cadence (paid call, budget preserved)

## Left for the next run

1. **Indie Hackers product page brief** — a free 10-minute product submission to a founder community with DR ~72. Has been the second-ranked candidate for 4 consecutive runs; unblocked; next run should take it.
2. **Verify-product: update truth.md with company address, contact email, and MCP Registry ID** — these facts appeared on the live homepage in a FAQ added 2026-11-20 and are not yet in the truth ledger or truth-checks.json.
3. **Remaining roundup outreach** — 5 more page-1 roundup pages (chatforest.com, kevinmeneses.com, postpeer.dev, dev.to/jesse_eisenbart, publora.com) need independence verification before briefing. Brief wording is already written in OFF-004 and OFF-005.
4. **Sitemap lastmod and duplicate meta description** — 2 technical violations on the live site that require the website repo to fix (see NY-3 below).

## Decisions waiting on you

**The two new outreach briefs are ready to send (NY-10).** Two independent roundup articles that rank page 1 for "best social media MCP servers" and "social media API for AI agents" do not list SocialsForAI. The briefs are at `.seo/briefs/2026-11-21-roundup-outreach-t2.md`. (a) OFF-004: Leave a comment on the dev.to post at https://dev.to/jclvsh/social-media-posting-apis-for-ai-agents-buffer-ayrshare-blotato-postiz-zernio-and-dropspace-4an8 or DM the author @jclvsh asking them to add SocialsForAI — the brief has the exact description to paste, about 15 minutes. (b) OFF-005: Contact shapelessai.com via their contact page or social links to ask them to add a row for SocialsForAI to their 27-tool census at https://shapelessai.com/best-social-media-mcp-servers — the brief has the full table row ready to paste, about 10 minutes. Reply "sent OFF-004", "sent OFF-005", or both, and the next run logs the send date and schedules a 60-day recheck. (NY-10)

**Search Console is not connected (NY-1).** Without it, this skill cannot see which pages are close to ranking, cannot measure click-through rate, cannot run URL inspection, and the weekly link-opportunity and SERP-feature panels run blind. The fix: go to the OpenSEO dashboard for project ba51c7a8-d290-4772-8bbb-70c6c2c505f5 and add the Google Search Console property for socialsforai.com. Options: (a) connect now; (b) skip for now. Recommend (a). Reply with a letter. (NY-1)

**Brand positioning and product details need a quick confirmation (NY-2 / NY-9).** Two questions remain from the first run: (a) Is the positioning sentence accurate — "social media posting API and MCP server for AI agent developers who need to publish programmatically"? (d) Are there any proprietary data assets (aggregate usage stats, error rate data, posts-per-day numbers) that could become public content — a data study or benchmarks post? Reply to both. (NY-9)

**Two live-site technical violations require the website repo (NY-3).** The site's sitemap lists all 46 pages with the same lastmod date (2026-11-01), which is a build date rather than a content date — search engines notice when every page on a site "changed" on the same day and discount the signal. Separately, the privacy and terms pages share the homepage meta description word for word. Both fixes are one-liners in the site generator but require the website codebase, which is in a separate repository. Options: (a) fix both in the website repo; (b) skip for now. Recommend (a). Reply "done" once fixed. (NY-3)

**Four directory briefs are drafted and waiting to be submitted (NY-4, NY-5, NY-6, NY-7).** Product Hunt (NY-4), AlternativeTo (NY-6), and SaaSHub (NY-7) each have a ready-to-send brief. The full directory list including G2, Capterra, and Indie Hackers is in NY-5. These are free submissions that take 5-20 minutes each and add backlinks from high-authority directories. Reply "sent" listing which you submitted and the next run logs them. (NY-4, NY-5, NY-6, NY-7)

**The /instagram-api meta description is a small improvement ready when you have website repo access (NY-8).** The page body correctly states Instagram posting is in review, but the meta description reads as a general Instagram API guide with no caveat. Suggested update is in the brief. No urgency — the page body is correct. (NY-8)

Nothing is waiting on you beyond the above.

## How the run ended

Committed 9 files to branch `seo/daily`: `.seo/briefs/2026-11-21-roundup-outreach-t2.md`, `.seo/radar.md`, `.seo/aeo/mentions.md`, `.seo/aeo/worklog.md`, `.seo/content-ledger.md`, `.seo/needs-you.md`, `.seo/roadmap.md`, `.seo/runs/2026-11-21-0000.md`, `.seo/runs/latest.md`. No code changed. Run record at `.seo/runs/2026-11-21-0000.md`.
