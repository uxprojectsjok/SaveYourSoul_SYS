# Authentication Model

**Version:** 1.1

---

## 1. Trust Model

```
SOUL_MASTER_KEY  (secret, server-side only)
    └── soul_cert = HMAC-SHA256(SOUL_MASTER_KEY, soul_id)[0:32]
            └── All owner API access validated against this cert
                    └── vault_key (AES-256) — encrypts content
                            └── service-token — scoped external access

pol_access_token (48 hex chars)
    └── Issued by /api/soul/pay after on-chain payment verification
            └── Scoped to specific soul_id + free_tools list
                    └── Time-limited (duration set by soul owner)
```

| Identity | Key Material | Trust Level | Scope |
|---|---|---|---|
| Soul owner | soul_cert (= HMAC of master key) | Full | All operations on own soul |
| Paid agent | pol_access_token (48 hex) | Payment-gated | Tools enabled by soul owner |
| External service | service-token (64 hex) | Scoped | Permissions in api_context.json |
| Mnemonic caller | BIP39 12-word phrase | Scoped | Same as service-token |
| Server operator | SOUL_MASTER_KEY | Root | Can derive any cert |

---

## 2. soul_cert — Owner Authentication

### 2.1 Derivation

```
cert = HMAC-SHA256(SOUL_MASTER_KEY, soul_id).hex()[0:32]
```

- `SOUL_MASTER_KEY`: 32-byte hex string, set via server environment variable
- `soul_id`: UTF-8 encoded UUID v4 string
- Output: 32 lowercase hex characters (16 bytes)

### 2.2 Bearer Token Format

```
Authorization: Bearer {soul_id}.{cert}
```

Example:
```
Authorization: Bearer 7f3a2b1c-4d5e-6f7a-8b9c-0d1e2f3a4b5c.a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5
```

### 2.3 Server Validation

The server MUST:
1. Split the Bearer value on the first `.`
2. Recompute the expected cert from `SOUL_MASTER_KEY` + `soul_id`
3. Compare with constant-time equality (prevents timing attacks)
4. Set `ngx.ctx.soul_id` on success
5. Clear the `Authorization` header before proxying upstream

The server MUST return `401` on any validation failure without revealing
which part (soul_id or cert) was incorrect.

### 2.4 Properties

- **Stateless**: No database lookup. cert is always the same for a given soul_id + key pair.
- **No expiry**: cert is valid until `SOUL_MASTER_KEY` changes.
- **Instance-bound**: Certs from one SYS instance are invalid on any other instance.
- **Rotation**: Changing `SOUL_MASTER_KEY` invalidates all existing certs simultaneously.

---

## 3. pol_access_token — Paid Agent Authentication

### 3.1 Purpose

Allows external AI agents to access a soul's data after paying the soul owner
on-chain (Polygon). Issued by the server after verifying the on-chain transaction.
The soul owner controls which tools are accessible and for how long.

### 3.2 Format

```
48 lowercase hex characters (24 bytes), no dots
```

Detection rule (Lua): `#token == 48 and token:match("^[0-9a-fA-F]+$") and not token:find(".", 1, true)`

### 3.3 Issuance Flow

```
1. GET  /api/soul/discover           → public soul listing (no auth)
2. POST /api/soul/pay                → { tx_hash, soul_id, pol_amount }
   → server validates TX on-chain (Polygon RPC):
     - recipient == soul's wallet address
     - amount >= configured price per session
     - ≥ 1 confirmation
     - tx_hash not seen before (replay protection, 48h window)
   → issues pol_access_token, stores in ngx.shared.pol_access dict
   → returns { access_token, expires_at, free_tools, soul_id }
```

### 3.4 Storage

Tokens are stored in the OpenResty shared dict `pol_access` under the key `tok:{token}`:

```json
{
  "soul_id": "uuid-v4",
  "expires_at": 1712845200,
  "free_tools": ["soul_read", "soul_maturity", "audio_list"]
}
```

Additionally persisted to `/var/lib/sys/pol_tokens/{token}.json` for restart durability.

### 3.5 Token Validation (`vault_auth.lua`)

```lua
-- Token must be exactly 48 hex chars, no dot
if #token ~= 48 or not token:match("^[0-9a-fA-F]+$") then return nil end

local raw = ngx.shared.pol_access:get("tok:" .. token:lower())
-- Decode soul_id, check amortization.enabled == true
-- Set ngx.ctx.soul_id, ngx.ctx.vault_key, ngx.ctx.is_paid_agent = true
```

### 3.6 Access Restrictions

Paid agents MUST only access:

| Allowed | Restricted |
|---------|------------|
| `GET /api/vault/audio/*` | `GET /api/soul` (use `/api/soul/paid-read`) |
| `GET /api/vault/images/*` | `PUT /api/context` |
| `GET /api/vault/video/*` | `POST /api/vault/sync` |
| `GET /api/vault/context/*` | Any destructive operation |
| `GET /api/vault/profile/*` | Any endpoint not in ALLOWED_PREFIXES |
| `GET /api/soul/paid-read` | |
| `POST /api/soul/paid-write` | |

Any request outside these prefixes returns `403 paid_agent_restricted`.

### 3.7 soul_write Sandbox

The `/api/soul/paid-write` endpoint restricts agents to the `<!-- AGENT:START --> … <!-- AGENT:END -->` block only. Content containing these markers is stripped before writing. Agents cannot escape this sandbox regardless of input.

---

## 4. Service-Token — Scoped External Access

### 4.1 Purpose

Service-tokens allow external systems (AI agents, MCP clients, webhooks)
to access a soul's data with granular, user-defined permissions.

### 4.2 Format

```
64 lowercase hex characters (32 bytes)
```

### 4.3 Token Derivation

```
service_token = HMAC-SHA256(vault_key_bytes, soul_id)[hex]
```

This links the token cryptographically to the vault key —
a token is only valid while the vault key it was derived from is active.

### 4.4 Transport

```
Authorization: Bearer {service_token}
```

or via query parameter for direct file downloads:

```
GET /api/vault/audio/file.mp3?token={service_token}
```

### 4.5 Permissions

Permissions are stored in `api_context.json`:

```json
{
  "permissions": {
    "soul":          true,   // read sys.md
    "calendar":      false,  // include ## Calendar section
    "audio":         true,   // read vault/audio/
    "video":         false,  // read vault/video/
    "images":        false,  // read vault/images/
    "context_files": true    // read vault/context/
  }
}
```

Service-tokens MUST NOT access fields they are not permitted to.
The server enforces this on every request.

---

## 5. BIP39 Mnemonic Authentication

### 5.1 Purpose

Allows accessing encrypted vault content using 12 BIP39 words
without an active vault session. Used primarily by the MCP client
for offline / stateless access.

### 5.2 Key Derivation

```
vault_key = PBKDF2-SHA256(mnemonic, soul_id, iterations=100000, length=32)
expected_token = HMAC-SHA256(vault_key, soul_id)[hex]
```

The derived token MUST match the `webhook_token` stored in `api_context.json`.

### 5.3 Request Format

```http
POST /api/webhook/mnemonic
Content-Type: application/json

{
  "soul_id": "uuid-v4",
  "words": ["word1", "word2", ..., "word12"]
}
```

### 5.4 Security Notes

- PBKDF2 with 100 000 iterations costs ~100ms CPU per request
- Rate limiting on this endpoint is STRONGLY RECOMMENDED
- Comparison MUST be constant-time (prevents timing attacks)

---

## 6. JWT — Service Integration Token

### 6.1 Purpose

Issues a standard JWT for integrations that require Bearer JWT
(e.g. the MCP OAuth flow).

### 6.2 Endpoint

```http
POST /api/soul/v1/token
Authorization: Bearer {soul_id}.{cert}
```

```json
{
  "token": "<HS256 JWT>",
  "expires_in": 2592000,
  "soul_id": "uuid-v4"
}
```

### 6.3 JWT Structure

```
Header:  { "alg": "HS256", "typ": "JWT" }
Claims:  { "soul_id": "...", "iat": ..., "exp": ... }
Signing: HMAC-SHA256(API_SIGNING_KEY, header.payload)
TTL:     30 days
```

`API_SIGNING_KEY` MUST be distinct from `SOUL_MASTER_KEY`.

---

## 7. Auth Guard Precedence (`vault_auth.lua`)

When a request arrives, the server tries auth methods in this order:

```
1. soul_cert  → check_soul_cert()       → full owner access
2. pol_access_token → check_pol_access_token() → paid agent, restricted access
3. service_token → check_service_token() → scoped service access
```

First match wins. On all failures: `401` (or `403 vault_locked` if vault is locked for service-tokens).

---

## 8. Security Considerations

| Concern | Mitigation |
|---|---|
| Timing attacks | Constant-time comparison on all token validation |
| soul_id enumeration | `/api/soul-cert` is unauthenticated but yields no useful info without the master key |
| SOUL_MASTER_KEY exposure | Server-side only, injected via systemd environment, never in build artifacts |
| Token replay (pol_access) | tx_hash stored for 48h, duplicate TX rejected |
| pol_access token leakage | Time-limited, scoped to soul_id + free_tools only |
| AGENT block escape | AGENT markers stripped from soul_write content before writing |
| Path traversal | soul_id validated against UUID pattern before any file operation |
| Token replay (general) | TLS in transit; tokens are bearer credentials — treat like passwords |
| cert rotation | Change SOUL_MASTER_KEY; all souls must re-fetch their cert |
