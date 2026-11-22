# SEO run — 2026-11-22

## What this run did

The Indie Hackers product directory (indiehackers.com, domain rating ~72) is a founder and indie developer community that lists software products made by builders. SocialsForAI was not listed. Today's run wrote a ready-to-submit product listing brief (OFF-006) at `.seo/briefs/2026-11-22-indie-hackers-t2.md`.

Indie Hackers was chosen because its audience — developer founders and indie builders, many of whom are building AI agents and automation tools — is a direct match for SocialsForAI's primary persona. A direct competitor (Ayrshare) is already listed there; SocialsForAI's absence is a straightforward gap. The brief has been the second-ranked candidate for four consecutive runs and was explicitly flagged "next run should take it" in yesterday's record.

The brief contains the exact tagline ("Social media posting API and MCP server for AI agents"), a full product description with all eight live networks (X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, Nostr), the five key differentiators (idempotency, no credential handling for agents, approval workflow, sub-agent keys, MCP server URL), free tier terms (3 accounts, 100 posts/month, no credit card), and a revenue field for the owner to fill in. All claims were verified against the truth ledger before the brief was written.

## Verified

- Brief claims against truth.md: **passed** — all 8 live networks, credentials, idempotency, approval workflow, sub-agent keys, MCP URL, and free tier limits sourced from SKILL.md / README.md via truth.md
- Finding id, source URL, current state, requested wording, effort estimate all present in brief: **passed**
- No auto-submit, no contact made: **passed** — brief only, human submits
- Competitor background claim ("Ayrshare is on Indie Hackers"): **not independently verified** — noted as context in brief, not part of the ask; listing accuracy unaffected
- Health diff (46 pages): **passed** — 2 changed (/docs content, /status live data), 2 violations unchanged, 0 new violations
- Truth check (6 rules, today's health fingerprint): **passed** — 0 contradictions, 0 missing
- Build/type check: **not applicable** — only .seo/ Markdown and JSON files changed
- GSC panel: **not checked** — Search Console not connected (NY-1)
- Census: **not checked** — requires GSC
- AI panel: **not checked** — cadence due (never run), skipped for unattended budget cap; run `/seo aeo` to execute it

## Left for the next run

1. **Verify-product: update truth.md with company address, contact email, and MCP Registry ID** — these facts appeared in the homepage FAQ on 2026-11-20 and are not yet in the truth ledger. Score 17 — top candidate next run.
2. **Remaining roundup outreach** — 5 more page-1 roundup pages (chatforest.com, kevinmeneses.com, postpeer.dev, dev.to/jesse_eisenbart, publora.com) need independence verification before briefing. Brief wording is already written.
3. **Sitemap lastmod and duplicate meta description** — 2 technical violations on the live site that require the website repo (see NY-3 below). Unchanged for 4+ days.
4. **AI panel** — first measurement of what ChatGPT, Claude, Perplexity and Gemini say about SocialsForAI has never been run; cadence is 14 days and it is overdue. Requires a dedicated `/seo aeo` run with budget approval.

## Decisions waiting on you

**The Indie Hackers product listing brief is ready to submit (NY-11).** Indie Hackers is a developer-founder community (indiehackers.com) where builders list the products they have shipped. SocialsForAI is absent; a direct competitor (Ayrshare) is already listed. The brief is at `.seo/briefs/2026-11-22-indie-hackers-t2.md` with the exact tagline and description to enter. You will need an Indie Hackers account in your name as the maker (create one free at indiehackers.com if you do not have one). Optionally enter your current MRR — the IH community values revenue transparency, but the brief leaves that field blank for you to fill in. Effort: about 10 minutes. Reply "sent OFF-006" and the next run logs the send date and schedules a 30-day recheck. (NY-11)

**Two outreach briefs from the previous run are ready to send (NY-10).** Two independent roundup articles that rank page 1 for "best social media MCP servers" and "social media API for AI agents" do not list SocialsForAI. The briefs are at `.seo/briefs/2026-11-21-roundup-outreach-t2.md`. (a) OFF-004: Leave a comment or DM the author of the dev.to post "Social media posting APIs for AI agents" at https://dev.to/jclvsh/social-media-posting-apis-for-ai-agents-buffer-ayrshare-blotato-postiz-zernio-and-dropspace-4an8 asking them to add SocialsForAI as a seventh option — the brief has the exact wording, about 15 minutes. (b) OFF-005: Contact shapelessai.com via their contact page or social links to ask them to add a SocialsForAI row to their 27-tool MCP server census at https://shapelessai.com/best-social-media-mcp-servers — the brief has the full table row ready to paste, about 10 minutes. Reply "sent OFF-004", "sent OFF-005", or both. (NY-10)

**Search Console is not connected (NY-1).** Without it, this skill cannot see which pages are close to ranking, cannot measure click-through rate, and cannot run URL inspection. The fix: go to the OpenSEO dashboard for project ba51c7a8-d290-4772-8bbb-70c6c2c505f5 and add the Google Search Console property for socialsforai.com. Options: (a) connect now; (b) skip for now. Recommend (a). Reply with a letter. (NY-1)

**Brand positioning and product details need a quick confirmation (NY-2 / NY-9).** Two questions remain: (a) Is the positioning sentence accurate — "social media posting API and MCP server for AI agent developers who need to publish programmatically"? (d) Are there any proprietary data assets (aggregate usage stats, error rate data, posts-per-day numbers) that could become public content? Reply to both. (NY-9)

**Two live-site technical violations require the website repo (NY-3).** The site's sitemap lists all 46 pages with the same lastmod date (2026-11-01, a build date, not content dates). The privacy and terms pages share the homepage meta description word for word. Both are one-liners in the site generator but require the website codebase. Options: (a) fix both in the website repo; (b) skip for now. Recommend (a). Reply "done" once fixed. (NY-3)

**Four directory briefs are drafted and waiting to be submitted (NY-4, NY-5, NY-6, NY-7).** Product Hunt (OFF-001), AlternativeTo (OFF-002), and SaaSHub (OFF-003) each have a ready-to-send brief in `.seo/briefs/`. G2, Capterra, and Crunchbase are in NY-5. These are free or low-cost submissions that take 5–20 minutes each. Reply "sent" listing which you submitted. (NY-4, NY-5, NY-6, NY-7)

**The /instagram-api meta description is a small improvement ready when you have website repo access (NY-8).** The page body correctly states Instagram posting is in review, but the meta description reads as a general Instagram API guide. No urgency — the page body is correct. (NY-8)

**The first AI visibility measurement has never been run.** This is the measurement of what ChatGPT, Claude, Perplexity, and Gemini say about SocialsForAI when buyers ask questions in the product category. The cadence is every 14 days and it has never run. It costs real money (the exact amount depends on sample size — run `/seo aeo` and I will show the preflight estimate before spending anything). Options: (a) run it now with `/seo aeo`; (b) skip until you are ready. Recommend (a): without it every off-page action's value is unverified. This is not a needs-you item yet — no blocker other than budget — but it is worth flagging.

Nothing else is waiting on you beyond the above.

## How the run ended

Committed 7 files to branch `seo/daily`: `.seo/briefs/2026-11-22-indie-hackers-t2.md`, `.seo/aeo/worklog.md`, `.seo/aeo/mentions.md`, `.seo/content-ledger.md`, `.seo/backlink-targets.json`, `.seo/needs-you.md`, `.seo/roadmap.md`, `.seo/runs/2026-11-22-0000.md`, `.seo/runs/latest.md`. No code changed. Run record at `.seo/runs/2026-11-22-0000.md`.
