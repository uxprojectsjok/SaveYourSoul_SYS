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
          <LangToggle />
          <button v-if="config.public.allowCreateSoul" class="btn ghost" @click="createSoulOpen = true">Create Soul</button>
          <button v-if="config.public.allowLogin" class="btn primary" @click="loginOpen = true">Login <span class="arr">→</span></button>
        </div>
      </nav>

      <div class="ticker" aria-hidden="true">
        <div class="track">
          <span v-for="i in 2" :key="i">
            <template v-for="tick in t.ticker" :key="tick">
              <em>◆</em> {{ tick }}
            </template>
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
            <div class="issue">{{ t.heroIssue }}</div>
            <p v-html="t.heroP1"></p>
            <p>{{ t.heroP2 }}</p>
            <div class="cta-row">
              <button v-if="config.public.allowCreateSoul" class="btn primary" @click="createSoulOpen = true">Create Soul <span class="arr">→</span></button>
              <button v-if="config.public.allowLogin" class="btn ghost" @click="loginOpen = true">Login with Soul</button>
            </div>
          </aside>
        </div>
        <div class="hero-meta">
          <span><b>01</b> {{ t.meta1 }}</span>
          <span><b>02</b> {{ t.meta2 }}</span>
          <span><b>03</b> {{ t.meta3 }}</span>
          <span><b>04</b> MCP · Polygon · IPFS</span>
        </div>
      </section>

      <div class="masthead">
        <div><span class="lbl">sys.md Format</span><span class="val">Markdown<em>+YAML</em></span></div>
        <div><span class="lbl">{{ t.mastEnc }}</span><span class="val">AES-256<em>CBC · GCM</em></span></div>
        <div><span class="lbl">{{ t.mastAnchor }}</span><span class="val">Polygon<em>Mainnet</em></span></div>
        <div><span class="lbl">{{ t.mastProtocol }}</span><span class="val">MCP<em>open</em></span></div>
      </div>

      <!-- Quickstart -->
      <section class="sec">
        <header class="sec-head">
          <span class="n">{{ t.quickN }}</span>
          <h2 v-html="t.quickH2"></h2>
        </header>
        <ol class="steps">
          <li v-for="step in t.quickSteps" :key="step.k">
            <div class="big"><em>{{ step.num }}</em></div>
            <div class="k">{{ step.k }}</div>
            <h3>{{ step.h3 }}</h3>
            <p>{{ step.p }}</p>
          </li>
        </ol>
      </section>

      <!-- Five pillars -->
      <section class="sec no-pad-bottom">
        <header class="sec-head">
          <span class="n">{{ t.pillarsN }}</span>
          <h2 v-html="t.pillarsH2"></h2>
        </header>
        <div class="feat">
          <article v-for="pillar in t.pillars" :key="pillar.k">
            <div class="feat-vis" aria-hidden="true"><img :src="pillar.img" alt="" /></div>
            <div class="k">{{ pillar.k }}</div>
            <h3 v-html="pillar.h3"></h3>
            <p class="lede">{{ pillar.lede }}</p>
            <ul><li v-for="li in pillar.li" :key="li" v-html="li"></li></ul>
          </article>
        </div>
      </section>

      <!-- Agent Marketplace Vision -->
      <section class="sec marketplace-vision">
        <header class="sec-head">
          <span class="n">Agent Marketplace</span>
          <h2 v-html="t.mvH2"></h2>
        </header>
        <div class="mv-intro"><p>{{ t.mvIntro }}</p></div>
        <ol class="steps">
          <li v-for="step in t.mvSteps" :key="step.k">
            <div class="big"><em>{{ step.num }}</em></div>
            <div class="k">{{ step.k }}</div>
            <h3>{{ step.h3 }}</h3>
            <p>{{ step.p }}</p>
          </li>
        </ol>
      </section>

      <!-- Pull quote -->
      <aside class="pull">
        <span class="mark">&ldquo;</span>
        <blockquote v-html="t.quote"></blockquote>
      </aside>

      <!-- FAQ -->
      <section class="sec">
        <header class="sec-head">
          <span class="n">{{ t.faqN }}</span>
          <h2 v-html="t.faqH2"></h2>
        </header>
        <div class="faq-list">
          <div
            v-for="(item, i) in t.faq"
            :key="i"
            class="faq-item"
            :class="{ open: faqOpen[i] }"
          >
            <button class="faq-q" @click="faqOpen[i] = !faqOpen[i]" :aria-expanded="faqOpen[i]">
              <span>{{ item.q }}</span>
              <svg class="faq-ico" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="faqOpen[i]" class="faq-a">{{ item.a }}</div>
          </div>
        </div>
      </section>

      <!-- Privacy -->
      <section class="sec">
        <header class="sec-head">
          <span class="n">{{ t.privN }}</span>
          <h2 v-html="t.privH2"></h2>
        </header>
        <div class="feat no-border-top">
          <article v-for="card in t.privCards" :key="card.k">
            <div class="k">{{ card.k }}</div>
            <h3 v-html="card.h3"></h3>
            <p class="lede">{{ card.lede }}</p>
          </article>
        </div>
      </section>

      <!-- Roadmap -->
      <section class="sec">
        <header class="sec-head">
          <span class="n">Roadmap</span>
          <h2 v-html="t.roadmapH2"></h2>
        </header>
        <ul class="timeline">
          <li v-for="item in t.roadmap" :key="item.h4" :class="{ active: item.active }">
            <span class="phase">{{ item.phase }}</span>
            <span class="date">{{ item.date }}</span>
            <h4>{{ item.h4 }}</h4>
            <div class="chips"><span v-for="chip in item.chips" :key="chip">{{ chip }}</span></div>
          </li>
        </ul>
      </section>

      <footer class="colophon">
        <div>
          <div class="lockup">
            <div class="word">SYS<em>.</em></div>
          </div>
          <p>{{ t.footerDesc }}</p>
        </div>
        <div>
          <h5>{{ t.footerProtocol }}</h5>
          <ul>
            <li><NuxtLink to="/api-docs">API Docs</NuxtLink></li>
            <li><NuxtLink to="/dev-docs">Dev Docs</NuxtLink></li>
            <li><a href="https://github.com/uxprojectsjok/personal-sys-vps" target="_blank" rel="noopener">GitHub</a></li>
          </ul>
        </div>
        <div>
          <h5>{{ t.footerLegal }}</h5>
          <ul>
            <li><NuxtLink to="/datenschutz">{{ t.linkPrivacy }}</NuxtLink></li>
            <li><NuxtLink to="/impressum">{{ t.linkImprint }}</NuxtLink></li>
            <li><NuxtLink to="/lizenz">{{ t.linkLicense }}</NuxtLink></li>
          </ul>
        </div>
      </footer>

      <div class="disclaimer">
        <p><strong>{{ t.disclaimerLabel }}</strong> {{ t.disclaimerText }} <NuxtLink to="/lizenz">{{ t.disclaimerLink }}</NuxtLink></p>
      </div>

      <div class="foot-rule">
        <span>© 2026 · UX-Projects Jan-Oliver Karo</span>
        <span>Apache 2.0</span>
      </div>

    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, computed } from 'vue'

const config = useRuntimeConfig()
const { lang } = useLang()

const faqOpen = ref(Array(6).fill(false))

const i18n = {
  de: {
    ticker: [
      'Deine KI-Identität, komplett unter deiner Kontrolle',
      'Lokal gespeichert · AES-256 verschlüsselt',
      'KI-Agenten verbinden sich direkt per MCP',
      'Peer-to-Peer · Nodes vernetzen sich untereinander',
      'Blockchain-verankert · on-chain verifiziert',
      'sys.md — deine Datei, deine Regeln',
    ],
    heroIssue: 'Dein Node · dein Server · deine Daten',
    heroP1: 'Deine KI kennt dich. <b>Andere Nodes finden dich — Agenten zahlen für Zugang.</b> Kryptographisch signiert, lokal gespeichert, dezentral vernetzt.',
    heroP2: 'Kein Account. Kein Plattformzwang. Deine Soul gehört dir — und arbeitet für dich.',
    meta1: 'Portable Identitätsdatei',
    meta2: 'Peer-to-Peer vernetzt',
    meta3: 'Lokal · verschlüsselt · on-chain',
    mastEnc: 'Verschlüsselung',
    mastAnchor: 'Anker',
    mastProtocol: 'Protokoll',
    quickN: 'Schnellstart',
    quickH2: 'In drei Schritten<br><em>zur lebendigen Soul.</em>',
    quickSteps: [
      { num: '01', k: 'Schritt 01 · Einrichtung', h3: 'Eigenen Node starten', p: 'SaveYourSoul mit dem geführten Einrichtungsassistenten auf eigenem Server in Betrieb nehmen.' },
      { num: '02', k: 'Schritt 02 · MCP', h3: 'KI-Client verbinden', p: 'Verbindungsadresse in deinem KI-Client eintragen — die Anmeldung erscheint automatisch.' },
      { num: '03', k: 'Schritt 03 · Guide', h3: 'Soul Guide starten', p: 'Einmal im KI-Chat aufrufen — deine KI liest die Soul und schreibt nach bedeutsamen Gesprächen Einträge.' },
    ],
    pillarsN: 'Fünf Bausteine',
    pillarsH2: 'Identität. Vault.<br><em>KI. Netzwerk. Markt.</em>',
    pillars: [
      { img: '/ecosystem/phase1-soul.webp', k: 'I · Soul Protocol', h3: 'Identität<em>,</em> als Datei.', lede: 'Eine kryptographisch signierte Identitätsdatei, die deine Persönlichkeit strukturiert erfasst und durch jede Session weiterentwickelt wird.', li: ['Kryptographische Signatur', 'Offenes sys.md-Format', 'Soul-Kalender · Vault-Sync', 'Wächst mit jeder Session', 'Blockchain-Anker (optional)'] },
      { img: '/ecosystem/Vault.webp', k: 'II · Memory Vault', h3: 'Vault<em>,</em> als Tresor.', lede: 'Dein lokaler, verschlüsselter Ordner für alles, was dich ausmacht — Stimme, Gesicht, Bewegung, Bilder, Texte. Lokal auf deinem Gerät.', li: ['Stimme, Gesicht &amp; Bewegung', 'AES-256 Verschlüsselung', '12-Wort-Wiederherstellungsschlüssel', 'Datei-Verwaltung', 'Geräteübergreifender Import'] },
      { img: '/ecosystem/phase4-robot.webp', k: 'III · AI Interface', h3: 'KI<em>,</em> die dich kennt.', lede: 'Sprich mit einer KI, die deine Soul kennt. Die Soul wird automatisch angereichert — dein Profil wächst mit.', li: ['Soul als Kontext für KI', 'Echtzeit-Streaming-Antworten', 'Automatische Soul-Anreicherung', 'Kamera-Analyse · Bild &amp; Video'] },
      { img: '/ecosystem/phase3-api.webp', k: 'IV · Soul Network', h3: 'Netzwerk<em>,</em> für Nodes.', lede: 'Verbinde deinen Node mit anderen. Peers teilen Kontext, Kalender und Vault-Inhalte — direkt, kryptographisch gesichert, ohne Zwischendienst.', li: ['Peer-to-Peer Verbindungen', 'Kontext &amp; Vault zwischen Nodes', 'Kalender-Sync zwischen Peers', 'Mehrstufige Zugangskontrolle', 'Browser-Erweiterung für Chrome'] },
      { img: '/ecosystem/agent_marketplace.webp', k: 'V · Agent Marketplace', h3: 'KI-Agenten<em>,</em> finden dich.', lede: 'Registriere deine Soul im dezentralen IPFS-Verzeichnis. Externe KI-Agenten entdecken dich, zahlen in POL und erhalten kontrollierten MCP-Zugang.', li: ['Dezentrale Verzeichnis-Registrierung', 'Einnahmen pro KI-Zugriff', 'Blockchain-verifizierte Identität', 'On-chain Zahlungsvalidierung', 'Einnahmen-Übersicht'] },
    ],
    mvH2: 'Deine Identität.<br><em>Dein Markt.</em>',
    mvIntro: 'KI-Agenten brauchen menschlichen Kontext — und zahlen dafür. SaveYourSoul macht deinen Node zum wirtschaftlichen Teilnehmer im KI-Ökosystem: dezentral registriert, kryptographisch gesichert, ökonomisch selbsttragend. Du bestimmst den Preis, die Laufzeit und was sichtbar ist — jeder Zugriff wird on-chain abgerechnet.',
    mvSteps: [
      { num: '01', k: 'Schritt 01 · Entdecken', h3: 'Entdecken', p: 'KI-Agenten finden deinen Node über das dezentrale IPFS-Verzeichnis — Name, Adresse und Zugangsmodus sind öffentlich sichtbar.' },
      { num: '02', k: 'Schritt 02 · Prüfen', h3: 'Prüfen', p: 'Der Agent ruft das öffentliche Profil ab: freigegebene Inhalte, Zugangsmodus und Preis — bevor eine Verbindung entsteht.' },
      { num: '03', k: 'Schritt 03 · Zahlung', h3: 'Zahlung', p: 'POL-Zahlung direkt an deine Wallet auf Polygon. Der Node verifiziert die Transaktion on-chain, bevor Zugang gewährt wird.' },
      { num: '04', k: 'Schritt 04 · Zugang', h3: 'Zugang', p: 'Der Agent erhält zeitlich begrenzten Zugang zu den von dir freigegebenen Inhalten. Laufzeit und Umfang bestimmst du.' },
    ],
    quote: 'Ich glaube nicht, dass eine Persönlichkeit aufhört, wenn der Körper schläft.<br>Die digitale Schicht ist längst Teil des Menschen — <em>sie braucht nur eine Form, die ihm gehört.</em>',
    faqN: 'Häufige Fragen',
    faqH2: 'Häufig<br><em>gefragt.</em>',
    faq: [
      { q: 'Was ist SaveYourSoul und für wen ist es gemacht?', a: 'SaveYourSoul ist ein selbst gehostetes Tool für digitale Identität. Du installierst es auf deinem eigenen Server, erstellst eine Soul — eine kryptographisch signierte Profildatei — und verbindest deinen KI-Client direkt damit. Keine Plattform dazwischen, keine Cloud-Abhängigkeit. Deine Daten bleiben auf deinem Server.\n\nGeeignet für alle, die ihrem KI-Assistenten echten persönlichen Kontext geben wollen — und die Kontrolle darüber behalten möchten, was die KI über sie weiß.' },
      { q: 'Was brauche ich, um meinen eigenen Node zu starten?', a: 'Einen VPS (Ubuntu 24, min. 2 GB RAM), eine Domain und einen Anthropic-API-Schlüssel. Der Einrichtungsassistent (init.sh) hilft bei allem anderen — OpenResty, SSL, Frontend.\n\nNach der Einrichtung: Soul erstellen, KI-Client verbinden, Soul Guide einmal im Chat aufrufen. Ab da wächst dein Profil mit jeder Session.' },
      { q: 'Wie verbinde ich Claude oder einen anderen KI-Client?', a: 'Im Dashboard unter MCP-Verbindung die Adresse deines Nodes kopieren. In Claude Desktop oder claude.ai unter Einstellungen → Integrations → MCP-Server eintragen. Claude erkennt deine Soul beim nächsten Start und liest dein Profil automatisch als Kontext ein.\n\nDas Gleiche funktioniert mit jedem MCP-kompatiblen Client — Cursor, Continue.dev und andere.' },
      { q: 'Sind meine Daten wirklich nur auf meinem Server?', a: 'Ja. Der Vault wird AES-256 verschlüsselt, bevor irgendetwas den Browser verlässt. Auf dem Server liegen nur verschlüsselte Blöcke — ohne dein Passwort oder 12-Wort-Mnemonic kann niemand die Inhalte lesen, auch nicht der Serverbetreiber.\n\nDie KI bekommt als Kontext nur das, was du explizit hochlädst. Rohdaten aus dem Vault verlassen deinen Server nicht.' },
      { q: 'Wie funktioniert der Agent Marketplace?', a: 'Du registrierst deine Soul im dezentralen IPFS-Verzeichnis und legst optional einen Preis in POL (Polygon) fest. KI-Agenten, die nach passendem Kontext suchen, finden deinen Node, schicken die Zahlung direkt an deine Wallet und erhalten einen zeitlich begrenzten MCP-Zugang.\n\nAlles läuft automatisch — du siehst Zugriffe und Einnahmen im Dashboard. Du bestimmst den Preis, die Laufzeit und welche Daten freigegeben werden.' },
      { q: 'Kann ich meinen Node mit Familie oder einem Team teilen?', a: 'Ja — im Multi-Hoster Modus können mehrere Personen eigene Souls auf demselben Server anlegen. Jede Soul ist vollständig isoliert: eigener Vault, eigene Verschlüsselung, eigene Zugangskontrolle.\n\nDer Serverbetreiber sieht keine Inhalte der anderen Souls. Jede Person verwaltet ihren Zugang eigenständig.' },
    ],
    privN: 'Datenschutz',
    privH2: 'Deine Daten.<br><em>Deine Regeln.</em>',
    privCards: [
      { k: 'Lokale Datenhaltung', h3: 'Standardmäßig <em>lokal</em>.', lede: 'Persönliche Inhalte werden standardmäßig lokal auf deinem Gerät gespeichert. AES-256-CBC ab Browser — Klartext verlässt dein Gerät niemals ohne ausdrückliches Opt-in.' },
      { k: 'Kein Tracking', h3: 'Keine <em>Hintertüren</em>.', lede: 'Keine Tracking-Technologien, kein Profiling, keine Werbenetzwerke. Zero-Knowledge-Modus mit 12-Wort-Mnemonic oder Passkey als Option.' },
      { k: 'Transparenz', h3: 'Offen <em>dokumentiert</em>.', lede: 'Das Datenmodell und die Funktionsweise sind offen dokumentiert. Du entscheidest selbst, ob Inhalte exportiert oder extern gespeichert werden.' },
      { k: 'DSGVO', h3: 'Kontrolle <em>behalten</em>.', lede: 'Privacy by Design. Orientiert an WCAG 2.1 AA und DSGVO. Kein Tracking, keine Werbenetzwerke, keine zentralen Nutzerprofile.' },
    ],
    roadmapH2: 'Wohin die<br><em>Reise führt.</em>',
    roadmap: [
      { active: true, phase: 'Phase 1 · Abgeschlossen ✓', date: '2026', h4: 'Kernfunktionen · Live', chips: ['Soul Protocol', 'Memory Vault', 'Verschlüsselung · Biometrischer Zugang', 'MCP Server', 'Soul Network', 'Polygon-Anker', 'Browser-Erweiterung', 'PWA Mobile', 'KI-Bildgenerierung · WaveSpeed AI'] },
      { active: true, phase: 'Beta · Live', date: '2026', h4: 'Erweiterte Identität', chips: ['Agent Marketplace', 'Einnahmen per KI-Zugriff', 'Dezentrale Verzeichnis-Registrierung', 'Multi-Hoster Modus', 'Mehrere Soul-Versionen', 'Schlüsselverwaltung', 'Automatische Zertifikatserneuerung', 'Mehrstufige Zugangsverwaltung', 'Offenes Protokoll'] },
      { active: false, phase: 'Vision', date: 'Langfristig', h4: 'Offenes Ökosystem', chips: ['Interoperable Identitäten', 'Agenten-Identität als Zugangsbedingung', 'Bidirektionale Reputation on-chain', 'Automatische Zugangsvergabe', 'Geräteübergreifende Identitäten', 'Robotik-Integration', 'Community-Governance'] },
    ],
    footerDesc: 'SaveYourSoul ist ein Privacy-first-Tool für digitale Identität. Servergespeicherte Inhalte werden standardmäßig verschlüsselt. Kein Tracking, keine Werbenetzwerke, keine zentralen Nutzerprofile.',
    footerProtocol: 'Protokoll',
    footerLegal: 'Rechtliches',
    linkPrivacy: 'Datenschutz',
    linkImprint: 'Impressum',
    linkLicense: 'Lizenz',
    disclaimerLabel: 'Haftungsausschluss:',
    disclaimerText: 'Diese Software wird ohne jegliche Gewährleistung bereitgestellt — weder ausdrücklich noch stillschweigend. Der Autor übernimmt keine Haftung für Datenverlust, Systemausfälle, fehlerhafte KI-Ausgaben oder sonstige direkte oder indirekte Schäden, die durch die Nutzung entstehen. Jede/r Betreiber/in ist selbst verantwortlich für den Betrieb des eigenen Nodes, die Sicherheit der Zugangsdaten und die Einhaltung geltenden Rechts. KI-Ausgaben stellen keine medizinischen, rechtlichen oder finanziellen Beratungen dar.',
    disclaimerLink: 'Vollständige Lizenzbedingungen →',
  },
  en: {
    ticker: [
      'Your AI identity, completely under your control',
      'Stored locally · AES-256 encrypted',
      'AI agents connect directly via MCP',
      'Peer-to-peer · nodes connect with each other',
      'Blockchain-anchored · verified on-chain',
      'sys.md — your file, your rules',
    ],
    heroIssue: 'Your node · your server · your data',
    heroP1: 'Your AI knows you. <b>Other nodes find you — agents pay for access.</b> Cryptographically signed, stored locally, distributed network.',
    heroP2: 'No account. No platform lock-in. Your soul belongs to you — and works for you.',
    meta1: 'Portable identity file',
    meta2: 'Peer-to-peer network',
    meta3: 'Local · encrypted · on-chain',
    mastEnc: 'Encryption',
    mastAnchor: 'Anchor',
    mastProtocol: 'Protocol',
    quickN: 'Quick Start',
    quickH2: 'Three steps<br><em>to a living soul.</em>',
    quickSteps: [
      { num: '01', k: 'Step 01 · Setup', h3: 'Start your own node', p: 'Deploy SaveYourSoul on your own server using the guided setup wizard.' },
      { num: '02', k: 'Step 02 · MCP', h3: 'Connect an AI client', p: 'Enter your node\'s address in your AI client — the login appears automatically.' },
      { num: '03', k: 'Step 03 · Guide', h3: 'Launch Soul Guide', p: 'Run it once in AI chat — your AI reads the soul and writes entries after meaningful conversations.' },
    ],
    pillarsN: 'Five pillars',
    pillarsH2: 'Identity. Vault.<br><em>AI. Network. Market.</em>',
    pillars: [
      { img: '/ecosystem/phase1-soul.webp', k: 'I · Soul Protocol', h3: 'Identity<em>,</em> as a file.', lede: 'A cryptographically signed identity file that captures your personality in a structured way and evolves through every session.', li: ['Cryptographic signature', 'Open sys.md format', 'Soul calendar · vault sync', 'Grows with every session', 'Blockchain anchor (optional)'] },
      { img: '/ecosystem/Vault.webp', k: 'II · Memory Vault', h3: 'Vault<em>,</em> as a safe.', lede: 'Your local, encrypted folder for everything that defines you — voice, face, motion, images, text. Local on your device.', li: ['Voice, face &amp; motion', 'AES-256 encryption', '12-word recovery key', 'File management', 'Cross-device import'] },
      { img: '/ecosystem/phase4-robot.webp', k: 'III · AI Interface', h3: 'AI<em>,</em> that knows you.', lede: 'Talk to an AI that knows your soul. The soul is automatically enriched — your profile grows with it.', li: ['Soul as AI context', 'Real-time streaming responses', 'Automatic soul enrichment', 'Camera analysis · image &amp; video'] },
      { img: '/ecosystem/phase3-api.webp', k: 'IV · Soul Network', h3: 'Network<em>,</em> for nodes.', lede: 'Connect your node with others. Peers share context, calendar and vault contents — directly, cryptographically secured, without intermediary services.', li: ['Peer-to-peer connections', 'Context &amp; vault across nodes', 'Calendar sync between peers', 'Multi-level access control', 'Chrome browser extension'] },
      { img: '/ecosystem/agent_marketplace.webp', k: 'V · Agent Marketplace', h3: 'AI agents<em>,</em> find you.', lede: 'Register your soul in the decentralised IPFS directory. External AI agents discover you, pay in POL and receive controlled MCP access.', li: ['Decentralised directory registration', 'Revenue per AI access', 'Blockchain-verified identity', 'On-chain payment validation', 'Revenue overview'] },
    ],
    mvH2: 'Your identity.<br><em>Your market.</em>',
    mvIntro: 'AI agents need human context — and pay for it. SaveYourSoul turns your node into an economic participant in the AI ecosystem: decentrally registered, cryptographically secured, economically self-sustaining. You set the price, the duration and what is visible — every access is settled on-chain.',
    mvSteps: [
      { num: '01', k: 'Step 01 · Discover', h3: 'Discover', p: 'AI agents find your node via the decentralised IPFS directory — name, address and access mode are publicly visible.' },
      { num: '02', k: 'Step 02 · Inspect', h3: 'Inspect', p: 'The agent fetches the public profile: shared contents, access mode and price — before any connection is made.' },
      { num: '03', k: 'Step 03 · Pay', h3: 'Pay', p: 'POL payment directly to your wallet on Polygon. The node verifies the transaction on-chain before granting access.' },
      { num: '04', k: 'Step 04 · Access', h3: 'Access', p: 'The agent receives time-limited access to the contents you have released. You determine the duration and scope.' },
    ],
    quote: 'I don\'t believe a personality ceases when the body sleeps.<br>The digital layer has long been part of a person — <em>it just needs a form that belongs to them.</em>',
    faqN: 'FAQ',
    faqH2: 'Frequently<br><em>asked.</em>',
    faq: [
      { q: 'What is SaveYourSoul and who is it for?', a: 'SaveYourSoul is a self-hosted tool for digital identity. You install it on your own server, create a soul — a cryptographically signed profile file — and connect your AI client directly to it. No platform in between, no cloud dependency. Your data stays on your server.\n\nIdeal for anyone who wants to give their AI assistant real personal context — and retain control over what the AI knows about them.' },
      { q: 'What do I need to start my own node?', a: 'A VPS (Ubuntu 24, min. 2 GB RAM), a domain and an Anthropic API key. The setup wizard (init.sh) handles everything else — OpenResty, SSL, frontend.\n\nAfter setup: create a soul, connect your AI client, run Soul Guide once in chat. From then on your profile grows with every session.' },
      { q: 'How do I connect Claude or another AI client?', a: 'Copy your node\'s address from the dashboard under MCP connection. In Claude Desktop or claude.ai go to Settings → Integrations → add MCP server. Claude recognises your soul on next start and reads your profile automatically as context.\n\nThe same works with any MCP-compatible client — Cursor, Continue.dev and others.' },
      { q: 'Is my data really only on my server?', a: 'Yes. The vault is AES-256 encrypted before anything leaves the browser. The server only holds encrypted blocks — without your password or 12-word mnemonic, no one can read the contents, not even the server operator.\n\nThe AI only receives as context what you explicitly upload. Raw data from the vault does not leave your server.' },
      { q: 'How does the Agent Marketplace work?', a: 'You register your soul in the decentralised IPFS directory and optionally set a price in POL (Polygon). AI agents searching for suitable context find your node, send payment directly to your wallet and receive time-limited MCP access.\n\nEverything runs automatically — you see accesses and revenue in the dashboard. You set the price, the duration and which data is shared.' },
      { q: 'Can I share my node with family or a team?', a: 'Yes — in multi-hoster mode, multiple people can create their own souls on the same server. Each soul is fully isolated: own vault, own encryption, own access control.\n\nThe server operator cannot see the contents of other souls. Each person manages their own access independently.' },
    ],
    privN: 'Privacy',
    privH2: 'Your data.<br><em>Your rules.</em>',
    privCards: [
      { k: 'Local storage', h3: 'Local <em>by default</em>.', lede: 'Personal content is stored locally on your device by default. AES-256-CBC from the browser — plaintext never leaves your device without explicit opt-in.' },
      { k: 'No tracking', h3: 'No <em>backdoors</em>.', lede: 'No tracking technologies, no profiling, no ad networks. Zero-knowledge mode with 12-word mnemonic or passkey as an option.' },
      { k: 'Transparency', h3: 'Openly <em>documented</em>.', lede: 'The data model and operation are openly documented. You decide whether content is exported or stored externally.' },
      { k: 'GDPR', h3: 'Retain <em>control</em>.', lede: 'Privacy by design. Aligned with WCAG 2.1 AA and GDPR. No tracking, no ad networks, no central user profiles.' },
    ],
    roadmapH2: 'Where the<br><em>journey leads.</em>',
    roadmap: [
      { active: true, phase: 'Phase 1 · Completed ✓', date: '2026', h4: 'Core features · Live', chips: ['Soul Protocol', 'Memory Vault', 'Encryption · Biometric access', 'MCP Server', 'Soul Network', 'Polygon anchor', 'Browser extension', 'PWA Mobile', 'AI image generation · WaveSpeed AI'] },
      { active: true, phase: 'Beta · Live', date: '2026', h4: 'Extended identity', chips: ['Agent Marketplace', 'Revenue per AI access', 'Decentralised directory registration', 'Multi-hoster mode', 'Multiple soul versions', 'Key management', 'Automatic certificate renewal', 'Multi-level access management', 'Open protocol'] },
      { active: false, phase: 'Vision', date: 'Long-term', h4: 'Open ecosystem', chips: ['Interoperable identities', 'Agent identity as access condition', 'Bidirectional reputation on-chain', 'Automatic access granting', 'Cross-device identities', 'Robotics integration', 'Community governance'] },
    ],
    footerDesc: 'SaveYourSoul is a privacy-first tool for digital identity. Server-stored content is encrypted by default. No tracking, no ad networks, no central user profiles.',
    footerProtocol: 'Protocol',
    footerLegal: 'Legal',
    linkPrivacy: 'Privacy Policy',
    linkImprint: 'Legal Notice',
    linkLicense: 'License',
    disclaimerLabel: 'Disclaimer:',
    disclaimerText: 'This software is provided without any warranty — either express or implied. The author accepts no liability for data loss, system failures, incorrect AI outputs or any other direct or indirect damages arising from use. Each operator is solely responsible for the operation of their own node, the security of their credentials and compliance with applicable law. AI outputs do not constitute medical, legal or financial advice.',
    disclaimerLink: 'Full license terms →',
  },
}

const t = computed(() => lang.value === 'de' ? i18n.de : i18n.en)
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
.side p :deep(b) { color: var(--fg); font-weight: 700; }
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
.sec-head h2 :deep(em) { font-style: italic; color: var(--fg-3); }

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

.feat { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-top: 1px solid var(--rule); }
.feat.no-border-top { border-top: 0; }
.feat article { padding: 36px 28px; border-right: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
.feat article:nth-child(2n) { border-right: 0; }
@media (max-width: 720px) { .feat { grid-template-columns: 1fr; } .feat article { border-right: 0; } }
.feat-vis { margin: -36px -28px 28px; height: 200px; overflow: hidden; position: relative; }
.feat-vis::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 30%, var(--paper) 100%); pointer-events: none; }
.feat-vis img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; opacity: 0.88; transition: opacity 0.4s ease; }
.feat article:hover .feat-vis img { opacity: 1; }
.feat .k { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; color: var(--accent); text-transform: uppercase; }
.feat h3 { font-family: var(--serif); font-weight: 400; font-size: clamp(28px,3.5vw,40px); line-height: 1; letter-spacing: -0.025em; margin: 18px 0 16px; color: var(--fg); }
.feat h3 :deep(em) { font-style: italic; color: var(--accent); }
.feat .lede { font-family: var(--serif); font-size: 17px; line-height: 1.55; color: var(--fg-2); margin: 0 0 20px; max-width: 40ch; }
.feat ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.feat li { font-size: 13px; color: var(--fg-2); display: flex; gap: 10px; line-height: 1.5; }
.feat li::before { content: "—"; color: var(--fg-4); flex: none; }

.pull { padding: clamp(56px,9vw,96px) clamp(20px,4vw,44px); border-bottom: 1px solid var(--rule); display: grid; grid-template-columns: 120px 1fr; gap: 32px; align-items: start; }
@media (max-width: 640px) { .pull { grid-template-columns: 1fr; gap: 16px; } }
.pull .mark { font-family: var(--serif); font-style: italic; font-size: clamp(72px,10vw,112px); line-height: 0.8; color: var(--accent); }
.pull blockquote { font-family: var(--serif); font-weight: 400; font-size: clamp(26px,4vw,52px); line-height: 1.12; letter-spacing: -0.022em; margin: 0; color: var(--fg); text-wrap: balance; }
.pull blockquote :deep(em) { font-style: italic; color: var(--fg-3); }

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

/* ────── FAQ ────── */
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
  padding: 16px 0 24px;
  font-size: 14px; line-height: 1.75; color: var(--fg-2);
  white-space: pre-line;
  border-top: 1px solid var(--rule);
  max-width: 72ch;
}

/* ────── MARKETPLACE VISION ────── */
.marketplace-vision { background: linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.04) 40%, transparent 100%); }
.mv-intro { max-width: 72ch; margin: 0 0 56px; }
.mv-intro p { font-family: var(--serif); font-size: clamp(17px,2vw,21px); line-height: 1.6; color: var(--fg-2); }

/* ────── COLOPHON ────── */
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

.disclaimer { padding: 20px clamp(20px,4vw,44px); border-top: 1px solid var(--rule); background: rgba(13,11,20,0.5); }
.disclaimer p { font-family: var(--mono); font-size: 11px; line-height: 1.75; color: var(--fg-3); margin: 0; max-width: 120ch; letter-spacing: 0.01em; }
.disclaimer strong { color: var(--fg-2); font-weight: 600; }
.disclaimer a { color: var(--fg-2); text-decoration: underline; text-underline-offset: 3px; }
.disclaimer a:hover { color: var(--accent-bright); }

.foot-rule { padding: 18px clamp(20px,4vw,44px); border-top: 1px solid var(--rule); display: flex; justify-content: space-between; font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg-4); gap: 12px; flex-wrap: wrap; }
</style>
