import json
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qsl, urlparse

import pytest


class FakeApi:
    """A local stand-in for the API. Set `routes["GET /v1/x"] = fn(record) -> (status, json, headers)`."""

    def __init__(self):
        self.routes = {}
        self.seen = []

    def handle(self, method, raw_path, headers, body):
        url = urlparse(raw_path)
        rec = {"method": method, "path": url.path, "query": dict(parse_qsl(url.query)), "headers": {k.lower(): v for k, v in headers.items()}, "body": body}
        try:
            rec["json"] = json.loads(body) if body else None
        except ValueError:
            rec["json"] = None
        self.seen.append(rec)
        fn = self.routes.get(f"{method} {url.path}")
        if not fn:
            return 404, {"error": {"code": "not_found", "message": "No such endpoint."}}, {}
        out = fn(rec)
        return (out + ({},))[:3] if len(out) == 2 else out


@pytest.fixture
def api():
    fake = FakeApi()

    class Handler(BaseHTTPRequestHandler):
        def _do(self):
            n = int(self.headers.get("Content-Length") or 0)
            status, payload, extra = fake.handle(self.command, self.path, dict(self.headers), self.rfile.read(n) if n else b"")
            data = b"" if payload is None else json.dumps(payload).encode()
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            for k, v in extra.items():
                self.send_header(k, v)
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        do_GET = do_POST = do_PATCH = do_DELETE = _do

        def log_message(self, *a):
            pass

    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    fake.base = f"http://127.0.0.1:{server.server_address[1]}"
    yield fake
    server.shutdown()
