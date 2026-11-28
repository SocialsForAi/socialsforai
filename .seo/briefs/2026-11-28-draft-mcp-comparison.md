# Draft page: social media MCP servers compared (2026-11-28)

Not published. The website repo is not visible to this worker, so this is a ready-to-paste draft. Owner URL proposal: `/mcp/compare` (or a section on `/mcp`; the `/mcp` page already owns "MCP server for social media", so a second page must serve a distinct intent: choosing between servers).

**Demand evidence (dated):** distribution eval handoff 2026-11-26, 0 of 24 agent runs retrieved any SocialsForAI page for (1) "MCP server post schedule LinkedIn Bluesky Threads social media" (agents read Buffer MCP, mcpservers.org, Postiz) and (4) "Buffer vs Postiz vs Late vs Ayrshare MCP server" (agents read buffer.com/mcp, developers.buffer.com). Two of the four open agent queries; one page serves both.

**Information gain (one sentence):** a comparison where every price is computed by the live `GET /v1/pricing` endpoint and every network claim by `GET /v1/platforms`, with the cases where we lose stated.

**Page title:** Social media MCP servers compared: SocialsForAI, Buffer, Postiz, Late, Ayrshare
**Meta description:** How the social media MCP servers differ: connect flow, networks live today, approval gates and price for 3, 10 and 36 accounts. Threads is in review with us.

## Short answer (top of page, extractable)
SocialsForAI is a hosted MCP server at `https://socialsforai.com/api/mcp` (Streamable HTTP, OAuth sign-in). Live today: X, Bluesky, LinkedIn, Mastodon, Telegram, Discord, Slack, Nostr (8 of 16 on the roadmap; Threads, Instagram, Facebook, TikTok and YouTube are in review, so a Threads post is not possible yet; confirm the list at `/v1/platforms` before publishing). Free covers 3 active accounts and 100 posts a month. Pro is $10 a month for 10 active accounts, then $1 per extra active account. It is the only paid plan.

## Table (fill every cell from a dated source; cells marked VERIFY are not yet checked)
| | SocialsForAI | Buffer | Postiz | Late (Zernio) | Ayrshare |
|---|---|---|---|---|---|
| Hosted MCP URL | `socialsforai.com/api/mcp`, OAuth | VERIFY (buffer.com/mcp returned a bot challenge to this worker, 2026-11-28) | VERIFY (docs.postiz.com/mcp returned 405 to a plain GET) | VERIFY | VERIFY |
| Threads | in review, not live | VERIFY | VERIFY | VERIFY | VERIFY |
| Dry run before publish | yes | VERIFY | VERIFY | VERIFY | VERIFY |
| Human approval gate | yes (`approval: "required"`, approver opens a URL) | VERIFY | VERIFY | VERIFY | VERIFY |
| Scoped sub-agent keys | yes (per account, per scope, daily post limit) | VERIFY | VERIFY | VERIFY | VERIFY |
| Cost for 3 accounts / 10 / 36 | $0 / $10 / $36 | VERIFY | pricing.md 2026-11-19: $29 Standard for 2 and 5 accounts, $99 Ultimate for 36 | pricing.md: $0 for 2, $18 for 5, $126 for 36 | pricing.md: $149 Premium for 2 and 5, $599 Business for 36 |

The Postiz, Zernio and Ayrshare prices above are the 2026-11-19 snapshot in `pricing.md`; re-read each pricing page before publishing. Do not cite Buffer, Late or any MCP-specific claim until a dated source is attached.

## Three honest tradeoffs (required)
1. Threads, Instagram, Facebook, TikTok and YouTube are in review with us. A team that must post to Threads today needs a service that has it live.
2. At large account counts a flat or per-profile price can beat our per-account price: `pricing.md` shows Upload-Post at $85 against our $160 for 40 clients x 4 networks. (Add Upload-Post as a column if the page covers cost.)
3. We are a young product with a small footprint; Buffer and Postiz have far larger user bases, self-hosting (Postiz) and visual calendars. We are API- and agent-first, not a scheduling UI.

## Sections
1. Short answer (above).
2. How an agent connects to each (one code block per server; ours: add the URL, sign in with OAuth, then a person approves each social account through a connect link).
3. What each server lets an agent do without a human (dry run, approvals, scoped keys, idempotency key on retry).
4. Price for the same setup (embed `GET /v1/pricing?accounts=36`; link `/pricing.md`).
5. Who should pick which (three tradeoffs above, then "pick us when ...").
6. FAQ: "Does it support Threads?" (not yet, in review); "Can the agent connect accounts by itself?" (no, a person approves each); "Can the agent pay?" (no, it requests an upgrade link and a human pays through Stripe Checkout).

## Links required
Inbound: `/mcp`, `/vs/postiz`, `/vs/ayrshare`, `/pricing`, homepage footer. Outbound: `/mcp`, `/pricing.md`, `/v1/platforms`, `/vs/postiz`, `/vs/ayrshare`.

## Schema
`WebPage` + `FAQPage` only. No `AggregateRating`, no review markup.

## Gates before publish
- Every VERIFY cell replaced with a dated, linked source or the row deleted.
- Re-run `GET /v1/platforms` and `/v1/pricing` the day of publishing.
- Do not publish before NY-19 (the /vs/ayrshare price fix) is applied, so the two pages agree.
- Not rendered or built here; unchecked.

## Not covered (the other two agent queries)
- "Ayrshare pricing Business plan ...": fix `/vs/ayrshare` first (NY-19 brief).
- "cheapest ... API for agencies multi-profile pricing": pricing.md already has the 12 clients x 3 networks row ($36 Pro vs $49 Upload-Post). Next step is to check that page is fetched, then add a short `/pricing/agencies` page; we lose at 40 clients x 4 networks, so say so.
