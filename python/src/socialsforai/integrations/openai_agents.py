"""Tools for the OpenAI Agents SDK.

    from agents import Agent
    from socialsforai.integrations.openai_agents import socials_tools
    agent = Agent(name="Social media", tools=socials_tools())
"""

from __future__ import annotations

import json
from typing import Iterable

from .._client import SocialsForAI
from ..tools import run_tool
from ._common import as_text, client_or_default, pick


def socials_tools(client: SocialsForAI | None = None, *, tools: Iterable[str] | None = None, include_destructive: bool = False) -> list:
    try:
        from agents import FunctionTool
    except ImportError as e:  # pragma: no cover
        raise ImportError("Install the OpenAI Agents SDK first: pip install openai-agents") from e
    c = client_or_default(client)
    out = []
    for spec in pick(tools, include_destructive):

        async def invoke(_ctx, raw: str, _name: str = spec["name"]) -> str:
            import asyncio

            args = json.loads(raw or "{}")
            return as_text(await asyncio.to_thread(run_tool, c, _name, args))

        # Our schemas have optional fields, so strict mode (which requires every field) is off.
        out.append(FunctionTool(name=spec["name"], description=spec["description"], params_json_schema=spec["input"], on_invoke_tool=invoke, strict_json_schema=False))
    return out
