# SYS · SaveYourSoul

**Ein offenes Protokoll für digitale Identität im KI-Zeitalter.**

> 🌐 Homepage: [sys.uxprojects-jok.com](https://sys.uxprojects-jok.com)
> 🛠️ Implementierungs-Repo: [github.com/uxprojectsjok/personal-sys-vps](https://github.com/uxprojectsjok/personal-sys-vps) *(in aktiver Entwicklung — noch nicht zur eigenen Installation geeignet)*

---

*Deutsch · [English below](#english)*

---

## Was ist SYS?

SYS ist kein Produkt. Es ist ein **Protokoll** — ein entstehender Layer zwischen dem Menschen und der KI-Infrastruktur des Internets.

Das heutige Internet kennt Accounts, Profile, Cookies. Es kennt keinen Menschen. KI-Systeme wissen vieles über Nutzer — aber das Wissen ist fragmentiert, plattformgebunden, entzogen.

SYS beschreibt eine andere Architektur: **eine kryptographisch signierte, lokal gespeicherte Identitätsdatei (`sys.md`)**, die als persistenter Kontext für KI-Agenten dient — auf einem selbst kontrollierten Node, peer-to-peer vernetzt, optionale On-chain-Verankerung über Polygon.

Kein zentraler Dienst. Kein Plattformzwang. Deine Identität gehört dir.

---

## Das sys.md-Format

`sys.md` ist das offene Dateiformat des Protokolls — Markdown mit YAML-Frontmatter. Eine Datei beschreibt eine Person: Werte, Interessen, Beziehungen, Kontexte, Erinnerungen.

- Offen und menschenlesbar
- Versionierbar (Git, lokale Snapshots)
- Kryptographisch signierbar
- Als MCP-Kontext direkt an jeden kompatiblen KI-Client übergebar
- Optional on-chain verankert (Polygon Mainnet)

Die Datei wächst. Nach jeder bedeutsamen Session kann ein KI-Agent neue Erkenntnisse einschreiben — mit Zustimmung des Nutzers. Die Soul ist lebendig.

---

## Fünf Bausteine

### I · Soul Protocol
Eine kryptographisch signierte Identitätsdatei, die deine Persönlichkeit strukturiert erfasst. Das Protokoll definiert Schema, Signatur, Versionierung und Sync-Mechanismus. Die Soul wächst mit jeder Session.

### II · Memory Vault
Ein lokal verschlüsselter Datei-Tresor (AES-256-CBC) für persönliche Medien: Stimme, Gesicht, Bewegung, Bilder, Texte. Der Vault verlässt das Gerät niemals unverschlüsselt. 12-Wort-Mnemonic für Zero-Knowledge-Wiederherstellung.

### III · AI Interface
Die KI liest die Soul als Kontext. Antworten sind personalisiert, ohne dass Rohdaten das System verlassen. Automatische Soul-Anreicherung nach bedeutsamen Gesprächen. Kompatibel mit Claude, Cursor, Continue.dev und jedem MCP-Client.

### IV · Soul Network
Nodes verbinden sich peer-to-peer. Peers tauschen Soul-Kontext, Kalendereinträge und freigegebene Vault-Inhalte direkt aus — kryptographisch gesichert, ohne Zwischendienst. Mehrstufige Zugangskontrolle pro Node.

### V · Agent Marketplace
Der wirtschaftliche Layer des Protokolls. Nodes registrieren sich im dezentralen IPFS-Verzeichnis. Externe KI-Agenten entdecken Nodes, zahlen in POL (Polygon) und erhalten zeitlich begrenzten MCP-Zugang. Jeder Zugriff wird on-chain abgerechnet. Der Node-Betreiber bestimmt Preis, Laufzeit und Umfang.

---

## Protokoll-Stack

| Schicht | Technologie |
|--------|-------------|
| Identitätsformat | `sys.md` · Markdown+YAML · open spec |
| Verschlüsselung | AES-256-CBC (Browser) · AES-256-GCM (Server) |
| KI-Schnittstelle | MCP (Model Context Protocol) · open |
| Peer-Netzwerk | Direkt · Node-zu-Node |
| Verzeichnis | IPFS · dezentral |
| On-chain Anker | Polygon Mainnet |
| Node-Software | Node.js · Lua API · OpenResty |

---

## Roadmap

**Phase 1 — Abgeschlossen ✓ (2026)**
Soul Protocol · Memory Vault · Verschlüsselung · Biometrischer Zugang · MCP Server · Soul Network · Polygon-Anker · Browser-Erweiterung · PWA · KI-Bildgenerierung

**Beta — Live / In finaler Testphase (2026)**
Agent Marketplace · Einnahmen per KI-Zugriff · Dezentrale Verzeichnis-Registrierung · **Multi-Hoster-Modus** *(letzte Tests)* · Mehrere Soul-Versionen · Schlüsselverwaltung · Offenes Protokoll

**Vision — Langfristig**
Interoperable Identitäten · Agenten-Identität als Zugangsbedingung · Bidirektionale Reputation on-chain · Automatische Zugangsvergabe · Geräteübergreifende Identitäten · Robotik-Integration · Community-Governance

---

## Diese Repository

Dieses Repo enthält **keine installierbare Software** und keinen ausführbaren Code.

Es dient — neben der Homepage — als öffentliche Plattform für:
- **Protokoll-Dokumentation** und offene Spezifikationen
- **Community-Abstimmungen** über Erweiterungen des Formats und Protokolls
- **Issues und Diskussionen** zur Vision und Richtung
- **Kollaborative Docs** zu sys.md-Schema, MCP-Schnittstelle und Netzwerkverhalten

Die eigentliche Implementierung (Node-Software, Lua API, MCP-Server, Init-Skript) liegt in einem separaten, nicht öffentlichen Repository und ist nicht zur eigenen Installation vorgesehen.

→ **Homepage mit vollständiger Dokumentation:** [sys.uxprojects-jok.com](https://sys.uxprojects-jok.com)

---

## Mitmachen

Diskussionen, Ideen und Protokoll-Vorschläge sind willkommen — über GitHub Issues oder Discussions.

Kein Pull-Request-Workflow für Code, da sich kein ausführbarer Code in diesem Repo befindet. Protokoll-Erweiterungen werden als Markdown-Proposals diskutiert.

---

## Lizenz

Apache License 2.0 · Copyright 2026 Jan-Oliver Karo — UX-Projects, Marburg, Germany

---
---

## English

# SYS · SaveYourSoul

**An open protocol for digital identity in the age of AI.**

> 🌐 Homepage: [sys.uxprojects-jok.com](https://sys.uxprojects-jok.com)
> 🛠️ Implementation repo: [github.com/uxprojectsjok/personal-sys-vps](https://github.com/uxprojectsjok/personal-sys-vps) *(actively developed — not yet suitable for self-installation)*

---

## What is SYS?

SYS is not a product. It is a **protocol** — an emerging layer between the human and the AI infrastructure of the internet.

Today's internet knows accounts, profiles, cookies. It does not know a person. AI systems know a great deal about users — but that knowledge is fragmented, platform-bound, and inaccessible to the user.

SYS describes a different architecture: **a cryptographically signed, locally stored identity file (`sys.md`)** that serves as persistent context for AI agents — on a self-controlled node, connected peer-to-peer, with optional on-chain anchoring via Polygon.

No central service. No platform dependency. Your identity belongs to you.

---

## The sys.md Format

`sys.md` is the open file format of the protocol — Markdown with YAML frontmatter. One file describes one person: values, interests, relationships, contexts, memories.

- Open and human-readable
- Versionable (Git, local snapshots)
- Cryptographically signable
- Passable as MCP context directly to any compatible AI client
- Optionally anchored on-chain (Polygon Mainnet)

The file grows. After every meaningful session, an AI agent can write new insights into it — with the user's consent. The soul is alive.

---

## Five Pillars

### I · Soul Protocol
A cryptographically signed identity file that captures your personality in a structured way. The protocol defines schema, signature, versioning and sync mechanism. The soul grows with every session.

### II · Memory Vault
A locally encrypted file vault (AES-256-CBC) for personal media: voice, face, motion, images, texts. The vault never leaves the device unencrypted. 12-word mnemonic for zero-knowledge recovery.

### III · AI Interface
The AI reads the soul as context. Responses are personalised without raw data leaving the system. Automatic soul enrichment after meaningful conversations. Compatible with Claude, Cursor, Continue.dev and any MCP client.

### IV · Soul Network
Nodes connect peer-to-peer. Peers exchange soul context, calendar entries and shared vault contents directly — cryptographically secured, without intermediary services. Multi-level access control per node.

### V · Agent Marketplace
The economic layer of the protocol. Nodes register in the decentralised IPFS directory. External AI agents discover nodes, pay in POL (Polygon) and receive time-limited MCP access. Every access is settled on-chain. The node operator sets price, duration and scope.

---

## Protocol Stack

| Layer | Technology |
|-------|-----------|
| Identity format | `sys.md` · Markdown+YAML · open spec |
| Encryption | AES-256-CBC (browser) · AES-256-GCM (server) |
| AI interface | MCP (Model Context Protocol) · open |
| Peer network | Direct · node-to-node |
| Directory | IPFS · decentralised |
| On-chain anchor | Polygon Mainnet |
| Node software | Node.js · Lua API · OpenResty |

---

## Roadmap

**Phase 1 — Completed ✓ (2026)**
Soul Protocol · Memory Vault · Encryption · Biometric access · MCP Server · Soul Network · Polygon anchor · Browser extension · PWA · AI image generation

**Beta — Live / Final testing (2026)**
Agent Marketplace · Revenue per AI access · Decentralised directory registration · **Multi-hoster mode** *(final tests)* · Multiple soul versions · Key management · Open protocol

**Vision — Long-term**
Interoperable identities · Agent identity as access condition · Bidirectional reputation on-chain · Automatic access granting · Cross-device identities · Robotics integration · Community governance

---

## This Repository

This repo contains **no installable software** and no executable code.

It serves — alongside the homepage — as a public platform for:
- **Protocol documentation** and open specifications
- **Community alignment** on format and protocol extensions
- **Issues and discussions** on vision and direction
- **Collaborative docs** on the sys.md schema, MCP interface and network behaviour

The actual implementation (node software, Lua API, MCP server, init script) lives in a separate, non-public repository and is not intended for self-installation.

→ **Homepage with full documentation:** [sys.uxprojects-jok.com](https://sys.uxprojects-jok.com)

---

## Contributing

Discussions, ideas and protocol proposals are welcome — via GitHub Issues or Discussions.

No pull-request workflow for code, as no executable code lives in this repo. Protocol extensions are discussed as Markdown proposals.

---

## License

Apache License 2.0 · Copyright 2026 Jan-Oliver Karo — UX-Projects, Marburg, Germany
