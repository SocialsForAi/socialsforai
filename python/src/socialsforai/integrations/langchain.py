"""LangChain tools (also usable from LangGraph).

    from socialsforai.integrations.langchain import socials_tools
    tools = socials_tools()            # reads SOCIALSFORAI_API_KEY
    agent = create_react_agent(model, tools)
"""

from __future__ import annotations

from typing import Iterable

from .._client import SocialsForAI
from ..tools import run_tool
from ._common import as_text, client_or_default, pick


def socials_tools(client: SocialsForAI | None = None, *, tools: Iterable[str] | None = None, include_destructive: bool = False) -> list:
    try:
        from langchain_core.tools import StructuredTool
    except ImportError as e:  # pragma: no cover
        raise ImportError("Install LangChain first: pip install langchain-core") from e
    c = client_or_default(client)
    out = []
    for spec in pick(tools, include_destructive):

        def call(_name: str = spec["name"], **kwargs) -> str:
            return as_text(run_tool(c, _name, kwargs))

        out.append(StructuredTool.from_function(func=call, name=spec["name"], description=spec["description"], args_schema=spec["input"]))
    return out
