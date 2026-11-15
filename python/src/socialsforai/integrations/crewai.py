"""CrewAI tools.

    from socialsforai.integrations.crewai import socials_tools
    agent = Agent(role="Social media manager", tools=socials_tools(), ...)
"""

from __future__ import annotations

from typing import Any, Iterable

from .._client import SocialsForAI
from ..tools import run_tool
from ._common import as_text, client_or_default, pick


def _model_for(spec: dict[str, Any]):
    """A pydantic model for the tool's input (CrewAI validates arguments with it)."""
    from pydantic import ConfigDict, Field, create_model

    types = {"string": str, "integer": int, "boolean": bool, "array": list, "object": dict}
    props = spec["input"].get("properties", {})
    required = set(spec["input"].get("required", []))
    fields = {}
    for name, p in props.items():
        t = types.get(p.get("type"), Any)
        fields[name] = (t, Field(... if name in required else None, description=p.get("description", "")))
    return create_model(f"{spec['name']}_input", __config__=ConfigDict(extra="allow"), **fields)


def socials_tools(client: SocialsForAI | None = None, *, tools: Iterable[str] | None = None, include_destructive: bool = False) -> list:
    try:
        from crewai.tools import BaseTool
    except ImportError as e:  # pragma: no cover
        raise ImportError("Install CrewAI first: pip install crewai") from e
    c = client_or_default(client)
    out = []
    for spec in pick(tools, include_destructive):

        class SocialsTool(BaseTool):
            name: str = spec["name"]
            description: str = spec["description"]
            args_schema: type = _model_for(spec)

            def _run(self, **kwargs) -> str:
                return as_text(run_tool(c, self.name, {k: v for k, v in kwargs.items() if v is not None}))

        out.append(SocialsTool())
    return out
