# Brand — SocialsForAI

_Written 2026-11-18. Inferred from README.md, AGENTS.md, skills/socialsforai/SKILL.md, sdk/package.json, python/pyproject.toml. Fields marked `inferred — unconfirmed` need owner review (see NY-2 in needs-you.md)._

---

## Positioning

> We are a **social media posting API and MCP server** for **AI agent developers and app builders** who need to publish to social networks programmatically without custom per-network integrations.
> We win because **one request covers all accounts, the agent never touches credentials, every post gets an idempotency key so a retry never duplicates, and every error carries a machine-readable `fix` field that tells the agent exactly what to do next.**
> We are **not** for social media managers who want a visual dashboard; businesses whose posting workflow does not involve code or AI agents.

Rule 3 from foundation.md applied: positioning derived from README and SKILL.md, marked `inferred — unconfirmed` until the owner confirms. See NY-2.

---

## Product one-liner

One API and MCP server to post to every social platform from AI agents. (19 words — inferred from site tagline)

---

## Primary persona

**AI agent developer** — writes or orchestrates AI agents (using Claude, GPT-4, Cursor, LangChain, CrewAI, or similar) and needs those agents to publish content to social networks as part of an automated workflow.

Secondary persona: **SaaS / app builder** integrating social posting into a product that is itself built on AI.

Company size: B2B, all sizes. The free tier supports solo developers; paid plans support production apps with many accounts.

---

## Concrete differentiators

1. **Agent-first error design.** Every error carries `code`, `message`, and `fix`. The agent reads `fix` and acts — no human debugging required for routine errors like `text_too_long`, `account_needs_reauth`, or `rate_limited`.
2. **Built-in idempotency.** Pass the same idempotency key to retry; the API never publishes twice. Critical for agentic retry loops.
3. **No credential handling.** The agent issues a connect link; the account owner approves through the network's own OAuth screen. The agent never sees a password or token.
4. **Scoped sub-agent keys.** A coordinating agent can mint a child key with per-account limits, approval requirements, and daily post caps — isolation without custom middleware.
5. **Approval workflow.** An agent can submit a post for human approval, wait for the decision, and read rejection feedback — all via API.

---

## Competitors

| Name | Domain | Tier | Note |
|---|---|---|---|
| Postiz | postiz.com | head | Open-source scheduler; has API; the most common comparison |
| Ayrshare | ayrshare.com | head | Established social API; the main enterprise alternative |
| Post Bridge | postbridge.io | mid | Simple multi-platform posting API |
| Blotato | blotato.com | mid | Buffer-like; recently added API |
| Upload Post | uploadpost.com | mid | Direct comparison on /vs/ |
| Zernio | zernio.com | niche | Direct comparison on /vs/ |

---

## Brand voice

Derived from README.md and SKILL.md close-reads. `inferred — unconfirmed`.

Tags: **technical, direct, error-first, founder-to-developer** — writes like an experienced engineer explaining an API to a peer who reads code faster than prose. No hype words ("revolutionary", "seamless", "game-changing"). Sentence rhythm: short declarative statements, then one longer clause that earns its length. Code examples are canonical; prose is commentary on the code, not the other way around.

Forbidden words: "seamless," "powerful," "robust," "leverage," "synergy," "game-changing," "revolutionary," "world-class," "best-in-class."

---

## Author / byline

Codehorts LLC / Lee Shadle (inferred from pyproject.toml and git config). Developer-founder. The credential is "built this, uses this, runs the support queue" — not a media byline.

---

## Free tier

Yes. 3 active accounts, 100 posts/month. No credit card required for signup.

Plans above free: hobby, pro, growth, scale. Pricing at https://socialsforai.com/pricing. Agents can generate an upgrade link via API (`POST /v1/upgrade-links`).

---

## Anti-positioning

- Not a social media management dashboard (no post composer UI)
- Not a content calendar tool for marketers
- Not Hootsuite, Buffer, or Sprout Social
- Explicitly not for teams that do not use AI agents or programmatic posting

---

## Proprietary data

None documented yet. `inferred — unconfirmed`. First-party metrics (posts sent, error rates by platform, latency) are in the product database but not published. If aggregate stats are ever published, they would be a strong information-gain moat ("X% of LinkedIn posts from agents fail on the first attempt because of Y"). See NY-2 for follow-up.

---

## Forbidden claims

- Do not claim specific uptime SLAs without a source (not in README or SKILL.md)
- Do not claim support for a network not listed in `/v1/platforms` — the SKILL.md explicitly says to call that endpoint rather than assuming. Networks listed as of 2026-11-18 (from SKILL.md): X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, Nostr, plus sandbox. YouTube and TikTok appear in SDK keywords but should be verified via `/v1/platforms` before citing.
- Do not claim enterprise compliance certifications (SOC 2, GDPR compliance) without a dated source
