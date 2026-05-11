<template>
  <div class="legal-page">

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

    <main id="main-content" class="content">

      <div class="doc-intro">
        <h1 v-html="t.h1"></h1>
        <p class="sub">{{ t.sub }}</p>
      </div>

      <section>
        <h2>{{ t.s1h2 }}</h2>
        <p v-html="t.s1p1"></p>
        <div class="code-block">
          <p>Copyright 2026 Jan-Oliver Karo, UX-Projects</p>
          <br />
          <p>{{ t.apachePara }}</p>
          <br />
          <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener">https://www.apache.org/licenses/LICENSE-2.0</a>
          <br /><br />
          <p>{{ t.apacheDisclaimer }}</p>
        </div>
        <p v-html="t.s1Marks"></p>
        <p v-html="t.s1Third"></p>
      </section>

      <section>
        <h2>{{ t.s2h2 }}</h2>

        <h3>{{ t.s2s1h3 }}</h3>
        <p>{{ t.s2s1p1 }}</p>
        <p>{{ t.s2s1p2 }}</p>

        <h3>{{ t.s2s2h3 }}</h3>
        <p v-html="t.s2s2p"></p>

        <h3>{{ t.s2s3h3 }}</h3>
        <p>{{ t.s2s3p }}</p>
        <ul>
          <li v-for="item in t.s2s3list" :key="item" v-html="item"></li>
        </ul>
      </section>

      <section>
        <h2>{{ t.s3h2 }}</h2>
        <div class="inset">
          <p v-html="t.s3p1"></p>
          <p>{{ t.s3p2 }}</p>
        </div>
      </section>

      <section>
        <h2>{{ t.s4h2 }}</h2>
        <p v-html="t.s4p1"></p>
        <p>{{ t.s4p2 }}</p>
      </section>

      <section>
        <h2>{{ t.s5h2 }}</h2>
        <p>{{ t.s5p }}</p>
      </section>

      <section>
        <h2>{{ t.s6h2 }}</h2>
        <p>{{ t.s6p }}</p>
      </section>

      <section>
        <h2>{{ t.s7h2 }}</h2>
        <p>{{ t.s7p }}</p>
      </section>

      <section>
        <h2>{{ t.s8h2 }}</h2>
        <div class="license-list">
          <div class="license-item">
            <strong>Inter, Noto Serif, Oxanium, JetBrains Mono</strong>
            <span>SIL Open Font License 1.1 · <a href="https://scripts.sil.org/OFL" target="_blank" rel="noopener">scripts.sil.org/OFL</a></span>
            <span class="dim">{{ t.fontsNote }}</span>
          </div>
          <div class="license-item">
            <strong>Remix Icons</strong>
            <span>Apache License 2.0 · <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener">apache.org</a></span>
            <span class="dim">{{ t.iconsNote }}</span>
          </div>
          <div class="license-item">
            <strong>Vue.js / Nuxt</strong>
            <span>MIT License · © Evan You {{ t.andContributors }}</span>
          </div>
          <div class="license-item">
            <strong>Tailwind CSS</strong>
            <span>MIT License · © Tailwind Labs Inc.</span>
          </div>
        </div>
      </section>

      <p class="stand">{{ t.stand }}</p>

    </main>

    <div class="foot-rule">
      <span>© 2026 · UX-Projects Jan-Oliver Karo</span>
      <span>Apache 2.0</span>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({ layout: false })
useSeoMeta({ title: 'Lizenz & Nutzungsbedingungen – SaveYourSoul', robots: 'noindex' })

const { lang } = useLang()

const i18n = {
  de: {
    pageTitle: 'Lizenz & Nutzungsbedingungen',
    back: '← Zurück',
    h1: 'Lizenz &amp; Nutzungs<em>bedingungen.</em>',
    sub: 'Gültig ab 11. Mai 2026',
    s1h2: '1. Open-Source-Lizenz (Apache 2.0)',
    s1p1: 'Die vollständige <strong>SaveYourSoul-Codebasis</strong> — Frontend (Nuxt/Vue), Backend-Lua-Skripte (OpenResty), Installationsskripte, MCP-Server, Browser-Extension und das sys.md-Format — wird unter der <strong>Apache License 2.0</strong> als Open Source veröffentlicht.',
    apachePara: 'Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:',
    apacheDisclaimer: 'Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
    s1Marks: '<strong>Marken:</strong> „SaveYourSoul" und „SYS" sind Marken von Jan-Oliver Karo. Die Apache-2.0-Lizenz räumt keine Rechte zur Nutzung dieser Marken ein. Private, passwortgeschützte, nicht-kommerzielle Nodes sind von der Namensnennung ausgenommen — Details im <a href="https://github.com/uxprojectsjok/personal-sys-vps/blob/main/NOTICE" target="_blank" rel="noopener">NOTICE</a>.',
    s1Third: 'Drittanbieter-Dienste (Anthropic, ElevenLabs, WaveSpeed AI, Twilio, WalletConnect, Pinata, Polygon) sind unabhängige Dienste. Jede/r Betreiber/in muss deren Nutzungsbedingungen eigenständig prüfen, akzeptieren und für die Integration vollständige Verantwortung übernehmen. Ich bin nicht Vertreter oder Partner dieser Anbieter.',
    s2h2: '2. Nutzungsbedingungen',
    s2s1h3: '2.1 Selbst gehostete Software',
    s2s1p1: 'SaveYourSoul ist Software zum Selbst-Hosten. Jede Person, die SaveYourSoul auf eigenem Server installiert, betreibt einen vollständig unabhängigen Node unter eigener Domain. Ich (Jan-Oliver Karo) bin Autor der Software — nicht Betreiber fremder Nodes. Ich habe keinen Zugang zu den Servern, Daten oder Schlüsseln anderer Betreiber.',
    s2s1p2: 'Die Nutzung der Software erfolgt auf eigene Verantwortung. Es handelt sich um experimentelle Software ohne jegliche Gewährleistung — weder ausdrücklich noch stillschweigend.',
    s2s2h3: '2.2 Keine Garantie zur Datensicherung',
    s2s2p: 'Jede/r Betreiber/in übernimmt die vollständige Verantwortung für die Verfügbarkeit und Sicherheit der auf dem eigenen Server gespeicherten Daten. <strong>Regelmäßige Datensicherungen liegen in der Verantwortung des jeweiligen Betreibers.</strong> SaveYourSoul stellt dazu die „Verschlüsseln &amp; Download"-Funktion bereit, mit der eine vollständige, verschlüsselte Sicherungskopie als .soul-Bundle erstellt werden kann.',
    s2s3h3: '2.3 Zulässige Nutzung',
    s2s3p: 'Die Nutzung ist ausschließlich für rechtmäßige Zwecke gestattet. Ausdrücklich verboten ist:',
    s2s3list: [
      '<strong>Impersonation</strong> — das Anlegen einer Soul, die eine andere lebende oder verstorbene Person ohne deren Einwilligung darstellt, mit dem Ziel der Täuschung Dritter',
      '<strong>Spam und Missbrauch</strong> — automatisiertes Erstellen von Souls oder massenhaftes Abfragen der API zu nicht-legitimen Zwecken',
      '<strong>Illegale Inhalte</strong> — Speicherung oder Verarbeitung rechtswidriger Inhalte im Vault oder als Soul-Inhalt',
      '<strong>Manipulation von Sicherheitsmechanismen</strong> — Versuche, die Authentifizierungslogik (soul_cert, HMAC-Signierung) zu umgehen oder zu kompromittieren',
    ],
    s3h2: '3. Haftungsausschluss für KI-Ausgaben',
    s3p1: 'KI-Ausgaben (Chat-Antworten, Soul-Analysen, Anreicherungsvorschläge) sind automatisch generierte Inhalte und stellen <strong>keine medizinischen, rechtlichen, finanziellen oder sonstigen Fachberatungen</strong> dar. Bei gesundheitlichen, rechtlichen oder finanziellen Fragen ist immer qualifizierter Fachrat einzuholen.',
    s3p2: 'Der Autor haftet nicht für Schäden, die durch das Vertrauen auf KI-generierte Inhalte entstehen. KI-Modelle können Fehler machen, falsche Informationen erzeugen oder veraltete Daten liefern.',
    s4h2: '4. Soul-Daten: Eigentümerschaft',
    s4p1: '<strong>Jede/r Nutzer/in behält alle Rechte an seinen/ihren Daten.</strong> sys.md und alle Vault-Inhalte sind vom Nutzer erstellte Werke. Die Nutzung von SaveYourSoul begründet keine Übertragung von Eigentumsrechten oder Nutzungsrechten.',
    s4p2: 'Das sys.md-Format ist ein offenes Format (Apache 2.0). Nutzer können ihre Identitätsdaten jederzeit exportieren, migrieren oder in anderen kompatiblen Systemen verwenden.',
    s5h2: '5. Haftungsbeschränkung',
    s5p: 'Jede Haftung für Datenverlust, Systemausfälle, fehlerhafte KI-Ausgaben oder sonstige direkte oder indirekte Schäden ist im gesetzlich zulässigen Rahmen ausgeschlossen. Dies gilt insbesondere für Schäden, die durch den Verlust der 12 Wörter (BIP39-Mnemonic) oder des Passkeys entstehen — beide Schlüsselmittel werden serverseitig nicht gespeichert und können bei Verlust nicht wiederhergestellt werden.',
    s6h2: '6. Änderungen dieser Bedingungen',
    s6p: 'Diese Nutzungsbedingungen beziehen sich auf die Nutzung der SaveYourSoul-Software. Änderungen werden im Repository und auf dieser Seite kommuniziert. Da jede/r Betreiber/in die Software unabhängig betreibt, entscheidet sie/er selbst, welche Version der Software eingesetzt wird.',
    s7h2: '7. Anwendbares Recht',
    s7p: 'Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit gesetzlich zulässig, der Wohnsitz des Autors.',
    s8h2: '8. Drittanbieter-Lizenzen',
    fontsNote: 'Lokal eingebundene Schriftarten. Keine externe Verbindung.',
    iconsNote: 'Lokal eingebundene Icon-Schriftart. Keine externe Verbindung.',
    andContributors: 'und Mitwirkende',
    stand: 'Stand: 11. Mai 2026',
  },
  en: {
    pageTitle: 'License & Terms of Use',
    back: '← Back',
    h1: 'License &amp; Terms of <em>Use.</em>',
    sub: 'Effective May 11, 2026',
    s1h2: '1. Open-Source License (Apache 2.0)',
    s1p1: 'The complete <strong>SaveYourSoul codebase</strong> — frontend (Nuxt/Vue), backend Lua scripts (OpenResty), installation scripts, MCP server, browser extension and the sys.md format — is released as open source under the <strong>Apache License 2.0</strong>.',
    apachePara: 'Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:',
    apacheDisclaimer: 'Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
    s1Marks: '<strong>Trademarks:</strong> "SaveYourSoul" and "SYS" are trademarks of Jan-Oliver Karo. The Apache 2.0 license does not grant rights to use these trademarks. Private, password-protected, non-commercial nodes are exempt from attribution requirements — see <a href="https://github.com/uxprojectsjok/personal-sys-vps/blob/main/NOTICE" target="_blank" rel="noopener">NOTICE</a> for details.',
    s1Third: 'Third-party services (Anthropic, ElevenLabs, WaveSpeed AI, Twilio, WalletConnect, Pinata, Polygon) are independent services. Each operator must independently review and accept their terms of service and take full responsibility for the integration. I am not a representative or partner of these providers.',
    s2h2: '2. Terms of Use',
    s2s1h3: '2.1 Self-hosted software',
    s2s1p1: 'SaveYourSoul is self-hosted software. Anyone who installs SaveYourSoul on their own server operates a fully independent node under their own domain. I (Jan-Oliver Karo) am the author of the software — not the operator of other people\'s nodes. I have no access to other operators\' servers, data or keys.',
    s2s1p2: 'Use of the software is at your own risk. This is experimental software provided without any warranty — either express or implied.',
    s2s2h3: '2.2 No data backup guarantee',
    s2s2p: 'Each operator is fully responsible for the availability and security of data stored on their own server. <strong>Regular backups are the responsibility of the respective operator.</strong> SaveYourSoul provides an "Encrypt &amp; Download" function to create a complete, encrypted backup as a .soul bundle.',
    s2s3h3: '2.3 Permitted use',
    s2s3p: 'Use is permitted for lawful purposes only. Expressly prohibited:',
    s2s3list: [
      '<strong>Impersonation</strong> — creating a soul that represents another living or deceased person without their consent with the intent to deceive third parties',
      '<strong>Spam and abuse</strong> — automated creation of souls or mass querying of the API for illegitimate purposes',
      '<strong>Illegal content</strong> — storing or processing unlawful content in the vault or as soul content',
      '<strong>Tampering with security mechanisms</strong> — attempts to circumvent or compromise the authentication logic (soul_cert, HMAC signing)',
    ],
    s3h2: '3. Disclaimer for AI Outputs',
    s3p1: 'AI outputs (chat responses, soul analyses, enrichment suggestions) are automatically generated content and do <strong>not constitute medical, legal, financial or other professional advice</strong>. Always seek qualified professional advice for health, legal or financial questions.',
    s3p2: 'The author is not liable for damages arising from reliance on AI-generated content. AI models can make mistakes, generate incorrect information or provide outdated data.',
    s4h2: '4. Soul Data: Ownership',
    s4p1: '<strong>Each user retains all rights to their data.</strong> sys.md and all vault contents are works created by the user. Use of SaveYourSoul does not transfer any ownership or usage rights.',
    s4p2: 'The sys.md format is an open format (Apache 2.0). Users can export, migrate or use their identity data in other compatible systems at any time.',
    s5h2: '5. Limitation of Liability',
    s5p: 'Liability for data loss, system failures, incorrect AI outputs or any other direct or indirect damages is excluded to the extent permitted by law. This applies in particular to damages resulting from the loss of the 12-word mnemonic (BIP39) or the passphrase — neither key material is stored server-side and cannot be recovered if lost.',
    s6h2: '6. Changes to These Terms',
    s6p: 'These terms of use relate to the use of SaveYourSoul software. Changes will be communicated in the repository and on this page. Since each operator runs the software independently, they decide which version of the software to use.',
    s7h2: '7. Governing Law',
    s7p: 'The law of the Federal Republic of Germany applies. The place of jurisdiction is, to the extent permitted by law, the domicile of the author.',
    s8h2: '8. Third-party Licenses',
    fontsNote: 'Locally embedded fonts. No external connection.',
    iconsNote: 'Locally embedded icon font. No external connection.',
    andContributors: 'and contributors',
    stand: 'As of: May 11, 2026',
  },
}

const t = computed(() => lang.value === 'de' ? i18n.de : i18n.en)
</script>

<style scoped>
.legal-page {
  --ink: #08070c; --paper: #12101a; --paper-2: #1a1726;
  --rule: rgba(226,220,240,0.10); --rule-2: rgba(226,220,240,0.20);
  --fg: #ffffff; --fg-2: rgba(255,255,255,0.85); --fg-3: rgba(255,255,255,0.65); --fg-4: rgba(255,255,255,0.45);
  --accent: #8b5cf6; --accent-bright: #a78bfa;
  --serif: 'Noto Serif', Georgia, serif;
  --sans: 'Inter', system-ui, sans-serif;
  --mono: 'Oxanium', monospace;
  min-height: 100dvh;
  background: var(--paper);
  color: var(--fg);
  font-family: var(--sans);
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

/* Content */
.content { max-width: 720px; margin: 0 auto; padding: 56px clamp(20px,4vw,44px) 80px; }

.doc-intro { padding-bottom: 40px; border-bottom: 1px solid var(--rule); margin-bottom: 48px; }
.doc-intro h1 { font-family: var(--serif); font-size: clamp(26px,5vw,56px); font-weight: 700; letter-spacing: -0.025em; line-height: 1.1; color: var(--fg); margin: 0 0 12px; }
.doc-intro h1 :deep(em) { color: var(--accent); font-style: italic; }
.doc-intro .sub { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fg-4); margin: 0; }

/* Sections */
section { margin-bottom: 48px; }
h2 { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-3); margin: 0 0 20px; font-weight: 500; padding-bottom: 12px; border-bottom: 1px solid var(--rule); }
h3 { font-family: var(--serif); font-size: 18px; font-weight: 700; color: var(--fg); margin: 24px 0 8px; }
p { font-size: 15px; line-height: 1.7; color: var(--fg-2); margin: 0 0 14px; }
strong { color: var(--fg); font-weight: 600; }
a { color: var(--accent-bright); text-decoration: underline; text-underline-offset: 3px; }
code { font-family: var(--mono); font-size: 12px; color: var(--accent-bright); }
ul { padding-left: 20px; margin: 0 0 14px; }
li { font-size: 15px; line-height: 1.7; color: var(--fg-2); margin-bottom: 8px; }

.code-block { background: rgba(13,11,20,0.92); border: 1px solid var(--rule-2); padding: 20px 24px; font-family: var(--mono); font-size: 12px; line-height: 1.65; color: var(--fg-3); margin: 16px 0; }

.inset { border: 1px solid var(--rule); background: rgba(13,11,20,0.6); padding: 20px 24px; }
.inset p { margin-bottom: 10px; }
.inset p:last-child { margin-bottom: 0; }

.license-list { display: flex; flex-direction: column; gap: 16px; }
.license-item { display: flex; flex-direction: column; gap: 2px; padding: 14px 0; border-bottom: 1px solid var(--rule); }
.license-item strong { font-size: 14px; color: var(--fg); font-weight: 600; }
.license-item span { font-size: 13px; color: var(--fg-3); }
.license-item .dim { font-size: 12px; color: var(--fg-4); }

.stand { font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-4); margin-top: 56px; padding-top: 24px; border-top: 1px solid var(--rule); }

/* Footer */
.foot-rule { display: flex; justify-content: space-between; padding: 20px clamp(20px,4vw,44px); border-top: 1px solid var(--rule); font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fg-4); }

@media (max-width: 640px) {
  .l-nav { grid-template-columns: 1fr auto; }
  .center { display: none; }
}
</style>
