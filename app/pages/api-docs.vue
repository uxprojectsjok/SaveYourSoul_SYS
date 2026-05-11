<template>
  <div class="docs-page">

    <nav class="l-nav">
      <div class="lockup">
        <span class="mark">SYS<span class="dot">.</span></span>
      </div>
      <div class="center"><span class="page-title">API-Dokumentation</span></div>
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
          <div class="doc-hero-kicker">API-Referenz · v1.0β</div>
          <h1>Save<em>Your</em>Soul<span class="amp">.</span></h1>
          <p>MCP-Tools, HTTP-Endpunkte und Authentifizierung für den persönlichen SYS Node.</p>
        </div>

        <!-- ── 1 · VERBINDUNG ── -->
        <section id="connection" class="doc-section">
          <div class="sec-label">01 · Verbindung</div>
          <h2>MCP-Client verbinden</h2>
          <p>Der MCP-Server läuft als eigenständiger Prozess auf deinem Node und kommuniziert per Streamable HTTP. Jeder MCP-kompatible Client kann sich direkt verbinden.</p>

          <div class="endpoint-box">
            <span class="method get">MCP</span>
            <code>https://&lt;deine-domain&gt;/mcp</code>
          </div>

          <h3>Claude Desktop</h3>
          <p>In <code>claude_desktop_config.json</code> eintragen:</p>
          <pre><code>{
  "mcpServers": {
    "sys": {
      "url": "https://&lt;deine-domain&gt;/mcp"
    }
  }
}</code></pre>

          <h3>claude.ai (Integrations)</h3>
          <p>Einstellungen → Integrationen → URL eintragen. Claude startet den OAuth-Flow automatisch — dein soul_cert wird als Bearer-Token ausgestellt.</p>

          <h3>OAuth-Scopes</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Scope</th><th>Zugang</th></tr></thead>
              <tbody>
                <tr><td><code>soul</code></td><td>sys.md lesen und schreiben</td></tr>
                <tr><td><code>calendar</code></td><td>Kalender-Einträge</td></tr>
                <tr><td><code>audio</code></td><td>Audio-Vault</td></tr>
                <tr><td><code>images</code></td><td>Bild-Vault</td></tr>
                <tr><td><code>video</code></td><td>Video-Vault</td></tr>
                <tr><td><code>context</code></td><td>Kontext-Dokumente</td></tr>
                <tr><td><code>network</code></td><td>Peer-Netzwerk</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ── 2 · AUTHENTIFIZIERUNG ── -->
        <section id="auth" class="doc-section">
          <div class="sec-label">02 · Authentifizierung</div>
          <h2>Token-Typen</h2>
          <p>Alle API-Aufrufe laufen über <code>vault_auth.lua</code>. Drei Token-Typen mit unterschiedlichem Scope:</p>

          <div class="table-wrap">
            <table>
              <thead><tr><th>Token</th><th>Format</th><th>Scope</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>soul_cert</code></td>
                  <td><code>{soul_id}.{hmac32}</code></td>
                  <td>Vollzugriff — Soul-Inhaber</td>
                </tr>
                <tr>
                  <td><code>pol_access_token</code></td>
                  <td>48 Hex-Zeichen</td>
                  <td>Bezahlter Agent — GET Vault + Agent-Write</td>
                </tr>
                <tr>
                  <td><code>service_token</code></td>
                  <td>Frei wählbar</td>
                  <td>Autorisierte Dienste, Vault entsperrt</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>soul_cert ableiten</h3>
          <pre><code>cert = HMAC-SHA256(SOUL_MASTER_KEY, soul_id).hex()[:32]
Authorization: Bearer {soul_id}.{cert}</code></pre>

          <div class="info-box">
            <strong>Hinweis:</strong> soul_cert und SOUL_MASTER_KEY werden bei der Einrichtung generiert und sind nur auf deinem Server gespeichert. Es gibt keine Möglichkeit, sie zurückzusetzen ohne Datenverlust.
          </div>
        </section>

        <!-- ── 3 · MCP TOOLS · SOUL ── -->
        <section id="mcp-soul" class="doc-section">
          <div class="sec-label">03 · MCP Tools · Soul</div>
          <h2>Soul lesen &amp; schreiben</h2>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">soul_read</code>
              <span class="tool-scope">soul_cert · pol_access_token</span>
            </div>
            <p>Liest den vollständigen sys.md-Inhalt — Persönlichkeit, Werte, Biografie, Projekte, Session-Log. Soll zu Beginn jeder KI-Sitzung aufgerufen werden.</p>
            <div class="tool-params">Keine Parameter</div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">soul_write</code>
              <span class="tool-scope">soul_cert</span>
            </div>
            <p>Schreibt Inhalt dauerhaft in eine sys.md-Sektion. Liest zuerst die aktuelle Datei, aktualisiert die Sektion, schreibt zurück.</p>
            <div class="tool-params">
              <div class="param"><code>section</code> <span>string · Name der ## Sektion ohne "##"</span></div>
              <div class="param"><code>content</code> <span>string · Markdown-Inhalt</span></div>
              <div class="param"><code>mode</code> <span>replace | append | prepend — Standard: replace</span></div>
            </div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">soul_maturity</code>
              <span class="tool-scope">soul_cert</span>
            </div>
            <p>Berechnet die Soul-Reife: Vollständigkeit, Session-Tiefe, Sektions-Coverage.</p>
            <div class="tool-params">Keine Parameter</div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">soul_skills</code>
              <span class="tool-scope">soul_cert</span>
            </div>
            <p>Extrahiert strukturierte Fähigkeiten und Expertise-Bereiche aus der Soul.</p>
            <div class="tool-params">Keine Parameter</div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">soul_cloud_push</code>
              <span class="tool-scope">soul_cert</span>
            </div>
            <p>Pusht die aktuelle sys.md verschlüsselt auf IPFS (Pinata). Gibt den IPFS-Hash zurück.</p>
            <div class="tool-params">Keine Parameter</div>
          </div>
        </section>

        <!-- ── 4 · MCP TOOLS · VAULT ── -->
        <section id="mcp-vault" class="doc-section">
          <div class="sec-label">04 · MCP Tools · Vault</div>
          <h2>Vault-Inhalte</h2>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">vault_manifest</code>
              <span class="tool-scope">soul_cert</span>
            </div>
            <p>Übersicht aller Vault-Ressourcen: freigegebene Dateitypen, soul_id, aktive Berechtigungen.</p>
            <div class="tool-params">Keine Parameter</div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">audio_list · audio_get</code>
              <span class="tool-scope">soul_cert · audio scope</span>
            </div>
            <p><code>audio_list</code> gibt alle Audio-Dateien mit Metadaten zurück. <code>audio_get</code> lädt eine einzelne Datei.</p>
            <div class="tool-params">
              <div class="param"><code>file</code> <span>string · audio_get · Dateiname</span></div>
            </div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">image_list · image_get</code>
              <span class="tool-scope">soul_cert · images scope</span>
            </div>
            <p><code>image_list</code> gibt alle Bilder zurück. <code>image_get</code> lädt ein einzelnes Bild als Base64.</p>
            <div class="tool-params">
              <div class="param"><code>file</code> <span>string · image_get · Dateiname</span></div>
            </div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">video_list · video_get</code>
              <span class="tool-scope">soul_cert · video scope</span>
            </div>
            <p><code>video_list</code> gibt alle Videos zurück. <code>video_get</code> lädt Metadaten und Stream-URL.</p>
            <div class="tool-params">
              <div class="param"><code>file</code> <span>string · video_get · Dateiname</span></div>
            </div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">context_list · context_get</code>
              <span class="tool-scope">soul_cert · context scope</span>
            </div>
            <p><code>context_list</code> gibt alle Kontext-Dokumente zurück (md, txt, pdf). <code>context_get</code> liefert den Inhalt einer Datei.</p>
            <div class="tool-params">
              <div class="param"><code>file</code> <span>string · context_get · Dateiname</span></div>
            </div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">calendar_read</code>
              <span class="tool-scope">soul_cert · calendar scope</span>
            </div>
            <p>Liest alle Kalender-Einträge der Soul.</p>
            <div class="tool-params">Keine Parameter</div>
          </div>

          <div class="tool-card">
            <div class="tool-head">
              <code class="tool-name">profile_get · profile_save</code>
              <span class="tool-scope">soul_cert</span>
            </div>
            <p>Liest oder speichert biometrische Profile: Gesicht, Stimme, Bewegung, Expertise.</p>
            <div class="tool-params">
              <div class="param"><code>type</code> <span>string · face | voice | motion | expertise</span></div>
            </div>
          </div>
        </section>

        <!-- ── 5 · HTTP API ── -->
        <section id="http-api" class="doc-section">
          <div class="sec-label">05 · HTTP API</div>
          <h2>Wichtige Endpunkte</h2>
          <p>Alle Endpunkte laufen über OpenResty/Lua auf deinem Node. Token als <code>Authorization: Bearer &lt;token&gt;</code>.</p>

          <h3>Soul</h3>
          <div class="endpoint-list">
            <div class="endpoint">
              <span class="method get">GET</span><code>/api/soul</code>
              <p>sys.md lesen · soul_cert oder pol_access_token</p>
            </div>
            <div class="endpoint">
              <span class="method put">PUT</span><code>/api/context</code>
              <p>sys.md Inhalt schreiben · soul_cert oder service_token · Body: <code>{ soul_content: "..." }</code></p>
            </div>
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/soul-cert</code>
              <p>soul_cert ausstellen · Body: <code>{ soul_id: "..." }</code></p>
            </div>
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/soul-rotate-cert</code>
              <p>soul_cert rotieren · soul_cert (Bearer)</p>
            </div>
            <div class="endpoint">
              <span class="method get">GET</span><code>/api/validate</code>
              <p>soul_cert validieren · soul_cert (Bearer) · 200 OK bei Erfolg</p>
            </div>
          </div>

          <h3>Vault</h3>
          <div class="endpoint-list">
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/vault/unlock</code>
              <p>Vault entsperren · Passphrase oder Mnemonic</p>
            </div>
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/vault/sync</code>
              <p>Vault-Dateien hochladen oder synchronisieren · soul_cert</p>
            </div>
            <div class="endpoint">
              <span class="method get">GET</span><code>/api/vault/public/:soul_id</code>
              <p>Public-Vault-Manifest einer Soul · kein Auth</p>
            </div>
          </div>

          <h3>KI &amp; Medien</h3>
          <div class="endpoint-list">
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/wavespeed-submit</code>
              <p>KI-Bildgenerierung starten (WaveSpeed AI) · soul_cert</p>
            </div>
            <div class="endpoint">
              <span class="method get">GET</span><code>/api/wavespeed-result</code>
              <p>Generiertes Bild abrufen · soul_cert · Query: <code>job_id</code></p>
            </div>
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/tts</code>
              <p>Text-to-Speech (ElevenLabs) · soul_cert</p>
            </div>
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/vault/profile/analyze</code>
              <p>Bild- oder Video-Analyse (Vision) · soul_cert</p>
            </div>
          </div>

          <h3>Peer-Netzwerk</h3>
          <div class="endpoint-list">
            <div class="endpoint">
              <span class="method get">GET</span><code>/api/vault/connections</code>
              <p>Verbundene Souls auflisten · soul_cert</p>
            </div>
            <div class="endpoint">
              <span class="method post">POST</span><code>/api/vault/connections</code>
              <p>Verbindungsanfrage senden oder bestätigen · soul_cert</p>
            </div>
            <div class="endpoint">
              <span class="method get">GET</span><code>/api/vault/connections/peer-files</code>
              <p>Freigegebene Dateien einer verbundenen Soul lesen · soul_cert · Query: <code>soul_id, file?</code></p>
            </div>
            <div class="endpoint">
              <span class="method get">GET</span><code>/api/vault/peer-stream</code>
              <p>Datei einer verbundenen Soul streamen · soul_cert · Query: <code>soul_id, file</code></p>
            </div>
          </div>
        </section>

        <!-- ── 6 · SYS.MD FORMAT ── -->
        <section id="sysmd" class="doc-section">
          <div class="sec-label">06 · sys.md Format</div>
          <h2>Die Soul-Datei</h2>
          <p>sys.md ist eine Markdown-Datei mit YAML-Frontmatter. Das Format ist offen (Apache 2.0) — kompatible Implementierungen sind willkommen.</p>

          <pre><code>---
soul_id: 00000000-0000-0000-0000-000000000000
soul_name: ""
created: YYYY-MM-DD
last_session: YYYY-MM-DD
version: 1
soul_cert: [automatisch generiert]
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
[Agent-schreibbarer Bereich]
&lt;!-- AGENT:END --&gt;</code></pre>

          <p>Der AGENT-Block ist der einzige Bereich, in den bezahlte Agenten schreiben können. Alle anderen Sektionen sind nur mit soul_cert schreibbar.</p>
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
useSeoMeta({ title: 'API-Dokumentation – SaveYourSoul', robots: 'noindex' })

const active = ref('connection')

const nav = [
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

/* Endpoint box */
.endpoint-box { display: flex; align-items: center; gap: 12px; background: rgba(13,11,20,0.9); border: 1px solid var(--rule-2); padding: 14px 20px; margin: 16px 0 24px; }
.endpoint-box code { font-family: var(--mono); font-size: 13px; color: var(--fg-2); background: none; padding: 0; }

/* Method badges */
.method { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 8px; flex: none; font-weight: 700; }
.method.get { background: rgba(16,185,129,0.15); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.2); }
.method.post { background: rgba(59,130,246,0.15); color: #93c5fd; border: 1px solid rgba(59,130,246,0.2); }
.method.put { background: rgba(245,158,11,0.15); color: #fcd34d; border: 1px solid rgba(245,158,11,0.2); }
.method.mcp { background: rgba(139,92,246,0.15); color: var(--accent-bright); border: 1px solid rgba(139,92,246,0.2); }

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
.info-box strong { color: var(--fg); }

/* Footer */
.foot-rule { padding: 18px clamp(20px,4vw,44px); border-top: 1px solid var(--rule); display: flex; justify-content: space-between; font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg-4); gap: 12px; flex-wrap: wrap; }
</style>
