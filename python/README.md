# socialsforai

Python client and agent tools for [SocialsForAI](https://socialsforai.com): one API to publish, schedule and measure posts on X, LinkedIn, Bluesky, Mastodon, Telegram, Discord, Slack, Nostr and more, built for AI agents.

- No dependencies. Python 3.9+.
- Safe retries: rate limits, server errors and network errors are retried, and every post gets an idempotency key, so a retry never publishes twice.
- Every error has a stable `code` and a `fix` that says what to do next.
- Ready-made tools for LangChain, CrewAI and the OpenAI Agents SDK.

```bash
pip install socialsforai
```

## Quickstart

```python
from socialsforai import SocialsForAI

socials = SocialsForAI()  # reads SOCIALSFORAI_API_KEY

# No key yet? An agent can sign itself up:
# socials.workspaces.create(name="My agent", email="owner@example.com")

# Connect accounts: send this link to the account owner.
link = socials.connect_links.create(platforms=["x", "linkedin", "bluesky"])
print(link["url"])
socials.connect_links.wait_for(link["id"])

# Check, then publish. One result per account.
check = socials.posts.create(["linkedin", "bluesky"], "We just shipped webhooks.", dry_run=True)
print(check["ok"], check["issues"])
post = socials.posts.create(["linkedin", "bluesky"], "We just shipped webhooks.", wait=True)
for t in post["targets"]:
    print(t["platform"], t["status"], t["url"])
```

Any API field works as a keyword on `posts.create`: `media`, `link`, `thread`, `auto_thread=True` (split long text into a thread), `scheduled_at="best"`, `timezone`, `repeat={"every": "week", "count": 4}`, `approval="required"`, `platform_options`, `reply_to` and `reply_to_comment`. The full list is in the [agent guide](https://socialsforai.com/llms.txt).

| Group | Methods |
| --- | --- |
| Posts | `posts.create`, `posts.create_many` (up to 50), `posts.list`, `posts.get`, `posts.update`, `posts.delete`, `posts.metrics`, `posts.replies`, `posts.wait_for_approval` |
| Accounts | `accounts.list`, `accounts.get`, `accounts.connect`, `accounts.disconnect`, `connect_links.create`, `connect_links.get`, `connect_links.wait_for` |
| Media | `media.upload` (≤4 MB), `media.upload_file` (any size) |
| Events | `events.list` (what happened since an event id; for when you can't receive webhooks) |
| Workspace | `workspaces.create`, `workspace.get`, `workspace.set_owner_email`, `usage()`, `analytics()`, `platforms()`, `health()`, `upgrade_link(plan)` |
| Admin | `keys.list/create/revoke`, `webhooks.list/create/delete`, `verify_webhook(secret, header, raw_body)` |

## Agent tools

The same tools work in each framework: `list_accounts`, `list_platforms`, `create_connect_link`, `create_post`, `create_posts`, `get_post`, `list_posts`, `get_post_metrics`, `list_replies`, `list_events`, and `delete_post`. `delete_post` is off unless you pass `include_destructive=True`. Errors come back to the model as `{"error": {"code", "message", "fix"}}` so it can act on the fix.

**LangChain / LangGraph** (`pip install "socialsforai[langchain]"`)

```python
from langgraph.prebuilt import create_react_agent
from socialsforai.integrations.langchain import socials_tools

agent = create_react_agent(model, socials_tools())
```

**CrewAI** (`pip install "socialsforai[crewai]"`)

```python
from crewai import Agent
from socialsforai.integrations.crewai import socials_tools

manager = Agent(role="Social media manager", goal="Publish our launch", backstory="...", tools=socials_tools())
```

**OpenAI Agents SDK** (`pip install "socialsforai[openai-agents]"`)

```python
from agents import Agent
from socialsforai.integrations.openai_agents import socials_tools

agent = Agent(name="Social media", instructions="Dry-run before publishing.", tools=socials_tools())
```

**Anything else:** `socialsforai.tools.TOOLS` has each tool's name, description and JSON Schema, and `run_tool(client, name, args)` runs one.

Limit what an agent can do with `socials_tools(tools=["list_accounts", "create_post"])`, or give it a scoped key: `socials.keys.create(name="drafts", scopes=["posts:write"], require_approval=True)`.

## Links

- Docs: https://socialsforai.com/docs
- MCP server: https://socialsforai.com/api/mcp
- JavaScript SDK: `npm install @socialsforai/sdk`
