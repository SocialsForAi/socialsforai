# SEO run: 2026-11-28

## What was done and why
The live /vs/ayrshare page still says "Pro is $29 for 25", which is a retired price. The fix is already written up and waiting on the website repo, which this worker cannot see. So I did the next-best thing: I drafted the page that two of the four agent queries need. That is a comparison of social media MCP servers (SocialsForAI, Buffer, Postiz, Late, Ayrshare). It's saved as `.seo/briefs/2026-11-28-draft-mcp-comparison.md`. It uses prices and network status read live today from our pricing page and `/v1/platforms`. It says Threads is in review and lists three tradeoffs where competitors win. Nothing was published.

## Verified, and what could not be
- Health diff: 48 pages, 0 broken internal links. Truth check: 10 rules, 0 contradictions. The pricing rows in the truth ledger already match your 2026-11-25 owner fact, so I left them unchanged.
- Not verified: competitor MCP details. buffer.com returned a bot challenge and the Postiz MCP endpoint returned an error, so those table cells are marked "verify" in the draft.
- Not checked: Search Console, GA4 and Bing (not connected), census, demand radar, answer-engine and SERP panels. Paid calls: $0 of $2.00. No build applies; only `.seo/` changed.

## Left undone
- The Ayrshare pricing page and the agency-cost page are still unwritten. The agency-cost page is small: pricing.md already has the 12-client row ($36 vs Upload-Post $49).
- Sitemap lastmod (47 of 48 URLs share 2026-11-01), duplicate meta description on /, /privacy and /terms.
- The new blog post has one inbound link; it should be linked from /vs/postiz.
- The answer-engine panel is overdue.

## Decisions waiting on you
1. **NY-20: publish the MCP comparison?** (a) Have someone with the website repo verify the competitor cells and publish at /mcp/compare (recommended). (b) Publish only our own facts. (c) Not now.
2. **NY-19: fix /vs/ayrshare?** Apply the edits in `.seo/briefs/2026-11-27-fix-vs-ayrshare.md`, or give the worker the website repo (recommended). Publish NY-20 after this so the pages agree.
3. **NY-1: connect Search Console in OpenSEO?** Recommended yes; without it the worker is ranking blind.
4. Directory and outreach briefs NY-4 to NY-17 are still unsent.

## How the run ended
Committed on `seo/daily`. Nothing pushed.
