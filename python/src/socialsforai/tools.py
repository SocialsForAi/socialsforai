"""Agent tools, independent of any framework: the definitions (name, description, JSON Schema) and
one function that runs them. The framework adapters in socialsforai.integrations wrap these.

    from socialsforai import SocialsForAI
    from socialsforai.tools import TOOLS, run_tool
    result = run_tool(SocialsForAI(), "create_post", {"accounts": ["linkedin"], "text": "Hi", "dry_run": True})

Errors come back as {"error": {"code", "message", "fix", ...}} instead of being raised, so the model
can read the fix and act on it.
"""

from __future__ import annotations

import json
import uuid
from importlib import resources
from typing import Any

from ._client import SocialsError, SocialsForAI, _query, _quote

_SPEC = json.loads(resources.files(__package__).joinpath("tools.json").read_text())
#: Every tool: {"name", "description", "input" (JSON Schema), "request", "readOnly"?, "destructive"?}.
TOOLS: list[dict[str, Any]] = _SPEC["tools"]
_BY_NAME = {t["name"]: t for t in TOOLS}


def tool_names(read_only: bool = False, include_destructive: bool = True) -> list[str]:
    return [t["name"] for t in TOOLS if (not read_only or t.get("readOnly")) and (include_destructive or not t.get("destructive"))]


def run_tool(client: SocialsForAI, name: str, args: dict[str, Any] | None = None) -> dict[str, Any]:
    """Run one tool with the model's arguments and return the API's JSON (or its error)."""
    spec = _BY_NAME.get(name)
    if not spec:
        return {"error": {"code": "unknown_tool", "message": f"No tool named {name}."}}
    args = dict(args or {})
    req = spec["request"]
    path = req["path"]
    for key in [k[1:-1] for k in path.split("/") if k.startswith("{")]:
        if key not in args:
            return {"error": {"code": "missing_argument", "message": f"{name} needs {key}."}}
        path = path.replace("{" + key + "}", _quote(args.pop(key)))
    query = {k: args.pop(k) for k in req.get("query", []) if k in args}
    body: Any = None
    if req.get("body") == "*":
        body = {**req.get("defaults", {}), **args}
    elif req.get("body"):
        body = {k: args[k] for k in req["body"] if k in args}
    headers = None
    if req.get("idempotency") and not (body or {}).get("dry_run"):
        headers = {"Idempotency-Key": (body or {}).pop("idempotency_key", None) or str(uuid.uuid4())}
    try:
        out = client.request(req["method"], path + _query(query), body=body, headers=headers, auth=name != "list_platforms")
        return out if isinstance(out, dict) else {"result": out}
    except SocialsError as e:
        return e.to_dict()
