# Daily SEO run — 2026-11-23 (run 1 of day, ~00:00 UTC)

**Site:** socialsforai.com — social media posting API and MCP server for AI agents  
**Branch:** seo/daily  
**Previous run:** 2026-11-22-0000 (offpage-brief: Indie Hackers product listing OFF-006)

---

## Measured

```
GSC 28d: not connected (0/0). Pages: n/a (no GSC data).
Bing: no key.
Health: 46 pages, 1 changed (/status — live data, expected), 2 violations (unchanged).
  Violations: [build-date-lastmod] 46/46 URLs share 2026-11-01; [duplicate-meta-description] /privacy + /terms share homepage meta.
Truth: 8 rules, 0 contradictions, 0 missing. Clean. (up from 6 rules; 2 new rules added this run.)
Claims re-verified: 0 (no last_verified stamps in briefs yet).
AI panel: due (cadence 14d, never run) — skipped for budget ($2.00 unattended cap).
AI referrals: not measured (no GA4, no logs).
Census: unchecked — no GSC.
Vitals: speed median TTFB homepage ~82ms (no slow-ttfb flag). LCP/INP/CLS: unchecked (no PSI key). | relevance: unchecked | CTR: unchecked | links: within 7d cadence (due 2026-11-27). Backlinks: within 7d cadence (due 2026-11-28).
Radar: within 20h cadence (last ran 2026-11-22).
SERP: within 168h cadence (due 2026-11-27).
Links+: within 168h cadence (due 2026-11-27).
Brand: unchecked (no GSC queries file).
Product: 0 commits touching watched paths since 2026-11-22T00:00.
Competitors: within 168h window (due 2026-11-27).
Backlinks±: within 7d cadence (due 2026-11-28).
Seasonality: due monthly (cadence 720h).
Outcomes: n/a (no GSC). Priors: none.
Debt carried from 2026-11-22: offpage-brief roundup remaining targets, verify-product (top candidate), sitemap lastmod (blocked NY-3), AI panel (budget).
Unchecked: GSC (not connected), Bing (no key), census (no GSC), brand split (no GSC), SERP features (weekly cadence), link opportunities (weekly cadence), backlinks (weekly cadence, budget), Lighthouse (no PSI key), AI panel (budget), claim re-verification (no last_verified stamps), AI referrals (no GA4/logs).
```

---

## Candidates

Fixed overrides checked first:
- **Tier 1 (reachability/index regressions):** none detected.
- **Tier 2 (truth contradictions):** none (0 from truth_check.py on today's health file, 8 rules).
- **Tier 3 (repairs with user-facing harm):** none.

**Top candidates (rubric scored):**

| Rank | Action | Target | Evidence | Score | Effort | Blocked on |
|---|---|---|---|---|---|---|
| 1 | verify-product | truth.md: company address, contact email, MCP Registry ID, plan pricing | Homepage FAQ added 2026-11-20; pricing page read 2026-11-23; facts unlogged 3 days | 17 | S | — |
| 2 | offpage-brief | Roundup outreach — remaining: chatforest.com, kevinmeneses.com, postpeer.dev, jesse_eisenbart, publora.com | 5 page-1 roundups, independence unverified | 16 | S | Independence check needed |
| 3 | repair | Sitemap lastmod (build-date-lastmod) | 46/46 URLs share 2026-11-01; 5th consecutive run | 15 | S | NY-3 (website repo) |
| 4 | offpage-brief | G2 + Capterra listing | Ayrshare on G2; DR 92/91; human sends | 15 | M | NY-5 |

Saturation check: last 6 executed runs — offpage-brief (×2, 11-18), verify-product (11-19), repair (11-20), offpage-brief (11-21), offpage-brief (11-22). No verify-product cooldown (previous was different claims on 11-19). No saturation block.

Portfolio gates: create_gate unchecked (no GSC). No cold veins (no priors).

---

## Chose

**verify-product: truth.md update — company address, contact email, MCP Registry ID, full plan pricing.** Unattended run — taking top candidate (score 17). The homepage FAQ added "Who runs SocialsForAI?" content on 2026-11-20 with the company's address (1421 B St, Eureka, CA 95501, USA), contact email (lee@socialsforai.com), and MCP Registry ID (io.github.SocialsForAi/socialsforai). The pricing page was also read and all four paid plan prices were absent from truth.md. These are revenue-sensitive claims. Recording them now means every future create or refresh action can verify against the ledger, and truth_check.py can guard against contradictions in repo files.

---

## Did

**Files changed (4):**

1. `.seo/truth.md` — 22 new claim rows added in the claims table (address, email, MCP Registry ID, data deletion URL, credentials at rest, full Hobby/Pro/Growth/Scale pricing including overages and billing model, agent-cannot-connect-alone, agent-cannot-pay). 3 new HIGH-RISK entries added (plan pricing, contact email, MCP Registry ID). Header note updated with today's date.
2. `.seo/truth-checks.json` — 2 new mechanical check rules added: (a) Contact email: `python/pyproject.toml` must match `lee@socialsforai\.com` → PASS; (b) MCP Registry ID: `server.json` must match `io\.github\.SocialsForAi/socialsforai` → PASS.
3. `.seo/evidence/2026-11-23-verify-product-company-claims.json` — evidence file with all 10 verified claims, source for each, mechanical check results, and note on why pricing was not added to truth-checks.json grep rules (separate website repo).
4. `.seo/content-ledger.md` — ledger row added (2026-11-23, verify-product, truth.md + truth-checks.json); candidate backlog updated (verify-product removed, roundup outreach now #1).

**Gates (fix lane / verify-product, all non-waivable):**
- truth.md has each claim with a dated source: ✅ — 22 new rows, sources from homepage FAQ (health diff 2026-11-23.json) and pricing page (health diff 2026-11-23.json) and repo files (pyproject.toml, server.json)
- truth-checks.json has mechanical rule for new high-risk claims in repo files: ✅ — 2 new rules (email + MCP Registry ID); pricing not added to grep rules (pricing not in this repo — noted as limitation)
- truth_check.py post-action: 8 rules, 0 contradictions, 0 missing ✅
- No pages contradicted any new claim (no "Correcting a claim" steps required): ✅ — confirmed by truth_check.py
- Rendered check of corrected page: N/A — no page was corrected; this run only added claims to the ledger. No existing page contradicted any new claim.
- No competitor named outside allowed pages: ✅
- No invented regulatory/medical language: ✅
- Build/type check: not applicable — only .seo/ Markdown and JSON files changed.

---

## Not done

1. **offpage-brief: remaining roundup outreach** — chatforest.com, kevinmeneses.com, postpeer.dev, dev.to/jesse_eisenbart, publora.com — 5 page-1 roundup pages need independence verification before briefing. Score 16. **Top candidate next run.** Not done: lower score, independence check still needed.
2. **Sitemap lastmod and duplicate meta description** — requires website repository (NY-3). Two technical violations unchanged for 5 days.
3. **AI panel** — cadence 14 days, never run. Skipped for budget constraint (unattended $2.00 cap). Run `/seo aeo` to execute it as a dedicated run.
4. **Pricing not in truth-checks.json grep rules** — Plan prices ($9/$29/$79/$199) are verified from the live pricing page and recorded in truth.md, but no grep rule was added because the pricing page lives in a separate website repo (not greppable from this repo). If pricing-related copy ever lands in SKILL.md or README.md, add a must-not-match rule then.

---

## Needs you

No new items this run.  
Open (unchanged): NY-1, NY-2, NY-3, NY-4, NY-5, NY-6, NY-7, NY-8, NY-9, NY-10, NY-11.

---

## Spend

Paid calls: 0. Web searches (free): 0. URL fetches (free): 46 (health diff against socialsforai.com). Budget used: $0.00 / $2.00.

Skipped for budget/cadence: AI panel ($-paid; unattended budget cap), backlinks panel ($-paid weekly call), SERP features panel ($-paid weekly call).

---

## How the run ended

Git mode: commit. Files changed this run: 4 (.seo/ state files only, no code changed). Run record: `.seo/runs/2026-11-23-0000.md`.
