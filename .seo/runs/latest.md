# SEO run — 2026-11-24

## What this run did

Three outreach briefs were written for page-1 roundup articles where SocialsForAI is currently absent. Independence was verified for all three by fetching the pages today.

- **Jesse Eisenbart on dev.to** — "The 7 Best Social Media APIs for Developers & AI Agents in 2026" (dev.to/jesse_eisenbart/the-7-best-social-media-apis-for-developers-ai-agents-in-2026-3e15). This article ranks page 1 for "social media API for AI agents" and compares seven tools without including SocialsForAI. Jesse is an independent solo-founder (not a competitor product). The brief asks him to add SocialsForAI as an eighth option, with the description ready to paste. Brief: OFF-007.
- **ChatForest** — "Best Social Media MCP Servers 2026 — 35+ Tools" (chatforest.com/guides/best-social-media-mcp-servers/). Page 1 for "best social media MCP servers". ChatForest is an AI-native publication whose stated methodology is reading vendor documentation — the brief provides a pre-formatted data row in that format, with the MCP URL, networks, pricing, and agent features pre-verified from truth.md. Brief: OFF-008.
- **Kevin Meneses** — "7 Best Social Media MCP Servers for Claude and ChatGPT (2026)" (kevinmeneses.com/en/articles/best-social-media-mcp-servers-2026). Page 1 independent tech blog. The brief requests a straight factual addition. Important note in the brief: Kevin has affiliate links for some competitors in the article — do not offer or accept an affiliate arrangement. Brief: OFF-009.

Five other page-1 roundup articles found in today's radar check were confirmed competitor-authored (Schedule & Chill, DemandBird, Mallary Labs, PostPeer, Publora) and were dropped — not eligible for outreach.

This action won because SocialsForAI is absent from every significant page-1 roundup for the product's two target queries ("best social media MCP servers" and "social media API for AI agents"). These are the articles its buyers find before they know the product name. The three targets confirmed independent today were the last unverified items from the debt carried since 2026-11-19.

## Verified

- Truth check (repo + live pages): 8 rules, 0 contradictions — clean.
- Health diff: 46 pages, 2 unchanged violations (sitemap lastmod, duplicate meta description), 1 expected change (/status page). No new regressions.
- All brief wording cross-referenced against truth.md (last updated 2026-11-23): networks, pricing, MCP URL, MCP Registry ID, error.fix field, approval workflow, idempotency — all sourced from verified claims.
- Independence verified by page fetch for all three targets. Five competitor-authored articles found and dropped.
- No code files changed; no build or type check required.
- Not checked: GSC (not connected), Lighthouse (no PSI key), AI panel (budget), backlinks (weekly cadence, due 2026-11-28), SERP features (weekly cadence, due 2026-11-27), AI referrals (no GA4 or server logs), census (no GSC).

## Left for the next run

- **Sitemap lastmod fix and duplicate meta description** — still unresolved after 6 days. Both require editing the website repository (a separate codebase not present here). The sitemap has 46 URLs all sharing the lastmod date 2026-11-01 — this is a build date, not a content date, and slows recrawling.
- **AI panel** — what ChatGPT, Perplexity, Claude, and Gemini say about SocialsForAI has never been measured. The 14-day cadence is overdue. Requires a dedicated run with more budget. Run `/seo aeo` to execute it.
- **SERP features panel** is due 2026-11-27 (3 days). An unusual number of competitor-authored roundup articles appeared in today's radar (5 new ones). This may signal more AI Overviews appearing for target queries. The SERP panel will confirm.
- **Nine unsent briefs** are waiting (OFF-001 through OFF-009). The three written today (OFF-007, OFF-008, OFF-009) are the highest priority; the two from 2026-11-21 (OFF-004 dev.to/jclvsh, OFF-005 shapelessai.com) are next.

## Decisions waiting on you

**Search Console is not connected** — without it, this skill cannot see which pages are close to ranking on Google, cannot detect pages that dropped out of the index, and cannot measure click-through rates. Options: (a) connect Search Console — go to the OpenSEO dashboard for project ba51c7a8-d290-4772-8bbb-70c6c2c505f5 and add the Search Console property for socialsforai.com; (b) continue without it. Recommend (a): the site has been active for a week with no GSC data, and striking-distance pages are invisible without it. Reply with a letter. (NY-1)

**Brand positioning and product truth need owner confirmation** — two things remain unconfirmed: (a) Is the positioning sentence accurate: "social media posting API and MCP server for AI agent developers who need to publish programmatically"? (b) Are there any proprietary data assets — aggregate usage stats, error rate data, post volume trends — that could become public content? Original data is the most durable SEO asset available; knowing what exists changes the content roadmap significantly. Reply yes/no on (a) and anything you're willing to publish on (b). (NY-9)

**Two technical violations on the live site require the website repository** — both have appeared in every health scan for 6 days: (1) All 46 sitemap URLs share the lastmod date 2026-11-01 (a build date, not a content date — this tells Google to recrawl less often). Fix: emit the actual page-modified date in the sitemap generator, or omit lastmod. (2) The /privacy and /terms pages both use the homepage meta description. Fix: give each its own distinct meta description. Both require the website repo. Options: (a) fix them in the site repo and reply "done"; (b) continue deferring. Recommend (a): these are two small changes that take under 30 minutes combined. (NY-3)

**Product Hunt brief is ready to submit** — the brief at .seo/briefs/2026-11-18-product-hunt-t2.md has the tagline, description, topics, and media links ready. Product Hunt requires a human to submit and to be available on launch day (Tuesday–Thursday recommended, roughly 2–3 hours available). Reply "sent" once submitted and the skill will log the send date and schedule a 30-day recheck. (NY-4)

**Directory starter stack** — G2, Capterra/GetApp, SaaSHub, and Crunchbase remain unsubmitted. Each has a brief or is a 5–20 minute form submission. Combined, they add presence on platforms with domain ratings of 88–92 that answer engines cite for vendor discovery. Reply "done" listing which were submitted and the skill will log and schedule rechecks. (NY-5)

**AlternativeTo brief ready** — submit SocialsForAI at alternativeto.net/software/add/ using .seo/briefs/2026-11-18-alternativeto-t2.md, then mark it as an alternative to Postiz, Ayrshare, and Post Bridge from each competitor's AlternativeTo page. ~15 min total. Reply "sent OFF-002". (NY-6)

**SaaSHub brief ready** — submit at saashub.com/submit using .seo/briefs/2026-11-18-saashub-t2.md. ~5 min. Reply "sent OFF-003". (NY-7)

**Instagram meta description** — the /instagram-api page body correctly says Instagram posting is not yet live, but the page's meta description reads as a general Instagram API guide with no caveat. Consider updating it. Requires website repo. No urgency. Reply "done" if applied. (NY-8)

**dev.to/jclvsh and shapelessai.com briefs** — ready to send since 2026-11-21. (a) OFF-004: Comment or DM the author of "Social media posting APIs for AI agents" on dev.to asking to add SocialsForAI as a seventh option — wording is in .seo/briefs/2026-11-21-roundup-outreach-t2.md, ~15 min. (b) OFF-005: Contact shapelessai.com asking them to add a SocialsForAI row to their 27-tool MCP server census — table row ready to paste, ~10 min. Reply "sent OFF-004", "sent OFF-005", or both. (NY-10)

**Indie Hackers product listing** — brief at .seo/briefs/2026-11-22-indie-hackers-t2.md. Submit at indiehackers.com/products — requires an Indie Hackers account in your name. ~10 min. Reply "sent OFF-006". (NY-11)

**Three new roundup briefs ready today** — all in .seo/briefs/2026-11-24-roundup-outreach-t2.md. (NY-12) OFF-007: Comment or message Jesse Eisenbart on dev.to asking him to add SocialsForAI to "The 7 Best Social Media APIs for Developers & AI Agents in 2026" — wording ready to paste, ~15 min. Reply "sent OFF-007". (NY-13) OFF-008: Contact ChatForest via their site contact form asking them to add a SocialsForAI entry to their "35+ Best Social Media MCP Servers 2026" article — pre-formatted data row in the brief, ~10 min. Reply "sent OFF-008". (NY-14) OFF-009: Contact Kevin Meneses asking for a straight factual addition to his "7 Best Social Media MCP Servers" article. Do not offer or accept any affiliate arrangement — the brief includes this note. ~10 min. Reply "sent OFF-009". (NY-14)

## How the run ended

Git mode: `commit`. 6 files changed under `.seo/` (brief file, worklog, mentions inventory, content ledger, needs-you queue, radar). No code or website files changed. Run record: `.seo/runs/2026-11-24-0000.md`.

**Missing connections:** Search Console (would unlock per-page impressions, CTR, and striking-distance detection) and GA4 (would add AI referral attribution from ChatGPT, Perplexity, Claude) are the two most valuable additions. Both are connectable from the OpenSEO dashboard.
