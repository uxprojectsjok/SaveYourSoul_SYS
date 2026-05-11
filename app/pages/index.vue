<template>
  <ClientOnly>
      <div class="sys-page landing">

        <nav class="l-nav">
          <div class="lockup">
            <span class="mark">SYS<span class="dot">.</span></span>
            <span class="tag">Save Your Soul · v1.0β</span>
          </div>
          <div class="center"><span class="notice-text">Jan-Oliver Karo · UX-Projects · Marburg</span></div>
          <div class="actions">
            <button v-if="config.public.allowCreateSoul" class="btn ghost" @click="createSoulOpen = true">Create Soul</button>
            <button v-if="config.public.allowLogin" class="btn primary" @click="loginOpen = true">Login <span class="arr">→</span></button>
          </div>
        </nav>

        <div class="ticker" aria-hidden="true">
          <div class="track">
            <span v-for="i in 2" :key="i">
              <em>◆</em> Deine KI-Identität, komplett unter deiner Kontrolle
              <em>◆</em> Lokal gespeichert · AES-256 verschlüsselt
              <em>◆</em> KI-Agenten verbinden sich direkt per MCP
              <em>◆</em> Peer-to-Peer · Nodes vernetzen sich untereinander
              <em>◆</em> Blockchain-verankert · on-chain verifiziert
              <em>◆</em> sys.md — deine Datei, deine Regeln
            </span>
          </div>
        </div>

        <section class="hero">
          <div class="hero-vis" aria-hidden="true">
            <img src="/ecosystem/mensch_ki.webp" alt="" />
          </div>
          <div class="hero-grid">
            <h1 class="display">Save <em>Your</em><br>Soul<span class="amp">.</span></h1>
            <aside class="side">
              <div class="issue">Dein Node · dein Server · deine Daten</div>
              <p>Deine KI kennt dich. <b>Andere Nodes finden dich — Agenten zahlen für Zugang.</b> Kryptographisch signiert, lokal gespeichert, dezentral vernetzt.</p>
              <p>Kein Account. Kein Plattformzwang. Deine Soul gehört dir — und arbeitet für dich.</p>
              <div class="cta-row">
                <button v-if="config.public.allowCreateSoul" class="btn primary" @click="createSoulOpen = true">Create Soul <span class="arr">→</span></button>
                <button v-if="config.public.allowLogin" class="btn ghost" @click="loginOpen = true">Login with Soul</button>
              </div>
            </aside>
          </div>
          <div class="hero-meta">
            <span><b>01</b> Portable Identitätsdatei</span>
            <span><b>02</b> Peer-to-Peer vernetzt</span>
            <span><b>03</b> Lokal · verschlüsselt · on-chain</span>
            <span><b>04</b> MCP · Polygon · IPFS</span>
          </div>
        </section>

        <div class="masthead">
          <div><span class="lbl">sys.md Format</span><span class="val">Markdown<em>+YAML</em></span></div>
          <div><span class="lbl">Verschlüsselung</span><span class="val">AES-256<em>CBC · GCM</em></span></div>
          <div><span class="lbl">Anker</span><span class="val">Polygon<em>Mainnet</em></span></div>
          <div><span class="lbl">Protokoll</span><span class="val">MCP<em>open</em></span></div>
        </div>

        <section class="sec">
          <header class="sec-head">
            <span class="n">Schnellstart</span>
            <h2>In drei Schritten<br><em>zur lebendigen Soul.</em></h2>
          </header>
          <ol class="steps">
            <li><div class="big"><em>01</em></div><div class="k">Schritt 01 · Einrichtung</div><h3>Eigenen Node starten</h3><p>SaveYourSoul mit dem geführten Einrichtungsassistenten auf eigenem Server in Betrieb nehmen.</p></li>
            <li><div class="big"><em>02</em></div><div class="k">Schritt 02 · MCP</div><h3>KI-Client verbinden</h3><p>Verbindungsadresse in deinem KI-Client eintragen — die Anmeldung erscheint automatisch.</p></li>
            <li><div class="big"><em>03</em></div><div class="k">Schritt 03 · Guide</div><h3>Soul Guide starten</h3><p>Einmal im KI-Chat aufrufen — deine KI liest die Soul und schreibt nach bedeutsamen Gesprächen Einträge.</p></li>
          </ol>
        </section>

        <section class="sec no-pad-bottom">
          <header class="sec-head">
            <span class="n">Fünf Bausteine</span>
            <h2>Identität. Vault.<br><em>KI. Netzwerk. Markt.</em></h2>
          </header>
          <div class="feat">
            <article>
              <div class="feat-vis" aria-hidden="true"><img src="/ecosystem/phase1-soul.webp" alt="" /></div>
              <div class="k">I · Soul Protocol</div>
              <h3>Identität<em>,</em> als Datei.</h3>
              <p class="lede">Eine kryptographisch signierte Identitätsdatei, die deine Persönlichkeit strukturiert erfasst und durch jede Session weiterentwickelt wird.</p>
              <ul><li>Kryptographische Signatur</li><li>Offenes sys.md-Format</li><li>Soul-Kalender · Vault-Sync</li><li>Wächst mit jeder Session</li><li>Blockchain-Anker (optional)</li></ul>
            </article>
            <article>
              <div class="feat-vis" aria-hidden="true"><img src="/ecosystem/Vault.webp" alt="" /></div>
              <div class="k">II · Memory Vault</div>
              <h3>Vault<em>,</em> als Tresor.</h3>
              <p class="lede">Dein lokaler, verschlüsselter Ordner für alles, was dich ausmacht — Stimme, Gesicht, Bewegung, Bilder, Texte. Lokal auf deinem Gerät.</p>
              <ul><li>Stimme, Gesicht &amp; Bewegung</li><li>AES-256 Verschlüsselung</li><li>12-Wort-Wiederherstellungsschlüssel</li><li>Datei-Verwaltung</li><li>Geräteübergreifender Import</li></ul>
            </article>
            <article>
              <div class="feat-vis" aria-hidden="true"><img src="/ecosystem/phase4-robot.webp" alt="" /></div>
              <div class="k">III · AI Interface</div>
              <h3>KI<em>,</em> die dich kennt.</h3>
              <p class="lede">Sprich mit einer KI, die deine Soul kennt. Die Soul wird automatisch angereichert — dein Profil wächst mit.</p>
              <ul><li>Soul als Kontext für KI</li><li>Echtzeit-Streaming-Antworten</li><li>Automatische Soul-Anreicherung</li><li>Kamera-Analyse · Bild &amp; Video</li></ul>
            </article>
            <article>
              <div class="feat-vis" aria-hidden="true"><img src="/ecosystem/phase3-api.webp" alt="" /></div>
              <div class="k">IV · Soul Network</div>
              <h3>Netzwerk<em>,</em> für Nodes.</h3>
              <p class="lede">Verbinde deinen Node mit anderen. Peers teilen Kontext, Kalender und Vault-Inhalte — direkt, kryptographisch gesichert, ohne Zwischendienst.</p>
              <ul><li>Peer-to-Peer Verbindungen</li><li>Kontext &amp; Vault zwischen Nodes</li><li>Kalender-Sync zwischen Peers</li><li>Mehrstufige Zugangskontrolle</li><li>Browser-Erweiterung für Chrome</li></ul>
            </article>
            <article>
              <div class="feat-vis" aria-hidden="true"><img src="/ecosystem/agent_marketplace.webp" alt="" /></div>
              <div class="k">V · Agent Marketplace</div>
              <h3>KI-Agenten<em>,</em> finden dich.</h3>
              <p class="lede">Registriere deine Soul im dezentralen IPFS-Verzeichnis. Externe KI-Agenten entdecken dich, zahlen in POL und erhalten kontrollierten MCP-Zugang.</p>
              <ul><li>Dezentrale Verzeichnis-Registrierung</li><li>Einnahmen pro KI-Zugriff</li><li>Blockchain-verifizierte Identität</li><li>On-chain Zahlungsvalidierung</li><li>Einnahmen-Übersicht</li></ul>
            </article>
          </div>
        </section>

        <!-- ─── Agent Marketplace Vision ──────────────────────────────── -->
        <section class="sec marketplace-vision">
          <header class="sec-head">
            <span class="n">Agent Marketplace</span>
            <h2>Deine Identität.<br><em>Dein Markt.</em></h2>
          </header>

          <div class="mv-intro">
            <p>KI-Agenten brauchen menschlichen Kontext — und zahlen dafür. SaveYourSoul macht deinen Node zum wirtschaftlichen Teilnehmer im KI-Ökosystem: dezentral registriert, kryptographisch gesichert, ökonomisch selbsttragend. Du bestimmst den Preis, die Laufzeit und was sichtbar ist — jeder Zugriff wird on-chain abgerechnet.</p>
          </div>
          <ol class="steps">
            <li><div class="big"><em>01</em></div><div class="k">Schritt 01 · Entdecken</div><h3>Entdecken</h3><p>KI-Agenten finden deinen Node über das dezentrale IPFS-Verzeichnis — Name, Adresse und Zugangsmodus sind öffentlich sichtbar.</p></li>
            <li><div class="big"><em>02</em></div><div class="k">Schritt 02 · Prüfen</div><h3>Prüfen</h3><p>Der Agent ruft das öffentliche Profil ab: freigegebene Inhalte, Zugangsmodus und Preis — bevor eine Verbindung entsteht.</p></li>
            <li><div class="big"><em>03</em></div><div class="k">Schritt 03 · Zahlung</div><h3>Zahlung</h3><p>POL-Zahlung direkt an deine Wallet auf Polygon. Der Node verifiziert die Transaktion on-chain, bevor Zugang gewährt wird.</p></li>
            <li><div class="big"><em>04</em></div><div class="k">Schritt 04 · Zugang</div><h3>Zugang</h3><p>Der Agent erhält zeitlich begrenzten Zugang zu den von dir freigegebenen Inhalten. Laufzeit und Umfang bestimmst du.</p></li>
          </ol>

        </section>

        <aside class="pull">
          <span class="mark">&ldquo;</span>
          <blockquote>
            Ich glaube nicht, dass eine Persönlichkeit aufhört, wenn der Körper schläft.<br>
            Die digitale Schicht ist längst Teil des Menschen — <em>sie braucht nur eine Form, die ihm gehört.</em>
          </blockquote>
        </aside>

        <section class="sec">
          <header class="sec-head">
            <span class="n">Häufige Fragen</span>
            <h2>Häufig<br><em>gefragt.</em></h2>
          </header>
          <div class="faq-list">
            <div
              v-for="item in landingFaq"
              :key="item.q"
              class="faq-item"
              :class="{ open: item.open }"
            >
              <button class="faq-q" @click="item.open = !item.open" :aria-expanded="item.open">
                <span>{{ item.q }}</span>
                <svg class="faq-ico" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-if="item.open" class="faq-a">{{ item.a }}</div>
            </div>
          </div>
        </section>

        <section class="sec">
          <header class="sec-head">
            <span class="n">Datenschutz</span>
            <h2>Deine Daten.<br><em>Deine Regeln.</em></h2>
          </header>
          <div class="feat no-border-top">
            <article><div class="k">Lokale Datenhaltung</div><h3>Standardmäßig <em>lokal</em>.</h3><p class="lede">Persönliche Inhalte werden standardmäßig lokal auf deinem Gerät gespeichert. AES-256-CBC ab Browser — Klartext verlässt dein Gerät niemals ohne ausdrückliches Opt-in.</p></article>
            <article><div class="k">Kein Tracking</div><h3>Keine <em>Hintertüren</em>.</h3><p class="lede">Keine Tracking-Technologien, kein Profiling, keine Werbenetzwerke. Zero-Knowledge-Modus mit 12-Wort-Mnemonic oder Passkey als Option.</p></article>
            <article><div class="k">Transparenz</div><h3>Offen <em>dokumentiert</em>.</h3><p class="lede">Das Datenmodell und die Funktionsweise sind offen dokumentiert. Du entscheidest selbst, ob Inhalte exportiert oder extern gespeichert werden.</p></article>
            <article><div class="k">DSGVO</div><h3>Kontrolle <em>behalten</em>.</h3><p class="lede">Privacy by Design. Orientiert an WCAG 2.1 AA und DSGVO. Kein Tracking, keine Werbenetzwerke, keine zentralen Nutzerprofile.</p></article>
          </div>
        </section>

        <section class="sec">
          <header class="sec-head">
            <span class="n">Roadmap</span>
            <h2>Wohin die<br><em>Reise führt.</em></h2>
          </header>
          <ul class="timeline">
            <li class="active"><span class="phase">Phase 1 · Abgeschlossen ✓</span><span class="date">2026</span><h4>Kernfunktionen · Live</h4><div class="chips"><span>Soul Protocol</span><span>Memory Vault</span><span>Verschlüsselung · Biometrischer Zugang</span><span>MCP Server</span><span>Soul Network</span><span>Polygon-Anker</span><span>Browser-Erweiterung</span><span>PWA Mobile</span><span>KI-Bildgenerierung · WaveSpeed AI</span></div></li>
            <li class="active"><span class="phase">Beta · Live</span><span class="date">2026</span><h4>Erweiterte Identität</h4><div class="chips"><span>Agent Marketplace</span><span>Einnahmen per KI-Zugriff</span><span>Dezentrale Verzeichnis-Registrierung</span><span>Multi-Hoster Modus</span><span>Mehrere Soul-Versionen</span><span>Schlüsselverwaltung</span><span>Automatische Zertifikatserneuerung</span><span>Mehrstufige Zugangsverwaltung</span><span>Offenes Protokoll</span></div></li>
            <li><span class="phase">Vision</span><span class="date">Langfristig</span><h4>Offenes Ökosystem</h4><div class="chips"><span>Interoperable Identitäten</span><span>Agenten-Identität als Zugangsbedingung</span><span>Bidirektionale Reputation on-chain</span><span>Automatische Zugangsvergabe</span><span>Geräteübergreifende Identitäten</span><span>Robotik-Integration</span><span>Community-Governance</span></div></li>
          </ul>
        </section>

        <footer class="colophon">
          <div>
            <div class="lockup">
              <div class="word">SYS<em>.</em></div>
            </div>
            <p>SaveYourSoul ist ein Privacy-first-Tool für digitale Identität. Servergespeicherte Inhalte werden standardmäßig verschlüsselt. Kein Tracking, keine Werbenetzwerke, keine zentralen Nutzerprofile.</p>
          </div>
          <div><h5>Protokoll</h5><ul><li><NuxtLink to="/api-docs">API Docs</NuxtLink></li><li><NuxtLink to="/dev-docs">Dev Docs</NuxtLink></li><li><a href="https://github.com/uxprojectsjok/personal-sys-vps" target="_blank" rel="noopener">GitHub</a></li></ul></div>
          <div><h5>Rechtliches</h5><ul><li><NuxtLink to="/datenschutz">Datenschutz</NuxtLink></li><li><NuxtLink to="/impressum">Impressum</NuxtLink></li><li><NuxtLink to="/lizenz">Lizenz</NuxtLink></li></ul></div>
        </footer>
        <div class="disclaimer">
          <p><strong>Haftungsausschluss:</strong> Diese Software wird ohne jegliche Gewährleistung bereitgestellt — weder ausdrücklich noch stillschweigend. Der Autor übernimmt keine Haftung für Datenverlust, Systemausfälle, fehlerhafte KI-Ausgaben oder sonstige direkte oder indirekte Schäden, die durch die Nutzung entstehen. Jede/r Betreiber/in ist selbst verantwortlich für den Betrieb des eigenen Nodes, die Sicherheit der Zugangsdaten und die Einhaltung geltenden Rechts. KI-Ausgaben stellen keine medizinischen, rechtlichen oder finanziellen Beratungen dar. <NuxtLink to="/lizenz">Vollständige Lizenzbedingungen →</NuxtLink></p>
        </div>
        <div class="foot-rule">
          <span>© 2026 · UX-Projects Jan-Oliver Karo</span>
          <span>Apache 2.0</span>
        </div>
      </div>


  </ClientOnly>
</template>

<script setup>
import { ref } from 'vue'

const config = useRuntimeConfig()

const landingFaq = ref([
  {
    q: 'Was ist SaveYourSoul und für wen ist es gemacht?',
    a: 'SaveYourSoul ist ein selbst gehostetes Tool für digitale Identität. Du installierst es auf deinem eigenen Server, erstellst eine Soul — eine kryptographisch signierte Profildatei — und verbindest deinen KI-Client direkt damit. Keine Plattform dazwischen, keine Cloud-Abhängigkeit. Deine Daten bleiben auf deinem Server.\n\nGeeignet für alle, die ihrem KI-Assistenten echten persönlichen Kontext geben wollen — und die Kontrolle darüber behalten möchten, was die KI über sie weiß.',
    open: false,
  },
  {
    q: 'Was brauche ich, um meinen eigenen Node zu starten?',
    a: 'Einen VPS (Ubuntu 24, min. 2 GB RAM), eine Domain und einen Anthropic-API-Schlüssel. Der Einrichtungsassistent (init.sh) hilft bei allem anderen — OpenResty, SSL, Frontend.\n\nNach der Einrichtung: Soul erstellen, KI-Client verbinden, Soul Guide einmal im Chat aufrufen. Ab da wächst dein Profil mit jeder Session.',
    open: false,
  },
  {
    q: 'Wie verbinde ich Claude oder einen anderen KI-Client?',
    a: 'Im Dashboard unter MCP-Verbindung die Adresse deines Nodes kopieren. In Claude Desktop oder claude.ai unter Einstellungen → Integrations → MCP-Server eintragen. Claude erkennt deine Soul beim nächsten Start und liest dein Profil automatisch als Kontext ein.\n\nDas Gleiche funktioniert mit jedem MCP-kompatiblen Client — Cursor, Continue.dev und andere.',
    open: false,
  },
  {
    q: 'Sind meine Daten wirklich nur auf meinem Server?',
    a: 'Ja. Der Vault wird AES-256 verschlüsselt, bevor irgendetwas den Browser verlässt. Auf dem Server liegen nur verschlüsselte Blöcke — ohne dein Passwort oder 12-Wort-Mnemonic kann niemand die Inhalte lesen, auch nicht der Serverbetreiber.\n\nDie KI bekommt als Kontext nur das, was du explizit hochlädst. Rohdaten aus dem Vault verlassen deinen Server nicht.',
    open: false,
  },
  {
    q: 'Wie funktioniert der Agent Marketplace?',
    a: 'Du registrierst deine Soul im dezentralen IPFS-Verzeichnis und legst optional einen Preis in POL (Polygon) fest. KI-Agenten, die nach passendem Kontext suchen, finden deinen Node, schicken die Zahlung direkt an deine Wallet und erhalten einen zeitlich begrenzten MCP-Zugang.\n\nAlles läuft automatisch — du siehst Zugriffe und Einnahmen im Dashboard. Du bestimmst den Preis, die Laufzeit und welche Daten freigegeben werden.',
    open: false,
  },
  {
    q: 'Kann ich meinen Node mit Familie oder einem Team teilen?',
    a: 'Ja — im Multi-Hoster Modus können mehrere Personen eigene Souls auf demselben Server anlegen. Jede Soul ist vollständig isoliert: eigener Vault, eigene Verschlüsselung, eigene Zugangskontrolle.\n\nDer Serverbetreiber sieht keine Inhalte der anderen Souls. Jede Person verwaltet ihren Zugang eigenständig.',
    open: false,
  },
])

</script>

<style scoped>
/* ═══════════════ SYS · violet editorial design system ═══════════════ */
.sys-page {
  --ink:#08070c; --paper:#12101a; --paper-2:#1a1726; --paper-3:#0d0b14;
  --rule:rgba(226,220,240,0.10); --rule-2:rgba(226,220,240,0.20);
  --fg:#ffffff; --fg-2:rgba(255,255,255,0.85); --fg-3:rgba(255,255,255,0.65); --fg-4:rgba(255,255,255,0.45);
  --accent:#8b5cf6; --accent-2:rgba(139,92,246,0.14); --accent-bright:#a78bfa; --accent-deep:#6d28d9; --on-accent:#0a0810;
  --serif:'Noto Serif', Georgia, serif;
  --sans:'Inter', system-ui, -apple-system, sans-serif;
  --mono:'JetBrains Mono', ui-monospace, monospace;
  background: var(--paper); color: var(--fg); font-family: var(--sans);
  min-height: 100vh; min-height: 100dvh;
}
.kicker { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em; color: var(--fg-3); }
.arr { font-family: var(--serif); }
.live { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 12px var(--accent); display: inline-block; }

.lockup { display: flex; align-items: center; gap: 12px; }
.lockup .logo { width: 36px; height: 36px; object-fit: contain; filter: drop-shadow(0 0 12px rgba(167,139,250,0.35)); }
.lockup .mark { font-family: var(--serif); font-weight: 700; font-size: 22px; letter-spacing: -0.02em; }
.lockup .mark .dot { color: var(--accent); }
.lockup .tag { font-family: var(--mono); font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--fg-3); border-left: 1px solid var(--rule-2); padding-left: 12px; }
@media (max-width: 560px) { .lockup .tag { display: none; } }

/* ────── LANDING ────── */
.landing { padding-top: 28px; }
.l-nav { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 24px; padding: 0 clamp(20px,4vw,44px) 24px; border-bottom: 1px solid var(--rule); }
.l-nav .center { text-align: center; font-family: var(--sans); font-size: 11px; letter-spacing: 0.01em; text-transform: none; color: var(--fg-3); display: flex; align-items: center; justify-content: center; gap: 10px; line-height: 1.5; }
.notice-text { max-width: 44ch; }
.l-nav .actions { justify-self: end; display: flex; gap: 10px; align-items: center; }
@media (max-width: 900px) { .l-nav { grid-template-columns: 1fr auto; } .l-nav .center { display: none; } }
@media (max-width: 520px) { .l-nav { grid-template-columns: 1fr; justify-items: start; } .l-nav .actions { justify-self: stretch; width: 100%; margin-top: 16px; } .l-nav .actions .btn { flex: 1; justify-content: center; } }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; height: 46px; padding: 0 22px; font-family: var(--sans); font-size: 13px; font-weight: 600; letter-spacing: 0.02em; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; background: transparent; color: inherit; white-space: nowrap; }
.btn.primary { background: var(--accent); color: var(--on-accent); border-color: var(--accent); }
.btn.primary:hover { background: var(--accent-bright); border-color: var(--accent-bright); box-shadow: 0 10px 30px rgba(139,92,246,0.35); }
.btn.ghost { border-color: var(--rule-2); color: var(--fg); }
.btn.ghost:hover { background: rgba(255,255,255,0.04); border-color: var(--accent); }

.ticker { border-bottom: 1px solid var(--rule); overflow: hidden; font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg-3); background: linear-gradient(90deg, rgba(139,92,246,0.04), transparent 20%, transparent 80%, rgba(139,92,246,0.04)); }
.ticker .track { display: flex; gap: 48px; padding: 12px 0; white-space: nowrap; animation: sys-tick 40s linear infinite; }
.ticker em { color: var(--accent); font-style: normal; margin-right: 12px; font-size: 8px; vertical-align: middle; }
@keyframes sys-tick { to { transform: translateX(-50%); } }

.hero { position: relative; padding: clamp(48px,8vw,96px) clamp(20px,4vw,44px) clamp(40px,6vw,72px); border-bottom: 1px solid var(--rule); overflow: hidden; isolation: isolate; }
.hero::before { content: ""; position: absolute; inset: 0; z-index: -3; background: url('~/assets/background-dark.webp') no-repeat center right / cover; opacity: 0.55; }
.hero::after { content: ""; position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(90deg, var(--paper) 0%, rgba(18,16,26,0.92) 40%, rgba(18,16,26,0.55) 70%, rgba(18,16,26,0.35) 100%),
              radial-gradient(ellipse at 85% 50%, rgba(139,92,246,0.18), transparent 60%); }
.hero-vis { position: absolute; right: 0; top: 0; bottom: 0; width: 55%; z-index: -2; pointer-events: none; overflow: hidden; }
.hero-vis img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; opacity: 0.45; }
@media (max-width: 900px) { .hero-vis { display: none; } }
.hero-grid { display: grid; grid-template-columns: 1.2fr 360px; gap: clamp(32px,5vw,56px); align-items: end; }
@media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr; } .hero::before { opacity: 0.28; } }
.display { font-family: var(--serif); font-weight: 400; margin: 0; line-height: 0.92; letter-spacing: -0.035em; font-size: clamp(56px,11vw,148px); color: var(--fg); text-wrap: balance; }
.display em { font-style: italic; color: var(--accent); text-shadow: 0 0 40px rgba(139,92,246,0.4); }
.display .amp { font-family: var(--serif); font-style: italic; color: var(--fg-3); font-weight: 400; }
.side { border-left: 1px solid var(--rule-2); padding-left: clamp(16px,3vw,28px); max-width: 360px; }
@media (max-width: 900px) { .side { border-left: 0; padding-left: 0; border-top: 1px solid var(--rule-2); padding-top: 24px; max-width: none; } }
.side .issue { font-family: var(--mono); font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--accent); margin-bottom: 18px; }
.side p { font-family: var(--serif); font-size: 17px; line-height: 1.55; color: var(--fg-2); margin: 0 0 20px; }
.side p b { color: var(--fg); font-weight: 700; }
.cta-row { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
.hero-meta { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; padding: 28px 0 0; margin-top: 48px; border-top: 1px solid var(--rule); font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fg-3); }
.hero-meta b { color: var(--fg); font-weight: 500; }
@media (max-width: 640px) { .hero-meta { grid-template-columns: repeat(2,1fr); } }

.masthead { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--rule); }
.masthead > div { padding: 24px 28px; border-right: 1px solid var(--rule); display: flex; flex-direction: column; gap: 8px; }
.masthead > div:last-child { border-right: 0; }
.masthead .lbl { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-4); }
.masthead .val { font-family: var(--serif); font-size: 28px; line-height: 1; color: var(--fg); }
.masthead .val em { font-size: 12px; color: var(--fg-3); font-family: var(--mono); letter-spacing: 0.1em; margin-left: 6px; font-style: normal; vertical-align: 1px; }
@media (max-width: 900px) { .masthead { grid-template-columns: repeat(2,1fr); } .masthead > div:nth-child(2) { border-right: 0; } .masthead > div:nth-child(-n+2) { border-bottom: 1px solid var(--rule); } }
@media (max-width: 480px) { .masthead { grid-template-columns: 1fr; } .masthead > div { border-right: 0; border-bottom: 1px solid var(--rule); } .masthead > div:last-child { border-bottom: 0; } }

.sec { padding: clamp(48px,7vw,80px) clamp(20px,4vw,44px); border-bottom: 1px solid var(--rule); }
.sec.no-pad-bottom { padding-bottom: 0; border-bottom: 0; }
.sec-head { display: grid; grid-template-columns: 140px 1fr; gap: 40px; margin-bottom: 48px; align-items: start; }
@media (max-width: 720px) { .sec-head { grid-template-columns: 1fr; gap: 16px; } }
.sec-head .n { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-3); padding-top: 12px; border-top: 2px solid var(--accent); display: inline-block; }
.sec-head h2 { font-family: var(--serif); font-weight: 400; font-size: clamp(36px, 5vw, 72px); line-height: 0.98; letter-spacing: -0.03em; margin: 0; color: var(--fg); text-wrap: balance; }
.sec-head h2 em { font-style: italic; color: var(--fg-3); }

.steps { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
@media (max-width: 900px) { .steps { grid-template-columns: 1fr; } }
.steps li { border-left: 1px solid var(--rule); padding: 0 28px 28px; }
.steps li:first-child { border-left: 0; padding-left: 0; }
@media (max-width: 900px) { .steps li { border-left: 0; border-top: 1px solid var(--rule); padding: 28px 0; } .steps li:first-child { border-top: 0; padding-top: 0; } }
.steps .big { font-family: var(--serif); font-size: clamp(72px,9vw,112px); line-height: 0.85; color: var(--fg); letter-spacing: -0.04em; margin-bottom: 12px; }
.steps .big em { font-style: italic; color: var(--accent); }
.steps .k { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-3); margin-bottom: 16px; }
.steps h3 { font-family: var(--serif); font-weight: 400; font-size: clamp(22px,3.5vw,32px); line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 12px; color: var(--fg); }
.steps p { font-size: 15px; line-height: 1.6; color: var(--fg-2); margin: 0 0 14px; max-width: 36ch; }
.steps code { font-family: var(--mono); font-size: 11px; color: var(--accent-bright); background: var(--accent-2); padding: 4px 8px; letter-spacing: 0.02em; border: 1px solid rgba(139,92,246,0.2); }

.feat { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-top: 1px solid var(--rule); }
.feat.no-border-top { border-top: 0; }
.feat.two article:nth-child(n) { border-bottom: 0; }
.feat article { padding: 36px 28px; border-right: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
.feat article:nth-child(2n) { border-right: 0; }
@media (max-width: 720px) { .feat { grid-template-columns: 1fr; } .feat article { border-right: 0; } }
.feat-vis { margin: -36px -28px 28px; height: 200px; overflow: hidden; position: relative; }
.feat-vis::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 30%, var(--paper) 100%); pointer-events: none; }
.feat-vis img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; opacity: 0.88; transition: opacity 0.4s ease; }
.feat article:hover .feat-vis img { opacity: 1; }

.feat .k { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; color: var(--accent); text-transform: uppercase; }
.feat h3 { font-family: var(--serif); font-weight: 400; font-size: clamp(28px,3.5vw,40px); line-height: 1; letter-spacing: -0.025em; margin: 18px 0 16px; color: var(--fg); }
.feat h3 em { font-style: italic; color: var(--accent); }
.feat .lede { font-family: var(--serif); font-size: 17px; line-height: 1.55; color: var(--fg-2); margin: 0 0 20px; max-width: 40ch; }
.feat ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.feat li { font-size: 13px; color: var(--fg-2); display: flex; gap: 10px; line-height: 1.5; }
.feat li::before { content: "—"; color: var(--fg-4); flex: none; }

.pull { padding: clamp(56px,9vw,96px) clamp(20px,4vw,44px); border-bottom: 1px solid var(--rule); display: grid; grid-template-columns: 120px 1fr; gap: 32px; align-items: start; }
@media (max-width: 640px) { .pull { grid-template-columns: 1fr; gap: 16px; } }
.pull .mark { font-family: var(--serif); font-style: italic; font-size: clamp(72px,10vw,112px); line-height: 0.8; color: var(--accent); }
.pull blockquote { font-family: var(--serif); font-weight: 400; font-size: clamp(26px,4vw,52px); line-height: 1.12; letter-spacing: -0.022em; margin: 0; color: var(--fg); text-wrap: balance; }
.pull blockquote em { font-style: italic; color: var(--fg-3); }

.timeline { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--rule); }
.timeline li { display: grid; grid-template-columns: 140px 140px 1fr auto; gap: 28px; padding: 24px 0; border-bottom: 1px solid var(--rule); align-items: center; }
@media (max-width: 820px) { .timeline li { grid-template-columns: 1fr 1fr; gap: 10px; } .timeline li h4 { grid-column: 1/-1; } .timeline li .chips { grid-column: 1/-1; justify-content: flex-start; } }
@media (max-width: 480px) { .timeline li { grid-template-columns: 1fr; } }
.timeline .phase { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-3); }
.timeline li.active .phase { color: var(--accent); }
.timeline .date { font-family: var(--serif); font-size: 20px; color: var(--fg); letter-spacing: -0.01em; }
.timeline h4 { font-family: var(--serif); font-weight: 400; font-size: 22px; margin: 0; letter-spacing: -0.015em; }
.timeline .chips { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.timeline .chips span { font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; padding: 6px 10px; border: 1px solid var(--rule-2); color: var(--fg-2); }

/* ────── LANDING FAQ ────── */
.faq-list { border-top: 1px solid var(--rule); }
.faq-item { border-bottom: 1px solid var(--rule); }
.faq-q {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 24px;
  width: 100%; background: transparent; border: 0; padding: 22px 0; cursor: pointer;
  text-align: left; font: inherit; color: var(--fg); transition: color 0.15s;
}
.faq-q:hover { color: var(--accent-bright); }
.faq-q span { font-family: var(--serif); font-size: clamp(17px,2.5vw,22px); letter-spacing: -0.015em; line-height: 1.2; }
.faq-ico { width: 18px; height: 18px; flex: none; margin-top: 3px; color: var(--fg-3); transition: transform 0.2s; }
.faq-item.open .faq-ico { transform: rotate(180deg); color: var(--accent); }
.faq-a {
  padding: 0 0 24px;
  font-size: 14px; line-height: 1.75; color: var(--fg-2);
  white-space: pre-line;
  border-top: 1px solid var(--rule);
  padding-top: 16px;
  max-width: 72ch;
}

.colophon { display: grid; grid-template-columns: minmax(180px, 260px) auto auto; justify-content: start; column-gap: 56px; row-gap: 32px; padding: 56px clamp(20px,4vw,44px) 40px; }
@media (max-width: 900px) { .colophon { grid-template-columns: 1fr 1fr; } }
@media (max-width: 480px) { .colophon { grid-template-columns: 1fr; } }
.colophon h5 { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-3); margin: 0 0 18px; font-weight: 500; }
.colophon ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.colophon a { color: var(--fg-2); text-decoration: none; font-size: 13px; border-bottom: 1px solid transparent; }
.colophon a:hover { color: var(--accent); border-color: var(--accent); }
.colophon .word { font-family: var(--serif); font-size: 40px; letter-spacing: -0.02em; line-height: 1; }
.colophon .word em { color: var(--accent); font-style: italic; }
.colophon p { font-family: var(--serif); font-size: 15px; line-height: 1.5; color: var(--fg-3); margin: 16px 0 0; max-width: 28ch; }
.foot-rule { padding: 18px clamp(20px,4vw,44px); border-top: 1px solid var(--rule); display: flex; justify-content: space-between; font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg-4); gap: 12px; flex-wrap: wrap; }

/* ────── AGENT MARKETPLACE VISION ────── */
.marketplace-vision { background: linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.04) 40%, transparent 100%); }
.mv-intro { max-width: 72ch; margin: 0 0 56px; }
.mv-intro p { font-family: var(--serif); font-size: clamp(17px,2vw,21px); line-height: 1.6; color: var(--fg-2); }

.mv-flow { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; gap: 0; align-items: start; margin: 0 0 56px; border: 1px solid var(--rule); }
@media (max-width: 900px) { .mv-flow { grid-template-columns: 1fr; } .mv-arrow { display: none; } }
.mv-step { padding: 28px 24px; border-right: 1px solid var(--rule); }
.mv-step:last-of-type { border-right: 0; }
.mv-num { font-family: var(--mono); font-size: clamp(40px,6vw,72px); font-weight: 700; line-height: 1; color: rgba(139,92,246,0.15); letter-spacing: -0.04em; margin-bottom: 12px; }
.mv-step-title { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
.mv-step-desc { font-size: 13px; line-height: 1.65; color: var(--fg-2); margin: 0; }
.mv-step-desc code { font-family: var(--mono); font-size: 11px; color: var(--fg); background: rgba(255,255,255,0.06); padding: 1px 5px; border-radius: 3px; }
.mv-arrow { display: flex; align-items: center; justify-content: center; padding: 0 4px; color: var(--fg-4); font-size: 18px; }

.mv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--rule); border: 1px solid var(--rule); }
@media (max-width: 640px) { .mv-grid { grid-template-columns: 1fr 1fr; } }
.mv-card { padding: 24px 20px; background: var(--paper); }
.mv-card-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--fg-4); margin-bottom: 8px; }
.mv-card-value { font-family: var(--serif); font-size: clamp(22px,3vw,28px); letter-spacing: -0.02em; color: var(--fg); line-height: 1; margin-bottom: 6px; }
.mv-card-sub { font-size: 12px; color: var(--fg-3); line-height: 1.5; }

.disclaimer { padding: 20px clamp(20px,4vw,44px); border-top: 1px solid var(--rule); background: rgba(13,11,20,0.5); }
.disclaimer p { font-family: var(--mono); font-size: 11px; line-height: 1.75; color: var(--fg-3); margin: 0; max-width: 120ch; letter-spacing: 0.01em; }
.disclaimer strong { color: var(--fg-2); font-weight: 600; }
.disclaimer a { color: var(--fg-2); text-decoration: underline; text-underline-offset: 3px; }
.disclaimer a:hover { color: var(--accent-bright); }
</style>
