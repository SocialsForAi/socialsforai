# SocialsForAI — SEO Roadmap

_Initialized 2026-11-18. The programmatic-page tracker and off-page phase planner._

---

## Site facts

| Field | Value |
|---|---|
| Domain | socialsforai.com |
| Authority | null (new site; DataForSEO hasData:false 2026-11-18) |
| Stack | unknown (website code in separate repo) |
| KD ceiling | easy (cold-start default) |
| GSC | not connected |
| Sitemap | https://socialsforai.com/sitemap.xml (46 pages as of 2026-11-18) |

---

## Phase 0 — Technical foundation (blocked on website repo access)

**Why:** Two sitemap/meta violations found that suppress crawl quality. Cannot fix from this repo.

**Scope:**
- [ ] Fix: 46/46 sitemap URLs share lastmod 2026-11-01 (build date). Remove lastmod or use real content dates. (NY-3)
- [ ] Fix: /privacy and /terms share homepage meta description. Add unique descriptions. (NY-3)

**Files modified:** none until NY-3 is resolved with website repo access.

---

## Phase 1 — Off-page authority (directory starter stack)

**Why:** Site is new, DR unknown, zero SERP presence on three core queries. No directory listings confirmed. First backlinks and category signals must come before on-page optimization can work.

**Scope:**
- [ ] Product Hunt launch (see OFF-001 brief in .seo/briefs/) — highest impact, requires launch day coordination (NY-4)
- [ ] AlternativeTo — list as alternative to Postiz, Ayrshare, Post Bridge — free, 10 min (NY-5)
- [ ] G2 — submit product page — requires screenshot, verification email, ~20 min (NY-5)
- [ ] Capterra / GetApp / Software Advice — one form, ~20 min (NY-5)
- [ ] SaaSHub — free, 5 min (NY-5)
- [ ] Indie Hackers products — free, 10 min (NY-5)
- [ ] Crunchbase basic profile — free, 10 min (NY-5)

**Files modified:** none — external work. Track status in .seo/needs-you.md.

**Verification:** check backlink diff 30 days after first submissions.

---

## Phase 2 — GSC connection + first measurement

**Why:** Without GSC, the skill cannot see which of the 46 existing pages are close to ranking, cannot measure CTR, and cannot run URL inspection. Connect GSC first, then the next run can run striking-distance analysis.

**Scope:**
- [ ] Connect GSC to OpenSEO project ba51c7a8-d290-4772-8bbb-70c6c2c505f5 (NY-1)
- [ ] Run first full GSC measurement (page states, branded vs non-branded split)
- [ ] Run URL inspection on the 5 priority pages

**Unblocks:** strike-distance refreshes, CTR gap repair, index status.

---

## Phase 3 — On-page refresh (after GSC shows data)

_Deferred until Phase 2 complete. Candidates from candidate backlog once GSC data is available._

---

## Phase 4 — Programmatic expansion

_Patterns identified but deferred until authority baseline is established._

Potential patterns (from existing site structure):
- /mcp/{network} — currently 3 pages (x, linkedin, bluesky); could expand to Mastodon, Telegram, Discord, Slack, Nostr
- /agents/{tool} — currently 6 pages; could expand to other MCP clients / agent frameworks
- /vs/{competitor} — currently 6 pages; could add more direct competitors

**Gate:** invisible share must be below 50% before new pages are added. (Cannot measure yet — no GSC.)

---

## Phase 5 — Directory submissions (starter stack)

**Why:** Baseline presence and links from high-DR directories. Free submissions; cap at 2-3 hours total.

**Scope:**
- [ ] Product Hunt — brief drafted 2026-11-18 (OFF-001, NY-4)
- [ ] AlternativeTo — brief drafted 2026-11-18 (OFF-002, NY-6); list as alternative to Postiz, Ayrshare, Post Bridge
- [ ] SaaSHub — brief drafted 2026-11-18 (OFF-003, NY-7)
- [ ] G2 — requires screenshot + verification, ~20 min (NY-5)
- [ ] Capterra / GetApp / Software Advice — one form, ~20 min (NY-5)
- [ ] Indie Hackers products page — free, 10 min (NY-5)
- [ ] Crunchbase basic profile — free, 10 min (NY-5)

**Files modified:** none — external submissions. Track status in `.seo/needs-you.md`.

---

## Phase 6 — Roundup outreach (top listicle targets)

**Why:** 10+ page-1 roundup articles for "best social media MCP servers" and "social media API for AI agents" do not list SocialsForAI. Getting added to independent roundups is faster than displacing them.

**Targets (confirmed independent, page 1 as of 2026-11-21):**
- [ ] dev.to/jclvsh — "Social media posting APIs for AI agents" — brief ready (OFF-004, NY-10); ~15 min
- [ ] shapelessai.com/best-social-media-mcp-servers — 27-tool census — brief ready (OFF-005, NY-10); ~10 min
- [ ] chatforest.com/guides/best-social-media-mcp-servers/ — 35+ tools — verify independence before sending
- [ ] kevinmeneses.com/en/articles/best-social-media-mcp-servers-2026 — independent blog — verify before sending
- [ ] dev.to/jesse_eisenbart — "7 Best Social Media APIs for Developers & AI Agents in 2026" — verify before sending
- [ ] publora.com/blog/best-social-media-api-for-ai-agents-2026 — verify independence before sending

**Verification:** track reply status in `.seo/needs-you.md`. Schedule 60-day rechecks.

**Files modified:** none — external work.

---

## Keyword research appendix

_From run 2026-11-18. Seed research using DataForSEO via OpenSEO._

| Keyword | Vol | KD | Intent | Priority | Notes |
|---|---|---|---|---|---|
| social media for ai agents | 480 | 33 | commercial | P1 | Core query; site not ranking |
| ai powered social media management tool | 1000 | 38 | commercial | P2 | Broad; homepage could target |
| post to all social media at once free | 140 | 11 | transactional | P2 | /crosspost page could target |
| social media character limits | 20 | 1 | informational | P3 | Reference; site has individual pages |
| linkedin mcp server official | 20 | null | navigational | P2 | /mcp/linkedin should capture this |

_Re-research with tighter seeds in next keyword pass: "social posting api developers", "bluesky mcp server", "schedule posts programmatically"._
