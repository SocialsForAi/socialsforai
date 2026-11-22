# Brief: Indie Hackers products — https://www.indiehackers.com/products

**Finding id:** OFF-006  
**Tier:** 2 (get added where absent — founder/builder product directory)  
**Relationship:** none — open submission; founder submits as maker  
**Contact:** log in at indiehackers.com → Products → Add a product  
**Effort for recipient:** ~10 minutes  

---

## Current state

SocialsForAI is not listed on Indie Hackers. Indie Hackers is a founder and indie developer community (domain rating ~72) with a product directory where builders list what they have shipped. The audience — developers building products and AI tools — is a direct persona match for SocialsForAI: AI agent developers who need programmatic social posting. Ayrshare (a direct competitor) is listed on Indie Hackers; SocialsForAI is absent.

---

## Action

Submit a new product listing at **https://www.indiehackers.com/products** using the exact fields below. Requires an Indie Hackers account in the maker's name (Lee Shadle / Codehorts LLC) for credibility. Create one at indiehackers.com if needed.

---

## Listing fields — exact text to enter

**Product name:**
```
SocialsForAI
```

**Website:**
```
https://socialsforai.com
```

**Tagline (one line, ~100 characters):**
```
Social media posting API and MCP server for AI agents
```

**What is it? / Description:**
```
SocialsForAI is an API and MCP server for AI agents that need to publish to social
networks as part of an automated workflow.

An agent sends one request with a list of accounts and content. It gets back a result
per account: success with the post URL, or a machine-readable error that includes a
fix field the agent can act on without human debugging.

Supports X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, and Nostr.
The agent never touches OAuth credentials — the account owner approves through each
network's own login screen.

What makes it different from a social media scheduler:
- No dashboard. It is a pure API and MCP server — built for code, not for social
  media managers.
- Idempotent posting: same idempotency key → no duplicate posts, so agent retry
  loops are safe.
- Approval workflow: an agent proposes a post; a human approves or rejects via a URL
  with no login required.
- Sub-agent keys: a coordinating agent can mint a child key with per-account limits,
  approval requirements, and daily post caps.
- MCP server at https://socialsforai.com/api/mcp — connect from Claude Desktop,
  Cursor, or any MCP client.

Free tier: 3 accounts, 100 posts per month. No credit card required.
```

**Revenue (Indie Hackers convention — optional but recommended):**

Enter actual MRR if you are comfortable publishing it, or leave as "pre-revenue" if the product is not yet monetized. Do not enter a number this brief has not verified. The brief does not know the current MRR — the owner fills this in.

**Maker / team member:** add your Indie Hackers username as the maker (required for the listing to be active)

---

## Why this listing is accurate

All claims verified against `.seo/truth.md` (last updated 2026-11-19):

| Claim in listing | Verified source |
|---|---|
| Networks: X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, Nostr | SKILL.md §2; homepage network table (live as of 2026-11-19) |
| Agents never see OAuth credentials | SKILL.md §2 |
| Machine-readable error with fix field | SKILL.md error-schema documentation |
| Idempotent posting | SKILL.md §3 |
| Approval workflow via URL | SKILL.md §4 |
| Sub-agent keys with per-account limits | SKILL.md §6 |
| MCP server at https://socialsforai.com/api/mcp | README.md |
| Free tier: 3 accounts, 100 posts/mo | SKILL.md §7 |

Instagram, TikTok, YouTube, Facebook, and Threads are intentionally omitted — all are "in review" per truth.md and not yet live.

---

## Expected outcome

- One dofollow backlink from indiehackers.com (DR ~72)
- Product visible in the IH product directory and search — primary audience (developer founders building AI agents) is the exact SocialsForAI persona
- Potential organic mentions in IH community threads (e.g. "what do you use to auto-post from your AI agent?") and in IH curated newsletters
- Competitor Ayrshare is already listed — SocialsForAI's absence is a gap
- Recheck: 30 days after submission to confirm listing is live; reply "sent OFF-006" and the next run logs the send date and schedules the recheck
