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
      <h1 class="text-sm font-medium text-[var(--sys-fg)] tracking-wide">Datenschutzerklärung</h1>
    </header>

    <!-- Content -->
    <main id="main-content" class="max-w-2xl mx-auto px-5 py-8 pb-16">
      <LegalDatenschutzContent />
    </main>

  </div>
</template>

<script setup>
definePageMeta({ layout: false });

useSeoMeta({
  title: "Datenschutzerklärung – SaveYourSoul",
  robots: "noindex",
});
</script>
