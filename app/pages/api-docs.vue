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
          <div class="doc-hero-kicker">{{ t.heroKicker }}</div>
          <h1>Save<em>Your</em>Soul<span class="amp">.</span></h1>
          <p>{{ t.heroSub }}</p>
        </div>

        <!-- ── 1 · CONNECTION ── -->
        <section id="connection" class="doc-section">
          <div class="sec-label">{{ t.s01label }}</div>
          <h2>{{ t.s01h2 }}</h2>
          <p>{{ t.s01p }}</p>

          <div class="endpoint-box">
            <span class="method get">MCP</span>
            <code>https://&lt;your-domain&gt;/mcp</code>
          </div>

          <h3>Claude Desktop</h3>
          <p v-html="t.s01pClaude"></p>
          <pre><code>{
  "mcpServers": {
    "sys": {
      "url": "https://&lt;your-domain&gt;/mcp"
    }
  }
}</code></pre>

          <h3>claude.ai (Integrations)</h3>
          <p>{{ t.s01pClaudeai }}</p>

          <h3>OAuth-Scopes</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Scope</th><th>{{ t.thZugang }}</th></tr></thead>
              <tbody>
                <tr><td><code>soul</code></td><td>{{ t.scopeSoul }}</td></tr>
                <tr><td><code>calendar</code></td><td>{{ t.scopeCalendar }}</td></tr>
                <tr><td><code>audio</code></td><td>Audio Vault</td></tr>
                <tr><td><code>images</code></td><td>{{ t.scopeImages }}</td></tr>
                <tr><td><code>video</code></td><td>Video Vault</td></tr>
                <tr><td><code>context</code></td><td>{{ t.scopeContext }}</td></tr>
                <tr><td><code>network</code></td><td>{{ t.scopeNetwork }}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ── 2 · AUTH ── -->
        <section id="auth" class="doc-section">
          <div class="sec-label">{{ t.s02label }}</div>
          <h2>{{ t.s02h2 }}</h2>
          <p v-html="t.s02p"></p>

          <div class="table-wrap">
            <table>
              <thead><tr><th>Token</th><th>Format</th><th>Scope</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>soul_cert</code></td>
                  <td><code>{soul_id}.{hmac32}</code></td>
                  <td>{{ t.tdSoulCertScope }}</td>
                </tr>
                <tr>
                  <td><code>pol_access_token</code></td>
                  <td>48 Hex</td>
                  <td>{{ t.tdPolScope }}</td>
                </tr>
                <tr>
                  <td><code>service_token</code></td>
                  <td>{{ t.tdServiceTokenFormat }}</td>
                  <td>{{ t.tdServiceScope }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>{{ t.s02h3 }}</h3>
          <pre><code>cert = HMAC-SHA256(SOUL_MASTER_KEY, soul_id).hex()[:32]
Authorization: Bearer {soul_id}.{cert}</code></pre>

          <div class="info-box" v-html="t.s02info"></div>
        </section>

        <!-- ── 3 · MCP TOOLS · SOUL ── -->
        <section id="mcp-soul" class="doc-section">
          <div class="sec-label">{{ t.s03label }}</div>
          <h2>{{ t.s03h2 }}</h2>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">soul_read</code>
              <span class="tool-scope">soul_cert · pol_access_token</span>
            </div>
            <p>{{ t.soulReadDesc }}</p>
            <div class="tool-params">{{ t.noParams }}</div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">soul_write</code>
              <span class="tool-scope">soul_cert</span>
            </div>
            <p>{{ t.soulWriteDesc }}</p>
            <div class="tool-params">
              <div class="param"><code>section</code> <span>{{ t.paramSection }}</span></div>
              <div class="param"><code>content</code> <span>{{ t.paramContent }}</span></div>
              <div class="param"><code>mode</code> <span>{{ t.paramMode }}</span></div>
            </div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">soul_maturity</code>
              <span class="tool-scope">soul_cert</span>
            </div>
            <p>{{ t.soulMaturityDesc }}</p>
            <div class="tool-params">{{ t.noParams }}</div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">soul_skills</code>
              <span class="tool-scope">soul_cert</span>
            </div>
            <p>{{ t.soulSkillsDesc }}</p>
            <div class="tool-params">{{ t.noParams }}</div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">soul_cloud_push</code>
              <span class="tool-scope">soul_cert</span>
            </div>
            <p>{{ t.soulCloudPushDesc }}</p>
            <div class="tool-params">{{ t.noParams }}</div>
          </div>
        </section>

        <!-- ── 4 · MCP TOOLS · VAULT ── -->
        <section id="mcp-vault" class="doc-section">
          <div class="sec-label">{{ t.s04label }}</div>
          <h2>{{ t.s04h2 }}</h2>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">vault_manifest</code>
              <span class="tool-scope">soul_cert</span>
            </div>
            <p>{{ t.vaultManifestDesc }}</p>
            <div class="tool-params">{{ t.noParams }}</div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">audio_list · audio_get</code>
              <span class="tool-scope">soul_cert · audio scope</span>
            </div>
            <p v-html="t.audioDesc"></p>
            <div class="tool-params">
              <div class="param"><code>file</code> <span>{{ t.paramFileAudio }}</span></div>
            </div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">image_list · image_get</code>
              <span class="tool-scope">soul_cert · images scope</span>
            </div>
            <p v-html="t.imageDesc"></p>
            <div class="tool-params">
              <div class="param"><code>file</code> <span>{{ t.paramFileImage }}</span></div>
            </div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">video_list · video_get</code>
              <span class="tool-scope">soul_cert · video scope</span>
            </div>
            <p v-html="t.videoDesc"></p>
            <div class="tool-params">
              <div class="param"><code>file</code> <span>{{ t.paramFileVideo }}</span></div>
            </div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">context_list · context_get</code>
              <span class="tool-scope">soul_cert · context scope</span>
            </div>
            <p v-html="t.contextDesc"></p>
            <div class="tool-params">
              <div class="param"><code>file</code> <span>{{ t.paramFileContext }}</span></div>
            </div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">calendar_read</code>
              <span class="tool-scope">soul_cert · calendar scope</span>
            </div>
            <p>{{ t.calendarReadDesc }}</p>
            <div class="tool-params">{{ t.noParams }}</div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">profile_get · profile_save</code>
              <span class="tool-scope">soul_cert</span>
            </div>
            <p>{{ t.profileDesc }}</p>
            <div class="tool-params">
              <div class="param"><code>type</code> <span>{{ t.paramTypeProfile }}</span></div>
            </div>
          </div>
        </section>

        <!-- ── 5 · HTTP API ── -->
        <section id="http-api" class="doc-section">
          <div class="sec-label">{{ t.s05label }}</div>
          <h2>{{ t.s05h2 }}</h2>
          <p v-html="t.s05p"></p>

          <h3>Soul</h3>
          <div class="endpoint-list">
            <div class="endpoint">
              <span class="method get">GET</span><code>/api/soul</code>
              <p v-html="t.epSoulGet"></p>
            </div>
            <div class="endpoint">
              <span class="method put">PUT</span><code>/api/context</code>
              <p v-html="t.epContextPut"></p>
            </div>
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/soul-cert</code>
              <p v-html="t.epSoulCert"></p>
            </div>
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/soul-rotate-cert</code>
              <p>{{ t.epSoulRotate }}</p>
            </div>
            <div class="endpoint">
              <span class="method get">GET</span><code>/api/validate</code>
              <p>{{ t.epValidate }}</p>
            </div>
          </div>

          <h3>Vault</h3>
          <div class="endpoint-list">
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/vault/unlock</code>
              <p>{{ t.epVaultUnlock }}</p>
            </div>
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/vault/sync</code>
              <p>{{ t.epVaultSync }}</p>
            </div>
            <div class="endpoint">
              <span class="method get">GET</span><code>/api/vault/public/:soul_id</code>
              <p>{{ t.epVaultPublic }}</p>
            </div>
          </div>

          <h3>{{ t.h3KI }}</h3>
          <div class="endpoint-list">
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/wavespeed-submit</code>
              <p>{{ t.epWavespeed }}</p>
            </div>
            <div class="endpoint">
              <span class="method get">GET</span><code>/api/wavespeed-result</code>
              <p v-html="t.epWavespeedResult"></p>
            </div>
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/tts</code>
              <p>{{ t.epTTS }}</p>
            </div>
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/vault/profile/analyze</code>
              <p>{{ t.epProfileAnalyze }}</p>
            </div>
          </div>

          <h3>{{ t.h3Peer }}</h3>
          <div class="endpoint-list">
            <div class="endpoint">
              <span class="method get">GET</span><code>/api/vault/connections</code>
              <p>{{ t.epConnectionsGet }}</p>
            </div>
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/vault/connections</code>
              <p>{{ t.epConnectionsPost }}</p>
            </div>
            <div class="endpoint">
              <span class="method get">GET</span><code>/api/vault/connections/peer-files</code>
              <p v-html="t.epPeerFiles"></p>
            </div>
            <div class="endpoint">
              <span class="method get">GET</span><code>/api/vault/peer-stream</code>
              <p v-html="t.epPeerStream"></p>
            </div>
          </div>
        </section>

        <!-- ── 6 · SYS.MD FORMAT ── -->
        <section id="sysmd" class="doc-section">
          <div class="sec-label">{{ t.s06label }}</div>
          <h2>{{ t.s06h2 }}</h2>
          <p>{{ t.s06p }}</p>

          <pre><code>---
soul_id: 00000000-0000-0000-0000-000000000000
soul_name: ""
created: YYYY-MM-DD
last_session: YYYY-MM-DD
version: 1
soul_cert: [auto-generated]
vault_hash: ""
soul_growth_chain: []
soul_chain_anchor: null
storage_tx: ""
---

## Core Identity
## Values &amp; Beliefs
## Aesthetics &amp; Resonance
## Speech Patterns &amp; Expression
## Recurring Themes
## Emotional Signature
## Worldview
## Session Log (compressed)
## Calendar

&lt;!-- AGENT:START --&gt;
{{ t.agentComment }}
&lt;!-- AGENT:END --&gt;</code></pre>

          <p>{{ t.s06agentNote }}</p>
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
    pageTitle: 'API-Dokumentation',
    back: '← Zurück',
    heroKicker: 'API-Referenz · v1.0β',
    heroSub: 'MCP-Tools, HTTP-Endpunkte und Authentifizierung für den persönlichen SYS Node.',
    nav: [
      { label: 'Grundlagen', items: [
        { id: 'connection', title: 'Verbindung' },
        { id: 'auth',       title: 'Authentifizierung' },
      ]},
      { label: 'MCP Tools', items: [
        { id: 'mcp-soul',  title: 'Soul' },
        { id: 'mcp-vault', title: 'Vault' },
      ]},
      { label: 'HTTP API', items: [
        { id: 'http-api', title: 'Endpunkte' },
      ]},
      { label: 'Referenz', items: [
        { id: 'sysmd', title: 'sys.md Format' },
      ]},
    ],
    s01label: '01 · Verbindung',
    s01h2: 'MCP-Client verbinden',
    s01p: 'Der MCP-Server läuft als eigenständiger Prozess auf deinem Node und kommuniziert per Streamable HTTP. Jeder MCP-kompatible Client kann sich direkt verbinden.',
    s01pClaude: 'In <code>claude_desktop_config.json</code> eintragen:',
    s01pClaudeai: 'Einstellungen → Integrationen → URL eintragen. Claude startet den OAuth-Flow automatisch — dein soul_cert wird als Bearer-Token ausgestellt.',
    thZugang: 'Zugang',
    scopeSoul: 'sys.md lesen und schreiben',
    scopeCalendar: 'Kalender-Einträge',
    scopeImages: 'Bild-Vault',
    scopeContext: 'Kontext-Dokumente',
    scopeNetwork: 'Peer-Netzwerk',
    s02label: '02 · Authentifizierung',
    s02h2: 'Token-Typen',
    s02p: 'Alle API-Aufrufe laufen über <code>vault_auth.lua</code>. Drei Token-Typen mit unterschiedlichem Scope:',
    tdSoulCertScope: 'Vollzugriff — Soul-Inhaber',
    tdPolScope: 'Bezahlter Agent — GET Vault + Agent-Write',
    tdServiceTokenFormat: 'Frei wählbar',
    tdServiceScope: 'Autorisierte Dienste, Vault entsperrt',
    s02h3: 'soul_cert ableiten',
    s02info: '<strong>Hinweis:</strong> soul_cert und SOUL_MASTER_KEY werden bei der Einrichtung generiert und sind nur auf deinem Server gespeichert. Es gibt keine Möglichkeit, sie zurückzusetzen ohne Datenverlust.',
    s03label: '03 · MCP Tools · Soul',
    s03h2: 'Soul lesen & schreiben',
    soulReadDesc: 'Liest den vollständigen sys.md-Inhalt — Persönlichkeit, Werte, Biografie, Projekte, Session-Log. Soll zu Beginn jeder KI-Sitzung aufgerufen werden.',
    noParams: 'Keine Parameter',
    soulWriteDesc: 'Schreibt Inhalt dauerhaft in eine sys.md-Sektion. Liest zuerst die aktuelle Datei, aktualisiert die Sektion, schreibt zurück.',
    paramSection: 'string · Name der ## Sektion ohne "##"',
    paramContent: 'string · Markdown-Inhalt',
    paramMode: 'replace | append | prepend — Standard: replace',
    soulMaturityDesc: 'Berechnet die Soul-Reife: Vollständigkeit, Session-Tiefe, Sektions-Coverage.',
    soulSkillsDesc: 'Extrahiert strukturierte Fähigkeiten und Expertise-Bereiche aus der Soul.',
    soulCloudPushDesc: 'Pusht die aktuelle sys.md verschlüsselt auf IPFS (Pinata). Gibt den IPFS-Hash zurück.',
    s04label: '04 · MCP Tools · Vault',
    s04h2: 'Vault-Inhalte',
    vaultManifestDesc: 'Übersicht aller Vault-Ressourcen: freigegebene Dateitypen, soul_id, aktive Berechtigungen.',
    audioDesc: '<code>audio_list</code> gibt alle Audio-Dateien mit Metadaten zurück. <code>audio_get</code> lädt eine einzelne Datei.',
    paramFileAudio: 'string · audio_get · Dateiname',
    imageDesc: '<code>image_list</code> gibt alle Bilder zurück. <code>image_get</code> lädt ein einzelnes Bild als Base64.',
    paramFileImage: 'string · image_get · Dateiname',
    videoDesc: '<code>video_list</code> gibt alle Videos zurück. <code>video_get</code> lädt Metadaten und Stream-URL.',
    paramFileVideo: 'string · video_get · Dateiname',
    contextDesc: '<code>context_list</code> gibt alle Kontext-Dokumente zurück (md, txt, pdf). <code>context_get</code> liefert den Inhalt einer Datei.',
    paramFileContext: 'string · context_get · Dateiname',
    calendarReadDesc: 'Liest alle Kalender-Einträge der Soul.',
    profileDesc: 'Liest oder speichert biometrische Profile: Gesicht, Stimme, Bewegung, Expertise.',
    paramTypeProfile: 'string · face | voice | motion | expertise',
    s05label: '05 · HTTP API',
    s05h2: 'Wichtige Endpunkte',
    s05p: 'Alle Endpunkte laufen über OpenResty/Lua auf deinem Node. Token als <code>Authorization: Bearer &lt;token&gt;</code>.',
    h3KI: 'KI & Medien',
    h3Peer: 'Peer-Netzwerk',
    epSoulGet: 'sys.md lesen · soul_cert oder pol_access_token',
    epContextPut: 'sys.md Inhalt schreiben · soul_cert oder service_token · Body: <code>{ soul_content: "..." }</code>',
    epSoulCert: 'soul_cert ausstellen · Body: <code>{ soul_id: "..." }</code>',
    epSoulRotate: 'soul_cert rotieren · soul_cert (Bearer)',
    epValidate: 'soul_cert validieren · soul_cert (Bearer) · 200 OK bei Erfolg',
    epVaultUnlock: 'Vault entsperren · Passphrase oder Mnemonic',
    epVaultSync: 'Vault-Dateien hochladen oder synchronisieren · soul_cert',
    epVaultPublic: 'Public-Vault-Manifest einer Soul · kein Auth',
    epWavespeed: 'KI-Bildgenerierung starten (WaveSpeed AI) · soul_cert',
    epWavespeedResult: 'Generiertes Bild abrufen · soul_cert · Query: <code>job_id</code>',
    epTTS: 'Text-to-Speech (ElevenLabs) · soul_cert',
    epProfileAnalyze: 'Bild- oder Video-Analyse (Vision) · soul_cert',
    epConnectionsGet: 'Verbundene Souls auflisten · soul_cert',
    epConnectionsPost: 'Verbindungsanfrage senden oder bestätigen · soul_cert',
    epPeerFiles: 'Freigegebene Dateien einer verbundenen Soul lesen · soul_cert · Query: <code>soul_id, file?</code>',
    epPeerStream: 'Datei einer verbundenen Soul streamen · soul_cert · Query: <code>soul_id, file</code>',
    s06label: '06 · sys.md Format',
    s06h2: 'Die Soul-Datei',
    s06p: 'sys.md ist eine Markdown-Datei mit YAML-Frontmatter. Das Format ist offen (Apache 2.0) — kompatible Implementierungen sind willkommen.',
    agentComment: '[Agent-schreibbarer Bereich]',
    s06agentNote: 'Der AGENT-Block ist der einzige Bereich, in den bezahlte Agenten schreiben können. Alle anderen Sektionen sind nur mit soul_cert schreibbar.',
  },
  en: {
    pageTitle: 'API Documentation',
    back: '← Back',
    heroKicker: 'API Reference · v1.0β',
    heroSub: 'MCP tools, HTTP endpoints and authentication for your personal SYS node.',
    nav: [
      { label: 'Basics', items: [
        { id: 'connection', title: 'Connection' },
        { id: 'auth',       title: 'Authentication' },
      ]},
      { label: 'MCP Tools', items: [
        { id: 'mcp-soul',  title: 'Soul' },
        { id: 'mcp-vault', title: 'Vault' },
      ]},
      { label: 'HTTP API', items: [
        { id: 'http-api', title: 'Endpoints' },
      ]},
      { label: 'Reference', items: [
        { id: 'sysmd', title: 'sys.md Format' },
      ]},
    ],
    s01label: '01 · Connection',
    s01h2: 'Connect an MCP Client',
    s01p: 'The MCP server runs as a standalone process on your node and communicates via Streamable HTTP. Any MCP-compatible client can connect directly.',
    s01pClaude: 'Add to <code>claude_desktop_config.json</code>:',
    s01pClaudeai: 'Settings → Integrations → enter URL. Claude starts the OAuth flow automatically — your soul_cert is issued as a Bearer token.',
    thZugang: 'Access',
    scopeSoul: 'Read and write sys.md',
    scopeCalendar: 'Calendar entries',
    scopeImages: 'Image vault',
    scopeContext: 'Context documents',
    scopeNetwork: 'Peer network',
    s02label: '02 · Authentication',
    s02h2: 'Token Types',
    s02p: 'All API calls go through <code>vault_auth.lua</code>. Three token types with different scopes:',
    tdSoulCertScope: 'Full access — soul owner',
    tdPolScope: 'Paid agent — GET vault + agent write',
    tdServiceTokenFormat: 'Freely defined',
    tdServiceScope: 'Authorized services, vault unlocked',
    s02h3: 'Derive soul_cert',
    s02info: '<strong>Note:</strong> soul_cert and SOUL_MASTER_KEY are generated during setup and stored only on your server. There is no way to reset them without data loss.',
    s03label: '03 · MCP Tools · Soul',
    s03h2: 'Read & write soul',
    soulReadDesc: 'Reads the complete sys.md content — personality, values, biography, projects, session log. Should be called at the start of every AI session.',
    noParams: 'No parameters',
    soulWriteDesc: 'Writes content permanently to a sys.md section. Reads the current file first, updates the section, writes back.',
    paramSection: 'string · Name of the ## section without "##"',
    paramContent: 'string · Markdown content',
    paramMode: 'replace | append | prepend — default: replace',
    soulMaturityDesc: 'Calculates soul maturity: completeness, session depth, section coverage.',
    soulSkillsDesc: 'Extracts structured skills and expertise areas from the soul.',
    soulCloudPushDesc: 'Pushes the current sys.md encrypted to IPFS (Pinata). Returns the IPFS hash.',
    s04label: '04 · MCP Tools · Vault',
    s04h2: 'Vault Contents',
    vaultManifestDesc: 'Overview of all vault resources: shared file types, soul_id, active permissions.',
    audioDesc: '<code>audio_list</code> returns all audio files with metadata. <code>audio_get</code> loads a single file.',
    paramFileAudio: 'string · audio_get · filename',
    imageDesc: '<code>image_list</code> returns all images. <code>image_get</code> loads a single image as Base64.',
    paramFileImage: 'string · image_get · filename',
    videoDesc: '<code>video_list</code> returns all videos. <code>video_get</code> loads metadata and stream URL.',
    paramFileVideo: 'string · video_get · filename',
    contextDesc: '<code>context_list</code> returns all context documents (md, txt, pdf). <code>context_get</code> delivers a file\'s content.',
    paramFileContext: 'string · context_get · filename',
    calendarReadDesc: 'Reads all calendar entries of the soul.',
    profileDesc: 'Reads or saves biometric profiles: face, voice, motion, expertise.',
    paramTypeProfile: 'string · face | voice | motion | expertise',
    s05label: '05 · HTTP API',
    s05h2: 'Key Endpoints',
    s05p: 'All endpoints run through OpenResty/Lua on your node. Pass tokens as <code>Authorization: Bearer &lt;token&gt;</code>.',
    h3KI: 'AI & Media',
    h3Peer: 'Peer Network',
    epSoulGet: 'Read sys.md · soul_cert or pol_access_token',
    epContextPut: 'Write sys.md content · soul_cert or service_token · Body: <code>{ soul_content: "..." }</code>',
    epSoulCert: 'Issue soul_cert · Body: <code>{ soul_id: "..." }</code>',
    epSoulRotate: 'Rotate soul_cert · soul_cert (Bearer)',
    epValidate: 'Validate soul_cert · soul_cert (Bearer) · 200 OK on success',
    epVaultUnlock: 'Unlock vault · passphrase or mnemonic',
    epVaultSync: 'Upload or sync vault files · soul_cert',
    epVaultPublic: 'Public vault manifest of a soul · no auth',
    epWavespeed: 'Start AI image generation (WaveSpeed AI) · soul_cert',
    epWavespeedResult: 'Retrieve generated image · soul_cert · Query: <code>job_id</code>',
    epTTS: 'Text-to-Speech (ElevenLabs) · soul_cert',
    epProfileAnalyze: 'Image or video analysis (Vision) · soul_cert',
    epConnectionsGet: 'List connected souls · soul_cert',
    epConnectionsPost: 'Send or confirm connection request · soul_cert',
    epPeerFiles: 'Read shared files of a connected soul · soul_cert · Query: <code>soul_id, file?</code>',
    epPeerStream: 'Stream a file from a connected soul · soul_cert · Query: <code>soul_id, file</code>',
    s06label: '06 · sys.md Format',
    s06h2: 'The Soul File',
    s06p: 'sys.md is a Markdown file with YAML frontmatter. The format is open (Apache 2.0) — compatible implementations are welcome.',
    agentComment: '[Agent-writable area]',
    s06agentNote: 'The AGENT block is the only area that paid agents can write to. All other sections can only be written with soul_cert.',
  },
}

const t = computed(() => lang.value === 'de' ? i18n.de : i18n.en)
const nav = computed(() => t.value.nav)

useSeoMeta({ title: 'API-Dokumentation – SaveYourSoul', robots: 'noindex' })

const active = ref('connection')

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

/* Endpoint box */
.endpoint-box { display: flex; align-items: center; gap: 12px; background: rgba(13,11,20,0.9); border: 1px solid var(--rule-2); padding: 14px 20px; margin: 16px 0 24px; }
.endpoint-box code { font-family: var(--mono); font-size: 13px; color: var(--fg-2); background: none; padding: 0; }

/* Method badges */
.method { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 8px; flex: none; font-weight: 700; }
.method.get { background: rgba(16,185,129,0.15); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.2); }
.method.post { background: rgba(59,130,246,0.15); color: #93c5fd; border: 1px solid rgba(59,130,246,0.2); }
.method.put { background: rgba(245,158,11,0.15); color: #fcd34d; border: 1px solid rgba(245,158,11,0.2); }

/* Endpoint list */
.endpoint-list { display: flex; flex-direction: column; gap: 0; border: 1px solid var(--rule); margin: 16px 0 24px; }
.endpoint { display: grid; grid-template-columns: 52px auto 1fr; gap: 14px; align-items: baseline; padding: 12px 16px; border-bottom: 1px solid var(--rule); }
.endpoint:last-child { border-bottom: 0; }
.endpoint code { font-family: var(--mono); font-size: 12px; color: var(--fg-2); background: none; padding: 0; }
.endpoint p { font-size: 12px; color: var(--fg-3); margin: 0; line-height: 1.5; }
@media (max-width: 640px) { .endpoint { grid-template-columns: 52px 1fr; } .endpoint p { grid-column: 1/-1; } }

/* Tool cards */
.tool-card { border: 1px solid var(--rule); padding: 20px 24px; margin-bottom: 12px; }
.tool-head { display: flex; align-items: baseline; gap: 16px; margin-bottom: 10px; flex-wrap: wrap; }
.tool-name { font-family: var(--mono); font-size: 14px; color: var(--accent-bright); background: rgba(139,92,246,0.1); padding: 3px 8px; }
.tool-scope { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fg-4); }
.tool-card > p { font-size: 14px; line-height: 1.6; color: var(--fg-2); margin: 0 0 12px; }
.tool-params { display: flex; flex-direction: column; gap: 4px; border-top: 1px solid var(--rule); padding-top: 12px; }
.param { display: flex; gap: 12px; font-size: 13px; }
.param code { font-family: var(--mono); font-size: 11px; color: var(--accent-bright); background: rgba(139,92,246,0.1); padding: 2px 6px; flex: none; }
.param span { color: var(--fg-3); line-height: 1.5; }
.tool-params > div:only-child:not(.param) { color: var(--fg-4); font-family: var(--mono); font-size: 11px; }

/* Info box */
.info-box { background: rgba(139,92,246,0.06); border: 1px solid rgba(139,92,246,0.2); padding: 16px 20px; margin: 20px 0; font-size: 14px; line-height: 1.6; color: var(--fg-2); }
.info-box :deep(strong) { color: var(--fg); }

/* Footer */
.foot-rule { padding: 18px clamp(20px,4vw,44px); border-top: 1px solid var(--rule); display: flex; justify-content: space-between; font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg-4); gap: 12px; flex-wrap: wrap; }
</style>
