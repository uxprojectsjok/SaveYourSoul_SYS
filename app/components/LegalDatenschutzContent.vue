<template>
  <div class="legal-body space-y-8 text-[var(--sys-fg)] leading-relaxed max-w-prose">

    <div>
      <h1 class="text-2xl font-bold mb-2">Datenschutzerklärung</h1>
      <p class="text-sm text-[var(--sys-fg-dim)]">Gemäß DSGVO (EU) 2016/679</p>
    </div>

    <!-- Intro -->
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
        <p class="text-base text-[var(--sys-fg-muted)] leading-relaxed">
          Die SaveYourSoul-Software ist Open Source (Apache 2.0). Jeder kann sie herunterladen und auf dem eigenen VPS betreiben. Diese dezentrale Architektur bedeutet:
        </p>
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
        <div class="flex gap-3">
          <span class="font-medium text-[var(--sys-fg)] w-36 flex-none">Auskunft</span>
          <span>Art. 15 DSGVO — Auskunft über gespeicherte Daten</span>
        </div>
        <div class="flex gap-3">
          <span class="font-medium text-[var(--sys-fg)] w-36 flex-none">Berichtigung</span>
          <span>Art. 16 DSGVO — Berichtigung unrichtiger Daten</span>
        </div>
        <div class="flex gap-3">
          <span class="font-medium text-[var(--sys-fg)] w-36 flex-none">Löschung</span>
          <span>Art. 17 DSGVO — Recht auf Löschung</span>
        </div>
        <div class="flex gap-3">
          <span class="font-medium text-[var(--sys-fg)] w-36 flex-none">Einschränkung</span>
          <span>Art. 18 DSGVO — Einschränkung der Verarbeitung</span>
        </div>
        <div class="flex gap-3">
          <span class="font-medium text-[var(--sys-fg)] w-36 flex-none">Widerspruch</span>
          <span>Art. 21 DSGVO — Widerspruch gegen die Verarbeitung</span>
        </div>
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

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const CONSENT_KEY = 'plausible-consent'
const consentStatus = ref('unknown')

const consentLabel = computed(() => ({
  granted: 'Erteilt',
  denied:  'Abgelehnt',
  unknown: 'Noch nicht entschieden',
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
