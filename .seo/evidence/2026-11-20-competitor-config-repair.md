# Evidence: competitor config repair — 2026-11-20

**Action:** repair  
**Target:** `.seo/config.json` competitors array  
**Run:** 2026-11-20-0912

## Before

All 7 (originally 6) competitors had `sitemap_url: null`. The competitor delta panel (`competitor_diff.py`) requires a sitemap URL to fingerprint each competitor's pages; with all null, the panel was disabled and no competitive intelligence was available.

Additionally, `social-api.ai` was identified on the demand radar (2026-11-19) as a direct competitor ("Unified Social Media API for AI Agents & Developers — 75+ tools, OAuth 2.1, inbox access") but was not in `config.competitors`.

## Verification method

For each competitor domain, fetched `https://<domain>/robots.txt` via curl and extracted the `Sitemap:` directive. Fallback: direct HTTP HEAD against `<domain>/sitemap.xml` and `<domain>/sitemap_index.xml`. All 7 returned valid sitemap URLs.

## After

| Competitor | Domain | Sitemap URL | Baseline pages | Violations |
|---|---|---|---|---|
| Postiz | postiz.com | https://postiz.com/sitemap.xml | 30 | 0 |
| Ayrshare | ayrshare.com | https://www.ayrshare.com/sitemap.xml | 30 | 10 |
| Post Bridge | postbridge.io | https://postbridge.io/sitemap.xml | 30 | 1 |
| Blotato | blotato.com | https://www.blotato.com/sitemap-index.xml | 30 | 1 |
| Upload Post | uploadpost.com | https://www.upload-post.com/sitemap.xml | 30 | 0 |
| Zernio | zernio.com | https://zernio.com/sitemap.xml | 30 | 4 |
| Social API AI (new) | social-api.ai | https://social-api.ai/sitemap.xml | 30 | 4 |

## Gates

- config.json valid JSON: ✅ (python3 -c "import json; json.load(open('.seo/config.json'))" exits 0)
- All 7 competitors have non-null sitemap_url: ✅
- 7 baseline fingerprints written to `.seo/competitors/<host>/2026-11-20.json`: ✅
- Largest fingerprint file: well under 20 MB limit: ✅
- Build/type check: not applicable (only .seo/ JSON/Markdown changed): ✅
- competitor_diff.py: not applicable on first baseline (needs 2+ fingerprints to diff): ✅

## Notes

- `upload-post.com` stores competitor files under `upload-post.com/` not `uploadpost.com/` (following the actual hostname after redirect).
- Ayrshare's `robots.txt` does not declare a `Sitemap:` directive; `www.ayrshare.com/sitemap.xml` returns HTTP 200.
- social-api.ai homepage is 1.2 MB HTML — heavy-html violation noted; not an action item.
- Competitor delta panel cadence: 168h (weekly). First diff will run on or after 2026-11-27.
