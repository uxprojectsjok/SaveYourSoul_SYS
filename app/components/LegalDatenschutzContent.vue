<template>
  <div class="legal-body space-y-8 text-[var(--sys-fg)] leading-relaxed max-w-prose">

    <!-- ── DEUTSCH ── -->
    <template v-if="lang === 'de'">

      <div>
        <h1 class="text-2xl font-bold mb-2">Datenschutzerklärung</h1>
        <p class="text-sm text-[var(--sys-fg-dim)]">Gemäß DSGVO (EU) 2016/679</p>
      </div>

      <div class="p-4 rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] space-y-3">
        <p class="text-base text-[var(--sys-fg-muted)] leading-relaxed">
          Diese Datenschutzerklärung gilt ausschließlich für die Projektinfo-Seite
          <strong class="text-[var(--sys-fg)]">sys.uxprojects-jok.com</strong>.
          Diese Seite ist eine rein statische Website — sie erhebt keine personenbezogenen Daten, setzt keine Cookies, betreibt kein Tracking und enthält keine Anmeldefunktion.
        </p>
        <p class="text-base text-[var(--sys-fg-muted)] leading-relaxed">
          <strong class="text-[var(--sys-fg)]">Selbst gehostete SYS-Nodes:</strong>
          Die SaveYourSoul-Software läuft auf den eigenen Servern der jeweiligen Nutzer (privater VPS, eigene Domain). Jede Person, die SaveYourSoul auf eigenem Server einrichtet, betreibt einen vollständig unabhängigen Node und ist nach DSGVO selbst Verantwortliche/r für die auf ihrem Server verarbeiteten Daten. Ich habe keinen Zugang zu diesen Servern oder den dort gespeicherten Daten.
        </p>
      </div>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">1. Verantwortlicher für diese Seite</h2>
        <div class="text-base leading-relaxed space-y-0.5">
          <p class="font-medium text-[var(--sys-fg)]">UX-Projects – Jan-Oliver Karo</p>
          <p>Wäldchesborn 57</p>
          <p>35043 Marburg</p>
          <p>Deutschland</p>
          <p class="mt-2">E-Mail: <a href="mailto:info@uxprojects-jok.com" class="text-[var(--sys-violet)] hover:underline underline-offset-2">info@uxprojects-jok.com</a></p>
        </div>
        <p class="text-sm text-[var(--sys-fg-dim)] mt-3">Verantwortlich im datenschutzrechtlichen Sinne bin ich ausschließlich für diese Projektinfo-Seite — nicht für selbst gehostete Nodes Dritter.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">2. Erhobene Daten</h2>

        <h3 class="text-base font-semibold text-[var(--sys-fg)] mb-2 mt-4">2.1 Server-Logdateien</h3>
        <p class="text-base text-[var(--sys-fg-muted)] mb-2">Beim Besuch dieser Seite werden automatisch technisch notwendige Logdaten erfasst:</p>
        <ul class="space-y-1 text-base text-[var(--sys-fg-muted)] list-disc list-inside ml-2">
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>Aufgerufene URL</li>
          <li>HTTP-Statuscode</li>
          <li>Übertragene Datenmenge</li>
          <li>Anonymisierte IP-Adresse</li>
          <li>Browser-Typ und -Version (User-Agent)</li>
        </ul>
        <p class="text-xs text-[var(--sys-fg-dim)] mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Speicherdauer: bis zu 14 Tage. Es findet kein Profiling statt.</p>

        <h3 class="text-base font-semibold text-[var(--sys-fg)] mb-2 mt-6">2.2 Keine weiteren Daten</h3>
        <p class="text-base text-[var(--sys-fg-muted)]">Auf dieser Seite gibt es keine Anmeldung, kein Nutzerkonto, keine Eingabeformulare und keine Tracking-Skripte. Es werden keinerlei personenbezogene Daten über die Webserver-Logs hinaus erhoben oder gespeichert.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">3. Webanalyse mit Plausible Analytics</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">Diese Website nutzt <strong class="text-[var(--sys-fg)]">Plausible Analytics</strong> in einer selbst gehosteten Variante auf einem Server in Deutschland (<code class="font-mono text-xs text-[var(--sys-violet)]">analytics.uxprojects-jok.com</code>). Plausible arbeitet <strong class="text-[var(--sys-fg)]">ohne Cookies</strong> und erstellt keine personenbezogenen Nutzerprofile.</p>
        <ul class="space-y-1 text-base text-[var(--sys-fg-muted)] list-disc list-inside ml-2 mt-2">
          <li>Erhobene Daten: anonymisierte Nutzungsinformationen (Seitenaufrufe, Herkunftsland, Gerätekategorie)</li>
          <li>IP-Adressen: keine Speicherung im Klartext</li>
          <li>Drittlandtransfer: findet nicht statt (Server in Deutschland)</li>
          <li>Cookies: keine</li>
        </ul>
        <p class="text-xs text-[var(--sys-fg-dim)] mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Die anonyme Statistikerhebung erfolgt nur nach deiner Zustimmung im Datenschutz-Banner. Du kannst diese Einwilligung jederzeit widerrufen. Es findet kein Profiling statt.</p>
        <div class="mt-4 flex items-center gap-4 flex-wrap">
          <span class="text-sm text-[var(--sys-fg-muted)]">Aktuelle Einwilligung: <strong :class="consentStatus === 'granted' ? 'text-green-400' : consentStatus === 'denied' ? 'text-[var(--sys-fg)]' : 'text-[var(--sys-fg-muted)]'">{{ consentLabel }}</strong></span>
          <button v-if="consentStatus === 'granted'" @click="revokeConsent" class="consent-btn revoke">Einwilligung widerrufen</button>
          <button v-if="consentStatus === 'denied' || consentStatus === 'unknown'" @click="grantConsent" class="consent-btn grant">Statistik erlauben</button>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">4. Cookies und Tracking</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">Diese Seite verwendet keine Tracking-Cookies und keine personenbezogenen Profiling-Mechanismen. Alle Schriftarten und Icons werden lokal von diesem Server ausgeliefert — es werden keine externen Ressourcen nachgeladen. Die einzige anonymisierte Nutzungsstatistik erfolgt über Plausible Analytics (selbst gehostet, cookiefrei — siehe Abschnitt 3).</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">5. Hosting</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">Diese statische Seite wird gehostet bei: <strong class="text-[var(--sys-fg)]">IONOS SE</strong>, Elgendorfer Str. 57, 56410 Montabaur, Deutschland. Rechenzentrum: Berlin, Deutschland.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">6. Selbst gehostete SYS-Nodes (Hinweis)</h2>
        <div class="p-4 rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] space-y-3">
          <p class="text-base text-[var(--sys-fg-muted)] leading-relaxed">Die SaveYourSoul-Software ist Open Source (Apache 2.0). Jeder kann sie herunterladen und auf dem eigenen VPS betreiben. Diese dezentrale Architektur bedeutet:</p>
          <ul class="space-y-2 text-sm text-[var(--sys-fg-muted)] list-disc list-inside ml-2">
            <li>Jede/r Betreiber/in ist datenschutzrechtlich <strong class="text-[var(--sys-fg)]">selbst Verantwortliche/r</strong> für den eigenen Node.</li>
            <li>Ich (Jan-Oliver Karo) habe keinen Zugang zu den Servern, Daten oder Verschlüsselungsschlüsseln anderer Nodes.</li>
            <li>Für auf fremden Nodes verarbeitete Daten bin ich nicht verantwortlich und habe keinen Einfluss darauf.</li>
            <li>Wer eine SaveYourSoul-Instanz betreibt und dabei personenbezogene Daten Dritter verarbeitet, muss eigene datenschutzrechtliche Vorgaben erfüllen und eine eigene Datenschutzerklärung bereitstellen.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">7. Deine Rechte (Betroffenenrechte)</h2>
        <p class="text-base text-[var(--sys-fg-muted)] mb-3">In Bezug auf diese Projektinfo-Seite hast du nach DSGVO folgende Rechte gegenüber dem Verantwortlichen:</p>
        <div class="space-y-2 text-sm text-[var(--sys-fg-muted)]">
          <div class="flex gap-3"><span class="font-medium text-[var(--sys-fg)] w-36 flex-none">Auskunft</span><span>Art. 15 DSGVO — Auskunft über gespeicherte Daten</span></div>
          <div class="flex gap-3"><span class="font-medium text-[var(--sys-fg)] w-36 flex-none">Berichtigung</span><span>Art. 16 DSGVO — Berichtigung unrichtiger Daten</span></div>
          <div class="flex gap-3"><span class="font-medium text-[var(--sys-fg)] w-36 flex-none">Löschung</span><span>Art. 17 DSGVO — Recht auf Löschung</span></div>
          <div class="flex gap-3"><span class="font-medium text-[var(--sys-fg)] w-36 flex-none">Einschränkung</span><span>Art. 18 DSGVO — Einschränkung der Verarbeitung</span></div>
          <div class="flex gap-3"><span class="font-medium text-[var(--sys-fg)] w-36 flex-none">Widerspruch</span><span>Art. 21 DSGVO — Widerspruch gegen die Verarbeitung</span></div>
        </div>
        <p class="text-base text-[var(--sys-fg-muted)] mt-4">Zur Wahrnehmung dieser Rechte genügt eine formlose E-Mail an <a href="mailto:info@uxprojects-jok.com" class="text-[var(--sys-violet)] hover:underline underline-offset-2">info@uxprojects-jok.com</a>.</p>
        <p class="text-base text-[var(--sys-fg-muted)] mt-3">Du hast zudem das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig für den Verantwortlichen ist:</p>
        <div class="text-sm text-[var(--sys-fg-muted)] mt-2 ml-2">
          <p class="font-medium text-[var(--sys-fg)]">Der Hessische Beauftragte für Datenschutz und Informationsfreiheit (HBDI)</p>
          <p>Postfach 3163, 65021 Wiesbaden</p>
          <p>E-Mail: <a href="mailto:poststelle@datenschutz.hessen.de" class="text-[var(--sys-violet)] hover:underline underline-offset-2">poststelle@datenschutz.hessen.de</a></p>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">8. Automatisierte Entscheidungsfindung</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">Es findet keine automatisierte Entscheidungsfindung einschließlich Profiling im Sinne von Art. 22 DSGVO statt.</p>
        <p class="text-base text-[var(--sys-fg-muted)] mt-2"><strong class="text-[var(--sys-fg)]">Hinweis zur Datenschutzbeauftragten-Bestellung:</strong> Gemäß § 38 BDSG ist keine Datenschutzbeauftragte oder kein Datenschutzbeauftragter bestellt, da die Voraussetzungen (mehr als 20 mit Datenverarbeitung beschäftigte Personen) nicht vorliegen. Anfragen zum Datenschutz richten Sie bitte direkt an den Verantwortlichen: <a href="mailto:info@uxprojects-jok.com" class="text-[var(--sys-violet)] hover:underline underline-offset-2">info@uxprojects-jok.com</a>.</p>
      </section>

      <p class="text-xs text-[var(--sys-fg-dim)] pt-4 border-t border-[var(--sys-border)]">Stand: 11. Mai 2026</p>

    </template>

    <!-- ── ENGLISH ── -->
    <template v-else>

      <div>
        <h1 class="text-2xl font-bold mb-2">Privacy Policy</h1>
        <p class="text-sm text-[var(--sys-fg-dim)]">Pursuant to GDPR (EU) 2016/679</p>
      </div>

      <div class="p-4 rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] space-y-3">
        <p class="text-base text-[var(--sys-fg-muted)] leading-relaxed">
          This privacy policy applies exclusively to the project info site
          <strong class="text-[var(--sys-fg)]">sys.uxprojects-jok.com</strong>.
          This site is a purely static website — it collects no personal data, sets no cookies, does no tracking and has no login function.
        </p>
        <p class="text-base text-[var(--sys-fg-muted)] leading-relaxed">
          <strong class="text-[var(--sys-fg)]">Self-hosted SYS nodes:</strong>
          SaveYourSoul software runs on the servers of individual users (private VPS, own domain). Anyone who sets up SaveYourSoul on their own server operates a fully independent node and is themselves the controller under GDPR for the data processed on their server. I have no access to those servers or the data stored on them.
        </p>
      </div>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">1. Controller for this site</h2>
        <div class="text-base leading-relaxed space-y-0.5">
          <p class="font-medium text-[var(--sys-fg)]">UX-Projects – Jan-Oliver Karo</p>
          <p>Wäldchesborn 57</p>
          <p>35043 Marburg</p>
          <p>Germany</p>
          <p class="mt-2">Email: <a href="mailto:info@uxprojects-jok.com" class="text-[var(--sys-violet)] hover:underline underline-offset-2">info@uxprojects-jok.com</a></p>
        </div>
        <p class="text-sm text-[var(--sys-fg-dim)] mt-3">I am the controller under data protection law exclusively for this project info site — not for self-hosted nodes operated by third parties.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">2. Data collected</h2>

        <h3 class="text-base font-semibold text-[var(--sys-fg)] mb-2 mt-4">2.1 Server log files</h3>
        <p class="text-base text-[var(--sys-fg-muted)] mb-2">When you visit this site, technically necessary log data is collected automatically:</p>
        <ul class="space-y-1 text-base text-[var(--sys-fg-muted)] list-disc list-inside ml-2">
          <li>Date and time of access</li>
          <li>URL accessed</li>
          <li>HTTP status code</li>
          <li>Data volume transferred</li>
          <li>Anonymised IP address</li>
          <li>Browser type and version (User-Agent)</li>
        </ul>
        <p class="text-xs text-[var(--sys-fg-dim)] mt-2">Legal basis: Art. 6(1)(f) GDPR. Retention period: up to 14 days. No profiling takes place.</p>

        <h3 class="text-base font-semibold text-[var(--sys-fg)] mb-2 mt-6">2.2 No further data</h3>
        <p class="text-base text-[var(--sys-fg-muted)]">This site has no login, no user account, no input forms and no tracking scripts. No personal data beyond the web server logs is collected or stored.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">3. Web analytics with Plausible Analytics</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">This website uses <strong class="text-[var(--sys-fg)]">Plausible Analytics</strong> in a self-hosted setup on a server in Germany (<code class="font-mono text-xs text-[var(--sys-violet)]">analytics.uxprojects-jok.com</code>). Plausible works <strong class="text-[var(--sys-fg)]">without cookies</strong> and creates no personal user profiles.</p>
        <ul class="space-y-1 text-base text-[var(--sys-fg-muted)] list-disc list-inside ml-2 mt-2">
          <li>Data collected: anonymised usage information (page views, country of origin, device category)</li>
          <li>IP addresses: not stored in plain text</li>
          <li>Third-country transfer: none (server in Germany)</li>
          <li>Cookies: none</li>
        </ul>
        <p class="text-xs text-[var(--sys-fg-dim)] mt-2">Legal basis: Art. 6(1)(a) GDPR (consent). Anonymous statistics are only collected after your consent in the privacy banner. You can withdraw this consent at any time. No profiling takes place.</p>
        <div class="mt-4 flex items-center gap-4 flex-wrap">
          <span class="text-sm text-[var(--sys-fg-muted)]">Current consent: <strong :class="consentStatus === 'granted' ? 'text-green-400' : consentStatus === 'denied' ? 'text-[var(--sys-fg)]' : 'text-[var(--sys-fg-muted)]'">{{ consentLabelEn }}</strong></span>
          <button v-if="consentStatus === 'granted'" @click="revokeConsent" class="consent-btn revoke">Withdraw consent</button>
          <button v-if="consentStatus === 'denied' || consentStatus === 'unknown'" @click="grantConsent" class="consent-btn grant">Allow analytics</button>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">4. Cookies and tracking</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">This site uses no tracking cookies and no personal profiling mechanisms. All fonts and icons are served locally from this server — no external resources are loaded. The only anonymised usage statistics are via Plausible Analytics (self-hosted, cookieless — see section 3).</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">5. Hosting</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">This static site is hosted by: <strong class="text-[var(--sys-fg)]">IONOS SE</strong>, Elgendorfer Str. 57, 56410 Montabaur, Germany. Data centre: Berlin, Germany.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">6. Self-hosted SYS nodes (note)</h2>
        <div class="p-4 rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] space-y-3">
          <p class="text-base text-[var(--sys-fg-muted)] leading-relaxed">SaveYourSoul software is open source (Apache 2.0). Anyone can download it and run it on their own VPS. This decentralised architecture means:</p>
          <ul class="space-y-2 text-sm text-[var(--sys-fg-muted)] list-disc list-inside ml-2">
            <li>Each operator is <strong class="text-[var(--sys-fg)]">independently responsible</strong> as controller under data protection law for their own node.</li>
            <li>I (Jan-Oliver Karo) have no access to the servers, data or encryption keys of other nodes.</li>
            <li>I am not responsible for data processed on third-party nodes and have no influence over it.</li>
            <li>Anyone who operates a SaveYourSoul instance and processes personal data of third parties must comply with their own data protection obligations and provide their own privacy policy.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">7. Your rights (data subject rights)</h2>
        <p class="text-base text-[var(--sys-fg-muted)] mb-3">With respect to this project info site you have the following rights under GDPR against the controller:</p>
        <div class="space-y-2 text-sm text-[var(--sys-fg-muted)]">
          <div class="flex gap-3"><span class="font-medium text-[var(--sys-fg)] w-36 flex-none">Access</span><span>Art. 15 GDPR — information about stored data</span></div>
          <div class="flex gap-3"><span class="font-medium text-[var(--sys-fg)] w-36 flex-none">Rectification</span><span>Art. 16 GDPR — correction of inaccurate data</span></div>
          <div class="flex gap-3"><span class="font-medium text-[var(--sys-fg)] w-36 flex-none">Erasure</span><span>Art. 17 GDPR — right to erasure</span></div>
          <div class="flex gap-3"><span class="font-medium text-[var(--sys-fg)] w-36 flex-none">Restriction</span><span>Art. 18 GDPR — restriction of processing</span></div>
          <div class="flex gap-3"><span class="font-medium text-[var(--sys-fg)] w-36 flex-none">Objection</span><span>Art. 21 GDPR — objection to processing</span></div>
        </div>
        <p class="text-base text-[var(--sys-fg-muted)] mt-4">To exercise these rights, an informal email to <a href="mailto:info@uxprojects-jok.com" class="text-[var(--sys-violet)] hover:underline underline-offset-2">info@uxprojects-jok.com</a> is sufficient.</p>
        <p class="text-base text-[var(--sys-fg-muted)] mt-3">You also have the right to lodge a complaint with a supervisory authority. The authority responsible for the controller is:</p>
        <div class="text-sm text-[var(--sys-fg-muted)] mt-2 ml-2">
          <p class="font-medium text-[var(--sys-fg)]">Der Hessische Beauftragte für Datenschutz und Informationsfreiheit (HBDI)</p>
          <p>Postfach 3163, 65021 Wiesbaden, Germany</p>
          <p>Email: <a href="mailto:poststelle@datenschutz.hessen.de" class="text-[var(--sys-violet)] hover:underline underline-offset-2">poststelle@datenschutz.hessen.de</a></p>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">8. Automated decision-making</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">No automated decision-making including profiling within the meaning of Art. 22 GDPR takes place.</p>
        <p class="text-base text-[var(--sys-fg-muted)] mt-2"><strong class="text-[var(--sys-fg)]">Note on data protection officer:</strong> Pursuant to § 38 BDSG, no data protection officer has been appointed, as the conditions (more than 20 persons engaged in data processing) are not met. Please direct data protection enquiries directly to the controller: <a href="mailto:info@uxprojects-jok.com" class="text-[var(--sys-violet)] hover:underline underline-offset-2">info@uxprojects-jok.com</a>.</p>
      </section>

      <p class="text-xs text-[var(--sys-fg-dim)] pt-4 border-t border-[var(--sys-border)]">As of: May 11, 2026</p>

    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { lang } = useLang()

const CONSENT_KEY = 'plausible-consent'
const consentStatus = ref('unknown')

const consentLabel = computed(() => ({
  granted: 'Erteilt',
  denied:  'Abgelehnt',
  unknown: 'Noch nicht entschieden',
}[consentStatus.value]))

const consentLabelEn = computed(() => ({
  granted: 'Granted',
  denied:  'Denied',
  unknown: 'Not yet decided',
}[consentStatus.value]))

onMounted(() => {
  const v = localStorage.getItem(CONSENT_KEY)
  consentStatus.value = v === 'granted' ? 'granted' : v === 'denied' ? 'denied' : 'unknown'
})

function revokeConsent() {
  localStorage.removeItem(CONSENT_KEY)
  const script = document.getElementById('plausible-script')
  if (script) script.remove()
  window.location.reload()
}

function grantConsent() {
  localStorage.setItem(CONSENT_KEY, 'granted')
  consentStatus.value = 'granted'
  if (!document.getElementById('plausible-script')) {
    const s = document.createElement('script')
    s.async = true
    s.setAttribute('data-domain', 'uxprojects-jok.com')
    s.src = 'https://analytics.uxprojects-jok.com/js/script.js'
    s.id = 'plausible-script'
    document.head.appendChild(s)
  }
}
</script>

<style scoped>
.legal-body {
  font-family: "Inter", system-ui, sans-serif;
}
.legal-body h1,
.legal-body h2,
.legal-body h3 {
  font-family: "Inter", system-ui, sans-serif;
  letter-spacing: -0.01em;
}
.consent-btn {
  font-family: "Inter", system-ui, sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border: 1px solid;
  cursor: pointer;
  transition: opacity 0.15s;
}
.consent-btn:hover { opacity: 0.8; }
.consent-btn.revoke {
  background: transparent;
  color: rgba(255,255,255,0.65);
  border-color: rgba(226,220,240,0.25);
}
.consent-btn.grant {
  background: #8b5cf6;
  color: #fff;
  border-color: #8b5cf6;
}
</style>
