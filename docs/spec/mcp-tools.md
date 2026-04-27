# MCP Tools Specification

**Version:** 2.0
**Protocol:** Model Context Protocol (MCP) — Streamable HTTP, stateless
**Auth:** OAuth 2.0 + PKCE (soul owner) · pol_access_token (paid agent)

---

## 1. Connection

```
MCP endpoint:     https://YOUR_DOMAIN/mcp
OAuth authorize:  https://YOUR_DOMAIN/oauth/authorize
OAuth token:      https://YOUR_DOMAIN/oauth/token
Discovery:        https://YOUR_DOMAIN/.well-known/oauth-authorization-server
```

The MCP server runs as a Node.js process (PM2, port 3098) proxied by OpenResty at `/mcp`.
It operates in stateless mode — no session IDs are issued or required.

---

## 2. Access Modes

### 2.1 Soul Owner (OAuth 2.0 + PKCE)

```
1. GET  /oauth/authorize?response_type=code&client_id=...&redirect_uri=...
                        &code_challenge=...&code_challenge_method=S256
   → HTML consent page (shows soul_id + permissions requested)

2. POST /oauth/authorize   { soul_id, cert, approved: true }
   → issues auth code (in-memory, 5 min TTL)

3. POST /oauth/token       { code, code_verifier, grant_type }
   → returns access_token (= service-token scoped to granted permissions)

4. All MCP tool calls      Authorization: Bearer {access_token}
```

Full access to all tools. Permissions governed by `api_context.json`.

### 2.2 Paid Agent (pol_access_token)

External AI agents that have paid on-chain receive a `pol_access_token` (48 hex chars)
via `POST /api/soul/pay`. They connect to the same MCP endpoint with this token.

Access is restricted to tools explicitly listed in the soul's `free_tools` configuration.
The token is time-limited (duration set by soul owner).

See [spec/auth.md §3](auth.md#3-pol_access_token--paid-agent-authentication) for the full payment and token flow.

---

## 3. Tool Catalog

### 3.1 soul_read

Read the soul's current context.

- **Soul owner:** returns full sys.md content
- **Paid agent:** returns only the `<!-- AGENT:START --> … <!-- AGENT:END -->` block

**Requires:** `soul` permission · or pol_access_token with `soul_read` in free_tools

**Input:** none

**Output:**
```
<sys.md content as text>
```

---

### 3.2 soul_write

Update sys.md content.

- **Soul owner:** targets a named `## Section` in sys.md
- **Paid agent:** writes only to the AGENT block (`<!-- AGENT:START --> … <!-- AGENT:END -->`). Requires `soul_write` in `free_tools`. Content containing AGENT markers is stripped (injection protection).

**Requires:** `soul` permission · or pol_access_token with `soul_write` in free_tools

**Input:**
```json
{
  "section": "Session Log (compressed)",
  "content": "### 2026-04-10\nNew session content...",
  "mode": "append"
}
```

For paid agents, `section` is ignored — write always targets the AGENT block.

| `mode` | Behavior |
|---|---|
| `replace` | Replace entire section/block content |
| `append` | Add content after existing content |
| `prepend` | Add content before existing content |

---

### 3.3 soul_maturity

Compute the soul's maturity score (0–100) from sys.md completeness.

**Requires:** `soul` permission · or pol_access_token with `soul_maturity` in free_tools

**Input:** none (optional `{ "access_token": "pol_access_token" }` for cross-soul)

**Output:**
```json
{
  "name": "Jan",
  "soul_id": "uuid-v4",
  "maturity_score": 72,
  "level": "Reif",
  "is_mature": true,
  "sessions": 45,
  "anchored": true,
  "breakdown": {
    "herkunft": 20, "tiefe": 25, "biometrie": 15,
    "archiv": 7, "signatur": 5
  }
}
```

---

### 3.4 soul_skills

Generate complete Claude skill definitions from all soul vault data.
Builds one skill file per sys.md section, one per context document (`.md`/`.txt` only),
and a root skill integrating all biometric profiles.

**Requires:** `soul` permission · or pol_access_token with `soul_skills` in free_tools

**Input:** none

**Output:**
```json
{
  "soul": "Jan",
  "skill_count": 8,
  "sources": {
    "soul_sections": 6,
    "context_files": 1,
    "profiles_loaded": ["face", "voice"]
  },
  "install_path": "~/.claude/skills/",
  "skills": [
    {
      "filename": "jan-sys.md",
      "heading": "Root (Soul-Kontext)",
      "source": "sys.md + profile",
      "content": "---\nname: jan-sys\n..."
    }
  ]
}
```

---

### 3.5 soul_discover

Search the public soul registry. No auth required — usable before payment.

**Requires:** none (public)

**Input:**
```json
{ "q": "KI-Experte Berlin" }
```

**Output:**
```json
{
  "results": [
    {
      "soul_id": "uuid-v4",
      "name": "Jan",
      "mcp_endpoint": "https://...",
      "price_pol": 0.001,
      "wallet": "0x...",
      "free_tools": ["soul_read", "soul_maturity"],
      "access_duration_hours": 24,
      "maturity": 72
    }
  ]
}
```

---

### 3.6 soul_earnings

Read the earnings ledger — all received Agent Marketplace payments.

**Requires:** `soul` permission (soul owner only)

**Input:** none

**Output:** Markdown-formatted earnings summary with total POL and payment history.

---

### 3.7 audio_list / audio_get

List or retrieve audio vault files.

**Requires:** `audio` permission

**audio_list input:** none

**audio_list output:**
```json
{
  "files": [
    { "name": "voice.mp3", "url": "...", "url_with_token": "...", "mime": "audio/mpeg", "active": true }
  ],
  "active_url": "https://..."
}
```

**audio_get input:**
```json
{ "filename": "voice.mp3" }
```

Returns a signed direct URL (token embedded — no Auth header needed for playback).

---

### 3.8 image_list / image_get

List or retrieve image vault files.

**Requires:** `images` permission

**image_list input:** none

**image_get input:**
```json
{ "filename": "profile.jpg" }
```

**image_get output:** Returns the image as a base64-encoded MCP `image` content block.
The image is directly visible to the AI — no fetch required.

```json
{ "filename": "profile.jpg", "size_kb": 420 }
```

---

### 3.9 video_list / video_get

List or retrieve video vault files.

**Requires:** `video` permission

**video_list input:** none

**video_get input:**
```json
{ "filename": "bewegung.webm", "max_frames": 6 }
```

`max_frames` — frames to extract, equally spaced over duration (1–12, default 6).

**video_get output:** ffmpeg extracts frames as JPEG, returned as base64-encoded MCP `image` blocks. All frames are directly analyzable.

---

### 3.10 context_list / context_get

List or retrieve text context files from `vault/context/`.

**Requires:** `context_files` permission

Only `.md` and `.txt` files are listed and retrievable. Binary files (PDF, DOCX) in the context directory are skipped.

**context_list input:** none (optional `{ "access_token": "pol_access_token" }`)

**context_get input:**
```json
{ "filename": "notes.md" }
```

---

### 3.11 profile_get / profile_save

Read or write structured analysis profiles.

**Requires:** `soul` permission + unlocked vault

**Profile types:** `face` · `voice` · `motion` · `expertise`

**profile_get input:**
```json
{ "type": "face" }
```

If no profile exists, returns `{ "exists": false, "how_to_create": "..." }`.

**profile_save input:**
```json
{
  "type": "face",
  "data": {
    "description": "...",
    "features": { "glasses": "...", "hair": "...", "beard": "..." },
    "expression": "neutral-ruhig",
    "estimated_age": "47–50",
    "notes": "..."
  }
}
```

Recommended data structures:
- **face:** `{ description, features, expression, estimated_age, style, notes }`
- **voice:** `{ tone, pace, energy, style, vocabulary_markers, notes }`
- **motion:** `{ energy_level, gesture_style, presence, posture, behavioral_notes }`
- **expertise:** `{ domains[], strengths[], experience_level, notes }`

**Typical workflow:**
1. `image_get` → analyze face → `profile_save face`
2. `video_get` → analyze motion frames → `profile_save motion`
3. `soul_read` → derive expertise → `profile_save expertise`

---

### 3.12 calendar_read

Read the `## Calendar` section of sys.md.

**Requires:** `calendar` permission · or pol_access_token with `calendar_read` in free_tools

**Input:** none (optional `{ "access_token": "pol_access_token" }`)

**Output:** Calendar section content as text.

---

### 3.13 beme_chat

Talk to the soul — the AI responds as the soul owner would.

**Requires:** `soul` permission + unlocked vault

**Input:**
```json
{
  "message": "Was denkst du über dieses Projekt?",
  "history": [
    { "role": "user",      "content": "Hallo!" },
    { "role": "assistant", "content": "Hey, schön dass du da bist." }
  ],
  "max_tokens": 1024
}
```

| Field | Required | Description |
|---|---|---|
| `message` | ✓ | Current user message (max 8000 chars) |
| `history` | — | Prior conversation turns (max 20, optional) |
| `max_tokens` | — | Max response length (64–4096, default 1024) |

**Output:**
```json
{ "response": "...", "soul_name": "Jan", "model": "claude-sonnet-4-6" }
```

Server reads sys.md, builds the system prompt, calls Anthropic API server-side.
No Anthropic API key needed in the MCP client.

---

### 3.14 network_list

List all connected souls in the Soul Network.

**Requires:** `soul` permission

**Output:**
```json
{
  "connections": [
    { "soul_id": "...", "alias": "...", "grant_level": "read", "connected_at": "..." }
  ]
}
```

---

### 3.15 network_peer_get

Read shared content from a connected peer's Public Vault.

**Requires:** `soul` permission + peer must have granted `soul_grant` access

**Input:**
```json
{ "soul_id": "uuid-v4" }
```

Optional — read a single file:
```json
{ "soul_id": "uuid-v4", "file": "report.pdf" }
```

**Output (manifest mode):**
- `soul_content` — peer's sys.md (if `soul` scope granted)
- Text/Markdown files — inline as text blocks
- PDF files — as MCP `resource` blob (application/pdf, directly readable)
- Images, Audio, Video — listed by name

---

## 4. Paid Agent Tool Summary

Tools accessible via pol_access_token, subject to soul owner's `free_tools` configuration:

| Tool | free_tools key | Notes |
|---|---|---|
| `soul_read` | `soul_read` | Returns AGENT block only |
| `soul_write` | `soul_write` | Writes to AGENT block only, markers stripped |
| `soul_maturity` | `soul_maturity` | |
| `soul_skills` | `soul_skills` | |
| `soul_discover` | — | Always public, no token needed |
| `audio_list` | `audio_list` | |
| `audio_get` | `audio_get` | |
| `image_list` | `image_list` | |
| `image_get` | `image_get` | |
| `video_list` | `video_list` | |
| `video_get` | `video_get` | |
| `context_list` | `context_list` | |
| `context_get` | `context_get` | |
| `profile_get` | `profile_get` | |
| `calendar_read` | `calendar_read` | |
| `soul_earnings` | — | Soul owner only, never paid agents |

---

## 5. Error Responses

All tools return structured errors:

```json
{ "error": "error_code", "message": "Human-readable description." }
```

| Code | HTTP | Meaning |
|---|---|---|
| `vault_locked` | 403 | Vault key not in active session |
| `encrypted` | 403 | Content is encrypted, no key available |
| `permission_denied` | 403 | Service-token lacks required permission |
| `not_found` | 404 | Resource does not exist |
| `soul_not_synced` | 404 | No sys.md uploaded to VPS |
| `api_disabled` | 403 | API context not enabled by user |
| `token_expired_or_invalid` | 401 | pol_access_token invalid or expired |
| `amortization_not_active` | 402 | Soul not registered in Agent Marketplace |
| `soul_write_not_enabled` | 403 | soul_write not in free_tools |
| `paid_agent_restricted` | 403 | Endpoint not accessible to paid agents |

---

## 6. Rate Limits

| Zone | Rate | Burst | Endpoints |
|---|---|---|---|
| `mcp` | 5 r/s | 10 | `/mcp` |
| `oauth` | 3 r/s | 5 | `/oauth/` |
| `chat` | 2 r/s | 20 | `/api/vault/connections/*`, `/api/vault/peer-stream`, `/api/beme` |
