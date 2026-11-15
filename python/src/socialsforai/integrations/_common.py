from __future__ import annotations

import json
from typing import Any, Iterable

from .._client import SocialsForAI
from ..tools import TOOLS


def pick(names: Iterable[str] | None, include_destructive: bool) -> list[dict[str, Any]]:
    """The tool specs to expose: all, or the named ones. Destructive tools (delete_post) need opting in."""
    wanted = set(names) if names is not None else None
    out = [t for t in TOOLS if (wanted is None or t["name"] in wanted) and (include_destructive or not t.get("destructive") or (wanted is not None and t["name"] in wanted))]
    if wanted is not None:
        missing = wanted - {t["name"] for t in TOOLS}
        if missing:
            raise ValueError(f"Unknown tools: {', '.join(sorted(missing))}. Available: {', '.join(t['name'] for t in TOOLS)}.")
    return out


def client_or_default(client: SocialsForAI | None) -> SocialsForAI:
    return client or SocialsForAI()


def as_text(result: dict[str, Any]) -> str:
    return json.dumps(result, ensure_ascii=False)
