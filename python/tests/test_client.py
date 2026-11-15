import hashlib
import hmac
import time

import pytest

from socialsforai import SocialsError, SocialsForAI, verify_webhook
from socialsforai.tools import TOOLS, run_tool


def client(api, **kw):
    return SocialsForAI("sk_test", base_url=api.base, **kw)


def test_sends_key_and_parses(api):
    api.routes["GET /v1/usage"] = lambda r: (200, {"object": "usage", "posts": 3}, {"RateLimit-Limit": "300", "RateLimit-Remaining": "299", "RateLimit-Reset": "60"})
    c = client(api)
    assert c.usage()["posts"] == 3
    assert api.seen[0]["headers"]["authorization"] == "Bearer sk_test"
    assert api.seen[0]["headers"]["user-agent"].startswith("socialsforai-sdk-python/")
    assert c.rate_limit == {"limit": 300, "remaining": 299, "reset": 60}


def test_errors_carry_code_fix_and_issues(api):
    api.routes["POST /v1/posts"] = lambda r: (422, {"error": {"code": "preflight_failed", "message": "Nope.", "fix": "Fix it.", "issues": [{"code": "text_too_long"}], "request_id": "req_1"}})
    with pytest.raises(SocialsError) as e:
        client(api).posts.create(["acc_1"], "x" * 400)
    assert (e.value.status, e.value.code, e.value.fix, e.value.request_id) == (422, "preflight_failed", "Fix it.", "req_1")
    assert e.value.issues[0]["code"] == "text_too_long"
    assert e.value.to_dict()["error"]["fix"] == "Fix it."


def test_retries_rate_limits_and_5xx_with_the_same_idempotency_key(api):
    calls = []

    def flaky(r):
        calls.append(r)
        return (429, {"error": {"code": "rate_limited", "message": "slow"}}, {"Retry-After": "0"}) if len(calls) < 3 else (201, {"id": "post_1"})

    api.routes["POST /v1/posts"] = flaky
    assert client(api).posts.create(["acc_1"], "hi")["id"] == "post_1"
    keys = {c["headers"]["idempotency-key"] for c in calls}
    assert len(calls) == 3 and len(keys) == 1
    api.routes["GET /v1/usage"] = lambda r: (400, {"error": {"code": "bad", "message": "no"}})
    with pytest.raises(SocialsError):
        client(api).usage()
    assert sum(1 for s in api.seen if s["path"] == "/v1/usage") == 1  # 4xx isn't retried


def test_dry_runs_get_no_key_and_fields_pass_through(api):
    api.routes["POST /v1/posts"] = lambda r: (200, {"object": "preflight", "ok": True})
    client(api).posts.create(["acc_1"], "hi", dry_run=True, auto_thread=True, scheduled_at="best", repeat={"every": "week", "count": 4})
    s = api.seen[-1]
    assert "idempotency-key" not in s["headers"]
    assert s["json"] == {"accounts": ["acc_1"], "text": "hi", "dry_run": True, "auto_thread": True, "scheduled_at": "best", "repeat": {"every": "week", "count": 4}}


def test_signup_without_a_key_then_uses_it(api):
    api.routes["POST /v1/workspaces"] = lambda r: (201, {"id": "ws_1", "api_key": "sk_new"})
    api.routes["GET /v1/workspace"] = lambda r: (200, {"id": "ws_1"})
    c = SocialsForAI(base_url=api.base)
    c.api_key = None
    with pytest.raises(SocialsError) as e:
        c.usage()
    assert e.value.code == "missing_api_key"
    c.workspaces.create(name="agent")
    assert "authorization" not in api.seen[0]["headers"]
    c.workspace.get()
    assert api.seen[-1]["headers"]["authorization"] == "Bearer sk_new"


def test_queries_events_replies_delete_series_and_batch(api):
    api.routes["GET /v1/events"] = lambda r: (200, {"object": "list", "data": [], "last_id": "evt_2"})
    api.routes["GET /v1/posts/post_1/replies"] = lambda r: (200, {"total": 0, "targets": []})
    api.routes["DELETE /v1/posts/post_1"] = lambda r: (200, {"id": "post_1", "series_canceled": 3})
    api.routes["POST /v1/posts/batch"] = lambda r: (200, {"object": "batch", "succeeded": 2})
    c = client(api)
    c.events.list(after="evt_1", types=["post.failed", "post.published"], wait_seconds=30)
    assert api.seen[-1]["query"] == {"after": "evt_1", "types": "post.failed,post.published", "wait": "30"}
    c.posts.replies("post_1")
    assert c.posts.delete("post_1", series=True)["series_canceled"] == 3
    assert api.seen[-1]["query"] == {"series": "true"}
    c.posts.create_many([{"accounts": ["a"], "text": "1"}, {"accounts": ["a"], "text": "2"}])
    assert api.seen[-1]["headers"]["idempotency-key"]
    assert len(api.seen[-1]["json"]["posts"]) == 2


def test_network_errors_are_reported(api):
    c = SocialsForAI("sk", base_url="http://127.0.0.1:9", max_retries=0, timeout=2)
    with pytest.raises(SocialsError) as e:
        c.usage()
    assert e.value.code == "network_error"


def test_verify_webhook():
    body = '{"type":"post.published"}'
    t = int(time.time())
    sig = hmac.new(b"whsec_x", f"{t}.{body}".encode(), hashlib.sha256).hexdigest()
    assert verify_webhook("whsec_x", f"t={t},v1={sig}", body)
    assert not verify_webhook("whsec_x", f"t={t},v1={sig}", body + " ")
    assert not verify_webhook("whsec_x", f"t={t - 1000},v1={sig}", body)
    assert not verify_webhook("whsec_x", None, body)


def test_run_tool_maps_paths_queries_bodies_and_returns_errors(api):
    api.routes["GET /v1/posts/post_9"] = lambda r: (200, {"id": "post_9"})
    api.routes["DELETE /v1/posts/post_9"] = lambda r: (200, {"id": "post_9"})
    api.routes["POST /v1/posts"] = lambda r: (422, {"error": {"code": "preflight_failed", "message": "Too long.", "fix": "Shorten it."}})
    api.routes["GET /v1/platforms"] = lambda r: (200, {"data": [{"id": "x"}]})
    c = client(api)
    assert run_tool(c, "get_post", {"id": "post_9"}) == {"id": "post_9"}
    run_tool(c, "delete_post", {"id": "post_9", "accounts": ["acc_1", "acc_2"], "series": True})
    assert api.seen[-1]["query"] == {"accounts": "acc_1,acc_2", "series": "true"}
    out = run_tool(c, "create_post", {"accounts": ["acc_1"], "text": "hi"})
    assert out["error"]["fix"] == "Shorten it."
    assert api.seen[-1]["json"] == {"wait": True, "accounts": ["acc_1"], "text": "hi"}
    assert api.seen[-1]["headers"]["idempotency-key"]
    assert run_tool(c, "list_platforms", {})["data"][0]["id"] == "x"
    assert "authorization" not in api.seen[-1]["headers"]
    assert run_tool(c, "get_post", {})["error"]["code"] == "missing_argument"
    assert run_tool(c, "nope", {})["error"]["code"] == "unknown_tool"
    assert {t["name"] for t in TOOLS} >= {"create_post", "list_replies", "list_events", "create_posts"}
