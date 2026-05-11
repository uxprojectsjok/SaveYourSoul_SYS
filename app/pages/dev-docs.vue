<template>
  <div class="docs-page">

    <nav class="l-nav">
      <div class="lockup">
        <span class="mark">SYS<span class="dot">.</span></span>
      </div>
      <div class="center"><span class="page-title">Dev-Dokumentation</span></div>
      <button class="back" @click="$router.back()" aria-label="Zurück">← Zurück</button>
    </nav>

    <div class="docs-layout">

      <!-- Sticky sidebar -->
      <aside class="docs-sidebar">
        <nav>
          <div v-for="group in nav" :key="group.label" class="nav-group">
            <span class="nav-label">{{ group.label }}</span>
            <a
              v-for="item in group.items"
              :key="item.id"
              :href="'#' + item.id"
              class="nav-item"
              :class="{ active: active === item.id }"
              @click.prevent="scrollTo(item.id)"
            >{{ item.title }}</a>
          </div>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="docs-main">

        <!-- Hero -->
        <div class="doc-hero">
          <div class="doc-hero-kicker">Self-Hosting Guide · v1.0β</div>
          <h1>Dev<em>-</em>Docs<span class="amp">.</span></h1>
          <p>Architektur, Installation, Konfiguration und Erweiterung des persönlichen SYS Nodes.</p>
        </div>

        <!-- ── 1 · ARCHITEKTUR ── -->
        <section id="architecture" class="doc-section">
          <div class="sec-label">01 · Architektur</div>
          <h2>Stack-Überblick</h2>
          <p>Der SYS Node besteht aus drei Schichten, die auf demselben VPS laufen:</p>

          <pre><code>┌─────────────────────────────────────────────────────────┐
│  Browser / KI-Client                                    │
│  Nuxt 4 SSG (static)  ·  MCP Client  ·  Chrome Ext.    │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS (443)
┌────────────────────────▼────────────────────────────────┐
│  OpenResty  (nginx + LuaJIT)            Port 80/443     │
│  /etc/openresty/lua/  →  alle API-Endpunkte             │
│  vault_auth.lua  ·  soul_auth.lua  ·  soul_pay.lua      │
│  wavespeed_*.lua  ·  peer_*.lua  ·  vault_sync.lua      │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP proxy (127.0.0.1:3098)
┌────────────────────────▼────────────────────────────────┐
│  soul-mcp  (Node.js · systemd)          Port 3098       │
│  MCP Streamable HTTP  ·  OAuth 2.0 + PKCE               │
│  tools/  →  soul_read · soul_write · vault_* …          │
└─────────────────────────────────────────────────────────┘

Datenhaltung:
  /var/lib/sys/souls/          Soul-Dateien (sys.md, verschlüsselt)
  /var/lib/sys/config/         master.json, Pinata-Keys, Amortisierung
  /var/www/&lt;domain&gt;/          Frontend-Bundle (Nuxt SSG-Output)</code></pre>

          <p>OpenResty ist der einzige Prozess, der nach außen hört. Der MCP-Server wird ausschließlich über den OpenResty-Proxy erreicht — keine direkte externe Verbindung.</p>

          <div class="info-box">
            <strong>Kein Node.js in der Datenpfad.</strong> Alle Soul- und Vault-Operationen laufen in Lua. soul-mcp ist ein reiner MCP-Adapter — er ruft seinerseits die Lua-API auf.
          </div>
        </section>

        <!-- ── 2 · VORAUSSETZUNGEN ── -->
        <section id="requirements" class="doc-section">
          <div class="sec-label">02 · Voraussetzungen</div>
          <h2>Was du brauchst</h2>

          <div class="table-wrap">
            <table>
              <thead><tr><th>Anforderung</th><th>Details</th></tr></thead>
              <tbody>
                <tr><td>VPS</td><td>Ubuntu 24.04 LTS · min. 2 GB RAM · min. 20 GB SSD</td></tr>
                <tr><td>Domain</td><td>A-Eintrag zeigt auf Server-IP — SSL-Zertifikat wird automatisch ausgestellt</td></tr>
                <tr><td>E-Mail</td><td>Für Let's Encrypt SSL-Zertifikat</td></tr>
                <tr><td>Anthropic API Key</td><td><code>sk-ant-...</code> — für KI-Chat und Soul-Anreicherung</td></tr>
                <tr><td>WalletConnect ID</td><td>Optional — für Blockchain-Anchoring (Polygon)</td></tr>
              </tbody>
            </table>
          </div>

          <p>DNS-Eintrag muss vor dem Setup gesetzt sein — certbot schlägt fehl wenn der A-Eintrag noch nicht propagiert ist.</p>
        </section>

        <!-- ── 3 · INSTALLATION ── -->
        <section id="installation" class="doc-section">
          <div class="sec-label">03 · Installation</div>
          <h2>init.sh</h2>
          <p>Das Init-Skript richtet den kompletten Stack auf einem frischen Ubuntu 24 VPS ein. Einmal ausführen — der geführte Assistent fragt alles Notwendige ab.</p>

          <pre><code>curl -fsSL https://raw.githubusercontent.com/uxprojectsjok/personal-sys-vps/main/init.sh | bash</code></pre>

          <h3>Was init.sh tut</h3>
          <div class="steps-list">
            <div class="step"><span class="step-num">1</span><div><strong>Eingaben abfragen</strong> — Domain, E-Mail, Anthropic Key, WalletConnect ID (optional), Zugangspasswort</div></div>
            <div class="step"><span class="step-num">2</span><div><strong>OpenResty installieren</strong> — nginx + LuaJIT aus dem offiziellen OpenResty-Repository</div></div>
            <div class="step"><span class="step-num">3</span><div><strong>Systempakete</strong> — certbot, curl, git, lua-resty-http, Node.js 20</div></div>
            <div class="step"><span class="step-num">4</span><div><strong>Swap anlegen</strong> — 2 GB Swap für den Frontend-Build (npm run generate braucht RAM)</div></div>
            <div class="step"><span class="step-num">5</span><div><strong>Verzeichnisstruktur</strong> — <code>/var/lib/sys/</code>, <code>/var/www/&lt;domain&gt;/</code>, <code>/etc/openresty/lua/</code></div></div>
            <div class="step"><span class="step-num">6</span><div><strong>Lua-Skripte installieren</strong> — alle API-Handler nach <code>/etc/openresty/lua/</code></div></div>
            <div class="step"><span class="step-num">7</span><div><strong>Master Key generieren</strong> — <code>openssl rand -hex 32</code> → SOUL_MASTER_KEY, Gate-Passwort-Hash</div></div>
            <div class="step"><span class="step-num">8</span><div><strong>SSL-Zertifikat</strong> — certbot HTTP-01-Challenge über temporären HTTP-only vhost</div></div>
            <div class="step"><span class="step-num">9</span><div><strong>HTTPS vhost aktivieren</strong> — vollständige nginx-Konfiguration mit Proxy-Regeln</div></div>
            <div class="step"><span class="step-num">10</span><div><strong>.env + systemd override</strong> — Secrets in OpenResty-Prozessumgebung injizieren</div></div>
            <div class="step"><span class="step-num">11</span><div><strong>Frontend bauen</strong> — <code>npm install && npm run generate</code> → <code>/var/www/&lt;domain&gt;/</code></div></div>
            <div class="step"><span class="step-num">12</span><div><strong>Neustart</strong> — OpenResty neu starten, Node ist erreichbar unter <code>https://&lt;domain&gt;</code></div></div>
          </div>

          <div class="info-box">
            <strong>soul-mcp separat einrichten:</strong> Das MCP-Init-Skript richtet <em>nicht</em> soul-mcp ein. Nach dem Setup: <code>cd soul-mcp && npm install</code>, <code>.env</code> aus <code>.env.example</code> anlegen und befüllen, dann als systemd-Service registrieren (<code>soul-mcp.service</code> liegt im Repository). Erst dann ist <code>/mcp</code> erreichbar.
          </div>

          <h3>Nach dem Setup</h3>
          <pre><code># SSH absichern (empfohlen)
nano /etc/ssh/sshd_config
  → Port 2222           # Standard-Port 22 meiden
  → PermitRootLogin no
systemctl restart ssh

# Server-Passwort ändern
passwd</code></pre>

          <div class="warn-box">
            <strong>Wichtig:</strong> Neue SSH-Session mit dem neuen Port öffnen, BEVOR die alte geschlossen wird — sonst ist der Zugriff gesperrt.
          </div>
        </section>

        <!-- ── 4 · VERZEICHNISSE ── -->
        <section id="directories" class="doc-section">
          <div class="sec-label">04 · Verzeichnisse</div>
          <h2>Verzeichnisstruktur</h2>

          <pre><code>/var/lib/sys/
├── souls/                   Soul-Verzeichnisse
│   └── &lt;soul_id&gt;/
│       ├── sys.md           Soul-Datei (AES-256-CBC verschlüsselt)
│       ├── vault/           Vault-Dateien (Audio, Bilder, Video, Docs)
│       └── config.json      Soul-Konfiguration (Berechtigungen, Marketplace)
└── config/
    └── &lt;domain&gt;/
        ├── master.json      Gate-Passwort-Hash, Domain-Config
        ├── pinata.json      IPFS-Zugangsdaten (optional)
        └── amortization.json  Marketplace-Konfiguration

/etc/openresty/lua/          Lua API-Handler (von init.sh installiert)
/var/www/&lt;domain&gt;/          Frontend (Nuxt SSG-Output)

/var/www/SaveYourSoul/
├── soul-mcp/                MCP-Server
│   ├── server.mjs           Hauptprozess (Express + MCP SDK)
│   ├── tools/               MCP Tool-Implementierungen
│   ├── prompts/             MCP Prompts
│   └── .env                 MCP-Umgebungsvariablen
├── shared/utils/            soulParser.js, soulMaturity.js
└── .env                     Projekt-Umgebungsvariablen</code></pre>
        </section>

        <!-- ── 5 · UMGEBUNGSVARIABLEN ── -->
        <section id="env" class="doc-section">
          <div class="sec-label">05 · Umgebungsvariablen</div>
          <h2>Konfiguration</h2>

          <h3>Projekt .env</h3>
          <p>Liegt in <code>/var/www/SaveYourSoul/.env</code>. Secrets werden über den systemd-Override in OpenResty injiziert — nicht aus dieser Datei gelesen.</p>

          <div class="table-wrap">
            <table>
              <thead><tr><th>Variable</th><th>Pflicht</th><th>Beschreibung</th></tr></thead>
              <tbody>
                <tr><td><code>ANTHROPIC_API_KEY</code></td><td class="req">ja</td><td>Anthropic Claude API Key (<code>sk-ant-...</code>)</td></tr>
                <tr><td><code>SOUL_MASTER_KEY</code></td><td class="req">ja</td><td>64-Hex HMAC-Key für soul_cert — von init.sh generiert</td></tr>
                <tr><td><code>API_SIGNING_KEY</code></td><td class="req">ja</td><td>64-Hex Signing-Key für Session-Log-Signaturen</td></tr>
                <tr><td><code>WALLETCONNECT_PROJECT_ID</code></td><td>optional</td><td>Reown AppKit Project ID für Polygon-Wallet-Verbindung</td></tr>
                <tr><td><code>SPOTIFY_CLIENT_ID</code></td><td>optional</td><td>Spotify App Client ID für Musik-Integration</td></tr>
                <tr><td><code>YOUTUBE_CLIENT_ID</code></td><td>optional</td><td>Google OAuth Client ID für YouTube-Integration</td></tr>
              </tbody>
            </table>
          </div>

          <h3>soul-mcp .env</h3>
          <p>Liegt in <code>/var/www/SaveYourSoul/soul-mcp/.env</code>. Wird beim Service-Start geladen.</p>

          <div class="table-wrap">
            <table>
              <thead><tr><th>Variable</th><th>Standard</th><th>Beschreibung</th></tr></thead>
              <tbody>
                <tr><td><code>PORT</code></td><td><code>3098</code></td><td>MCP-Server-Port (nur intern, hinter OpenResty)</td></tr>
                <tr><td><code>BASE_URL</code></td><td>—</td><td>Öffentliche HTTPS-URL des Nodes (für OAuth-Metadaten)</td></tr>
                <tr><td><code>SYS_API_URL</code></td><td>—</td><td>API-Basis-URL (identisch mit BASE_URL)</td></tr>
                <tr><td><code>POLYGON_NETWORK</code></td><td><code>amoy</code></td><td><code>amoy</code> (Testnet) oder <code>main</code> (Mainnet)</td></tr>
              </tbody>
            </table>
          </div>

          <h3>systemd-Override für OpenResty</h3>
          <p>Liegt in <code>/etc/systemd/system/openresty.service.d/env.conf</code>. Injiziert Secrets in die Lua-Prozessumgebung — ohne diesen Override sind alle <code>os.getenv()</code>-Aufrufe in Lua leer.</p>
          <pre><code>[Service]
Environment="SOUL_MASTER_KEY=..."
Environment="ANTHROPIC_API_KEY=..."
Environment="API_SIGNING_KEY=..."</code></pre>
          <pre><code># Nach Änderung neu laden
systemctl daemon-reload && systemctl restart openresty</code></pre>
        </section>

        <!-- ── 6 · OPENRESTY / LUA ── -->
        <section id="lua" class="doc-section">
          <div class="sec-label">06 · OpenResty · Lua</div>
          <h2>API-Schicht</h2>
          <p>Alle HTTP-Endpunkte sind Lua-Skripte in <code>/etc/openresty/lua/</code>. OpenResty routet über <code>content_by_lua_file</code>-Direktiven in der nginx-Konfiguration.</p>

          <h3>Wichtige Lua-Skripte</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Datei</th><th>Funktion</th></tr></thead>
              <tbody>
                <tr><td><code>vault_auth.lua</code></td><td>Zentrale Auth-Schicht — prüft soul_cert, pol_access_token, service_token</td></tr>
                <tr><td><code>soul_auth.lua</code></td><td>soul_cert validieren und ausstellen</td></tr>
                <tr><td><code>soul_cert.lua</code></td><td>Zertifikat-Rotation</td></tr>
                <tr><td><code>soul_pay.lua</code></td><td>Polygon-Transaktion on-chain verifizieren → pol_access_token ausstellen</td></tr>
                <tr><td><code>soul_register.lua</code></td><td>Soul im IPFS-Verzeichnis registrieren</td></tr>
                <tr><td><code>vault_sync.lua</code></td><td>Vault-Dateien hochladen und synchronisieren</td></tr>
                <tr><td><code>vault_profile.lua</code></td><td>Biometrische Profile (Gesicht, Stimme, Bewegung)</td></tr>
                <tr><td><code>vault_connections_peer.lua</code></td><td>Peer-Verbindungen und freigegebene Dateien</td></tr>
                <tr><td><code>wavespeed_submit.lua</code></td><td>KI-Bildgenerierung starten (WaveSpeed AI)</td></tr>
                <tr><td><code>wavespeed_result.lua</code></td><td>Generiertes Bild abrufen</td></tr>
                <tr><td><code>tts.lua</code></td><td>Text-to-Speech (ElevenLabs)</td></tr>
                <tr><td><code>gate_auth.lua</code></td><td>Gate-Schutz — Node-weites Zugangspasswort</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Lua nach Änderungen neu laden</h3>
          <pre><code>systemctl reload openresty
# oder vollständig neu starten
systemctl restart openresty</code></pre>

          <div class="info-box">
            <strong>nginx.conf Env-Deklaration:</strong> OpenResty erbt nur Umgebungsvariablen, die in <code>nginx.conf</code> mit <code>env VARNAME;</code> deklariert sind. Neue Secrets erfordern einen Eintrag dort und im systemd-Override.
          </div>
        </section>

        <!-- ── 7 · MCP SERVER ── -->
        <section id="mcp-server" class="doc-section">
          <div class="sec-label">07 · MCP Server</div>
          <h2>soul-mcp</h2>
          <p>Der MCP-Server ist ein eigenständiger Node.js-Prozess, der als systemd-Service läuft. Er implementiert das Model Context Protocol als Streamable HTTP und stellt alle MCP Tools bereit.</p>

          <h3>Einrichten (manuell nach init.sh)</h3>
          <pre><code>cd /var/www/SaveYourSoul/soul-mcp
npm install
cp .env.example .env             # BASE_URL, SYS_API_URL, PORT eintragen
cp soul-mcp.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now soul-mcp</code></pre>

          <h3>Service verwalten</h3>
          <pre><code>systemctl status soul-mcp
systemctl restart soul-mcp
journalctl -u soul-mcp -f        # Live-Logs</code></pre>

        </section>

        <!-- ── 8 · VERSCHLÜSSELUNG ── -->
        <section id="encryption" class="doc-section">
          <div class="sec-label">08 · Verschlüsselung</div>
          <h2>Vault-Verschlüsselung</h2>

          <h3>AES-256-CBC (Vault)</h3>
          <p>Alle Vault-Dateien werden AES-256-CBC im Browser verschlüsselt, bevor sie den Browser verlassen. Der Server erhält nur verschlüsselte Blöcke — der Vault-Key liegt nie auf dem Server.</p>
          <pre><code>Vault-Key:   64 Hex-Zeichen (256 Bit) · im Browser aus Passphrase abgeleitet
Entsperren:  POST /api/vault/unlock  →  Server cached Key für die Sitzungsdauer
Sicherung:   BIP39 12-Wort-Mnemonic  →  Vault-Key bei Verlust der Passphrase</code></pre>

          <h3>soul_cert (HMAC)</h3>
          <p>Das soul_cert authentifiziert den Soul-Inhaber ohne Passwort. Es ist deterministisch ableitbar — bei Verlust wird es aus SOUL_MASTER_KEY und soul_id neu generiert.</p>
          <pre><code>cert = HMAC-SHA256(SOUL_MASTER_KEY, soul_id).hex()[:32]
bearer = soul_id + "." + cert</code></pre>

          <div class="warn-box">
            <strong>SOUL_MASTER_KEY verloren?</strong> Alle soul_certs werden ungültig. Nutzer können sich nicht mehr einloggen. Key ist in <code>/etc/systemd/system/openresty.service.d/env.conf</code> und <code>/var/www/SaveYourSoul/.env</code>.
          </div>

          <h3>Vault-Key verloren</h3>
          <p>Wenn Passphrase und 12-Wort-Mnemonic beide verloren sind, kann der Vault nicht entschlüsselt werden. Keine Wiederherstellung möglich. Regelmäßige Backups mit "Verschlüsseln &amp; Download" in der Soul-Session anlegen.</p>
        </section>


      </main>
    </div>

    <div class="foot-rule">
      <span>© 2026 · UX-Projects Jan-Oliver Karo</span>
      <span>Apache 2.0</span>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({ layout: false })
useSeoMeta({ title: 'Dev-Dokumentation – SaveYourSoul', robots: 'noindex' })

const active = ref('architecture')

const nav = [
  { label: 'Grundlagen', items: [
    { id: 'architecture', title: 'Architektur' },
    { id: 'requirements', title: 'Voraussetzungen' },
    { id: 'installation', title: 'Installation' },
    { id: 'directories',  title: 'Verzeichnisse' },
  ]},
  { label: 'Konfiguration', items: [
    { id: 'env',        title: 'Umgebungsvariablen' },
    { id: 'lua',        title: 'OpenResty · Lua' },
    { id: 'mcp-server', title: 'MCP Server' },
  ]},
  { label: 'Betrieb', items: [
    { id: 'encryption', title: 'Verschlüsselung' },
  ]},
]

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

let observer = null
onMounted(() => {
  const sections = document.querySelectorAll('.doc-section')
  observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) active.value = e.target.id })
  }, { rootMargin: '-20% 0px -70% 0px' })
  sections.forEach(s => observer.observe(s))
})
onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.docs-page {
  --paper: #12101a; --paper-2: #1a1726;
  --rule: rgba(226,220,240,0.10); --rule-2: rgba(226,220,240,0.20);
  --fg: #ffffff; --fg-2: rgba(255,255,255,0.85); --fg-3: rgba(255,255,255,0.65); --fg-4: rgba(255,255,255,0.45);
  --accent: #8b5cf6; --accent-bright: #a78bfa;
  --serif: 'Noto Serif', Georgia, serif;
  --sans: 'Inter', system-ui, sans-serif;
  --mono: 'Oxanium', monospace;
  background: var(--paper); color: var(--fg); font-family: var(--sans);
  min-height: 100dvh;
}

/* Nav */
.l-nav { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 24px; padding: 28px clamp(20px,4vw,44px) 24px; border-bottom: 1px solid var(--rule); }
.lockup { display: flex; align-items: center; gap: 10px; }
.mark { font-family: var(--mono); font-size: 18px; font-weight: 700; letter-spacing: -0.02em; color: var(--fg); }
.dot { color: var(--accent); }
.center { text-align: center; }
.page-title { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-4); }
.back { font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-3); background: none; border: none; cursor: pointer; transition: color 0.15s; }
.back:hover { color: var(--accent); }
@media (max-width: 640px) { .l-nav { grid-template-columns: 1fr auto; } .center { display: none; } }

/* Layout */
.docs-layout { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100dvh - 77px); }
@media (max-width: 900px) { .docs-layout { grid-template-columns: 1fr; } }

/* Sidebar */
.docs-sidebar { border-right: 1px solid var(--rule); padding: 32px 20px; position: sticky; top: 0; height: calc(100vh - 77px); overflow-y: auto; }
@media (max-width: 900px) { .docs-sidebar { display: none; } }
.nav-group { margin-bottom: 28px; }
.nav-label { display: block; font-family: var(--mono); font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--fg-4); margin-bottom: 8px; padding-left: 10px; }
.nav-item { display: block; font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em; color: var(--fg-3); padding: 6px 10px; cursor: pointer; transition: color 0.15s; border-left: 2px solid transparent; text-decoration: none; }
.nav-item:hover { color: var(--fg); }
.nav-item.active { color: var(--accent-bright); border-left-color: var(--accent); }

/* Main */
.docs-main { padding: 48px clamp(24px,4vw,56px) 96px; max-width: 860px; }

/* Hero */
.doc-hero { padding-bottom: 48px; margin-bottom: 64px; border-bottom: 1px solid var(--rule); }
.doc-hero-kicker { font-family: var(--mono); font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; }
.doc-hero h1 { font-family: var(--serif); font-size: clamp(36px,6vw,72px); font-weight: 400; letter-spacing: -0.03em; line-height: 0.95; margin: 0 0 20px; }
.doc-hero h1 em { font-style: italic; color: var(--accent); }
.amp { font-style: italic; color: var(--fg-3); }
.doc-hero p { font-family: var(--serif); font-size: 18px; line-height: 1.6; color: var(--fg-2); margin: 0; max-width: 52ch; }

/* Sections */
.doc-section { margin-bottom: 72px; scroll-margin-top: 32px; }
.sec-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
.doc-section h2 { font-family: var(--serif); font-size: clamp(24px,3.5vw,36px); font-weight: 400; letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 20px; color: var(--fg); }
.doc-section h3 { font-family: var(--serif); font-size: 20px; font-weight: 700; color: var(--fg); margin: 36px 0 12px; }
.doc-section p { font-size: 15px; line-height: 1.7; color: var(--fg-2); margin: 0 0 16px; }
.doc-section code { font-family: var(--mono); font-size: 12px; color: var(--accent-bright); background: rgba(139,92,246,0.1); padding: 2px 6px; }
.doc-section pre { background: rgba(13,11,20,0.9); border: 1px solid var(--rule-2); padding: 20px 24px; margin: 16px 0 24px; overflow-x: auto; }
.doc-section pre code { background: none; padding: 0; color: var(--fg-2); font-size: 12px; line-height: 1.7; }

/* Tables */
.table-wrap { overflow-x: auto; margin: 16px 0 24px; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th { font-family: var(--mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fg-4); text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--rule-2); font-weight: 500; }
td { padding: 10px 14px; border-bottom: 1px solid var(--rule); color: var(--fg-2); vertical-align: top; }
td code { font-family: var(--mono); font-size: 11px; color: var(--accent-bright); background: rgba(139,92,246,0.1); padding: 2px 6px; }
td.req { font-family: var(--mono); font-size: 11px; color: var(--accent-bright); }

/* Steps */
.steps-list { display: flex; flex-direction: column; gap: 0; border: 1px solid var(--rule); margin: 16px 0 24px; }
.step { display: grid; grid-template-columns: 44px 1fr; gap: 0; align-items: start; border-bottom: 1px solid var(--rule); padding: 14px 16px 14px 0; }
.step:last-child { border-bottom: 0; }
.step-num { font-family: var(--mono); font-size: 11px; color: var(--fg-4); text-align: center; padding-top: 2px; }
.step div { font-size: 14px; line-height: 1.6; color: var(--fg-2); }
.step strong { color: var(--fg); }
.step code { font-family: var(--mono); font-size: 11px; color: var(--accent-bright); background: rgba(139,92,246,0.1); padding: 2px 5px; }

/* Boxes */
.info-box { background: rgba(139,92,246,0.06); border: 1px solid rgba(139,92,246,0.2); padding: 16px 20px; margin: 20px 0; font-size: 14px; line-height: 1.6; color: var(--fg-2); }
.info-box strong { color: var(--fg); }
.warn-box { background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.2); padding: 16px 20px; margin: 20px 0; font-size: 14px; line-height: 1.6; color: var(--fg-2); }
.warn-box strong { color: #fcd34d; }

/* Footer */
.foot-rule { padding: 18px clamp(20px,4vw,44px); border-top: 1px solid var(--rule); display: flex; justify-content: space-between; font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg-4); gap: 12px; flex-wrap: wrap; }
</style>
