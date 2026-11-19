# Evidence: verify-product — network status update (2026-11-19)

**Action:** verify-product  
**Target:** `.seo/truth.md` — network claims  
**Run:** 2026-11-19  

---

## Trigger

The health diff showed socialsforai.com homepage content changed overnight (content_hash 02f18e70 → 37a8a45e, body_words 1081 → 1215). Reading the new body text revealed:

> "8 of 16 networks live › … Each network's status is read from the API's own configuration, so it only says live when it can post."

A visual network-status table now appears on the homepage with explicit Live / In review / Coming soon labels per network.

---

## Before (truth.md as of 2026-11-18)

| Claim | Old value |
|---|---|
| Networks: YouTube | unverified — appears in sdk/package.json keywords only |
| Networks: TikTok | unverified — appears in sdk/package.json keywords only |
| Networks: Instagram | unverified — /instagram-api page exists on live site but SKILL.md does not list it |
| Networks: Threads | (not in truth.md) |
| Networks: Facebook | (not in truth.md) |
| Networks: Pinterest | (not in truth.md) |
| Networks: Reddit | (not in truth.md) |
| Total network count | (not stated) |

---

## After (truth.md as of 2026-11-19)

| Claim | New value | Source |
|---|---|---|
| Networks: total on roadmap | 16 | homepage "8 of 16 networks live" |
| Networks: currently live count | 8 | homepage "8 of 16 networks live" |
| Networks: Instagram | in review — not yet live | homepage network table |
| Networks: YouTube | in review — not yet live | homepage network table |
| Networks: TikTok | in review — not yet live | homepage network table |
| Networks: Threads | in review — not yet live | homepage network table |
| Networks: Facebook | in review — not yet live | homepage network table |
| Networks: Pinterest | coming soon | homepage network table |
| Networks: Reddit | coming soon | homepage network table |

---

## Sibling check

- `/instagram-api` page checked: already correctly says "Instagram publishing isn't live on our API yet." No correction needed.
- Briefs (Product Hunt, AlternativeTo, SaaSHub) all omitted Instagram/YouTube/TikTok intentionally — no correction needed.
- `truth-checks.json` seeded with 6 mechanical rules: free plan limits (2 rules), idempotency (1 rule), and "Instagram/YouTube/TikTok not live" (3 rules). All rules pass on current repo + health fingerprint.

---

## Rendered check

Page body text read from health fingerprint with `--keep-text`. Network table extracted and verified. The /instagram-api page text confirmed via health fingerprint. No headless browser available; noted as degraded check.

---

## Remaining items

- The `/instagram-api` page title is "Instagram Posting API (2026): Requirements, Limits" — accurate for a guide page, but no disclaimer in the title that Instagram is not live on SocialsForAI yet. Owner may wish to update the meta description to clarify this. Logged in NY-8.
