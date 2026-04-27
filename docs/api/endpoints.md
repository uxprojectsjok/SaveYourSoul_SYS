# API Reference

**Base URL:** `https://YOUR_DOMAIN`
**Auth:** See [spec/auth.md](../spec/auth.md)

---

## Authentication

Three token types are accepted:

| Token | Format | Header |
|---|---|---|
| soul_cert | `Bearer {soul_id}.{32hexchars}` | `Authorization` |
| pol_access_token | `Bearer {48hexchars}` | `Authorization` |
| service_token | `Bearer {64hexchars}` or `X-Webhook-Token` | `Authorization` / header / `?token=` |

---

## Endpoint Index

### Core Soul

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/soul-cert` | none | Derive soul_cert for a soul_id |
| POST | `/api/soul-sign-session` | none | Sign a growth chain entry |
| GET | `/api/validate` | soul_cert | Validate cert (returns 200 or 401) |
| GET | `/api/context` | soul_cert | Read API context + permissions |
| PUT | `/api/context` | soul_cert | Update API context + upload sys.md |
| GET | `/api/soul` | vault_auth | Read sys.md (owner or service-token) |
| POST | `/api/chat` | soul_cert | Chat proxy (SSE streaming) |
| POST | `/api/soul-update` | soul_cert | Soul enrichment (JSON) |
| POST | `/api/soul/v1/token` | soul_cert | Issue JWT service token |
| POST | `/api/beme` | vault_auth | Talk as soul — beme_chat MCP backend |

### Vault

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/vault/unlock` | soul_cert | Unlock vault with AES key |
| POST | `/api/vault/lock` | soul_cert | Lock vault immediately |
| GET | `/api/vault/session` | soul_cert | Query vault session status |
| POST | `/api/vault/sync` | soul_cert | Upload a file to vault |
| GET | `/api/vault/manifest` | vault_auth | Vault index |
| GET | `/api/vault/audio[/{file}]` | vault_auth | List or get audio files |
| GET | `/api/vault/video[/{file}]` | vault_auth | List or get video files |
| GET | `/api/vault/images[/{file}]` | vault_auth | List or get image files |
| GET | `/api/vault/context[/{file}]` | vault_auth | List or get context files |
| GET | `/api/vault/profile/{type}` | vault_auth | Read analysis profile (face/voice/motion/expertise) |
| PUT | `/api/vault/profile/{type}` | vault_auth | Write analysis profile (encrypted) |
| DELETE | `/api/vault/profile/{type}` | soul_cert | Delete analysis profile |
| DELETE | `/api/vault/{type}/{file}` | soul_cert | Delete a vault file |

### Vision & Media

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/vision-analyze` | soul_cert | Claude Vision analysis |
| POST | `/api/tts` | soul_cert | ElevenLabs TTS proxy |
| POST | `/api/wavespeed/submit` | soul_cert | WaveSpeed AI image generation |
| GET | `/api/wavespeed/result` | soul_cert | WaveSpeed result polling |

### External & Bundle

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/vault/external/soul` | vault_auth | Fetch soul from external URL |
| POST | `/api/fetch-bundle` | none | Fetch encrypted bundle from URL |
| POST | `/api/webhook` | service_token | Generic webhook (all resources) |
| POST | `/api/webhook/mnemonic` | BIP39 in body | Mnemonic-auth webhook |

### Soul Network & Public Vault

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET/POST | `/api/vault/connections/network` | vault_auth | Soul Network |
| GET | `/api/vault/peer-stream` | service_token | Direct binary stream from peer vault |
| GET | `/api/vault/public/config` | soul_cert | Read own public vault config |
| PUT | `/api/vault/public/config` | soul_cert | Save public vault config |
| POST | `/api/vault/public/sync` | soul_cert | Upload file to public vault |
| DELETE | `/api/vault/public/{file}` | soul_cert | Remove file from public vault |
| GET | `/api/vault/public/{soul_id}` | none | Manifest of a soul's public vault |
| GET | `/api/vault/public/{soul_id}/{file}` | soul_cert or api_grant | Download public vault file |

### Agent Marketplace

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/soul/discover` | none | Search public soul registry (IPFS-backed) |
| GET | `/api/soul/register` | none | Preview IPFS registration payload |
| POST | `/api/soul/register` | soul_cert | Publish soul to IPFS registry |
| GET | `/api/soul/amortization` | soul_cert | Read Agent Marketplace configuration |
| PUT | `/api/soul/amortization` | soul_cert | Save Agent Marketplace configuration |
| POST | `/api/soul/pay` | none | Submit tx_hash → receive pol_access_token |
| GET | `/api/soul/maturity` | soul_cert or pol_access_token | Soul maturity score |
| GET | `/api/soul/earnings` | soul_cert | Earnings ledger |
| GET | `/api/soul/paid-read` | pol_access_token | Read soul context (paid agent) |
| POST | `/api/soul/paid-write` | pol_access_token | Write to AGENT block in sys.md |

---

## Endpoint Details

### POST /api/soul-cert

Derive a soul_cert. No authentication required.

```http
POST /api/soul-cert
Content-Type: application/json

{ "soul_id": "uuid-v4" }
```

```json
{ "cert": "a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5" }
```

---

### GET /api/validate

Validate a soul_cert. Returns 200 on success, 401 on failure.

```http
GET /api/validate
Authorization: Bearer {soul_id}.{cert}
```

---

### GET /api/context

Read the current API context for a soul.

```http
GET /api/context
Authorization: Bearer {soul_id}.{cert}
```

```json
{
  "enabled": true,
  "cipher_mode": "ciphered",
  "has_token": true,
  "external_soul_url": "",
  "permissions": {
    "soul": true,
    "calendar": false,
    "audio": true,
    "video": false,
    "images": false,
    "context_files": true
  },
  "synced_files": { "audio": ["voice.mp3"], "context": ["hash.txt"] },
  "active_files": { "audio": "voice.mp3" },
  "amortization": {
    "enabled": true,
    "price_pol": 0.001,
    "wallet": "0x...",
    "free_tools": ["soul_read", "soul_maturity"],
    "access_duration_hours": 24
  }
}
```

Note: `webhook_token` and `vault_key_hex` are never returned. `has_token` indicates presence only.

---

### PUT /api/context

Update API context. Accepts partial updates — only provided fields are changed.

```http
PUT /api/context
Authorization: Bearer {soul_id}.{cert}
Content-Type: application/json

{
  "enabled": true,
  "cipher_mode": "ciphered",
  "permissions": { "soul": true, "audio": true },
  "soul_content_encrypted": "<base64 AES-256-CBC ciphertext>",
  "active_files": { "audio": "voice.mp3" }
}
```

| Field | Type | Description |
|---|---|---|
| `enabled` | boolean | Enable/disable external API access |
| `cipher_mode` | `"ciphered"\|"open"` | Encryption mode for stored sys.md |
| `permissions` | object | Granular permission flags |
| `soul_content_encrypted` | base64 string | AES-256-CBC encrypted sys.md |
| `soul_content` | string | Plaintext sys.md (open mode only) |
| `webhook_token` | string | Service-token (max 256 chars) |
| `external_soul_url` | string | HTTPS URL for external soul storage |
| `active_files` | object | Active file selection per type |

---

### POST /api/vault/unlock

```http
POST /api/vault/unlock
Authorization: Bearer {soul_id}.{cert}
Content-Type: application/json

{
  "duration": "12h",
  "vault_key": "64-hex-char AES-256 key"
}
```

Allowed durations: `1h` `12h` `1d` `30d` `182d` `365d` `unlimited`

```json
{
  "ok": true,
  "unlocked": true,
  "duration": "12h",
  "expires_at": 1712845200,
  "has_key": true
}
```

---

### POST /api/vault/sync

Upload a file to the vault.

```http
POST /api/vault/sync
Authorization: Bearer {soul_id}.{cert}
Content-Type: application/json

{
  "type": "audio",
  "name": "voice-memo.webm",
  "data": "<base64-encoded file content>",
  "encrypted": false
}
```

| `type` | Allowed extensions | Max size |
|---|---|---|
| `audio` | mp3, wav, ogg, webm, m4a, opus, flac, aac | 50 MB |
| `video` | mp4, mov, avi, mkv, webm | 100 MB |
| `image` | jpg, jpeg, png, webp, gif, avif | 10 MB |
| `context` | md, txt | 512 KB |

Files are scanned by ClamAV before storage.
Audio files are converted to MP3 by ffmpeg on the server.
Video files are converted to MP4 H.264 + AAC.

---

### GET /api/soul

Read the sys.md. Decrypts on-the-fly if vault is unlocked.

```http
GET /api/soul
Authorization: Bearer {soul_id}.{cert}
```

Returns `text/markdown`. Requires `soul` permission.

Query parameter:
- `?raw=1` — return raw encrypted bytes (for cloud backup, only works on encrypted souls)

---

### POST /api/chat

Proxy to Anthropic Claude API with SSE streaming.
The server injects the `ANTHROPIC_API_KEY` — it is never exposed to the client.

```http
POST /api/chat
Authorization: Bearer {soul_id}.{cert}
Content-Type: application/json

{
  "model": "claude-sonnet-4-6",
  "max_tokens": 8192,
  "system": "...",
  "messages": [...]
}
```

Returns Server-Sent Events (SSE).

---

### GET /api/soul/discover

Search the public soul registry. No authentication required.

```http
GET /api/soul/discover?q=expertise
```

```json
{
  "results": [
    {
      "soul_id": "uuid-v4",
      "name": "Jan",
      "mcp_endpoint": "https://sys.uxprojects-jok.com/mcp",
      "price_pol": 0.001,
      "wallet": "0x...",
      "free_tools": ["soul_read", "soul_maturity"],
      "access_duration_hours": 24,
      "maturity": 72,
      "ipfs_hash": "Qm..."
    }
  ]
}
```

---

### POST /api/soul/pay

Submit an on-chain POL payment and receive a pol_access_token.
No authentication required — payment is the credential.

```http
POST /api/soul/pay
Content-Type: application/json

{
  "tx_hash": "0x...",
  "soul_id": "uuid-v4"
}
```

Server validates on-chain:
- Recipient matches soul's wallet address
- Amount ≥ configured `price_pol`
- ≥ 1 block confirmation
- tx_hash not previously used (replay protection, 48h window)

```json
{
  "ok": true,
  "access_token": "6f795d5b649ed6513b2021eb3f018130...",
  "expires_at": "2026-04-28T07:13:44Z",
  "soul_id": "uuid-v4",
  "free_tools": ["soul_read", "soul_maturity"],
  "mcp_endpoint": "https://sys.uxprojects-jok.com/mcp"
}
```

---

### GET /api/soul/paid-read

Read the agent-visible portion of sys.md. Only returns content between
`<!-- AGENT:START -->` and `<!-- AGENT:END -->` markers.

```http
GET /api/soul/paid-read
Authorization: Bearer {pol_access_token}
```

Returns `text/plain`. The full sys.md is never exposed to paid agents.

---

### POST /api/soul/paid-write

Write to the `<!-- AGENT:START --> … <!-- AGENT:END -->` block in sys.md.
Requires `soul_write` in the soul's `free_tools` list.

```http
POST /api/soul/paid-write
Authorization: Bearer {pol_access_token}
Content-Type: application/json

{
  "content": "Agent note here",
  "mode": "replace"
}
```

| `mode` | Behavior |
|---|---|
| `replace` | Replace entire AGENT block content |
| `append` | Add after existing content |
| `prepend` | Add before existing content |

Content containing `<!-- AGENT:START -->` or `<!-- AGENT:END -->` is stripped
before writing (injection protection).

```json
{ "ok": true, "section": "Agent-Kontext", "mode": "replace" }
```

---

### GET /api/soul/amortization

Read the Agent Marketplace configuration for a soul.

```http
GET /api/soul/amortization
Authorization: Bearer {soul_id}.{cert}
```

```json
{
  "enabled": true,
  "price_pol": 0.001,
  "wallet": "0x...",
  "free_tools": ["soul_read", "soul_maturity", "soul_write"],
  "access_duration_hours": 24
}
```

---

### GET /api/soul/earnings

Earnings ledger — all payments received via the Agent Marketplace.

```http
GET /api/soul/earnings
Authorization: Bearer {soul_id}.{cert}
```

```json
{
  "total_pol": 0.012,
  "count": 12,
  "payments": [
    {
      "tx_hash": "0x...",
      "pol_amount": "0.001",
      "from": "0x...",
      "issued_at": "2026-04-27T07:13:44Z",
      "expires_at": "2026-04-28T07:13:44Z"
    }
  ]
}
```

---

### POST /api/beme

Talk as the soul — the server reads sys.md, builds the same system prompt as the SYS chat app,
and calls the Anthropic API server-side. Used by the `beme_chat` MCP tool.

```http
POST /api/beme
Authorization: Bearer {soul_id}.{cert}
Content-Type: application/json

{
  "message": "Was denkst du über dieses Projekt?",
  "history": [
    { "role": "user",      "content": "Hallo!" },
    { "role": "assistant", "content": "Hey, schön dass du da bist." }
  ],
  "max_tokens": 1024
}
```

```json
{ "response": "...", "soul_name": "Jan", "model": "claude-sonnet-4-6" }
```

---

### POST /api/fetch-bundle

Fetch an encrypted .soul bundle from a public URL. No authentication required.

```http
POST /api/fetch-bundle
Content-Type: application/json

{ "url": "https://drive.google.com/..." }
```

Also accepts Arweave transaction IDs (43-char alphanumeric strings).
Returns the parsed JSON bundle. Decryption happens client-side.

---

### Profile Endpoints

```http
GET    /api/vault/profile/{type}   Authorization: Bearer {soul_id}.{cert}
PUT    /api/vault/profile/{type}   Authorization: Bearer {soul_id}.{cert}
DELETE /api/vault/profile/{type}   Authorization: Bearer {soul_id}.{cert}
```

**Profile types:** `face` · `voice` · `motion` · `expertise`

Profiles are always AES-256-CBC encrypted on disk. A PUT requires an active vault session.

---

### Public Vault

The public vault lets a soul share specific files with connected souls or external services.

See [vault.md](../architecture/vault.md) §7 for the full Public Vault & Soul Network reference.

---

## Rate Limits

| Zone | Rate | Burst | Endpoints |
|---|---|---|---|
| `chat` | 2 r/s | 20 | `/api/chat`, `/api/soul-update`, vision endpoints, `/api/beme` |
| `api` | 30 r/s | 10–30 | General API |
| `auth` | 5 r/s | 2–5 | `/api/soul-cert`, `/api/validate` |
| `mcp` | 5 r/s | 10 | `/mcp` |
| `oauth` | 3 r/s | 5 | `/oauth/` |
| `pay` | 3 r/s | 5 | `/api/soul/pay` |

---

## Error Format

All endpoints return errors in this format:

```json
{
  "error": "error_code",
  "message": "Optional human-readable description."
}
```

Common error codes: `vault_locked`, `encrypted`, `permission_denied`,
`invalid_soul_identity`, `api_not_enabled`, `storage_error`, `method_not_allowed`,
`token_expired_or_invalid`, `amortization_not_active`, `soul_write_not_enabled`,
`tx_already_used`, `tx_not_found`, `paid_agent_restricted`
