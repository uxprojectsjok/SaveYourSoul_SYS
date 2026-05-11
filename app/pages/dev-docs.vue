<template>
  <div class="docs-page">

    <nav class="l-nav">
      <div class="lockup">
        <span class="mark">SYS<span class="dot">.</span></span>
      </div>
      <div class="center"><span class="page-title">{{ t.pageTitle }}</span></div>
      <div class="nav-end">
        <LangToggle />
        <button class="back" @click="$router.back()" :aria-label="t.back">{{ t.back }}</button>
      </div>
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
          <p>{{ t.heroSub }}</p>
        </div>

        <!-- ── 1 · ARCHITECTURE ── -->
        <section id="architecture" class="doc-section">
          <div class="sec-label">{{ t.s01label }}</div>
          <h2>{{ t.s01h2 }}</h2>
          <p>{{ t.s01p1 }}</p>

          <pre><code>┌─────────────────────────────────────────────────────────┐
│  Browser / AI Client                                    │
│  Nuxt 4 SSG (static)  ·  MCP Client  ·  Chrome Ext.    │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS (443)
┌────────────────────────▼────────────────────────────────┐
│  OpenResty  (nginx + LuaJIT)            Port 80/443     │
│  /etc/openresty/lua/  →  all API endpoints              │
│  vault_auth.lua  ·  soul_auth.lua  ·  soul_pay.lua      │
│  wavespeed_*.lua  ·  peer_*.lua  ·  vault_sync.lua      │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP proxy (127.0.0.1:3098)
┌────────────────────────▼────────────────────────────────┐
│  soul-mcp  (Node.js · systemd)          Port 3098       │
│  MCP Streamable HTTP  ·  OAuth 2.0 + PKCE               │
│  tools/  →  soul_read · soul_write · vault_* …          │
└─────────────────────────────────────────────────────────┘

{{ t.dataStorage }}
  /var/lib/sys/souls/          {{ t.soulFiles }}
  /var/lib/sys/config/         master.json, Pinata keys
  /var/www/&lt;domain&gt;/          {{ t.frontendBundle }}</code></pre>

          <p>{{ t.s01p2 }}</p>

          <div class="info-box" v-html="t.s01info"></div>
        </section>

        <!-- ── 2 · REQUIREMENTS ── -->
        <section id="requirements" class="doc-section">
          <div class="sec-label">{{ t.s02label }}</div>
          <h2>{{ t.s02h2 }}</h2>

          <div class="table-wrap">
            <table>
              <thead><tr><th>{{ t.thReq }}</th><th>{{ t.thDetails }}</th></tr></thead>
              <tbody>
                <tr><td>VPS</td><td>{{ t.reqVPSDetails }}</td></tr>
                <tr><td>Domain</td><td>{{ t.reqDomainDetails }}</td></tr>
                <tr><td>{{ t.reqEmail }}</td><td>{{ t.reqEmailDetails }}</td></tr>
                <tr><td>Anthropic API Key</td><td v-html="t.reqAnthropicDetails"></td></tr>
                <tr><td>WalletConnect ID</td><td>{{ t.reqWalletConnectDetails }}</td></tr>
              </tbody>
            </table>
          </div>

          <p>{{ t.s02p2 }}</p>
        </section>

        <!-- ── 3 · INSTALLATION ── -->
        <section id="installation" class="doc-section">
          <div class="sec-label">{{ t.s03label }}</div>
          <h2>init.sh</h2>
          <p>{{ t.s03p }}</p>

          <pre><code>curl -fsSL https://raw.githubusercontent.com/uxprojectsjok/personal-sys-vps/main/init.sh | bash</code></pre>

          <h3>{{ t.s03h3what }}</h3>
          <div class="steps-list">
            <div v-for="step in t.steps" :key="step.num" class="step">
              <span class="step-num">{{ step.num }}</span>
              <div v-html="step.text"></div>
            </div>
          </div>

          <div class="info-box" v-html="t.s03info"></div>

          <h3>{{ t.s03h3after }}</h3>
          <pre><code># {{ t.sshComment }}
nano /etc/ssh/sshd_config
  → Port 2222           # {{ t.sshPortComment }}
  → PermitRootLogin no
systemctl restart ssh

# {{ t.passwdComment }}
passwd</code></pre>

          <div class="warn-box" v-html="t.s03warn"></div>
        </section>

        <!-- ── 4 · DIRECTORIES ── -->
        <section id="directories" class="doc-section">
          <div class="sec-label">{{ t.s04label }}</div>
          <h2>{{ t.s04h2 }}</h2>

          <pre><code>/var/lib/sys/
├── souls/                   {{ t.dirSouls }}
│   └── &lt;soul_id&gt;/
│       ├── sys.md           {{ t.dirSysMd }}
│       ├── vault/           {{ t.dirVault }}
│       └── config.json      {{ t.dirConfig }}
└── config/
    └── &lt;domain&gt;/
        ├── master.json      {{ t.dirMaster }}
        ├── pinata.json      {{ t.dirPinata }}
        └── amortization.json  {{ t.dirAmort }}

/etc/openresty/lua/          {{ t.dirLua }}
/var/www/&lt;domain&gt;/          {{ t.dirFrontend }}

/var/www/SaveYourSoul/
├── soul-mcp/                MCP Server
│   ├── server.mjs           {{ t.dirServer }}
│   ├── tools/               {{ t.dirTools }}
│   ├── prompts/             MCP Prompts
│   └── .env                 {{ t.dirMcpEnv }}
├── shared/utils/            soulParser.js, soulMaturity.js
└── .env                     {{ t.dirEnv }}</code></pre>
        </section>

        <!-- ── 5 · ENV VARS ── -->
        <section id="env" class="doc-section">
          <div class="sec-label">{{ t.s05label }}</div>
          <h2>{{ t.s05h2 }}</h2>

          <h3>{{ t.s05h3proj }}</h3>
          <p v-html="t.s05pProj"></p>

          <div class="table-wrap">
            <table>
              <thead><tr><th>{{ t.thVar }}</th><th>{{ t.thPflicht }}</th><th>{{ t.thDesc }}</th></tr></thead>
              <tbody>
                <tr><td><code>ANTHROPIC_API_KEY</code></td><td class="req">{{ t.tdYes }}</td><td v-html="t.envAnthropicKey"></td></tr>
                <tr><td><code>SOUL_MASTER_KEY</code></td><td class="req">{{ t.tdYes }}</td><td>{{ t.envSoulMasterKey }}</td></tr>
                <tr><td><code>API_SIGNING_KEY</code></td><td class="req">{{ t.tdYes }}</td><td>{{ t.envApiSigningKey }}</td></tr>
                <tr><td><code>WALLETCONNECT_PROJECT_ID</code></td><td>{{ t.tdOpt }}</td><td>{{ t.envWalletConnect }}</td></tr>
                <tr><td><code>SPOTIFY_CLIENT_ID</code></td><td>{{ t.tdOpt }}</td><td>{{ t.envSpotify }}</td></tr>
                <tr><td><code>YOUTUBE_CLIENT_ID</code></td><td>{{ t.tdOpt }}</td><td>{{ t.envYoutube }}</td></tr>
              </tbody>
            </table>
          </div>

          <h3>{{ t.s05h3mcp }}</h3>
          <p v-html="t.s05pMcp"></p>

          <div class="table-wrap">
            <table>
              <thead><tr><th>{{ t.thVar }}</th><th>{{ t.thStd }}</th><th>{{ t.thDesc }}</th></tr></thead>
              <tbody>
                <tr><td><code>PORT</code></td><td><code>3098</code></td><td>{{ t.envPort }}</td></tr>
                <tr><td><code>BASE_URL</code></td><td>—</td><td>{{ t.envBaseUrl }}</td></tr>
                <tr><td><code>SYS_API_URL</code></td><td>—</td><td>{{ t.envSysApi }}</td></tr>
                <tr><td><code>POLYGON_NETWORK</code></td><td><code>amoy</code></td><td v-html="t.envPolygon"></td></tr>
              </tbody>
            </table>
          </div>

          <h3>{{ t.s05h3systemd }}</h3>
          <p v-html="t.s05pSystemd"></p>
          <pre><code>[Service]
Environment="SOUL_MASTER_KEY=..."
Environment="ANTHROPIC_API_KEY=..."
Environment="API_SIGNING_KEY=..."</code></pre>
          <pre><code># {{ t.reloadComment }}
systemctl daemon-reload && systemctl restart openresty</code></pre>
        </section>

        <!-- ── 6 · OPENRESTY / LUA ── -->
        <section id="lua" class="doc-section">
          <div class="sec-label">{{ t.s06label }}</div>
          <h2>{{ t.s06h2 }}</h2>
          <p v-html="t.s06p"></p>

          <h3>{{ t.s06h3scripts }}</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>{{ t.thFile }}</th><th>{{ t.thFunc }}</th></tr></thead>
              <tbody>
                <tr><td><code>vault_auth.lua</code></td><td>{{ t.luaVaultAuth }}</td></tr>
                <tr><td><code>soul_auth.lua</code></td><td>{{ t.luaSoulAuth }}</td></tr>
                <tr><td><code>soul_cert.lua</code></td><td>{{ t.luaSoulCert }}</td></tr>
                <tr><td><code>soul_pay.lua</code></td><td>{{ t.luaSoulPay }}</td></tr>
                <tr><td><code>soul_register.lua</code></td><td>{{ t.luaSoulRegister }}</td></tr>
                <tr><td><code>vault_sync.lua</code></td><td>{{ t.luaVaultSync }}</td></tr>
                <tr><td><code>vault_profile.lua</code></td><td>{{ t.luaVaultProfile }}</td></tr>
                <tr><td><code>vault_connections_peer.lua</code></td><td>{{ t.luaVaultPeer }}</td></tr>
                <tr><td><code>wavespeed_submit.lua</code></td><td>{{ t.luaWavespeedSubmit }}</td></tr>
                <tr><td><code>wavespeed_result.lua</code></td><td>{{ t.luaWavespeedResult }}</td></tr>
                <tr><td><code>tts.lua</code></td><td>{{ t.luaTTS }}</td></tr>
                <tr><td><code>gate_auth.lua</code></td><td>{{ t.luaGate }}</td></tr>
              </tbody>
            </table>
          </div>

          <h3>{{ t.s06h3reload }}</h3>
          <pre><code>systemctl reload openresty
# {{ t.orFullRestart }}
systemctl restart openresty</code></pre>

          <div class="info-box" v-html="t.s06info"></div>
        </section>

        <!-- ── 7 · MCP SERVER ── -->
        <section id="mcp-server" class="doc-section">
          <div class="sec-label">{{ t.s07label }}</div>
          <h2>soul-mcp</h2>
          <p>{{ t.s07p }}</p>

          <h3>{{ t.s07h3setup }}</h3>
          <pre><code>cd /var/www/SaveYourSoul/soul-mcp
npm install
cp .env.example .env             # {{ t.fillEnvComment }}
cp soul-mcp.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now soul-mcp</code></pre>

          <h3>{{ t.s07h3manage }}</h3>
          <pre><code>systemctl status soul-mcp
systemctl restart soul-mcp
journalctl -u soul-mcp -f        # {{ t.liveLogsComment }}</code></pre>
        </section>

        <!-- ── 8 · ENCRYPTION ── -->
        <section id="encryption" class="doc-section">
          <div class="sec-label">{{ t.s08label }}</div>
          <h2>{{ t.s08h2 }}</h2>

          <h3>{{ t.s08h3aes }}</h3>
          <p>{{ t.s08pAes }}</p>
          <pre><code>{{ t.vaultKeyComment }}
{{ t.unlockComment }}
{{ t.backupComment }}</code></pre>

          <h3>{{ t.s08h3hmac }}</h3>
          <p>{{ t.s08pHmac }}</p>
          <pre><code>cert = HMAC-SHA256(SOUL_MASTER_KEY, soul_id).hex()[:32]
bearer = soul_id + "." + cert</code></pre>

          <div class="warn-box" v-html="t.s08warn"></div>

          <h3>{{ t.s08h3vaultLost }}</h3>
          <p v-html="t.s08pVaultLost"></p>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'

definePageMeta({ layout: false })

const { lang } = useLang()

const i18n = {
  de: {
    pageTitle: 'Dev-Dokumentation',
    back: '← Zurück',
    heroSub: 'Architektur, Installation, Konfiguration und Erweiterung des persönlichen SYS Nodes.',
    nav: [
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
    ],
    s01label: '01 · Architektur',
    s01h2: 'Stack-Überblick',
    s01p1: 'Der SYS Node besteht aus drei Schichten, die auf demselben VPS laufen:',
    dataStorage: 'Datenhaltung:',
    soulFiles: 'Soul-Dateien (sys.md, verschlüsselt)',
    frontendBundle: 'Frontend-Bundle (Nuxt SSG-Output)',
    s01p2: 'OpenResty ist der einzige Prozess, der nach außen hört. Der MCP-Server wird ausschließlich über den OpenResty-Proxy erreicht — keine direkte externe Verbindung.',
    s01info: '<strong>Kein Node.js in der Datenpfad.</strong> Alle Soul- und Vault-Operationen laufen in Lua. soul-mcp ist ein reiner MCP-Adapter — er ruft seinerseits die Lua-API auf.',
    s02label: '02 · Voraussetzungen',
    s02h2: 'Was du brauchst',
    thReq: 'Anforderung',
    thDetails: 'Details',
    reqVPSDetails: 'Ubuntu 24.04 LTS · min. 2 GB RAM · min. 20 GB SSD',
    reqDomainDetails: 'A-Eintrag zeigt auf Server-IP — SSL-Zertifikat wird automatisch ausgestellt',
    reqEmail: 'E-Mail',
    reqEmailDetails: 'Für Let\'s Encrypt SSL-Zertifikat',
    reqAnthropicDetails: '<code>sk-ant-...</code> — für KI-Chat und Soul-Anreicherung',
    reqWalletConnectDetails: 'Optional — für Blockchain-Anchoring (Polygon)',
    s02p2: 'DNS-Eintrag muss vor dem Setup gesetzt sein — certbot schlägt fehl wenn der A-Eintrag noch nicht propagiert ist.',
    s03label: '03 · Installation',
    s03p: 'Das Init-Skript richtet den kompletten Stack auf einem frischen Ubuntu 24 VPS ein. Einmal ausführen — der geführte Assistent fragt alles Notwendige ab.',
    s03h3what: 'Was init.sh tut',
    steps: [
      { num: 1,  text: '<strong>Eingaben abfragen</strong> — Domain, E-Mail, Anthropic Key, WalletConnect ID (optional), Zugangspasswort' },
      { num: 2,  text: '<strong>OpenResty installieren</strong> — nginx + LuaJIT aus dem offiziellen OpenResty-Repository' },
      { num: 3,  text: '<strong>Systempakete</strong> — certbot, curl, git, lua-resty-http, Node.js 20' },
      { num: 4,  text: '<strong>Swap anlegen</strong> — 2 GB Swap für den Frontend-Build (npm run generate braucht RAM)' },
      { num: 5,  text: '<strong>Verzeichnisstruktur</strong> — <code>/var/lib/sys/</code>, <code>/var/www/&lt;domain&gt;/</code>, <code>/etc/openresty/lua/</code>' },
      { num: 6,  text: '<strong>Lua-Skripte installieren</strong> — alle API-Handler nach <code>/etc/openresty/lua/</code>' },
      { num: 7,  text: '<strong>Master Key generieren</strong> — <code>openssl rand -hex 32</code> → SOUL_MASTER_KEY, Gate-Passwort-Hash' },
      { num: 8,  text: '<strong>SSL-Zertifikat</strong> — certbot HTTP-01-Challenge über temporären HTTP-only vhost' },
      { num: 9,  text: '<strong>HTTPS vhost aktivieren</strong> — vollständige nginx-Konfiguration mit Proxy-Regeln' },
      { num: 10, text: '<strong>.env + systemd override</strong> — Secrets in OpenResty-Prozessumgebung injizieren' },
      { num: 11, text: '<strong>Frontend bauen</strong> — <code>npm install && npm run generate</code> → <code>/var/www/&lt;domain&gt;/</code>' },
      { num: 12, text: '<strong>Neustart</strong> — OpenResty neu starten, Node ist erreichbar unter <code>https://&lt;domain&gt;</code>' },
    ],
    s03info: '<strong>soul-mcp separat einrichten:</strong> Das MCP-Init-Skript richtet <em>nicht</em> soul-mcp ein. Nach dem Setup: <code>cd soul-mcp && npm install</code>, <code>.env</code> aus <code>.env.example</code> anlegen und befüllen, dann als systemd-Service registrieren (<code>soul-mcp.service</code> liegt im Repository). Erst dann ist <code>/mcp</code> erreichbar.',
    s03h3after: 'Nach dem Setup',
    sshComment: 'SSH absichern (empfohlen)',
    sshPortComment: 'Standard-Port 22 meiden',
    passwdComment: 'Server-Passwort ändern',
    s03warn: '<strong>Wichtig:</strong> Neue SSH-Session mit dem neuen Port öffnen, BEVOR die alte geschlossen wird — sonst ist der Zugriff gesperrt.',
    s04label: '04 · Verzeichnisse',
    s04h2: 'Verzeichnisstruktur',
    dirSouls: 'Soul-Verzeichnisse',
    dirSysMd: 'Soul-Datei (AES-256-CBC verschlüsselt)',
    dirVault: 'Vault-Dateien (Audio, Bilder, Video, Docs)',
    dirConfig: 'Soul-Konfiguration (Berechtigungen, Marketplace)',
    dirMaster: 'Gate-Passwort-Hash, Domain-Config',
    dirPinata: 'IPFS-Zugangsdaten (optional)',
    dirAmort: 'Marketplace-Konfiguration',
    dirLua: 'Lua API-Handler (von init.sh installiert)',
    dirFrontend: 'Frontend (Nuxt SSG-Output)',
    dirServer: 'Hauptprozess (Express + MCP SDK)',
    dirTools: 'MCP Tool-Implementierungen',
    dirMcpEnv: 'MCP-Umgebungsvariablen',
    dirEnv: 'Projekt-Umgebungsvariablen',
    s05label: '05 · Umgebungsvariablen',
    s05h2: 'Konfiguration',
    s05h3proj: 'Projekt .env',
    s05pProj: 'Liegt in <code>/var/www/SaveYourSoul/.env</code>. Secrets werden über den systemd-Override in OpenResty injiziert — nicht aus dieser Datei gelesen.',
    thVar: 'Variable',
    thPflicht: 'Pflicht',
    thDesc: 'Beschreibung',
    envAnthropicKey: 'Anthropic Claude API Key (<code>sk-ant-...</code>)',
    envSoulMasterKey: '64-Hex HMAC-Key für soul_cert — von init.sh generiert',
    envApiSigningKey: '64-Hex Signing-Key für Session-Log-Signaturen',
    envWalletConnect: 'Reown AppKit Project ID für Polygon-Wallet-Verbindung',
    envSpotify: 'Spotify App Client ID für Musik-Integration',
    envYoutube: 'Google OAuth Client ID für YouTube-Integration',
    tdYes: 'ja',
    tdOpt: 'optional',
    s05h3mcp: 'soul-mcp .env',
    s05pMcp: 'Liegt in <code>/var/www/SaveYourSoul/soul-mcp/.env</code>. Wird beim Service-Start geladen.',
    thStd: 'Standard',
    envPort: 'MCP-Server-Port (nur intern, hinter OpenResty)',
    envBaseUrl: 'Öffentliche HTTPS-URL des Nodes (für OAuth-Metadaten)',
    envSysApi: 'API-Basis-URL (identisch mit BASE_URL)',
    envPolygon: '<code>amoy</code> (Testnet) oder <code>main</code> (Mainnet)',
    s05h3systemd: 'systemd-Override für OpenResty',
    s05pSystemd: 'Liegt in <code>/etc/systemd/system/openresty.service.d/env.conf</code>. Injiziert Secrets in die Lua-Prozessumgebung — ohne diesen Override sind alle <code>os.getenv()</code>-Aufrufe in Lua leer.',
    reloadComment: 'Nach Änderung neu laden',
    s06label: '06 · OpenResty · Lua',
    s06h2: 'API-Schicht',
    s06p: 'Alle HTTP-Endpunkte sind Lua-Skripte in <code>/etc/openresty/lua/</code>. OpenResty routet über <code>content_by_lua_file</code>-Direktiven in der nginx-Konfiguration.',
    s06h3scripts: 'Wichtige Lua-Skripte',
    thFile: 'Datei',
    thFunc: 'Funktion',
    luaVaultAuth: 'Zentrale Auth-Schicht — prüft soul_cert, pol_access_token, service_token',
    luaSoulAuth: 'soul_cert validieren und ausstellen',
    luaSoulCert: 'Zertifikat-Rotation',
    luaSoulPay: 'Polygon-Transaktion on-chain verifizieren → pol_access_token ausstellen',
    luaSoulRegister: 'Soul im IPFS-Verzeichnis registrieren',
    luaVaultSync: 'Vault-Dateien hochladen und synchronisieren',
    luaVaultProfile: 'Biometrische Profile (Gesicht, Stimme, Bewegung)',
    luaVaultPeer: 'Peer-Verbindungen und freigegebene Dateien',
    luaWavespeedSubmit: 'KI-Bildgenerierung starten (WaveSpeed AI)',
    luaWavespeedResult: 'Generiertes Bild abrufen',
    luaTTS: 'Text-to-Speech (ElevenLabs)',
    luaGate: 'Gate-Schutz — Node-weites Zugangspasswort',
    s06h3reload: 'Lua nach Änderungen neu laden',
    orFullRestart: 'oder vollständig neu starten',
    s06info: '<strong>nginx.conf Env-Deklaration:</strong> OpenResty erbt nur Umgebungsvariablen, die in <code>nginx.conf</code> mit <code>env VARNAME;</code> deklariert sind. Neue Secrets erfordern einen Eintrag dort und im systemd-Override.',
    s07label: '07 · MCP Server',
    s07p: 'Der MCP-Server ist ein eigenständiger Node.js-Prozess, der als systemd-Service läuft. Er implementiert das Model Context Protocol als Streamable HTTP und stellt alle MCP Tools bereit.',
    s07h3setup: 'Einrichten (manuell nach init.sh)',
    fillEnvComment: 'BASE_URL, SYS_API_URL, PORT eintragen',
    s07h3manage: 'Service verwalten',
    liveLogsComment: 'Live-Logs',
    s08label: '08 · Verschlüsselung',
    s08h2: 'Vault-Verschlüsselung',
    s08h3aes: 'AES-256-CBC (Vault)',
    s08pAes: 'Alle Vault-Dateien werden AES-256-CBC im Browser verschlüsselt, bevor sie den Browser verlassen. Der Server erhält nur verschlüsselte Blöcke — der Vault-Key liegt nie auf dem Server.',
    vaultKeyComment: 'Vault-Key:   64 Hex-Zeichen (256 Bit) · im Browser aus Passphrase abgeleitet',
    unlockComment:  'Entsperren:  POST /api/vault/unlock  →  Server cached Key für die Sitzungsdauer',
    backupComment:  'Sicherung:   BIP39 12-Wort-Mnemonic  →  Vault-Key bei Verlust der Passphrase',
    s08h3hmac: 'soul_cert (HMAC)',
    s08pHmac: 'Das soul_cert authentifiziert den Soul-Inhaber ohne Passwort. Es ist deterministisch ableitbar — bei Verlust wird es aus SOUL_MASTER_KEY und soul_id neu generiert.',
    s08warn: '<strong>SOUL_MASTER_KEY verloren?</strong> Alle soul_certs werden ungültig. Nutzer können sich nicht mehr einloggen. Key ist in <code>/etc/systemd/system/openresty.service.d/env.conf</code> und <code>/var/www/SaveYourSoul/.env</code>.',
    s08h3vaultLost: 'Vault-Key verloren',
    s08pVaultLost: 'Wenn Passphrase und 12-Wort-Mnemonic beide verloren sind, kann der Vault nicht entschlüsselt werden. Keine Wiederherstellung möglich. Regelmäßige Backups mit „Verschlüsseln &amp; Download" in der Soul-Session anlegen.',
  },
  en: {
    pageTitle: 'Dev Documentation',
    back: '← Back',
    heroSub: 'Architecture, installation, configuration and extension of your personal SYS node.',
    nav: [
      { label: 'Basics', items: [
        { id: 'architecture', title: 'Architecture' },
        { id: 'requirements', title: 'Requirements' },
        { id: 'installation', title: 'Installation' },
        { id: 'directories',  title: 'Directories' },
      ]},
      { label: 'Configuration', items: [
        { id: 'env',        title: 'Environment' },
        { id: 'lua',        title: 'OpenResty · Lua' },
        { id: 'mcp-server', title: 'MCP Server' },
      ]},
      { label: 'Operations', items: [
        { id: 'encryption', title: 'Encryption' },
      ]},
    ],
    s01label: '01 · Architecture',
    s01h2: 'Stack Overview',
    s01p1: 'The SYS node consists of three layers running on the same VPS:',
    dataStorage: 'Data storage:',
    soulFiles: 'Soul files (sys.md, encrypted)',
    frontendBundle: 'Frontend bundle (Nuxt SSG output)',
    s01p2: 'OpenResty is the only process that listens externally. The MCP server is only reachable through the OpenResty proxy — no direct external connection.',
    s01info: '<strong>No Node.js in the data path.</strong> All soul and vault operations run in Lua. soul-mcp is a pure MCP adapter — it calls the Lua API in turn.',
    s02label: '02 · Requirements',
    s02h2: 'What you need',
    thReq: 'Requirement',
    thDetails: 'Details',
    reqVPSDetails: 'Ubuntu 24.04 LTS · min. 2 GB RAM · min. 20 GB SSD',
    reqDomainDetails: 'A record points to server IP — SSL certificate is issued automatically',
    reqEmail: 'Email',
    reqEmailDetails: 'For Let\'s Encrypt SSL certificate',
    reqAnthropicDetails: '<code>sk-ant-...</code> — for AI chat and soul enrichment',
    reqWalletConnectDetails: 'Optional — for blockchain anchoring (Polygon)',
    s02p2: 'DNS record must be set before setup — certbot fails if the A record has not propagated yet.',
    s03label: '03 · Installation',
    s03p: 'The init script sets up the complete stack on a fresh Ubuntu 24 VPS. Run it once — the guided wizard asks for everything needed.',
    s03h3what: 'What init.sh does',
    steps: [
      { num: 1,  text: '<strong>Collect inputs</strong> — domain, email, Anthropic key, WalletConnect ID (optional), access password' },
      { num: 2,  text: '<strong>Install OpenResty</strong> — nginx + LuaJIT from the official OpenResty repository' },
      { num: 3,  text: '<strong>System packages</strong> — certbot, curl, git, lua-resty-http, Node.js 20' },
      { num: 4,  text: '<strong>Create swap</strong> — 2 GB swap for the frontend build (npm run generate needs RAM)' },
      { num: 5,  text: '<strong>Directory structure</strong> — <code>/var/lib/sys/</code>, <code>/var/www/&lt;domain&gt;/</code>, <code>/etc/openresty/lua/</code>' },
      { num: 6,  text: '<strong>Install Lua scripts</strong> — all API handlers to <code>/etc/openresty/lua/</code>' },
      { num: 7,  text: '<strong>Generate master key</strong> — <code>openssl rand -hex 32</code> → SOUL_MASTER_KEY, gate password hash' },
      { num: 8,  text: '<strong>SSL certificate</strong> — certbot HTTP-01 challenge via temporary HTTP-only vhost' },
      { num: 9,  text: '<strong>Activate HTTPS vhost</strong> — full nginx configuration with proxy rules' },
      { num: 10, text: '<strong>.env + systemd override</strong> — inject secrets into OpenResty process environment' },
      { num: 11, text: '<strong>Build frontend</strong> — <code>npm install && npm run generate</code> → <code>/var/www/&lt;domain&gt;/</code>' },
      { num: 12, text: '<strong>Restart</strong> — restart OpenResty, node is reachable at <code>https://&lt;domain&gt;</code>' },
    ],
    s03info: '<strong>Set up soul-mcp separately:</strong> The MCP init script does <em>not</em> set up soul-mcp. After setup: <code>cd soul-mcp && npm install</code>, create <code>.env</code> from <code>.env.example</code> and fill it in, then register as a systemd service (<code>soul-mcp.service</code> is in the repository). Only then is <code>/mcp</code> reachable.',
    s03h3after: 'After setup',
    sshComment: 'Harden SSH (recommended)',
    sshPortComment: 'avoid default port 22',
    passwdComment: 'Change server password',
    s03warn: '<strong>Important:</strong> Open a new SSH session with the new port BEFORE closing the old one — otherwise access will be locked.',
    s04label: '04 · Directories',
    s04h2: 'Directory Structure',
    dirSouls: 'Soul directories',
    dirSysMd: 'Soul file (AES-256-CBC encrypted)',
    dirVault: 'Vault files (audio, images, video, docs)',
    dirConfig: 'Soul config (permissions, marketplace)',
    dirMaster: 'Gate password hash, domain config',
    dirPinata: 'IPFS credentials (optional)',
    dirAmort: 'Marketplace configuration',
    dirLua: 'Lua API handlers (installed by init.sh)',
    dirFrontend: 'Frontend (Nuxt SSG output)',
    dirServer: 'Main process (Express + MCP SDK)',
    dirTools: 'MCP tool implementations',
    dirMcpEnv: 'MCP environment variables',
    dirEnv: 'Project environment variables',
    s05label: '05 · Environment Variables',
    s05h2: 'Configuration',
    s05h3proj: 'Project .env',
    s05pProj: 'Located at <code>/var/www/SaveYourSoul/.env</code>. Secrets are injected into OpenResty via the systemd override — not read from this file.',
    thVar: 'Variable',
    thPflicht: 'Required',
    thDesc: 'Description',
    envAnthropicKey: 'Anthropic Claude API Key (<code>sk-ant-...</code>)',
    envSoulMasterKey: '64-hex HMAC key for soul_cert — generated by init.sh',
    envApiSigningKey: '64-hex signing key for session log signatures',
    envWalletConnect: 'Reown AppKit Project ID for Polygon wallet connection',
    envSpotify: 'Spotify App Client ID for music integration',
    envYoutube: 'Google OAuth Client ID for YouTube integration',
    tdYes: 'yes',
    tdOpt: 'optional',
    s05h3mcp: 'soul-mcp .env',
    s05pMcp: 'Located at <code>/var/www/SaveYourSoul/soul-mcp/.env</code>. Loaded on service start.',
    thStd: 'Default',
    envPort: 'MCP server port (internal only, behind OpenResty)',
    envBaseUrl: 'Public HTTPS URL of the node (for OAuth metadata)',
    envSysApi: 'API base URL (same as BASE_URL)',
    envPolygon: '<code>amoy</code> (testnet) or <code>main</code> (mainnet)',
    s05h3systemd: 'systemd Override for OpenResty',
    s05pSystemd: 'Located at <code>/etc/systemd/system/openresty.service.d/env.conf</code>. Injects secrets into the Lua process environment — without this override, all <code>os.getenv()</code> calls in Lua return empty.',
    reloadComment: 'Reload after changes',
    s06label: '06 · OpenResty · Lua',
    s06h2: 'API Layer',
    s06p: 'All HTTP endpoints are Lua scripts in <code>/etc/openresty/lua/</code>. OpenResty routes via <code>content_by_lua_file</code> directives in the nginx configuration.',
    s06h3scripts: 'Key Lua Scripts',
    thFile: 'File',
    thFunc: 'Function',
    luaVaultAuth: 'Central auth layer — validates soul_cert, pol_access_token, service_token',
    luaSoulAuth: 'Validate and issue soul_cert',
    luaSoulCert: 'Certificate rotation',
    luaSoulPay: 'Verify Polygon transaction on-chain → issue pol_access_token',
    luaSoulRegister: 'Register soul in IPFS directory',
    luaVaultSync: 'Upload and sync vault files',
    luaVaultProfile: 'Biometric profiles (face, voice, motion)',
    luaVaultPeer: 'Peer connections and shared files',
    luaWavespeedSubmit: 'Start AI image generation (WaveSpeed AI)',
    luaWavespeedResult: 'Retrieve generated image',
    luaTTS: 'Text-to-Speech (ElevenLabs)',
    luaGate: 'Gate protection — node-wide access password',
    s06h3reload: 'Reload Lua after changes',
    orFullRestart: 'or full restart',
    s06info: '<strong>nginx.conf env declaration:</strong> OpenResty only inherits environment variables declared in <code>nginx.conf</code> with <code>env VARNAME;</code>. New secrets require an entry there and in the systemd override.',
    s07label: '07 · MCP Server',
    s07p: 'The MCP server is a standalone Node.js process running as a systemd service. It implements the Model Context Protocol as Streamable HTTP and provides all MCP tools.',
    s07h3setup: 'Setup (manual after init.sh)',
    fillEnvComment: 'fill in BASE_URL, SYS_API_URL, PORT',
    s07h3manage: 'Manage service',
    liveLogsComment: 'live logs',
    s08label: '08 · Encryption',
    s08h2: 'Vault Encryption',
    s08h3aes: 'AES-256-CBC (Vault)',
    s08pAes: 'All vault files are encrypted with AES-256-CBC in the browser before leaving it. The server only receives encrypted blocks — the vault key never resides on the server.',
    vaultKeyComment: 'Vault key: 64 hex chars (256-bit) · derived in browser from passphrase',
    unlockComment:  'Unlock:    POST /api/vault/unlock  →  server caches key for session duration',
    backupComment:  'Backup:    BIP39 12-word mnemonic  →  vault key recovery if passphrase lost',
    s08h3hmac: 'soul_cert (HMAC)',
    s08pHmac: 'The soul_cert authenticates the soul owner without a password. It is deterministically derivable — if lost, it is regenerated from SOUL_MASTER_KEY and soul_id.',
    s08warn: '<strong>SOUL_MASTER_KEY lost?</strong> All soul_certs become invalid. Users can no longer log in. Key is in <code>/etc/systemd/system/openresty.service.d/env.conf</code> and <code>/var/www/SaveYourSoul/.env</code>.',
    s08h3vaultLost: 'Vault key lost',
    s08pVaultLost: 'If both the passphrase and the 12-word mnemonic are lost, the vault cannot be decrypted. No recovery is possible. Create regular backups using "Encrypt &amp; Download" in the soul session.',
  },
}

const t = computed(() => lang.value === 'de' ? i18n.de : i18n.en)
const nav = computed(() => t.value.nav)

useSeoMeta({ title: 'Dev-Dokumentation – SaveYourSoul', robots: 'noindex' })

const active = ref('architecture')

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
.nav-end { display: flex; align-items: center; gap: 16px; }
.back { font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-3); background: none; border: none; cursor: pointer; transition: color 0.15s; white-space: nowrap; }
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
.step :deep(strong) { color: var(--fg); }
.step :deep(code) { font-family: var(--mono); font-size: 11px; color: var(--accent-bright); background: rgba(139,92,246,0.1); padding: 2px 5px; }

/* Boxes */
.info-box { background: rgba(139,92,246,0.06); border: 1px solid rgba(139,92,246,0.2); padding: 16px 20px; margin: 20px 0; font-size: 14px; line-height: 1.6; color: var(--fg-2); }
.info-box :deep(strong) { color: var(--fg); }
.warn-box { background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.2); padding: 16px 20px; margin: 20px 0; font-size: 14px; line-height: 1.6; color: var(--fg-2); }
.warn-box :deep(strong) { color: #fcd34d; }

/* Footer */
.foot-rule { padding: 18px clamp(20px,4vw,44px); border-top: 1px solid var(--rule); display: flex; justify-content: space-between; font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg-4); gap: 12px; flex-wrap: wrap; }
</style>
