#!/usr/bin/env python3
"""Smoke test for a private Prism deployment (stdlib only).

  smoke-test.py setup     first user + workspace + API key; the key goes to
                          $PRISM_KEY_FILE (mode 600), never to stdout
  smoke-test.py tools     list /mcp tools using the API key
  smoke-test.py call NAME JSON   call one /mcp tool
  smoke-test.py invite EMAIL     send a workspace invite (branded email check)
  smoke-test.py create-key NAME FILE   new API key (Admin role, one year) for
                          one caller, written to FILE (mode 600), never stdout

Env: PRISM_URL (default http://127.0.0.1:3130), PRISM_KEY_FILE,
PRISM_ADMIN_EMAIL and PRISM_ADMIN_PASSWORD (setup only).
"""
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone

URL = os.environ.get("PRISM_URL", "http://127.0.0.1:3130").rstrip("/")
KEY_FILE = os.environ.get("PRISM_KEY_FILE", "prism-api-key")
SESSION_FILE = KEY_FILE + ".session"


def post(path, body, token=None, accept="application/json"):
    headers = {"Content-Type": "application/json", "Accept": accept}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    request = urllib.request.Request(
        URL + path, data=json.dumps(body).encode(), headers=headers
    )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            return json.loads(response.read() or b"null")
    except urllib.error.HTTPError as error:
        sys.exit(f"{path}: HTTP {error.code} {error.read()[:2000].decode()}")


def gql(query, variables=None, token=None, path="/metadata"):
    result = post(path, {"query": query, "variables": variables or {}}, token)
    if result.get("errors"):
        sys.exit(f"{path}: {json.dumps(result['errors'])[:2000]}")
    return result["data"]


def write_secret(path, value):
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w") as handle:
        handle.write(value + "\n")


def read_secret(path):
    with open(path) as handle:
        return handle.read().strip()


def setup():
    email = os.environ["PRISM_ADMIN_EMAIL"]
    password = os.environ["PRISM_ADMIN_PASSWORD"]
    agnostic = gql(
        "mutation($email:String!,$password:String!){signUp(email:$email,password:$password)"
        "{tokens{accessOrWorkspaceAgnosticToken{token}}}}",
        {"email": email, "password": password},
    )["signUp"]["tokens"]["accessOrWorkspaceAgnosticToken"]["token"]
    created = gql(
        "mutation($input:SignUpInNewWorkspaceInput){signUpInNewWorkspace(input:$input)"
        "{loginToken{token} workspace{id}}}",
        {"input": {"displayName": "Nebula"}},
        agnostic,
    )["signUpInNewWorkspace"]
    print("workspace", created["workspace"]["id"])
    access = gql(
        "mutation($loginToken:String!,$origin:String!){getAuthTokensFromLoginToken("
        "loginToken:$loginToken,origin:$origin){tokens{accessOrWorkspaceAgnosticToken{token}}}}",
        {"loginToken": created["loginToken"]["token"], "origin": URL},
    )["getAuthTokensFromLoginToken"]["tokens"]["accessOrWorkspaceAgnosticToken"]["token"]
    gql(
        "mutation($data:ActivateWorkspaceInput!){activateWorkspace(data:$data){id activationStatus}}",
        {"data": {}},
        access,
    )
    write_secret(SESSION_FILE, access)
    roles = gql("{getRoles{id label}}", token=access)["getRoles"]
    admin = next(role for role in roles if role["label"].lower() == "admin")
    expires = (datetime.now(timezone.utc) + timedelta(days=365)).isoformat()
    api_key = gql(
        "mutation($input:CreateApiKeyInput!){createApiKey(input:$input){id}}",
        {"input": {"name": "nebula", "expiresAt": expires, "roleId": admin["id"]}},
        access,
    )["createApiKey"]
    token = gql(
        "mutation($apiKeyId:UUID!,$expiresAt:String!){generateApiKeyToken("
        "apiKeyId:$apiKeyId,expiresAt:$expiresAt){token}}",
        {"apiKeyId": api_key["id"], "expiresAt": expires},
        access,
    )["generateApiKeyToken"]["token"]
    write_secret(KEY_FILE, token)
    print("api key", api_key["id"], "expires", expires, "->", KEY_FILE)


def login():
    email = os.environ["PRISM_ADMIN_EMAIL"]
    password = os.environ["PRISM_ADMIN_PASSWORD"]
    login_token = gql(
        "mutation($e:String!,$p:String!,$o:String!){getLoginTokenFromCredentials("
        "email:$e,password:$p,origin:$o){loginToken{token}}}",
        {"e": email, "p": password, "o": URL},
    )["getLoginTokenFromCredentials"]["loginToken"]["token"]
    return gql(
        "mutation($t:String!,$o:String!){getAuthTokensFromLoginToken(loginToken:$t,origin:$o)"
        "{tokens{accessOrWorkspaceAgnosticToken{token}}}}",
        {"t": login_token, "o": URL},
    )["getAuthTokensFromLoginToken"]["tokens"]["accessOrWorkspaceAgnosticToken"]["token"]


def create_key(name, path):
    access = login()
    roles = gql("{getRoles{id label}}", token=access)["getRoles"]
    admin = next(role for role in roles if role["label"].lower() == "admin")
    expires = (datetime.now(timezone.utc) + timedelta(days=365)).isoformat()
    api_key = gql(
        "mutation($input:CreateApiKeyInput!){createApiKey(input:$input){id}}",
        {"input": {"name": name, "expiresAt": expires, "roleId": admin["id"]}},
        access,
    )["createApiKey"]
    token = gql(
        "mutation($apiKeyId:UUID!,$expiresAt:String!){generateApiKeyToken("
        "apiKeyId:$apiKeyId,expiresAt:$expiresAt){token}}",
        {"apiKeyId": api_key["id"], "expiresAt": expires},
        access,
    )["generateApiKeyToken"]["token"]
    write_secret(path, token)
    print("api key", name, api_key["id"], "expires", expires, "->", path)


def mcp(method, params=None):
    result = post(
        "/mcp",
        {"jsonrpc": "2.0", "id": 1, "method": method, "params": params or {}},
        read_secret(KEY_FILE),
    )
    if result.get("error"):
        sys.exit(f"mcp {method}: {json.dumps(result['error'])}")
    return result["result"]


def main():
    command = sys.argv[1] if len(sys.argv) > 1 else ""
    if command == "setup":
        setup()
    elif command == "tools":
        info = mcp("initialize", {"protocolVersion": "2025-06-18", "capabilities": {},
                                  "clientInfo": {"name": "prism-smoke-test", "version": "1"}})
        print("server", json.dumps(info.get("serverInfo")))
        for tool in mcp("tools/list")["tools"]:
            print(tool["name"], "-", (tool.get("description") or "")[:100])
    elif command == "call":
        result = mcp("tools/call", {"name": sys.argv[2], "arguments": json.loads(sys.argv[3])})
        print(json.dumps(result, indent=1)[:6000])
    elif command == "create-key":
        create_key(sys.argv[2], sys.argv[3])
    elif command == "invite":
        result = gql(
            "mutation($emails:[String!]!){sendInvitations(emails:$emails){success errors}}",
            {"emails": [sys.argv[2]]},
            read_secret(SESSION_FILE),
        )
        print(json.dumps(result))
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
