<template>
  <div class="legal-page">

    <nav class="l-nav">
      <div class="lockup">
        <span class="mark">SYS<span class="dot">.</span></span>
      </div>
      <div class="center"><span class="page-title">Lizenz &amp; Nutzungsbedingungen</span></div>
      <button class="back" @click="$router.back()" aria-label="Zurück">
        ← Zurück
      </button>
    </nav>

    <main id="main-content" class="content">

      <div class="doc-intro">
        <h1>Lizenz &amp; Nutzungs<em>bedingungen.</em></h1>
        <p class="sub">Gültig ab 11. Mai 2026</p>
      </div>

      <section>
        <h2>1. Open-Source-Lizenz (Apache 2.0)</h2>
        <p>Die vollständige <strong>SaveYourSoul-Codebasis</strong> — Frontend (Nuxt/Vue), Backend-Lua-Skripte (OpenResty), Installationsskripte, MCP-Server, Browser-Extension und das sys.md-Format — wird unter der <strong>Apache License 2.0</strong> als Open Source veröffentlicht.</p>
        <div class="code-block">
          <p>Copyright 2026 Jan-Oliver Karo, UX-Projects</p>
          <br />
          <p>Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:</p>
          <br />
          <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener">https://www.apache.org/licenses/LICENSE-2.0</a>
          <br /><br />
          <p>Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.</p>
        </div>
        <p><strong>Marken:</strong> „SaveYourSoul" und „SYS" sind Marken von Jan-Oliver Karo. Die Apache-2.0-Lizenz räumt keine Rechte zur Nutzung dieser Marken ein. Private, passwortgeschützte, nicht-kommerzielle Nodes sind von der Namensnennung ausgenommen — Details im <a href="https://github.com/uxprojectsjok/personal-sys-vps/blob/main/NOTICE" target="_blank" rel="noopener">NOTICE</a>.</p>
        <p>Drittanbieter-Dienste (Anthropic, ElevenLabs, WaveSpeed AI, Twilio, WalletConnect, Pinata, Polygon) sind unabhängige Dienste. Jede/r Betreiber/in muss deren Nutzungsbedingungen eigenständig prüfen, akzeptieren und für die Integration vollständige Verantwortung übernehmen. Ich bin nicht Vertreter oder Partner dieser Anbieter.</p>
      </section>

      <section>
        <h2>2. Nutzungsbedingungen</h2>

        <h3>2.1 Selbst gehostete Software</h3>
        <p>SaveYourSoul ist Software zum Selbst-Hosten. Jede Person, die SaveYourSoul auf eigenem Server installiert, betreibt einen vollständig unabhängigen Node unter eigener Domain. Ich (Jan-Oliver Karo) bin Autor der Software — nicht Betreiber fremder Nodes. Ich habe keinen Zugang zu den Servern, Daten oder Schlüsseln anderer Betreiber.</p>
        <p>Die Nutzung der Software erfolgt auf eigene Verantwortung. Es handelt sich um experimentelle Software ohne jegliche Gewährleistung — weder ausdrücklich noch stillschweigend.</p>

        <h3>2.2 Keine Garantie zur Datensicherung</h3>
        <p>Jede/r Betreiber/in übernimmt die vollständige Verantwortung für die Verfügbarkeit und Sicherheit der auf dem eigenen Server gespeicherten Daten. <strong>Regelmäßige Datensicherungen liegen in der Verantwortung des jeweiligen Betreibers.</strong> SaveYourSoul stellt dazu die „Verschlüsseln &amp; Download"-Funktion bereit, mit der eine vollständige, verschlüsselte Sicherungskopie als .soul-Bundle erstellt werden kann.</p>

        <h3>2.3 Zulässige Nutzung</h3>
        <p>Die Nutzung ist ausschließlich für rechtmäßige Zwecke gestattet. Ausdrücklich verboten ist:</p>
        <ul>
          <li><strong>Impersonation</strong> — das Anlegen einer Soul, die eine andere lebende oder verstorbene Person ohne deren Einwilligung darstellt, mit dem Ziel der Täuschung Dritter</li>
          <li><strong>Spam und Missbrauch</strong> — automatisiertes Erstellen von Souls oder massenhaftes Abfragen der API zu nicht-legitimen Zwecken</li>
          <li><strong>Illegale Inhalte</strong> — Speicherung oder Verarbeitung rechtswidriger Inhalte im Vault oder als Soul-Inhalt</li>
          <li><strong>Manipulation von Sicherheitsmechanismen</strong> — Versuche, die Authentifizierungslogik (soul_cert, HMAC-Signierung) zu umgehen oder zu kompromittieren</li>
        </ul>
      </section>

      <section>
        <h2>3. Haftungsausschluss für KI-Ausgaben</h2>
        <div class="inset">
          <p>KI-Ausgaben (Chat-Antworten, Soul-Analysen, Anreicherungsvorschläge) sind automatisch generierte Inhalte und stellen <strong>keine medizinischen, rechtlichen, finanziellen oder sonstigen Fachberatungen</strong> dar. Bei gesundheitlichen, rechtlichen oder finanziellen Fragen ist immer qualifizierter Fachrat einzuholen.</p>
          <p>Der Autor haftet nicht für Schäden, die durch das Vertrauen auf KI-generierte Inhalte entstehen. KI-Modelle können Fehler machen, falsche Informationen erzeugen oder veraltete Daten liefern.</p>
        </div>
      </section>

      <section>
        <h2>4. Soul-Daten: Eigentümerschaft</h2>
        <p><strong>Jede/r Nutzer/in behält alle Rechte an seinen/ihren Daten.</strong> sys.md und alle Vault-Inhalte sind vom Nutzer erstellte Werke. Die Nutzung von SaveYourSoul begründet keine Übertragung von Eigentumsrechten oder Nutzungsrechten.</p>
        <p>Das sys.md-Format ist ein offenes Format (Apache 2.0). Nutzer können ihre Identitätsdaten jederzeit exportieren, migrieren oder in anderen kompatiblen Systemen verwenden.</p>
      </section>

      <section>
        <h2>5. Haftungsbeschränkung</h2>
        <p>Jede Haftung für Datenverlust, Systemausfälle, fehlerhafte KI-Ausgaben oder sonstige direkte oder indirekte Schäden ist im gesetzlich zulässigen Rahmen ausgeschlossen. Dies gilt insbesondere für Schäden, die durch den Verlust der 12 Wörter (BIP39-Mnemonic) oder des Passkeys entstehen — beide Schlüsselmittel werden serverseitig nicht gespeichert und können bei Verlust nicht wiederhergestellt werden.</p>
      </section>

      <section>
        <h2>6. Änderungen dieser Bedingungen</h2>
        <p>Diese Nutzungsbedingungen beziehen sich auf die Nutzung der SaveYourSoul-Software. Änderungen werden im Repository und auf dieser Seite kommuniziert. Da jede/r Betreiber/in die Software unabhängig betreibt, entscheidet sie/er selbst, welche Version der Software eingesetzt wird.</p>
      </section>

      <section>
        <h2>7. Anwendbares Recht</h2>
        <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit gesetzlich zulässig, der Wohnsitz des Autors.</p>
      </section>

      <section>
        <h2>8. Drittanbieter-Lizenzen</h2>
        <div class="license-list">
          <div class="license-item">
            <strong>Inter, Noto Serif, Oxanium, JetBrains Mono</strong>
            <span>SIL Open Font License 1.1 · <a href="https://scripts.sil.org/OFL" target="_blank" rel="noopener">scripts.sil.org/OFL</a></span>
            <span class="dim">Lokal eingebundene Schriftarten. Keine externe Verbindung.</span>
          </div>
          <div class="license-item">
            <strong>Remix Icons</strong>
            <span>Apache License 2.0 · <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener">apache.org</a></span>
            <span class="dim">Lokal eingebundene Icon-Schriftart. Keine externe Verbindung.</span>
          </div>
          <div class="license-item">
            <strong>Vue.js / Nuxt</strong>
            <span>MIT License · © Evan You und Mitwirkende</span>
          </div>
          <div class="license-item">
            <strong>Tailwind CSS</strong>
            <span>MIT License · © Tailwind Labs Inc.</span>
          </div>
        </div>
      </section>

      <p class="stand">Stand: 11. Mai 2026</p>

    </main>

    <div class="foot-rule">
      <span>© 2026 · UX-Projects Jan-Oliver Karo</span>
      <span>Apache 2.0</span>
    </div>

  </div>
</template>

<script setup>
definePageMeta({ layout: false })
useSeoMeta({ title: 'Lizenz & Nutzungsbedingungen – SaveYourSoul', robots: 'noindex' })
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
.logo { width: 32px; height: 32px; object-fit: contain; }
.mark { font-family: var(--mono); font-size: 18px; font-weight: 700; letter-spacing: -0.02em; color: var(--fg); }
.dot { color: var(--accent); }
.center { text-align: center; }
.page-title { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-4); }
.back { font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-3); text-decoration: none; transition: color 0.15s; }
.back:hover { color: var(--accent); }

/* Content */
.content { max-width: 720px; margin: 0 auto; padding: 56px clamp(20px,4vw,44px) 80px; }

.doc-intro { padding-bottom: 40px; border-bottom: 1px solid var(--rule); margin-bottom: 48px; }
.doc-intro h1 { font-family: var(--serif); font-size: clamp(26px,5vw,56px); font-weight: 700; letter-spacing: -0.025em; line-height: 1.1; color: var(--fg); margin: 0 0 12px; }
.doc-intro h1 em { color: var(--accent); font-style: italic; }
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
