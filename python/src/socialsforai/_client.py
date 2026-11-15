"""The HTTP client. Standard library only, so it installs anywhere an agent runs."""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import time
import uuid
from typing import Any, Mapping
from urllib import error as urlerror
from urllib import parse, request

DEFAULT_BASE_URL = "https://socialsforai.com"
VERSION = "0.1.0"


class SocialsError(Exception):
    """An error the API returned. `code` is stable, `fix` says what to do, `issues` lists failed checks."""

    def __init__(self, status: int, code: str | None, message: str, fix: str | None = None, issues: list[dict] | None = None, request_id: str | None = None):
        super().__init__(message)
        self.status = status
        self.code = code or "http_error"
        self.message = message
        self.fix = fix
        self.issues = issues or []
        self.request_id = request_id

    def to_dict(self) -> dict:
        """The error as the API sent it, for handing back to a model."""
        out: dict[str, Any] = {"code": self.code, "message": self.message}
        if self.fix:
            out["fix"] = self.fix
        if self.issues:
            out["issues"] = self.issues
        if self.request_id:
            out["request_id"] = self.request_id
        return {"error": out}

    def __str__(self) -> str:
        return f"{self.code}: {self.message}" + (f" Fix: {self.fix}" if self.fix else "")


def _query(params: Mapping[str, Any] | None) -> str:
    if not params:
        return ""
    pairs = []
    for k, v in params.items():
        if v is None:
            continue
        if isinstance(v, bool):
            v = "true" if v else "false"
        elif isinstance(v, (list, tuple)):
            v = ",".join(str(x) for x in v)
        pairs.append((k, str(v)))
    return ("?" + parse.urlencode(pairs)) if pairs else ""


def _quote(s: str) -> str:
    return parse.quote(str(s), safe="")


class _Group:
    def __init__(self, client: "SocialsForAI"):
        self._c = client


class Workspaces(_Group):
    def create(self, name: str | None = None, email: str | None = None) -> dict:
        """Create a workspace and get an API key. Needs no key. The client starts using the new key."""
        body = {k: v for k, v in {"name": name, "email": email}.items() if v}
        ws = self._c.request("POST", "/v1/workspaces", body=body, auth=False)
        if ws.get("api_key") and not self._c.api_key:
            self._c.api_key = ws["api_key"]
        return ws


class Workspace(_Group):
    def get(self) -> dict:
        return self._c.request("GET", "/v1/workspace")

    def set_owner_email(self, email: str) -> dict:
        """Attach the owner's email (only while none is set): dashboard sign-in, recovery, paying for a plan."""
        return self._c.request("PATCH", "/v1/workspace", body={"email": email})


class Accounts(_Group):
    def list(self, platform: str | None = None, external_ref: str | None = None, status: str | None = None) -> list[dict]:
        return self._c.request("GET", "/v1/accounts" + _query({"platform": platform, "external_ref": external_ref, "status": status}))["data"]

    def get(self, id: str) -> dict:
        return self._c.request("GET", f"/v1/accounts/{_quote(id)}")

    def connect(self, platform: str, credentials: Mapping[str, str], external_ref: str | None = None) -> dict:
        """Connect Bluesky, Mastodon, Telegram, Discord, Slack or Nostr with credentials the owner gave you (or "sandbox" with {})."""
        body: dict[str, Any] = {"platform": platform, "credentials": dict(credentials)}
        if external_ref:
            body["external_ref"] = external_ref
        return self._c.request("POST", "/v1/accounts", body=body)

    def disconnect(self, id: str) -> dict:
        return self._c.request("DELETE", f"/v1/accounts/{_quote(id)}")


class ConnectLinks(_Group):
    def create(self, platforms: list[str] | None = None, external_ref: str | None = None, redirect_url: str | None = None, expires_in: int | None = None) -> dict:
        body = {k: v for k, v in {"platforms": platforms, "external_ref": external_ref, "redirect_url": redirect_url, "expires_in": expires_in}.items() if v is not None}
        return self._c.request("POST", "/v1/connect-links", body=body)

    def get(self, id: str, wait_seconds: int | None = None, until: str | None = None) -> dict:
        """The link's status. With wait_seconds (max 120) it holds until the owner finishes."""
        return self._c.request("GET", f"/v1/connect-links/{_quote(id)}" + _query({"wait": wait_seconds, "until": until}))

    def wait_for(self, id: str, until: str = "all", timeout: float = 900) -> dict:
        """Keep waiting until the owner has connected (all networks, or any with until="any") or the link expired."""
        deadline = time.monotonic() + timeout
        while True:
            s = self.get(id, wait_seconds=60, until=until)
            if s.get("status") in ("connected", "expired") or (until == "any" and s.get("status") == "partially_connected") or time.monotonic() >= deadline:
                return s


class Posts(_Group):
    def create(self, accounts: list[str], text: str = "", *, idempotency_key: str | None = None, **fields: Any) -> dict:
        """Publish now or schedule. Any API field works as a keyword: media, link, thread, auto_thread, poll,
        scheduled_at ("best" too), timezone, repeat, reply_to, reply_to_comment, first_comment, platform_options,
        approval="required", dry_run=True, wait=True. An idempotency key is generated when you don't pass one,
        so retries never publish twice; pass your own to make your own retries safe too."""
        body = {"accounts": accounts, "text": text, **fields}
        key = idempotency_key or body.pop("idempotency_key", None) or (None if body.get("dry_run") else str(uuid.uuid4()))
        return self._c.request("POST", "/v1/posts", body=body, headers={"Idempotency-Key": key} if key else None)

    def create_many(self, posts: list[dict], *, dry_run: bool = False, idempotency_key: str | None = None) -> dict:
        """Up to 50 posts in one request (a content calendar). Each is checked and created by itself."""
        key = idempotency_key or (None if dry_run else str(uuid.uuid4()))
        return self._c.request("POST", "/v1/posts/batch", body={"posts": posts, "dry_run": dry_run}, headers={"Idempotency-Key": key} if key else None)

    def list(self, status: str | None = None, series_id: str | None = None, limit: int | None = None, before: str | None = None) -> dict:
        return self._c.request("GET", "/v1/posts" + _query({"status": status, "series_id": series_id, "limit": limit, "before": before}))

    def get(self, id: str) -> dict:
        return self._c.request("GET", f"/v1/posts/{_quote(id)}")

    def update(self, id: str, **fields: Any) -> dict:
        """Edit a post that hasn't started publishing. Fields left out stay; scheduled_at=None publishes now."""
        return self._c.request("PATCH", f"/v1/posts/{_quote(id)}", body=fields)

    def delete(self, id: str, accounts: list[str] | None = None, series: bool = False) -> dict:
        """Delete it everywhere it went out (or only from some accounts). series=True cancels the rest of a repeat series."""
        return self._c.request("DELETE", f"/v1/posts/{_quote(id)}" + _query({"accounts": accounts, "series": True if series else None}))

    def metrics(self, id: str) -> dict:
        return self._c.request("GET", f"/v1/posts/{_quote(id)}/metrics")

    def replies(self, id: str) -> dict:
        """What people replied under each published copy. Answer one with create(..., reply_to=id, reply_to_comment=reply["id"])."""
        return self._c.request("GET", f"/v1/posts/{_quote(id)}/replies")

    def wait_for_approval(self, id: str, timeout: float = 3600) -> dict:
        """Wait while the post is pending_approval; returns it once a person decides (or the timeout passes)."""
        deadline = time.monotonic() + timeout
        while True:
            p = self._c.request("GET", f"/v1/posts/{_quote(id)}?wait=60")
            if p.get("status") != "pending_approval" or time.monotonic() >= deadline:
                return p


class Media(_Group):
    def upload(self, data: bytes, content_type: str) -> dict:
        """Upload a file of up to 4 MB and get a url to use in posts."""
        return self._c.request("POST", "/v1/media", raw=data, headers={"Content-Type": content_type})

    def upload_file(self, path: str, content_type: str | None = None) -> dict:
        """Upload a local file of any supported size; returns {url}."""
        import mimetypes

        ctype = content_type or mimetypes.guess_type(path)[0]
        if not ctype:
            raise ValueError(f"Can't tell the type of {path}; pass content_type.")
        with open(path, "rb") as f:
            data = f.read()
        if len(data) <= 4 * 1024 * 1024:
            return self.upload(data, ctype)
        up = self._c.request("POST", "/v1/media/uploads", body={"content_type": ctype, "size_bytes": len(data)})
        req = request.Request(up["upload_url"], data=data, method=up.get("method", "PUT"), headers=up.get("headers") or {"Content-Type": ctype})
        with request.urlopen(req, timeout=self._c.timeout) as res:
            if res.status >= 300:
                raise SocialsError(res.status, "upload_failed", f"The storage upload answered {res.status}.", "Upload again for a fresh URL.")
        return {"url": up["url"]}


class Events(_Group):
    def list(self, after: str | None = None, types: list[str] | None = None, limit: int | None = None, wait_seconds: int | None = None) -> dict:
        """What happened since `after` (an event id), oldest first. Keep last_id for the next call."""
        return self._c.request("GET", "/v1/events" + _query({"after": after, "types": types, "limit": limit, "wait": wait_seconds}))


class Webhooks(_Group):
    def list(self) -> list[dict]:
        return self._c.request("GET", "/v1/webhooks")["data"]

    def create(self, url: str, events: list[str] | None = None) -> dict:
        return self._c.request("POST", "/v1/webhooks", body={"url": url, "events": events or ["*"]})

    def delete(self, id: str) -> dict:
        return self._c.request("DELETE", f"/v1/webhooks/{_quote(id)}")


class Keys(_Group):
    def list(self) -> list[dict]:
        return self._c.request("GET", "/v1/keys")["data"]

    def create(self, **fields: Any) -> dict:
        """name, scopes, account_ids, require_approval, daily_post_limit. The key is returned once."""
        return self._c.request("POST", "/v1/keys", body=fields)

    def revoke(self, id: str) -> dict:
        return self._c.request("DELETE", f"/v1/keys/{_quote(id)}")


class SocialsForAI:
    """Client for the SocialsForAI API.

        from socialsforai import SocialsForAI
        socials = SocialsForAI()  # reads SOCIALSFORAI_API_KEY
        post = socials.posts.create(["linkedin"], "Hello", wait=True)
    """

    def __init__(self, api_key: str | None = None, *, base_url: str | None = None, max_retries: int = 2, timeout: float = 330):
        self.api_key = api_key or os.environ.get("SOCIALSFORAI_API_KEY") or os.environ.get("SOCIALS_API_KEY")
        self.base_url = (base_url or os.environ.get("SOCIALSFORAI_BASE_URL") or DEFAULT_BASE_URL).rstrip("/")
        self.max_retries = max_retries
        self.timeout = timeout
        #: The rate limit as of the last response: {"limit", "remaining", "reset"}, or None.
        self.rate_limit: dict | None = None
        self.workspaces = Workspaces(self)
        self.workspace = Workspace(self)
        self.accounts = Accounts(self)
        self.connect_links = ConnectLinks(self)
        self.posts = Posts(self)
        self.media = Media(self)
        self.events = Events(self)
        self.webhooks = Webhooks(self)
        self.keys = Keys(self)

    # One-call groups
    def platforms(self) -> list[dict]:
        return self.request("GET", "/v1/platforms", auth=False)["data"]

    def usage(self) -> dict:
        return self.request("GET", "/v1/usage")

    def analytics(self, **params: Any) -> dict:
        return self.request("GET", "/v1/analytics" + _query(params))

    def health(self) -> dict:
        return self.request("GET", "/v1/health", auth=False, ok_statuses=(503,))

    def upgrade_link(self, plan: str) -> dict:
        """A payment link for a human: you can't pay, the workspace owner can."""
        return self.request("POST", "/v1/upgrade-links", body={"plan": plan})

    def request(self, method: str, path: str, *, body: Any = None, raw: bytes | None = None, headers: Mapping[str, str] | None = None, auth: bool = True, ok_statuses: tuple[int, ...] = ()) -> Any:
        """Low-level request. Retries 429, 5xx and network errors (honouring Retry-After); never retries other errors."""
        if auth and not self.api_key:
            raise SocialsError(0, "missing_api_key", "No API key.", "Pass api_key or set SOCIALSFORAI_API_KEY. Get one with socials.workspaces.create().")
        h = {"Accept": "application/json", "User-Agent": f"socialsforai-sdk-python/{VERSION}"}
        if auth:
            h["Authorization"] = f"Bearer {self.api_key}"
        data = raw
        if body is not None and raw is None:
            data = json.dumps(body).encode()
            h["Content-Type"] = "application/json"
        h.update(headers or {})
        attempt = 0
        while True:
            req = request.Request(self.base_url + path, data=data, method=method, headers=h)
            try:
                with request.urlopen(req, timeout=self.timeout) as res:
                    return self._finish(res.status, res.headers, res.read())
            except urlerror.HTTPError as e:
                status, hdrs, payload = e.code, e.headers, e.read()
                if status in ok_statuses:
                    return self._finish(status, hdrs, payload)
                if (status == 429 or status >= 500) and attempt < self.max_retries:
                    after = hdrs.get("Retry-After")
                    time.sleep(min(float(after), 60) if after and after.replace(".", "", 1).isdigit() else 0.5 * 2**attempt)
                    attempt += 1
                    continue
                self._note_rate(hdrs)
                err = {}
                try:
                    err = json.loads(payload or b"{}").get("error") or {}
                except ValueError:
                    pass
                raise SocialsError(status, err.get("code"), err.get("message") or f"HTTP {status}", err.get("fix"), err.get("issues"), err.get("request_id") or hdrs.get("Request-Id")) from None
            except (urlerror.URLError, TimeoutError, ConnectionError) as e:
                if attempt < self.max_retries:
                    time.sleep(0.5 * 2**attempt)
                    attempt += 1
                    continue
                reason = getattr(e, "reason", e)
                raise SocialsError(0, "network_error", f"Could not reach {self.base_url}: {reason}", "Check the network and retry; creating a post is safe to retry with the same idempotency key.") from None

    def _note_rate(self, headers: Any) -> None:
        limit = headers.get("RateLimit-Limit") if headers else None
        if limit:
            self.rate_limit = {"limit": int(limit), "remaining": int(headers.get("RateLimit-Remaining") or 0), "reset": int(headers.get("RateLimit-Reset") or 0)}

    def _finish(self, status: int, headers: Any, payload: bytes) -> Any:
        self._note_rate(headers)
        if not payload:
            return None
        try:
            return json.loads(payload)
        except ValueError:
            return None


def verify_webhook(secret: str, header: str | None, raw_body: bytes | str, *, tolerance_seconds: int = 300, now: float | None = None) -> bool:
    """Check a delivery's Socials-Signature header ("t=<unix>,v1=<hex>"): HMAC-SHA256 of "<t>.<raw body>".
    Pass the raw request body as received, before parsing it."""
    parts = dict(p.strip().split("=", 1) for p in (header or "").split(",") if "=" in p)
    try:
        t = int(parts["t"])
        v1 = parts["v1"]
    except (KeyError, ValueError):
        return False
    if abs((now if now is not None else time.time()) - t) > tolerance_seconds:
        return False
    body = raw_body.encode() if isinstance(raw_body, str) else raw_body
    expected = hmac.new(secret.encode(), f"{t}.".encode() + body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, v1)
