"""Bloomy Weddings local server: SQLite accounts, shared portfolio and live updates.

Run with the bundled Python runtime or any Python 3.11+:
    python server.py
Then open http://localhost:3000
"""
import base64
import hashlib
import hmac
import json
import mimetypes
import os
import queue
import secrets
import sqlite3
import threading
import time
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent
DATA_DIR = Path(os.environ.get("BLOOMY_DATA_DIR", ROOT))
DATABASE = DATA_DIR / "bloomy.db"
HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "3000"))
EVENT_CLIENTS, EVENT_LOCK = [], threading.Lock()


def db():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def password_hash(password, salt=None):
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 310_000)
    return base64.b64encode(salt).decode() + "$" + base64.b64encode(digest).decode()


def password_matches(password, stored):
    try:
        salt, digest = stored.split("$", 1)
        calculated = password_hash(password, base64.b64decode(salt))
        return hmac.compare_digest(calculated, stored)
    except (ValueError, TypeError):
        return False


def setup_database():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with db() as connection:
        connection.executescript("""
            CREATE TABLE IF NOT EXISTS users (
              username TEXT PRIMARY KEY COLLATE NOCASE,
              password_hash TEXT NOT NULL,
              role TEXT NOT NULL CHECK(role IN ('admin', 'employee')),
              created_at INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS sessions (
              token TEXT PRIMARY KEY,
              username TEXT NOT NULL,
              expires_at INTEGER NOT NULL,
              FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS settings (
              key TEXT PRIMARY KEY,
              value TEXT NOT NULL
            );
        """)
        if not connection.execute("SELECT 1 FROM users WHERE role = 'admin'").fetchone():
            connection.execute(
                "INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, 'admin', ?)",
                ("bloomy", password_hash("bloomy2026"), int(time.time())),
            )


def publish(event, data):
    message = f"event: {event}\ndata: {json.dumps(data, separators=(',', ':'))}\n\n"
    with EVENT_LOCK:
        for client in EVENT_CLIENTS[:]:
            try:
                client.put_nowait(message)
            except Exception:
                EVENT_CLIENTS.remove(client)


class App(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, format, *args):
        print("[Bloomy] " + format % args)

    def json_response(self, status, data, cookie=None):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.end_headers()
        self.wfile.write(body)

    def read_json(self):
        length = int(self.headers.get("Content-Length", "0"))
        if length > 10_000_000:
            raise ValueError("Request is too large.")
        return json.loads(self.rfile.read(length).decode("utf-8")) if length else {}

    def session(self):
        cookie = SimpleCookie(self.headers.get("Cookie"))
        token = cookie.get("bloomy_session")
        if not token:
            return None
        with db() as connection:
            row = connection.execute("""
                SELECT users.username, users.role FROM sessions
                JOIN users ON users.username = sessions.username
                WHERE sessions.token = ? AND sessions.expires_at > ?
            """, (token.value, int(time.time()))).fetchone()
        return dict(row) if row else None

    def require_user(self, admin_only=False):
        user = self.session()
        if not user or (admin_only and user["role"] != "admin"):
            self.json_response(HTTPStatus.UNAUTHORIZED, {"error": "Sign in is required."})
            return None
        return user

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/me":
            user = self.session()
            return self.json_response(HTTPStatus.OK, {"user": user})
        if path == "/api/portfolio":
            with db() as connection:
                row = connection.execute("SELECT value FROM settings WHERE key = 'portfolio'").fetchone()
            return self.json_response(HTTPStatus.OK, {"portfolio": json.loads(row["value"]) if row else None})
        if path == "/api/employees":
            if not self.require_user(admin_only=True): return
            with db() as connection:
                rows = connection.execute("SELECT username FROM users WHERE role = 'employee' ORDER BY username").fetchall()
            return self.json_response(HTTPStatus.OK, {"employees": [row["username"] for row in rows]})
        if path == "/api/events":
            return self.events()
        return self.serve_file(path)

    def do_POST(self):
        path = urlparse(self.path).path
        try:
            payload = self.read_json()
        except (ValueError, json.JSONDecodeError) as error:
            return self.json_response(HTTPStatus.BAD_REQUEST, {"error": str(error) or "Invalid request."})
        if path == "/api/login": return self.login(payload)
        if path == "/api/logout": return self.logout()
        if path == "/api/employees": return self.create_employee(payload)
        if path == "/api/portfolio": return self.save_portfolio(payload)
        return self.json_response(HTTPStatus.NOT_FOUND, {"error": "Unknown endpoint."})

    def do_PUT(self):
        if urlparse(self.path).path != "/api/admin/credentials":
            return self.json_response(HTTPStatus.NOT_FOUND, {"error": "Unknown endpoint."})
        try: return self.update_credentials(self.read_json())
        except (ValueError, json.JSONDecodeError) as error: return self.json_response(HTTPStatus.BAD_REQUEST, {"error": str(error)})

    def do_DELETE(self):
        path = urlparse(self.path).path
        if path == "/api/portfolio": return self.reset_portfolio()
        if path.startswith("/api/employees/"):
            return self.delete_employee(unquote(path.rsplit("/", 1)[1]))
        return self.json_response(HTTPStatus.NOT_FOUND, {"error": "Unknown endpoint."})

    def login(self, data):
        username, password = str(data.get("username", "")).strip().lower(), str(data.get("password", ""))
        with db() as connection:
            user = connection.execute("SELECT username, password_hash, role FROM users WHERE username = ?", (username,)).fetchone()
            if not user or not password_matches(password, user["password_hash"]):
                return self.json_response(HTTPStatus.UNAUTHORIZED, {"error": "Invalid username or password."})
            token = secrets.token_urlsafe(32)
            connection.execute("INSERT INTO sessions (token, username, expires_at) VALUES (?, ?, ?)", (token, user["username"], int(time.time()) + 86400))
        return self.json_response(HTTPStatus.OK, {"user": {"username": user["username"], "role": user["role"]}}, "bloomy_session=" + token + "; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400")

    def logout(self):
        cookie = SimpleCookie(self.headers.get("Cookie")); token = cookie.get("bloomy_session")
        if token:
            with db() as connection: connection.execute("DELETE FROM sessions WHERE token = ?", (token.value,))
        return self.json_response(HTTPStatus.OK, {"ok": True}, "bloomy_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0")

    def create_employee(self, data):
        if not self.require_user(admin_only=True): return
        username, password = str(data.get("username", "")).strip().lower(), str(data.get("password", ""))
        if not valid_username(username) or len(password) < 8:
            return self.json_response(HTTPStatus.BAD_REQUEST, {"error": "Use a 3–32 character username and an 8+ character password."})
        try:
            with db() as connection: connection.execute("INSERT INTO users VALUES (?, ?, 'employee', ?)", (username, password_hash(password), int(time.time())))
        except sqlite3.IntegrityError:
            return self.json_response(HTTPStatus.CONFLICT, {"error": "That username is already in use."})
        publish("employees", {})
        return self.json_response(HTTPStatus.CREATED, {"username": username})

    def delete_employee(self, username):
        if not self.require_user(admin_only=True): return
        with db() as connection:
            deleted = connection.execute("DELETE FROM users WHERE username = ? AND role = 'employee'", (username,)).rowcount
        if not deleted: return self.json_response(HTTPStatus.NOT_FOUND, {"error": "Employee not found."})
        publish("employees", {})
        return self.json_response(HTTPStatus.OK, {"ok": True})

    def update_credentials(self, data):
        user = self.require_user(admin_only=True)
        if not user: return
        current_password, new_username, new_password = str(data.get("currentPassword", "")), str(data.get("newUsername", "")).strip().lower(), str(data.get("newPassword", ""))
        with db() as connection:
            account = connection.execute("SELECT password_hash FROM users WHERE username = ?", (user["username"],)).fetchone()
            if not account or not password_matches(current_password, account["password_hash"]):
                return self.json_response(HTTPStatus.UNAUTHORIZED, {"error": "Current password is incorrect."})
            if new_username and not valid_username(new_username): return self.json_response(HTTPStatus.BAD_REQUEST, {"error": "Username must be 3–32 characters using letters, numbers, dots, hyphens, or underscores."})
            if new_password and len(new_password) < 8: return self.json_response(HTTPStatus.BAD_REQUEST, {"error": "New password must have at least 8 characters."})
            if not new_username and not new_password: return self.json_response(HTTPStatus.BAD_REQUEST, {"error": "Enter a new username or password."})
            target = new_username or user["username"]
            try:
                if target != user["username"]:
                    connection.execute("UPDATE users SET username = ? WHERE username = ?", (target, user["username"]))
                    connection.execute("UPDATE sessions SET username = ? WHERE username = ?", (target, user["username"]))
                if new_password: connection.execute("UPDATE users SET password_hash = ? WHERE username = ?", (password_hash(new_password), target))
            except sqlite3.IntegrityError: return self.json_response(HTTPStatus.CONFLICT, {"error": "That username is already in use."})
        return self.json_response(HTTPStatus.OK, {"user": {"username": target, "role": "admin"}})

    def save_portfolio(self, data):
        if not self.require_user(): return
        portfolio = data.get("portfolio")
        if not isinstance(portfolio, list): return self.json_response(HTTPStatus.BAD_REQUEST, {"error": "Portfolio must be a list."})
        serialized = json.dumps(portfolio, separators=(",", ":"))
        if len(serialized) > 9_000_000: return self.json_response(HTTPStatus.BAD_REQUEST, {"error": "Portfolio is too large."})
        with db() as connection: connection.execute("INSERT OR REPLACE INTO settings (key, value) VALUES ('portfolio', ?)", (serialized,))
        publish("portfolio", {"portfolio": portfolio})
        return self.json_response(HTTPStatus.OK, {"ok": True})

    def reset_portfolio(self):
        if not self.require_user(): return
        with db() as connection: connection.execute("DELETE FROM settings WHERE key = 'portfolio'")
        publish("portfolio", {"portfolio": None})
        return self.json_response(HTTPStatus.OK, {"ok": True})

    def events(self):
        client = queue.Queue()
        with EVENT_LOCK: EVENT_CLIENTS.append(client)
        self.send_response(HTTPStatus.OK); self.send_header("Content-Type", "text/event-stream"); self.send_header("Cache-Control", "no-cache"); self.send_header("Connection", "keep-alive"); self.end_headers()
        try:
            while True:
                try: message = client.get(timeout=20)
                except queue.Empty: message = ": keepalive\n\n"
                self.wfile.write(message.encode("utf-8")); self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError): pass
        finally:
            with EVENT_LOCK:
                if client in EVENT_CLIENTS: EVENT_CLIENTS.remove(client)

    def serve_file(self, url_path):
        relative = "index.html" if url_path in ("", "/") else url_path.lstrip("/")
        file_path = (ROOT / relative).resolve()
        if ROOT not in file_path.parents and file_path != ROOT: return self.json_response(HTTPStatus.FORBIDDEN, {"error": "Forbidden"})
        if not file_path.is_file(): return self.json_response(HTTPStatus.NOT_FOUND, {"error": "Not found"})
        content_type = mimetypes.guess_type(file_path)[0] or "application/octet-stream"
        body = file_path.read_bytes()
        self.send_response(HTTPStatus.OK); self.send_header("Content-Type", content_type); self.send_header("Content-Length", str(len(body))); self.end_headers(); self.wfile.write(body)


def valid_username(username):
    return 3 <= len(username) <= 32 and all(c.isalnum() or c in ".-_" for c in username)


if __name__ == "__main__":
    setup_database()
    print(f"Bloomy server running at http://{HOST}:{PORT}")
    ThreadingHTTPServer((HOST, PORT), App).serve_forever()
