<template>
  <div class="legal-body space-y-8 text-[var(--sys-fg)] leading-relaxed max-w-prose">

    <!-- ── DEUTSCH ── -->
    <template v-if="lang === 'de'">

      <div>
        <h1 class="text-2xl font-bold mb-2">Impressum</h1>
        <p class="text-sm text-[var(--sys-fg-dim)]">Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)</p>
      </div>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Diensteanbieter</h2>
        <div class="text-base leading-relaxed space-y-0.5">
          <p class="font-medium text-[var(--sys-fg)]">UX-Projects – Jan-Oliver Karo</p>
          <p>Vertreten durch: Jan-Oliver Karo</p>
          <p>Wäldchesborn 57</p>
          <p>35043 Marburg</p>
          <p>Deutschland</p>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Kontakt</h2>
        <div class="text-base leading-relaxed space-y-1">
          <p>E-Mail: <a href="mailto:info@uxprojects-jok.com" class="text-[var(--sys-violet)] hover:underline underline-offset-2">info@uxprojects-jok.com</a></p>
          <p class="text-xs text-[var(--sys-fg-dim)] mt-1">Anfragen beantworte ich in der Regel innerhalb von 48 Stunden.</p>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Rechtsform</h2>
        <p class="text-base">Einzelunternehmen</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Umsatzsteuer</h2>
        <p class="text-base">Gemäß § 19 UStG (Kleinunternehmerregelung) erhebe ich keine Umsatzsteuer.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Domain</h2>
        <div class="text-base leading-relaxed space-y-0.5">
          <p><a href="https://sys.uxprojects-jok.com" target="_blank" rel="noopener noreferrer" class="text-[var(--sys-violet)] hover:underline underline-offset-2">https://sys.uxprojects-jok.com</a> <span class="text-[var(--sys-fg-dim)] text-sm">— SaveYourSoul Projektinfo-Seite</span></p>
          <p><a href="https://uxprojects-jok.com" target="_blank" rel="noopener noreferrer" class="text-[var(--sys-violet)] hover:underline underline-offset-2">https://uxprojects-jok.com</a> <span class="text-[var(--sys-fg-dim)] text-sm">— UX-Projects</span></p>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV</h2>
        <div class="text-base leading-relaxed space-y-0.5">
          <p>Jan-Oliver Karo</p>
          <p>Wäldchesborn 57</p>
          <p>35043 Marburg</p>
          <p>Deutschland</p>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Haftung für Inhalte</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">Als Diensteanbieter bin ich gemäß §§ 7–10 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8–10 DDG bin ich als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
        <p class="text-base text-[var(--sys-fg-muted)] mt-3">Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werde ich diese Inhalte umgehend entfernen.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Haftung für Links</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">Mein Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
        <p class="text-base text-[var(--sys-fg-muted)] mt-3">Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werde ich derartige Links umgehend entfernen.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Urheberrecht &amp; Lizenz</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">Die vollständige SaveYourSoul-Codebasis — einschließlich Frontend, Backend-Lua-Skripte, Installationsskripte und das sys.md-Format — wird unter der <strong class="text-[var(--sys-fg)]">Apache License 2.0</strong> als Open Source bereitgestellt. Der vollständige Lizenztext ist in der App unter „Lizenz &amp; Nutzungsbedingungen" einsehbar.</p>
        <p class="text-base text-[var(--sys-fg-muted)] mt-3"><strong class="text-[var(--sys-fg)]">Marken:</strong> „SaveYourSoul" und „SYS" sind Marken von Jan-Oliver Karo. Die Apache-2.0-Lizenz räumt keine Rechte zur Nutzung dieser Marken ein. Details: <a href="https://github.com/uxprojectsjok/personal-sys-vps/blob/main/NOTICE" target="_blank" rel="noopener noreferrer" class="text-[var(--sys-violet)] hover:underline underline-offset-2">NOTICE</a>.</p>
        <p class="text-base text-[var(--sys-fg-muted)] mt-3">Die Inhalte dieser Projektinfo-Seite (Texte, Design, Grafiken) unterliegen dem deutschen Urheberrecht. Die Vervielfältigung außerhalb der Open-Source-Lizenz bedarf meiner schriftlichen Zustimmung.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Hosting</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">Diese statische Projektinfo-Seite wird gehostet bei: <strong class="text-[var(--sys-fg)]">IONOS SE</strong>, Elgendorfer Str. 57, 56410 Montabaur, Deutschland. Rechenzentrum: Berlin, Deutschland.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Online-Streitbeilegung</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" class="text-[var(--sys-violet)] hover:underline underline-offset-2 break-all">ec.europa.eu/consumers/odr/</a>
        </p>
        <p class="text-base text-[var(--sys-fg-muted)] mt-3">Zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle bin ich gemäß § 36 VSBG nicht verpflichtet und nicht bereit.</p>
      </section>

      <p class="text-xs text-[var(--sys-fg-dim)] pt-4 border-t border-[var(--sys-border)]">Stand: 11. Mai 2026 · © 2026 Jan-Oliver Karo. Alle Rechte vorbehalten.</p>

    </template>

    <!-- ── ENGLISH ── -->
    <template v-else>

      <div>
        <h1 class="text-2xl font-bold mb-2">Legal Notice</h1>
        <p class="text-sm text-[var(--sys-fg-dim)]">Information pursuant to § 5 DDG (German Digital Services Act) — required by German law</p>
      </div>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Service provider</h2>
        <div class="text-base leading-relaxed space-y-0.5">
          <p class="font-medium text-[var(--sys-fg)]">UX-Projects – Jan-Oliver Karo</p>
          <p>Represented by: Jan-Oliver Karo</p>
          <p>Wäldchesborn 57</p>
          <p>35043 Marburg</p>
          <p>Germany</p>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Contact</h2>
        <div class="text-base leading-relaxed space-y-1">
          <p>Email: <a href="mailto:info@uxprojects-jok.com" class="text-[var(--sys-violet)] hover:underline underline-offset-2">info@uxprojects-jok.com</a></p>
          <p class="text-xs text-[var(--sys-fg-dim)] mt-1">I usually respond to enquiries within 48 hours.</p>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Legal form</h2>
        <p class="text-base">Sole trader (Einzelunternehmen)</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">VAT</h2>
        <p class="text-base">Pursuant to § 19 UStG (small business regulation) I do not charge VAT.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Domains</h2>
        <div class="text-base leading-relaxed space-y-0.5">
          <p><a href="https://sys.uxprojects-jok.com" target="_blank" rel="noopener noreferrer" class="text-[var(--sys-violet)] hover:underline underline-offset-2">https://sys.uxprojects-jok.com</a> <span class="text-[var(--sys-fg-dim)] text-sm">— SaveYourSoul project info site</span></p>
          <p><a href="https://uxprojects-jok.com" target="_blank" rel="noopener noreferrer" class="text-[var(--sys-violet)] hover:underline underline-offset-2">https://uxprojects-jok.com</a> <span class="text-[var(--sys-fg-dim)] text-sm">— UX-Projects</span></p>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Responsible for content pursuant to § 18(2) MStV</h2>
        <div class="text-base leading-relaxed space-y-0.5">
          <p>Jan-Oliver Karo</p>
          <p>Wäldchesborn 57</p>
          <p>35043 Marburg</p>
          <p>Germany</p>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Liability for content</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">As a service provider I am responsible for my own content on these pages in accordance with general law pursuant to §§ 7–10 DDG. However, pursuant to §§ 8–10 DDG, I am not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.</p>
        <p class="text-base text-[var(--sys-fg-muted)] mt-3">Obligations to remove or block the use of information under general law remain unaffected. Liability in this respect is only possible from the time of knowledge of a specific infringement. Upon becoming aware of such infringements, I will remove such content immediately.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Liability for links</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">My site contains links to external third-party websites over whose content I have no influence. I therefore cannot accept any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages.</p>
        <p class="text-base text-[var(--sys-fg-muted)] mt-3">The linked pages were checked for possible legal violations at the time of linking. Illegal content was not apparent at the time of linking. Permanent monitoring of the content of linked pages is not reasonable without specific indications of an infringement. Upon becoming aware of infringements, I will remove such links immediately.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Copyright &amp; License</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">The complete SaveYourSoul codebase — including frontend, backend Lua scripts, installation scripts and the sys.md format — is provided as open source under the <strong class="text-[var(--sys-fg)]">Apache License 2.0</strong>. The full license text is available in the app under "License &amp; Terms of Use".</p>
        <p class="text-base text-[var(--sys-fg-muted)] mt-3"><strong class="text-[var(--sys-fg)]">Trademarks:</strong> "SaveYourSoul" and "SYS" are trademarks of Jan-Oliver Karo. The Apache 2.0 license does not grant rights to use these trademarks. Details: <a href="https://github.com/uxprojectsjok/personal-sys-vps/blob/main/NOTICE" target="_blank" rel="noopener noreferrer" class="text-[var(--sys-violet)] hover:underline underline-offset-2">NOTICE</a>.</p>
        <p class="text-base text-[var(--sys-fg-muted)] mt-3">The content of this project info site (texts, design, graphics) is subject to German copyright law. Reproduction outside the open-source licence requires my written consent.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Hosting</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">This static project info site is hosted by: <strong class="text-[var(--sys-fg)]">IONOS SE</strong>, Elgendorfer Str. 57, 56410 Montabaur, Germany. Data centre: Berlin, Germany.</p>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-[var(--sys-fg)] mb-3">Online dispute resolution</h2>
        <p class="text-base text-[var(--sys-fg-muted)]">
          The European Commission provides a platform for online dispute resolution (ODR):
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" class="text-[var(--sys-violet)] hover:underline underline-offset-2 break-all">ec.europa.eu/consumers/odr/</a>
        </p>
        <p class="text-base text-[var(--sys-fg-muted)] mt-3">I am not obliged or willing to participate in dispute resolution proceedings before a consumer arbitration board pursuant to § 36 VSBG.</p>
      </section>

      <p class="text-xs text-[var(--sys-fg-dim)] pt-4 border-t border-[var(--sys-border)]">As of: May 11, 2026 · © 2026 Jan-Oliver Karo. All rights reserved.</p>

    </template>

  </div>
</template>

<script setup>
const { lang } = useLang()
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
</style>
