"""The framework adapters, checked against the real libraries (skipped when one isn't installed)."""

import asyncio
import json

import pytest

from socialsforai import SocialsForAI


def setup_routes(api):
    api.routes["POST /v1/posts"] = lambda r: (200, {"object": "preflight", "ok": True, "issues": [], "echo": r["json"]})
    api.routes["GET /v1/accounts"] = lambda r: (200, {"object": "list", "data": [{"id": "acc_1", "platform": "x"}]})
    api.routes["GET /v1/posts/post_1"] = lambda r: (404, {"error": {"code": "not_found", "message": "No post post_1.", "fix": "List posts first."}})
    return SocialsForAI("sk_test", base_url=api.base)


def test_langchain(api):
    pytest.importorskip("langchain_core")
    from socialsforai.integrations.langchain import socials_tools

    tools = socials_tools(setup_routes(api))
    by = {t.name: t for t in tools}
    assert "delete_post" not in by  # destructive tools need opting in
    assert set(by) >= {"create_post", "list_accounts", "list_replies"}
    out = json.loads(by["create_post"].invoke({"accounts": ["acc_1"], "text": "hi", "dry_run": True}))
    assert out["ok"] is True and out["echo"]["text"] == "hi"
    assert json.loads(by["list_accounts"].invoke({}))["data"][0]["id"] == "acc_1"
    assert json.loads(by["get_post"].invoke({"id": "post_1"}))["error"]["fix"] == "List posts first."
    assert by["create_post"].args["accounts"]["type"] == "array"
    assert [t.name for t in socials_tools(setup_routes(api), tools=["delete_post"])] == ["delete_post"]
    with pytest.raises(ValueError):
        socials_tools(setup_routes(api), tools=["nope"])


def test_openai_agents(api):
    pytest.importorskip("agents")
    from socialsforai.integrations.openai_agents import socials_tools

    tools = socials_tools(setup_routes(api))
    by = {t.name: t for t in tools}
    assert by["create_post"].params_json_schema["required"] == ["accounts"]
    out = asyncio.run(by["create_post"].on_invoke_tool(None, json.dumps({"accounts": ["acc_1"], "text": "hi", "dry_run": True})))
    assert json.loads(out)["ok"] is True


def test_crewai(api):
    pytest.importorskip("crewai")
    from socialsforai.integrations.crewai import socials_tools

    tools = socials_tools(setup_routes(api))
    by = {t.name: t for t in tools}
    out = json.loads(by["create_post"].run(accounts=["acc_1"], text="hi", dry_run=True))
    assert out["ok"] is True and out["echo"] == {"wait": True, "accounts": ["acc_1"], "text": "hi", "dry_run": True}
    assert json.loads(by["list_accounts"].run())["data"][0]["id"] == "acc_1"
