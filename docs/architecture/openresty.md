# OpenResty Architecture

---

## 1. Why OpenResty

The reference implementation uses OpenResty (nginx + LuaJIT) as the primary
API layer in production. All business logic runs in Lua scripts — with one
exception: the MCP server runs as a separate Node.js process proxied by OpenResty.

| Concern | Solution |
|---|---|
| Static frontend | `nuxt generate` produces a static SPA; OpenResty serves it |
| Key isolation | `ANTHROPIC_API_KEY` and `SOUL_MASTER_KEY` never reach the browser |
| Performance | nginx-native request handling, Lua runs in-process |
| MCP protocol | Node.js process for Streamable HTTP + OAuth 2.0 (proxied at `/mcp`) |

---

## 2. Backend Processes

One Node.js process runs behind OpenResty, managed by PM2:

| Process | Manager | Port | Proxied at | Purpose |
|---|---|---|---|---|
| `soul-mcp` | PM2 | `127.0.0.1:3098` | `/mcp`, `/oauth/`, `/.well-known/oauth-*` | MCP Streamable HTTP server, OAuth 2.0 + PKCE |

All other endpoints are handled by Lua scripts running inside OpenResty — no additional processes.

**Useful PM2 commands:**
```bash
pm2 status                  # show all processes
pm2 restart soul-mcp        # restart after code changes
pm2 logs soul-mcp           # tail logs
pm2 show soul-mcp           # full process details
```

**soul-mcp endpoints exposed via proxy:**

| Path | Forwarded to |
|---|---|
| `POST /mcp` | `http://127.0.0.1:3098/mcp` — MCP Streamable HTTP (tool calls) |
| `GET /oauth/authorize` | `http://127.0.0.1:3098/oauth/authorize` — OAuth consent page |
| `POST /oauth/authorize` | `http://127.0.0.1:3098/oauth/authorize` — Approve / issue auth code |
| `POST /oauth/token` | `http://127.0.0.1:3098/oauth/token` — Exchange code for access token |
| `GET /.well-known/oauth-authorization-server` | `http://127.0.0.1:3098/...` — OAuth discovery |
| `GET /.well-known/oauth-protected-resource` | `http://127.0.0.1:3098/...` — MCP resource discovery |
| `GET /health` | `http://127.0.0.1:3098/health` — Health check |

---

## 2. Request Flow

```
Browser (SPA)
    │
    │  HTTPS / TLS
    ▼
OpenResty (nginx + LuaJIT)
    │
    ├── /                    → static files (.output/public/)
    ├── /api/soul-cert       → soul_cert.lua          (no auth)
    ├── /api/soul-sign-sess  → soul_sign_session.lua  (no auth)
    ├── /api/fetch-bundle    → fetch_bundle.lua        (no auth)
    ├── /api/validate        → soul_auth.lua → 200
    ├── /api/context         → soul_auth.lua → api_context.lua
    ├── /api/vault/unlock    → soul_auth.lua → vault_unlock.lua
    ├── /api/vault/sync      → soul_auth.lua → vault_sync.lua
    ├── /api/chat            → soul_auth.lua → Anthropic proxy (SSE)
    ├── /api/soul-update     → soul_auth.lua → Anthropic proxy (JSON)
    ├── /api/soul/v1/token   → soul_auth.lua → soul_token_jwt.lua
    ├── /api/soul            → vault_auth.lua → api_serve.lua
    ├── /api/vault/*         → vault_auth.lua → api_serve.lua
    ├── /api/webhook         → vault_auth.lua → webhook.lua
    ├── /api/webhook/mnemonic → webhook_mnemonic.lua  (BIP39 auth)
    ├── /api/vault/external  → vault_auth.lua → external_vault.lua
    ├── /api/vision          → soul_auth.lua → vision_analyze.lua
    ├── /api/tts             → soul_auth.lua → tts.lua
    ├── /api/wavespeed/*     → soul_auth.lua → wavespeed_*.lua
    ├── /api/beme            → vault_auth.lua → beme.lua
    ├── /mcp                 → proxy → soul-mcp (Node.js :3098)
    └── /oauth/              → proxy → soul-mcp (Node.js :3098)
```

---

## 3. Auth Guards

Two Lua access-phase guards protect different endpoint classes:

### soul_auth.lua

Validates `Authorization: Bearer {soul_id}.{cert}`.

On success:
- Sets `ngx.ctx.soul_id`
- Clears `Authorization` header (prevents forwarding to Anthropic)

On failure: returns `ngx.exit(401)`

### vault_auth.lua

Extended guard for vault and webhook endpoints. Accepts three auth methods in order:

1. **soul_cert** (`Bearer {soul_id}.{cert}`) — full owner access
2. **pol_access_token** (`Bearer {48hexchars}`) — paid agent, restricted GET + AGENT write
3. **service_token** (`Bearer {64hexchars}` or `X-Webhook-Token`) — scoped service access
4. **query param** (`?token={token}`) — for direct file downloads

On success sets: `ngx.ctx.soul_id`, `ngx.ctx.vault_key`,
`ngx.ctx.via_webhook`, `ngx.ctx.service_permissions`, `ngx.ctx.is_paid_agent`

---

## 4. Lua Script Inventory

### Auth Guards (access phase)

| File | Purpose |
|---|---|
| `soul_auth.lua` | soul_cert validation — used by chat, vault/sync, api/context |
| `vault_auth.lua` | soul_cert + pol_access_token + service_token — used by soul, vault/*, webhook |
| `hmac_helper.lua` | HMAC-SHA256 helper, cert derivation, cert version tracking |

### Core Soul

| File | Endpoint(s) | Purpose |
|---|---|---|
| `soul_cert.lua` | `POST /api/soul-cert` | Cert derivation (no auth) |
| `soul_sign_session.lua` | `POST /api/soul-sign-session` | Growth chain entry signing |
| `soul_token_jwt.lua` | `POST /api/soul/v1/token` | JWT issuance |
| `soul_rotate_cert.lua` | `POST /api/soul/rotate-cert` | Cert version rotation |
| `soul_meta.lua` | `GET /api/soul/meta` | Soul metadata (public) |
| `api_context.lua` | `GET/PUT /api/context` | API context + sys.md upload |
| `api_serve.lua` | `GET /api/soul`, `GET /api/vault/*` | sys.md + vault file serving |

### Vault

| File | Endpoint(s) | Purpose |
|---|---|---|
| `vault_unlock.lua` | `POST /api/vault/unlock` | Start vault session with AES key |
| `vault_sync.lua` | `POST /api/vault/sync` | File upload + ClamAV + ffmpeg conversion |
| `vault_delete.lua` | `DELETE /api/vault/{type}/{file}` | File deletion |
| `vault_profile.lua` | `GET/PUT/DELETE /api/vault/profile/{type}` | Biometric profile read/write |
| `vault_profile_analyze.lua` | `POST /api/vault/profile/analyze` | AI-assisted profile generation |
| `vault_public.lua` | `/api/vault/public/*` | Public vault serving + grants |
| `vault_services.lua` | `/api/vault/services/*` | Service token management |
| `vault_connections_peer.lua` | `/api/vault/peer-stream` | Peer vault binary stream |

### Agent Marketplace

| File | Endpoint(s) | Purpose |
|---|---|---|
| `soul_amortization.lua` | `GET/PUT /api/soul/amortization` | Marketplace config (price, tools, duration) |
| `soul_pay.lua` | `POST /api/soul/pay` | On-chain TX verification → pol_access_token |
| `soul_pol_validate.lua` | internal | Polygon RPC TX validation helper |
| `soul_verify_cache.lua` | internal | TX replay-protection cache (48h) |
| `soul_paid_read.lua` | `GET /api/soul/paid-read` | AGENT block read for paid agents |
| `soul_paid_write.lua` | `POST /api/soul/paid-write` | AGENT block write (sandboxed) |
| `soul_register.lua` | `POST /api/soul/register` | Publish soul to IPFS registry |
| `soul_register_preview.lua` | `GET /api/soul/register` | Preview IPFS payload |
| `soul_earnings.lua` | `GET /api/soul/earnings` | Earnings ledger |
| `soul_pinata_config.lua` | internal | Pinata IPFS API helper |

### Soul Network & Integrations

| File | Endpoint(s) | Purpose |
|---|---|---|
| `soul_connections.lua` | `/api/vault/connections/*` | Soul network peer connections |
| `beme.lua` | `POST /api/beme` | beme_chat: reads sys.md, calls Anthropic server-side |
| `webhook.lua` | `POST /api/webhook` | Generic webhook (all resources in one response) |
| `webhook_mnemonic.lua` | `POST /api/webhook/mnemonic` | BIP39-authenticated webhook |
| `external_vault.lua` | `GET /api/vault/external/soul` | Fetch soul from external URL |
| `fetch_bundle.lua` | `POST /api/fetch-bundle` | Fetch encrypted bundle (no auth) |

### Media & AI

| File | Endpoint(s) | Purpose |
|---|---|---|
| `vision_analyze.lua` | `POST /api/vision-analyze` | Claude Vision proxy |
| `tts.lua` | `POST /api/tts` | ElevenLabs TTS proxy |
| `wavespeed_submit.lua` | `POST /api/wavespeed/submit` | WaveSpeed AI image generation |
| `wavespeed_result.lua` | `GET /api/wavespeed/result` | WaveSpeed result polling |
| `soul_paid_beme.lua` | `POST /api/soul/paid-beme` | beme_chat for paid agents |
| `soul_paid_context.lua` | `GET /api/soul/paid-context` | Context files for paid agents |
| `soul_paid_earnings.lua` | `GET /api/soul/paid-earnings` | Earnings via paid token |
| `soul_paid_profile.lua` | `GET /api/soul/paid-profile/{type}` | Profile read for paid agents |

---

## 5. Dev vs Production

```
┌─────────────────────────────────┐    ┌────────────────────────────────┐
│  nuxt dev (local)               │    │  nuxt generate → VPS           │
├─────────────────────────────────┤    ├────────────────────────────────┤
│  Vite dev server                │    │  Static files only             │
│  server/api/*.js  ←── mirrors   │    │  OpenResty Lua scripts         │
│  └── soul-cert.post.js          │    │  └── soul_cert.lua             │
│  └── chat.post.js               │    │  └── (Anthropic proxy)         │
│  └── soul-update.post.js        │    │  └── (soul-update proxy)       │
│  └── soul-sign-session.post.js  │    │  └── soul_sign_session.lua     │
│  └── soul/v1/token.post.js      │    │  └── soul_token_jwt.lua        │
└─────────────────────────────────┘    └────────────────────────────────┘
```

Both environments MUST exhibit identical behavior.
Changes to a JS handler MUST be mirrored in the corresponding Lua script.

---

## 6. Environment Variables

Declared in `nginx.conf` `main` block (required for Lua access):

```nginx
env ANTHROPIC_API_KEY;
env SOUL_MASTER_KEY;
env API_SIGNING_KEY;
env ELEVENLABS_API_KEY;
env WAVESPEED_KEY;
```

Injected via systemd override:

```ini
[Service]
Environment="ANTHROPIC_API_KEY=..."
Environment="SOUL_MASTER_KEY=..."
Environment="API_SIGNING_KEY=..."
```

After editing the override: `sudo systemctl restart openresty`
(`reload` is insufficient — workers inherit environment only on restart)

---

## 7. Security Headers

Applied via `more_set_headers` (headers-more-nginx-module, built into OpenResty).
Using `more_set_headers` instead of `add_header` ensures headers are inherited
by all location blocks, including those with their own `add_header` directives.

```nginx
more_set_headers "Strict-Transport-Security: max-age=63072000; includeSubDomains; preload";
more_set_headers "X-Content-Type-Options: nosniff";
more_set_headers "Referrer-Policy: no-referrer";
more_set_headers "Cross-Origin-Opener-Policy: same-origin";
```

CSP nonce is generated per request using `resty.random` (CSPRNG):

```lua
set_by_lua_block $nonce {
  local random = require("resty.random")
  local str    = require("resty.string")
  return str.to_hex(random.bytes(12))
}
```

---

## 8. Additional Server Dependencies

| Package | Purpose | Install |
|---|---|---|
| `lua-resty-openssl` | PBKDF2 + HMAC for `webhook_mnemonic.lua` | `opm get fffonion/lua-resty-openssl` |
| `resty.http` | HTTP client for external fetches | Built into OpenResty |
| `resty.aes` | AES-256-CBC | Built into OpenResty |
| `ffmpeg` | Audio/video conversion | `apt install ffmpeg` |
| `clamav-daemon` | Malware scanning | `apt install clamav-daemon` |

### resty.http DNS resolution

Any location block that uses `resty.http` to make outbound HTTP requests (e.g. `beme.lua`
calling `api.anthropic.com`) **must** include a `resolver` directive. OpenResty's Lua HTTP
client does not use the system resolver — it requires an explicit DNS server in the nginx config:

```nginx
location = /api/beme {
  resolver 1.1.1.1 8.8.8.8 valid=60s ipv6=off;
  resolver_timeout 5s;
  ...
}
```

Without this, `resty.http` returns a DNS resolution failure even though `curl` works from the shell.
