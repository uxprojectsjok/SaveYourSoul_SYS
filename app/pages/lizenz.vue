<template>
  <div class="min-h-screen bg-[var(--sys-bg)] text-[var(--sys-fg)]">

    <!-- Header -->
    <header class="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b border-[var(--sys-border)] bg-[var(--sys-bg)]/95 backdrop-blur-sm">
      <NuxtLink
        to="/"
        class="flex items-center gap-1.5 text-xs text-[var(--sys-fg-muted)] hover:text-[var(--sys-accent)] transition-colors"
        aria-label="Zurück zur Startseite"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        Zurück
      </NuxtLink>
      <span class="text-[var(--sys-border)]">/</span>
      <h1 class="text-sm font-medium text-[var(--sys-fg)] tracking-wide">Lizenz &amp; Nutzungsbedingungen</h1>
    </header>

    <!-- Content -->
    <main id="main-content" class="max-w-xl mx-auto px-5 py-8 pb-16">

      <div class="legal-body space-y-8 text-[var(--sys-fg)] leading-relaxed max-w-prose">

        <div>
          <h1 class="text-2xl font-bold mb-2">Lizenz &amp; Nutzungsbedingungen</h1>
          <p class="text-sm text-[var(--sys-fg-dim)]">Gültig ab 03. April 2026</p>
        </div>

        <!-- Invite Notice -->
        <div class="p-4 rounded-xl border border-[rgba(255,200,0,0.25)] bg-[rgba(255,200,0,0.04)]">
          <p class="text-xs font-semibold text-[var(--sys-amber)] mb-1">Invite-only</p>
          <p class="text-sm text-[var(--sys-fg-muted)] leading-relaxed">
            SaveYourSoul läuft unter Realbedingungen und ist ausschließlich für eingeladene Nutzer zugänglich.
            Die Software wird ohne jegliche Gewährleistung bereitgestellt — weder ausdrücklich noch stillschweigend.
            Die Nutzung erfolgt auf eigene Verantwortung.
          </p>
        </div>

        <section>
          <h2 class="text-xs uppercase tracking-[0.15em] font-semibold text-[var(--sys-fg-dim)] mb-3">1. Open-Source-Lizenz (Apache 2.0)</h2>
          <p class="text-sm text-[var(--sys-fg-muted)] mb-3">
            Das <strong class="text-[var(--sys-fg)]">soul.md-Format</strong> sowie ausgewählte offene Komponenten von SaveYourSoul werden unter der
            <strong class="text-[var(--sys-fg)]">Apache License 2.0</strong> veröffentlicht.
          </p>
          <div class="p-4 rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] font-mono text-xs text-[var(--sys-fg-muted)] leading-relaxed">
            <p>Copyright 2026 Jan-Oliver Karo, UX-Projects</p>
            <br />
            <p>Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:</p>
            <br />
            <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener noreferrer" class="text-[var(--sys-violet)] hover:underline underline-offset-2">https://www.apache.org/licenses/LICENSE-2.0</a>
            <br /><br />
            <p>Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.</p>
          </div>
          <p class="text-sm text-[var(--sys-fg-muted)] mt-3">
            Alle anderen Teile des Projekts (Design, Konzept, proprietäre Komponenten, Server-Logik) sind urheberrechtlich geschützt. Alle Rechte vorbehalten.
            © 2025–2026 Jan-Oliver Karo · UX-Projects
          </p>
        </section>

        <section>
          <h2 class="text-xs uppercase tracking-[0.15em] font-semibold text-[var(--sys-fg-dim)] mb-3">2. Nutzungsbedingungen</h2>

          <h3 class="text-sm font-semibold text-[var(--sys-fg)] mb-2 mt-4">2.1 Zugangsbeschränkung</h3>
          <p class="text-sm text-[var(--sys-fg-muted)]">
            Die Erstellung neuer Souls ist auf eingeladene Nutzer beschränkt. Ein Rechtsanspruch auf Zugang besteht nicht. Der Betreiber kann den Zugang jederzeit und ohne Angabe von Gründen einschränken oder beenden.
          </p>

          <h3 class="text-sm font-semibold text-[var(--sys-fg)] mb-2 mt-4">2.2 Keine Garantie zur Datensicherung</h3>
          <p class="text-sm text-[var(--sys-fg-muted)]">
            Der Betreiber übernimmt keine Garantie für die dauerhafte Verfügbarkeit oder Unversehrtheit gespeicherter Daten auf dem VPS. <strong class="text-[var(--sys-fg)]">Der Nutzer ist selbst für regelmäßige Datensicherungen verantwortlich.</strong> SaveYourSoul stellt dazu die „Verschlüsseln &amp; Download"-Funktion bereit, mit der eine vollständige, verschlüsselte Sicherungskopie als .soul-Bundle erstellt werden kann. Diese sollte regelmäßig und an einem sicheren Ort außerhalb der App aufbewahrt werden.
          </p>

          <h3 class="text-sm font-semibold text-[var(--sys-fg)] mb-2 mt-4">2.3 Zulässige Nutzung</h3>
          <p class="text-sm text-[var(--sys-fg-muted)] mb-2">Die Nutzung ist ausschließlich für rechtmäßige Zwecke gestattet. Ausdrücklich verboten ist:</p>
          <ul class="space-y-1.5 text-sm text-[var(--sys-fg-muted)] list-disc list-inside ml-2">
            <li><strong class="text-[var(--sys-fg)]">Impersonation</strong> — das Anlegen einer Soul, die eine andere lebende oder verstorbene Person ohne deren Einwilligung darstellt, mit dem Ziel der Täuschung Dritter</li>
            <li><strong class="text-[var(--sys-fg)]">Spam und Missbrauch</strong> — automatisiertes Erstellen von Souls oder massenhaftes Abfragen der API zu nicht-legitimen Zwecken</li>
            <li><strong class="text-[var(--sys-fg)]">Illegale Inhalte</strong> — Speicherung oder Verarbeitung rechtswidriger Inhalte (z. B. Kinderpornografie, Hass- und Hetzkampagnen, Gewaltdarstellungen) im Vault oder als Soul-Inhalt</li>
            <li><strong class="text-[var(--sys-fg)]">Manipulation von Sicherheitsmechanismen</strong> — Versuche, die Authentifizierungslogik (soul_cert, HMAC-Signierung) zu umgehen oder zu kompromittieren</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xs uppercase tracking-[0.15em] font-semibold text-[var(--sys-fg-dim)] mb-3">3. Haftungsausschluss für KI-Ausgaben</h2>
          <div class="p-4 rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)]">
            <p class="text-sm text-[var(--sys-fg-muted)] leading-relaxed">
              KI-Ausgaben (Chat-Antworten, Soul-Analysen, Anreicherungsvorschläge) sind automatisch generierte Inhalte und stellen <strong class="text-[var(--sys-fg)]">keine medizinischen, rechtlichen, finanziellen oder sonstigen Fachberatungen</strong> dar.
              Bei gesundheitlichen, rechtlichen oder finanziellen Fragen ist immer qualifizierter Fachrat einzuholen.
            </p>
            <p class="text-sm text-[var(--sys-fg-muted)] leading-relaxed mt-3">
              Der Betreiber haftet nicht für Schäden, die durch das Vertrauen auf KI-generierte Inhalte entstehen. KI-Modelle können Fehler machen, falsche Informationen erzeugen oder veraltete Daten liefern.
            </p>
          </div>
        </section>

        <section>
          <h2 class="text-xs uppercase tracking-[0.15em] font-semibold text-[var(--sys-fg-dim)] mb-3">4. Soul-Daten: Eigentümerschaft</h2>
          <p class="text-sm text-[var(--sys-fg-muted)]">
            <strong class="text-[var(--sys-fg)]">Der Nutzer behält alle Rechte an seinen Daten.</strong>
            soul.md und alle Vault-Inhalte sind vom Nutzer erstellte Werke. Die Nutzung von SaveYourSoul begründet keine Übertragung von Eigentumsrechten oder Nutzungsrechten an den Betreiber. Der Betreiber beansprucht kein Recht zur Nutzung, Verarbeitung oder Weitergabe von Inhalten, die über die technisch notwendige Bereitstellung des Dienstes hinausgehen.
          </p>
          <p class="text-sm text-[var(--sys-fg-muted)] mt-3">
            Das soul.md-Format ist ein offenes Format (Apache 2.0). Nutzer können ihre Identitätsdaten jederzeit exportieren, migrieren oder in anderen kompatiblen Systemen verwenden.
          </p>
        </section>

        <section>
          <h2 class="text-xs uppercase tracking-[0.15em] font-semibold text-[var(--sys-fg-dim)] mb-3">5. Haftungsbeschränkung</h2>
          <p class="text-sm text-[var(--sys-fg-muted)]">
            Jede Haftung des Betreibers für Datenverlust, Systemausfälle, fehlerhafte KI-Ausgaben oder sonstige direkte oder indirekte Schäden ist im gesetzlich zulässigen Rahmen ausgeschlossen. Dies gilt insbesondere für Schäden, die durch den Verlust der 12 Wörter (BIP39-Mnemonic) oder des Passkeys entstehen — beide Schlüsselmittel werden serverseitig nicht gespeichert und können bei Verlust nicht wiederhergestellt werden. Unberührt bleibt die Haftung für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für Vorsatz und grobe Fahrlässigkeit.
          </p>
        </section>

        <section>
          <h2 class="text-xs uppercase tracking-[0.15em] font-semibold text-[var(--sys-fg-dim)] mb-3">6. Änderungen der Nutzungsbedingungen</h2>
          <p class="text-sm text-[var(--sys-fg-muted)]">Der Betreiber behält sich vor, diese Nutzungsbedingungen bei sachlichem Grund (z. B. geänderte gesetzliche Anforderungen oder technische Weiterentwicklung) anzupassen. Änderungen werden mindestens 30 Tage vor Inkrafttreten per E-Mail oder durch einen Hinweis in der App mitgeteilt. Erhebt der Nutzer innerhalb dieser Frist keinen Widerspruch und nutzt das Angebot danach weiter, gelten die geänderten Bedingungen als angenommen. Auf dieses Widerspruchsrecht wird in der Benachrichtigung ausdrücklich hingewiesen.</p>
        </section>

        <section>
          <h2 class="text-xs uppercase tracking-[0.15em] font-semibold text-[var(--sys-fg-dim)] mb-3">7. Anwendbares Recht</h2>
          <p class="text-sm text-[var(--sys-fg-muted)]">Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit gesetzlich zulässig, der Wohnsitz des Betreibers.</p>
        </section>

        <section>
          <h2 class="text-xs uppercase tracking-[0.15em] font-semibold text-[var(--sys-fg-dim)] mb-3">8. Drittanbieter-Lizenzen</h2>
          <div class="space-y-3 text-sm text-[var(--sys-fg-muted)]">
            <div>
              <p class="font-medium text-[var(--sys-fg)]">Inter, Noto Serif, Oxanium</p>
              <p>SIL Open Font License 1.1 · <a href="https://scripts.sil.org/OFL" target="_blank" rel="noopener noreferrer" class="text-[var(--sys-violet)] hover:underline underline-offset-2">scripts.sil.org/OFL</a></p>
              <p class="text-xs text-[var(--sys-fg-dim)] mt-0.5">Lokal eingebundene Schriftarten. Keine externe Verbindung.</p>
            </div>
            <div>
              <p class="font-medium text-[var(--sys-fg)]">Remix Icons</p>
              <p>Apache License 2.0 · <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener noreferrer" class="text-[var(--sys-violet)] hover:underline underline-offset-2">apache.org/licenses/LICENSE-2.0</a></p>
              <p class="text-xs text-[var(--sys-fg-dim)] mt-0.5">Lokal eingebundene Icon-Schriftart. Keine externe Verbindung.</p>
            </div>
            <div>
              <p class="font-medium text-[var(--sys-fg)]">Lucide Icons (lucide-vue-next)</p>
              <p>MIT License · © Lucide Contributors</p>
              <p class="text-xs text-[var(--sys-fg-dim)] mt-0.5">Icon-Komponenten-Bibliothek, im Bundle eingebunden.</p>
            </div>
            <div>
              <p class="font-medium text-[var(--sys-fg)]">Vue.js / Nuxt</p>
              <p>MIT License · © Evan You und Mitwirkende</p>
            </div>
            <div>
              <p class="font-medium text-[var(--sys-fg)]">Tailwind CSS</p>
              <p>MIT License · © Tailwind Labs Inc.</p>
            </div>
          </div>
        </section>

        <p class="text-xs text-[var(--sys-fg-dim)] pt-4 border-t border-[var(--sys-border)]">Stand: 03. April 2026</p>

      </div>
    </main>

  </div>
</template>

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
</style>

<script setup>
definePageMeta({ layout: false });

useSeoMeta({
  title: "Lizenz & Nutzungsbedingungen – SaveYourSoul",
  robots: "noindex",
});
</script>
