# MCP Tools Specification

**Version:** 1.1
**Protocol:** Model Context Protocol (MCP) — Streamable HTTP transport
**Auth:** OAuth 2.0 + PKCE

---

## 1. Connection

```
MCP endpoint:     https://YOUR_DOMAIN/mcp
OAuth authorize:  https://YOUR_DOMAIN/oauth/authorize
OAuth token:      https://YOUR_DOMAIN/oauth/token
Discovery:        https://YOUR_DOMAIN/.well-known/oauth-authorization-server
```

The MCP server runs as a Node.js process proxied by OpenResty at `/mcp`.

---

## 2. OAuth Flow

```
1. GET  /oauth/authorize?response_type=code
                        &client_id=...
                        &redirect_uri=...
                        &code_challenge=...
                        &code_challenge_method=S256
   → HTML consent page (shows soul_id + permissions requested)

2. POST /oauth/authorize   { soul_id, cert, approved: true }
   → issues auth code (in-memory, 5 min TTL)

3. POST /oauth/token       { code, code_verifier, grant_type }
   → returns access_token (= service-token scoped to granted permissions)

4. All MCP tool calls      Authorization: Bearer {access_token}
```

The access token is a SYS service-token. It is validated by the same
mechanism as direct API service-tokens (see `spec/auth.md` §3).

---

## 3. Tool Catalog

### 3.1 soul_read

Read the full soul.md content.

**Requires:** `soul` permission

**Input:** none

**Output:**
```json
{ "content": "---\nsoul_id: ...\n---\n\n## Core Identity\n..." }
```

---

### 3.2 soul_write

Update a `## Section` in soul.md.

**Requires:** `soul` permission

**Input:**
```json
{
  "section": "Session Log (compressed)",
  "content": "### 2026-04-10\nNew session content...",
  "mode": "append"
}
```

| `mode` | Behavior |
|---|---|
| `replace` | Replace entire section content |
| `append` | Add content after existing section content |
| `prepend` | Add content before existing section content |

If the section does not exist, it MUST be created.

---

### 3.3 soul_maturity

Compute and optionally persist the maturity score.

**Requires:** `soul` permission

**Input:**
```json
{ "save": true }
```

**Output:**
```json
{ "score": 72, "breakdown": { "core_identity": 1, "values": 1, "session_log": 1, ... } }
```

---

### 3.4 soul_skills

List declared skills or invoke a skill handler.

**Requires:** `soul` permission

**Input (list):**
```json
{ "action": "list" }
```

**Input (invoke):**
```json
{ "action": "invoke", "skill": "skill-name", "params": {} }
```

Skills are declared in the `## Skills` section of soul.md as structured YAML blocks.

---

### 3.5 vault_manifest

Return the full vault index.

**Requires:** Any vault permission

**Input:** none

**Output:**
```json
{
  "soul_id": "...",
  "enabled": true,
  "cipher_mode": "ciphered",
  "permissions": { "soul": true, "audio": true, ... },
  "synced_files": { "audio": ["file.mp3"], "images": [], ... },
  "active_files": { "audio": "file.mp3" },
  "endpoints": { "soul": "/api/soul", "audio": "/api/vault/audio", ... }
}
```

---

### 3.6 audio_list / audio_get

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

Returns binary audio data as base64, or a signed URL for direct download.

---

### 3.7 image_list / image_get

List or retrieve image vault files.

**Requires:** `images` permission

**image_list input:** none

**image_get input:**
```json
{ "filename": "profile.jpg" }
```

**image_get output:** Returns the image as a base64-encoded MCP `image` content block plus metadata:
```json
{ "filename": "profile.jpg", "size_kb": 420, "hint": "Bild direkt analysieren, dann profile_save face aufrufen." }
```

The image content block is directly visible to Claude — no fetch required. Claude can
analyze it immediately and call `profile_save face` with the result.

---

### 3.8 video_list / video_get

List or retrieve video vault files.

**Requires:** `video` permission

**video_list input:** none

**video_get input:**
```json
{ "filename": "bewegung.webm", "max_frames": 6 }
```

`max_frames` — number of frames to extract, equally spaced over the video duration (1–12, default 6).

**video_get output:** ffmpeg extracts `max_frames` JPEG frames from the video and returns each as a base64-encoded MCP `image` content block. Claude can analyze all frames directly for motion analysis.

```json
{
  "filename": "motion_body.webm",
  "duration_sec": 57,
  "size_kb": 13803,
  "frames_extracted": 6,
  "hint": "Frames analysieren, dann profile_save motion aufrufen."
}
```

Each frame is preceded by a label (`Frame N/total (Xs):`) and followed by an image block.

**Requires ffmpeg** on the MCP host (`/usr/bin/ffmpeg`).

---

### 3.10 context_list / context_get

List or retrieve text context files from `vault/context/`.

**Requires:** `context_files` permission

Same interface as `audio_list` / `audio_get` for text types (`.md`, `.txt`).

---

### 3.11 profile_get / profile_save

Read or write structured analysis profiles stored in `vault/profile/{type}.json`.
Profiles are always AES-256-CBC encrypted on disk.

**Requires:** `soul` permission + unlocked vault (vault_key in session)

**Profile types (fixed enum):** `face` · `voice` · `motion` · `expertise`

**profile_get input:**
```json
{ "type": "face" }
```

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

### 3.13 network_list

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

### 3.14 network_peer_get

Read the soul.md of a connected peer (if they have granted access).

**Requires:** `soul` permission + peer must have granted access

**Input:**
```json
{ "peer_soul_id": "uuid-v4" }
```

---

### 3.15 soul_cloud_push

Push an encrypted bundle to external storage (Arweave, HTTPS endpoint).

**Requires:** `soul` permission

**Input:**
```json
{
  "target": "arweave",
  "include_vault": false
}
```

The bundle is always AES-256-CBC encrypted before upload.
The server MUST NOT push plaintext content.

---

### 3.16 verify_human

Human-in-the-loop confirmation step. The AI client MUST pause and
wait for explicit user confirmation before proceeding.

**Input:**
```json
{
  "prompt": "Are you sure you want to delete all VPS data?",
  "timeout_seconds": 60
}
```

**Output:**
```json
{ "confirmed": true }
```

This tool SHOULD be called before any destructive or irreversible operation.

---

### 3.17 calendar_read

Read the `## Calendar` section of soul.md.

**Requires:** `calendar` permission

**Output:**
```json
{ "content": "..." }
```

---

### 3.18 elevenlabs_agent_update

Update the ElevenLabs conversational AI agent configuration for voice interactions.

**Requires:** `soul` permission + `ELEVENLABS_API_KEY` configured on server

**Input:**
```json
{
  "system_prompt": "...",
  "first_message": "..."
}
```

---

### 3.19 twilio_call_config

Configure an outbound Twilio call with voice agent settings.

**Requires:** `soul` permission + Twilio integration configured

---

## 4. Error Responses

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
| `soul_not_synced` | 404 | No soul.md uploaded to VPS |
| `api_disabled` | 403 | API context not enabled by user |

---

## 5. Rate Limits

| Zone | Rate | Burst | Endpoints |
|---|---|---|---|
| `mcp` | 5 r/s | 10 | `/mcp` |
| `oauth` | 3 r/s | 5 | `/oauth/` |
