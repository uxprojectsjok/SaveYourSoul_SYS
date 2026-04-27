# SaveYourSoul (SYS)

**Protocol, not a product.**

SYS defines a portable, user-controlled identity layer for AI systems — and an economic layer that lets AI agents pay to use it.

The project has two complementary pillars:

---

## Pillar 1 — The Identity Layer

The core unit is the **sys.md** — a Markdown file with YAML frontmatter that encodes a personal identity profile. It lives in the user's browser, grows with each session, and serves as authentic context for AI systems.

> **sys.md is a file about the user — not about the AI.** It encodes who you are (values, expertise, relationships, session history) so that AI systems can represent you authentically. This is the inverse of AI agent personality files: instead of defining how an agent speaks, sys.md defines what the agent knows about *you*.

**What it includes:**
- Identity profile (values, aesthetics, speech patterns, worldview)
- Session log (compressed history of interactions)
- Biometric profiles (face, voice, motion — stored locally, never shared without consent)
- Calendar context
- Vault (documents, audio, images, video — encrypted AES-256-CBC)
- Blockchain anchor (optional, Polygon IPFS via Pinata)

---

## Pillar 2 — The Agent Marketplace

AI agents do not merely read a soul — they can **pay for access** and **write back** to it.

The **Agent Marketplace** is a built-in economic layer on top of the identity layer. Soul owners publish a price (in POL, Polygon's native token) and a set of permitted tools. Any AI agent that wants access follows a fully automated three-step flow:

```
1. Agent discovers soul via /api/soul/discover  (public, no auth)
2. Agent sends POL to the soul owner's wallet on-chain
3. Agent reports tx_hash → server validates on-chain → issues pol_access_token
```

The pol_access_token is time-limited (duration set by the soul owner), grants access to the permitted MCP tools, and is scoped to a specific soul. The soul owner earns cryptocurrency passively — no intermediary, no platform cut.

**Available tools for agents:**

| Category | Tools |
|----------|-------|
| Identity | `soul_read`, `soul_maturity`, `soul_discover`, `soul_skills` |
| Write | `soul_write` (AGENT block only — sandboxed, marker-injection proof) |
| Media | `audio_list`, `audio_get`, `image_list`, `image_get`, `video_list`, `video_get` |
| Documents | `context_list`, `context_get` |
| Profiles | `profile_get` (face / voice / motion / expertise) |
| Schedule | `calendar_read` |
| Economy | `soul_earnings` |

The agent-writable section of sys.md (`<!-- AGENT:START --> … <!-- AGENT:END -->`) is sandboxed — agents cannot escape this block regardless of what content they write.

---

## ERC-8004 — The Future Layer

ERC-8004 (published October 2025, with contributions from experts at MetaMask, Ethereum Foundation, Google and Coinbase) is an emerging Ethereum standard for **AI agent identity**. It makes agents discoverable, verifiable, and interoperable through three on-chain registries:

- **Identity Registry** — each agent receives an ERC-721 NFT as its global identity, pointing to a structured JSON file declaring its capabilities, endpoints, and supported trust models
- **Reputation Registry** — client feedback (scores 0–100, tags, payment receipts) stored on-chain via EIP-7702 gasless flows
- **Validation Registry** — independent validators can re-execute tasks or verify cryptographic proofs

IPFS via Pinata is the recommended storage layer for agent registration files and reputation data — content addressing creates an audit trail with built-in verifiability.

**How SaveYourSoul connects:**

ERC-8004 solved the *agent* side of a problem that has two sides. It defines with great precision how an AI agent proves who it is — verifiable, reputatable, discoverable. In doing so, it also makes visible exactly what it does not address: the human on the other side of the interaction. That absence is not a flaw in the standard — it is the natural boundary of a specification that was designed to be focused. And it is precisely where SaveYourSoul begins.

The two systems are complementary layers of the same trust infrastructure:

| Layer | Standard | Subject |
|-------|----------|---------|
| User identity | SaveYourSoul (sys.md) | Who the human is |
| Agent identity | ERC-8004 | Who the AI agent is |

Together they form a complete trust chain: an agent that is verifiably who it claims to be (ERC-8004) accessing a human who is verifiably who they claim to be (SaveYourSoul). Neither standard requires the other — but each becomes significantly more meaningful in the presence of the other.

**The same standard, both directions**

ERC-8004 is generic by design. Its Identity Registry assigns an ERC-721 NFT to any entity that declares endpoints, capabilities, and trust models. There is no technical reason that entity must be an agent.

A soul registered on SaveYourSoul has all the properties ERC-8004 requires: a unique identifier (soul_id), a public endpoint (`/api/soul/discover`), declared capabilities (the MCP tools the owner has enabled), and a supported trust model (on-chain payment verification). A soul can participate in the ERC-8004 registry not as an agent, but as a first-class identity — discoverable by the same agents the standard was written for.

This means the standard works in both directions:

```
Agent  →  ERC-8004 registry  →  finds a Soul  →  pays  →  accesses via MCP
Soul   →  ERC-8004 registry  →  found by Agent  →  earns  →  controls access
```

The roadmap therefore is not an extension of ERC-8004 — it is the natural consequence of applying a well-designed standard to a domain its authors left open:

1. **Soul as ERC-8004 participant** — soul_id registered as ERC-721, `/api/soul/discover` declared as MCP endpoint in the identity file, stored on IPFS via Pinata
2. **Agent identity as access condition** — soul owners can require that paying agents present a valid ERC-8004 NFT before a pol_access_token is issued, completing the mutual verification loop
3. **Reputation in both directions** — interactions generate on-chain feedback for agents (ERC-8004 Reputation Registry) and verifiable access logs for souls
4. **Trustless token issuance** — pol_access_tokens backed by ERC-8004 on-chain state instead of server-side shared dicts, removing the server as a trusted intermediary

> ERC-8004 built the infrastructure for agent trust. SaveYourSoul is the inevitable counterpart — the infrastructure for human identity that the agent economy requires to be complete.

---

## Protocol Flow

```
sys.md  →  sessionStorage (browser)  →  never leaves without user action
         →  VPS (encrypted, AES-256-CBC, user-initiated)
         →  AI context (Anthropic Claude API, transient, user-initiated)
         →  MCP tools (soul_read / soul_write, authorized per token)
         →  Agent Marketplace (pol_access_token, on-chain payment gated)
         →  IPFS / Polygon (optional blockchain anchor)
```

The sys.md belongs to the user. The operator has no access to encrypted content. Encryption is the default, plaintext is an explicit opt-in.

---

## Repository Structure

```
├── ARCHITECTURE.md          Protocol specification & reference implementation docs
├── app/                     Nuxt 4 frontend (SSG, pure client-side)
│   └── components/
│       └── AgentMarketplacePanel.vue   Soul monetization UI
├── server/
│   ├── api/                 Nitro API routes (development only)
│   └── openresty/           Lua scripts for OpenResty (production API layer)
│       ├── soul_amortization.lua       Agent Marketplace configuration
│       ├── soul_pay.lua                On-chain payment verification
│       ├── soul_paid_write.lua         Sandboxed agent write endpoint
│       ├── soul_paid_read.lua          Paid agent soul read
│       └── vault_auth.lua              Multi-token auth (soul_cert / pol_access_token / service)
├── shared/
│   └── utils/               soulParser.js, soulMaturity.js — core protocol logic
├── soul-mcp/                MCP server (Node.js, Streamable HTTP, stateless)
│   └── tools/               MCP tool implementations
├── soul-whatsapp/           WhatsApp integration (Twilio Serverless)
├── soul-voice-clone/        ElevenLabs voice clone + conversational agent
├── browser-extension/       Chrome MV3 extension
└── docs/
    ├── overview.md          Protocol overview & design principles
    ├── quickstart.md        Getting started guide
    ├── spec/                Protocol specifications (soul-md, auth, mcp-tools)
    ├── api/                 API reference & examples
    └── architecture/        OpenResty, vault, encryption internals
```

---

## sys.md Format

```markdown
---
soul_id: 00000000-0000-0000-0000-000000000000
soul_name: ""
created: YYYY-MM-DD
last_session: YYYY-MM-DD
version: 1
soul_cert: [automatically generated]
vault_hash: ""
soul_growth_chain: []
soul_chain_anchor: null
storage_tx: ""
---

## Core Identity
## Values & Beliefs
## Aesthetics & Resonance
## Speech Patterns & Expression
## Recurring Themes & Obsessions
## Emotional Signature
## Worldview
## Unanswered Questions
## Session Log (compressed)
## Calendar

<!-- AGENT:START -->
[Agent-writable section — sandboxed]
<!-- AGENT:END -->
```

Full specification: [docs/spec/sys_md.md](docs/spec/sys_md.md)

---

## Authentication

Three token types, one auth layer (`vault_auth.lua`):

| Token | Format | Scope |
|-------|--------|-------|
| `soul_cert` | `{soul_id}.{hmac32}` | Full access, soul owner |
| `pol_access_token` | 48 hex chars | Paid agent, GET vault + agent write |
| `service_token` | arbitrary string | Authorized services, vault must be unlocked |

```
cert = HMAC-SHA256(SOUL_MASTER_KEY, soul_id).hex()[:32]
bearer = soul_id + "." + soul_cert
```

---

## MCP Integration

`soul-mcp/` implements the [Model Context Protocol](https://modelcontextprotocol.io) as a stateless Streamable HTTP server. Claude, or any MCP-compatible AI client, can connect and access sys.md and vault files with granular permissions.

Available tools across two access modes:
- **Soul owner** (soul_cert): full read/write access to all tools
- **Paid agent** (pol_access_token): access to tools explicitly enabled by the soul owner

---

## Self-Hosting

The production stack uses OpenResty (nginx + LuaJIT) as the API layer — no Node.js in production. See [docs/architecture/openresty.md](docs/architecture/openresty.md) for the full component breakdown and [docs/PRODUCTION_SETUP.md](docs/PRODUCTION_SETUP.md) for implementation notes.

There is no install script. The specification is complete; the engineering is up to the implementer.

---

## Status

- **Active development** — two-pillar architecture (identity layer + agent marketplace) production-ready
- **Reference implementation** — invite-only, experimental
- **ERC-8004** — shared infrastructure primitives (IPFS, Polygon, crypto tokens); integration roadmap planned
- **Protocol** — Apache 2.0, compatible implementations welcome

---

## Disclaimer

This software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement.

The authors and operators are not liable for any damages, data loss, downtime, security incidents, or other consequences arising from the use or misuse of this software. Use at your own risk.

---

## License

Apache License 2.0 — see [LICENSE](LICENSE)

Copyright 2026 Jan-Oliver Karo — UX-Projects, Marburg, Germany
