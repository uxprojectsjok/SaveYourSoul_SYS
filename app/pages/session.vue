<template>
  <ClientOnly>
    <!-- Video läuft immer in der Session (Soul ist hier immer verbunden) -->
    <VideoBackground />

    <div v-show="!certValidating" class="h-screen h-dvh flex flex-col overflow-hidden relative z-10">

      <!-- ── HEADER ───────────────────────────────────────────────────── -->
      <header class="flex-none grid grid-cols-[2.25rem_1fr_2.25rem] md:grid-cols-[2.25rem_1fr_auto] items-center gap-2 px-3 pb-4 pt-header border-b border-[var(--sys-border)] bg-transparent backdrop-blur-md">

        <!-- Zurück-Pfeil (links) -->
        <button
          @click="handleBack"
          class="sys-btn sys-btn-icon"
          aria-label="Zurück"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
          </svg>
        </button>

        <!-- Soul Status Pill (Mitte) -->
        <div class="flex justify-center overflow-hidden">
          <button
            class="inline-flex items-center gap-2 px-4 rounded-full border transition-all duration-500 min-w-0 min-h-[32px]"
            style="height: 32px; border-radius: 16px; font-size: 14px;"
            :class="isEnriching
              ? 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.15)]'
              : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.10)] hover:bg-[rgba(255,255,255,0.08)]'"
            @click="triggerEnrichment"
            :disabled="isEnriching || !hasMessages"
            :title="isEnriching ? 'Soul wird analysiert…' : 'Soul lesen & aktualisieren'"
          >
            <span
              class="w-1.5 h-1.5 rounded-full soul-pulse flex-none"
              :class="isEnriching ? 'bg-white/35' : 'bg-white/50 soul-pulse'"
            ></span>
            <span
              class="font-semibold tracking-[0.05em] max-w-[120px] truncate"
              style="font-size: 14px;"
              :class="isEnriching ? 'text-[var(--sys-fg-dim)]' : 'text-[var(--sys-fg-muted)]'"
            >{{ isEnriching ? 'LESEN…' : '#' + (soulMeta?.name || soulMeta?.id?.slice(0, 8) || '------') }}</span>
            <svg v-if="!isEnriching" class="w-3 h-3 text-white/40 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4 6h16M4 12h16M4 18h7"/>
            </svg>
          </button>
        </div>

        <!-- ── Rechte Spalte: Desktop alle Icons / Mobile Burger ── -->
        <div class="flex justify-end items-center gap-0.5">
        <!-- ── Desktop: Alle Icons sichtbar (md+) ── -->
        <div class="hidden md:flex items-center gap-0.5">

          <!-- Profil -->
          <button
            @click="liveProfileVisible = !liveProfileVisible"
            class="sys-btn sys-btn-icon transition-all"
            :class="liveProfileVisible ? 'text-white !bg-[rgba(255,255,255,0.12)]' : 'hover:!text-white hover:!bg-[rgba(255,255,255,0.08)]'"
            title="Profil · Stimme, Gesicht & Bewegung" aria-label="Profil"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
            </svg>
          </button>

          <!-- Vault -->
          <button
            v-if="vaultSupported"
            @click="handleVaultConnect"
            class="sys-btn sys-btn-icon transition-all"
            :class="vaultConnected ? 'text-white !bg-[rgba(255,255,255,0.10)]' : 'hover:!text-white hover:!bg-[rgba(255,255,255,0.08)]'"
            :title="vaultConnected ? `Vault neu laden (${allFiles.length} Datei${allFiles.length !== 1 ? 'en' : ''})` : 'Vault verbinden'"
            aria-label="Vault"
          >
            <svg class="w-4 h-4" :class="vaultScanning ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path v-if="vaultScanning" stroke-linecap="round" d="M12 3a9 9 0 1 0 9 9"/>
              <path v-else-if="vaultConnected" stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"/>
            </svg>
          </button>

          <!-- Server-Stand prüfen -->
          <button
            v-if="hasSoul"
            @click="handleCheckServer"
            class="sys-btn sys-btn-icon transition-all"
            :class="syncStatus === 'in_sync'
              ? 'text-emerald-400 !bg-[rgba(52,211,153,0.10)]'
              : 'hover:!text-white hover:!bg-[rgba(255,255,255,0.08)]'"
            :disabled="serverChecking"
            :title="syncStatus === 'in_sync' ? 'Gleicher Stand · nochmals prüfen' : 'Server-Stand prüfen · VPS mit lokalem Stand vergleichen'"
            aria-label="Server-Stand prüfen"
          >
            <!-- Spinner beim Laden -->
            <svg v-if="serverChecking" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" d="M12 3a9 9 0 1 0 9 9"/>
            </svg>
            <!-- Checkmark bei in_sync -->
            <svg v-else-if="syncStatus === 'in_sync'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <!-- Download-Pfeil im Normalzustand -->
            <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
            </svg>
          </button>

          <!-- Polygon -->
          <button
            @click="anchorModalOpen = true"
            class="sys-btn sys-btn-icon transition-all"
            :class="anchorModalOpen ? 'text-white !bg-[rgba(255,255,255,0.12)]' : 'hover:!text-white hover:!bg-[rgba(255,255,255,0.08)]'"
            title="Polygon · Soul verankern" aria-label="Polygon"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2.25 21 7.5v9L12 21.75 3 16.5v-9L12 2.25z"/>
            </svg>
          </button>

          <div class="w-px h-5 bg-white/[0.1] mx-0.5"></div>

          <!-- Rolle wechseln — nutzt immer Chat-Bubble (Soul) vs. Sparkle (Session) -->
          <button
            @click="aiRole = aiRole === 'soul' ? 'session' : 'soul'"
            class="sys-btn sys-btn-icon transition-all"
            :class="aiRole === 'soul' ? 'text-white !bg-[rgba(255,255,255,0.12)]' : 'hover:!text-white hover:!bg-[rgba(255,255,255,0.08)]'"
            :title="aiRole === 'soul' ? 'Soul-Modus · klicken für Session' : 'Session-Modus · klicken für Soul'"
            aria-label="Modus wechseln"
          >
            <!-- Soul-Modus: Seele/Herz-Icon -->
            <svg v-if="aiRole === 'soul'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/>
            </svg>
            <!-- Session-Modus: Chat-Bubble-Icon -->
            <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>
            </svg>
          </button>
        </div>

        <!-- ── Mobile: Burger-Button (< md) ── -->
        <button
          @click="headerMenuOpen = !headerMenuOpen"
          class="md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all text-[var(--sys-fg-dim)] hover:text-[var(--sys-fg)] hover:bg-white/[0.08]"
          :class="headerMenuOpen ? 'text-[var(--sys-fg)] bg-white/[0.08]' : ''"
          aria-label="Menü"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="!headerMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>

        </div><!-- /rechte Spalte -->

      </header>

      <!-- ── Mobile Dropdown-Menü ──────────────────────────────────────── -->
      <Transition name="slide-up">
        <div
          v-if="headerMenuOpen"
          class="md:hidden flex-none flex items-center gap-0.5 px-2 py-1.5 border-b border-[var(--sys-border)] bg-transparent backdrop-blur-md"
          style="-webkit-overflow-scrolling: touch"
        >
          <!-- Profil -->
          <button
            @click="liveProfileVisible = !liveProfileVisible; headerMenuOpen = false"
            class="flex-none flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
            :class="liveProfileVisible ? 'text-white bg-[rgba(255,255,255,0.10)]' : 'text-[var(--sys-fg-dim)] hover:text-white hover:bg-[rgba(255,255,255,0.07)]'"
          >
            <svg class="w-4 h-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
            </svg>
            <span class="sr-only">Profil</span>
          </button>

          <!-- Vault -->
          <button
            v-if="vaultSupported"
            @click="handleVaultConnect(); headerMenuOpen = false"
            class="flex-none flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
            :class="vaultConnected ? 'text-white bg-[rgba(255,255,255,0.10)]' : 'text-[var(--sys-fg-dim)] hover:text-white hover:bg-[rgba(255,255,255,0.07)]'"
          >
            <svg class="w-4 h-4 flex-none" :class="vaultScanning ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path v-if="vaultScanning" stroke-linecap="round" d="M12 3a9 9 0 1 0 9 9"/>
              <path v-else-if="vaultConnected" stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"/>
            </svg>
            <span class="sr-only">Vault</span>
          </button>

          <!-- Server-Stand prüfen (Mobile) -->
          <button
            v-if="hasSoul"
            @click="handleCheckServer(); headerMenuOpen = false"
            :disabled="serverChecking"
            class="flex-none flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-[var(--sys-fg-dim)] hover:text-white hover:bg-[rgba(255,255,255,0.07)]"
            aria-label="Server-Stand prüfen"
          >
            <svg class="w-4 h-4 flex-none" :class="serverChecking ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
            </svg>
            <span class="text-xs">Server-Stand prüfen</span>
          </button>

          <!-- Polygon -->
          <button
            @click="anchorModalOpen = true; headerMenuOpen = false"
            class="flex-none flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-[var(--sys-fg-dim)] hover:text-white hover:bg-[rgba(255,255,255,0.07)]"
          >
            <svg class="w-4 h-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2.25 21 7.5v9L12 21.75 3 16.5v-9L12 2.25z"/>
            </svg>
            <span class="sr-only">Polygon</span>
          </button>

          <!-- Rolle -->
          <button
            @click="aiRole = aiRole === 'soul' ? 'session' : 'soul'; headerMenuOpen = false"
            class="flex-none flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
            :class="aiRole === 'soul' ? 'text-white bg-[rgba(255,255,255,0.10)]' : 'text-[var(--sys-fg-dim)] hover:text-white hover:bg-[rgba(255,255,255,0.07)]'"
            :title="aiRole === 'soul' ? 'Soul-Modus · klicken für Session' : 'Session-Modus · klicken für Soul'"
            aria-label="Modus wechseln"
          >
            <!-- Soul-Modus: Sparkle/Stern (wie Desktop) -->
            <svg v-if="aiRole === 'soul'" class="w-4 h-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/>
            </svg>
            <!-- Session-Modus: Chat-Bubble -->
            <svg v-else class="w-4 h-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>
            </svg>
            <span class="sr-only">{{ aiRole === 'soul' ? 'Seele' : 'Session' }}</span>
          </button>
        </div>
      </Transition>

      <!-- ── LIVE PROFILE (Stimme / Gesicht / Bewegung) ──────────────── -->
      <Transition name="slide-up">
        <LiveProfile
          v-if="liveProfileVisible"
          :soul-meta="soulMeta"
          @voice-saved="handleVoiceSaved"
          @motion-saved="handleMotionSaved"
          @close="liveProfileVisible = false"
        />
      </Transition>

      <!-- ── SOUL-UPDATE BANNER ─────────────────────────────────────── -->
      <Transition name="slide-up">
        <div
          v-if="enrichStatus"
          class="flex-none px-4 py-2 border-b text-xs flex items-center gap-2"
          :class="enrichStatus.type === 'loading'
            ? 'border-[rgba(255,255,255,0.08)] text-white/50'
            : enrichStatus.type === 'success'
              ? 'border-[rgba(255,255,255,0.10)] text-white/70'
              : 'border-red-900/20 text-red-400'"
        >
          <svg v-if="enrichStatus.type === 'loading'" class="w-3 h-3 animate-spin flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" d="M12 3a9 9 0 1 0 9 9"/>
          </svg>
          <svg v-else-if="enrichStatus.type === 'success'" class="w-3 h-3 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
          </svg>
          <svg v-else class="w-3 h-3 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/>
          </svg>
          <span>{{ enrichStatus.message }}</span>
          <button
            v-if="enrichStatus.type !== 'loading'"
            @click="enrichStatus = null"
            class="ml-auto text-current opacity-40 hover:opacity-100"
          >✕</button>
        </div>
      </Transition>

      <!-- ── VAULT-RELOAD BANNER ───────────────────────────────────────── -->
      <Transition name="slide-up">
        <div
          v-if="vaultStatus"
          class="flex-none px-4 py-2 border-b border-[rgba(255,255,255,0.08)] text-xs flex items-center gap-2 text-white/50"
        >
          <svg class="w-3 h-3 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
          </svg>
          <span>Vault neu geladen · Soul aktiv</span>
        </div>
      </Transition>

      <!-- ── CHAT ──────────────────────────────────────────────────────── -->
      <main id="main-content" class="flex-1 overflow-hidden flex flex-col">

        <!-- Onboarding-Banner (einmalig, bis dismissed) -->
        <Transition name="banner-slide">
          <div
            v-if="showOnboarding"
            class="flex-none w-full max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto px-3 pt-3"
          >
            <div class="rounded-2xl border border-[var(--sys-border)] bg-[var(--sys-bg-elevated)] p-4 flex flex-col sm:flex-row gap-4 items-start">
              <!-- Steps -->
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold tracking-widest uppercase mb-3" style="color: var(--sys-violet)">Schnellstart · 3 Schritte</p>
                <div class="flex flex-col sm:flex-row gap-3 sm:gap-6">
                  <!-- Step 1 done -->
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center flex-none" style="background: rgba(45,212,191,0.15); border: 1px solid rgba(45,212,191,0.3)">
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:#2dd4bf">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
                      </svg>
                    </div>
                    <span class="text-xs text-[var(--sys-fg-muted)]">Soul eingeloggt</span>
                  </div>
                  <!-- Step 2 -->
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center flex-none text-xs font-bold" style="background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.3); color: var(--sys-violet)">2</div>
                    <div>
                      <span class="text-xs text-[var(--sys-fg)]">MCP verbinden:</span>
                      <code class="ml-1 text-xs font-mono" style="color: rgba(255,255,255,0.4)">&lt;dein-server&gt;/mcp</code>
                    </div>
                  </div>
                  <!-- Step 3 -->
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center flex-none text-xs font-bold" style="background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.3); color: var(--sys-violet)">3</div>
                    <span class="text-xs text-[var(--sys-fg)]">Im KI-Client <code class="font-mono text-xs" style="color: rgba(255,255,255,0.4)">/soul_guide</code> aufrufen</span>
                  </div>
                </div>
              </div>
              <!-- Dismiss -->
              <button
                @click="dismissOnboarding"
                class="flex-none self-start sm:self-center w-8 h-8 flex items-center justify-center rounded-lg text-[var(--sys-fg-dim)] hover:text-[var(--sys-fg)] hover:bg-[var(--sys-bg-surface)] transition-all"
                aria-label="Schließen"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </Transition>

        <div class="flex-1 overflow-hidden w-full max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto">
          <ChatInterface
            ref="chatRef"
            :soul-content="soulContent"
            :soul-cert="soulToken"
            :role="aiRole"
            @cert-error="handleCertError"
          />
        </div>
      </main>

    </div>

    <!-- Cert-Fehler-Modal -->
    <Modal
      :open="certErrorVisible"
      title="Zertifikat ungültig"
      confirm-text="Seite neu laden"
      :hide-cancel="true"
      @confirm="reloadPage"
    >
      Das Soul-Zertifikat konnte nicht validiert werden. Die Seite wird neu geladen – danach wird automatisch ein frisches Zertifikat ausgestellt.
    </Modal>

    <!-- Soul Anchor Modal -->
    <SoulAnchorModal
      :is-open="anchorModalOpen"
      @close="anchorModalOpen = false"
    />

    <!-- Soul Sync Modal -->
    <SoulSyncModal />
    <ConfirmModal />

    <!-- Fallback -->
    <template #fallback>
      <div class="h-screen h-dvh flex items-center justify-center">
        <span class="text-xs font-mono tracking-[0.22em] text-[var(--sys-fg-dim)] uppercase animate-pulse">SYS</span>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useColorScheme } from "~/composables/useColorScheme.js";
import { useSoul } from "~/composables/useSoul.js";
import { useSession } from "~/composables/useSession.js";
import { useVault } from "~/composables/useVault.js";
import { useChainAnchor } from "~/composables/useChainAnchor.js";
import { useCamera } from "~/composables/useCamera.js";
import { updateSection, parseSoul, updateFrontmatterField, validateSoul } from "#shared/utils/soulParser.js";
import ChatInterface from "~/components/ChatInterface.vue";
import LiveProfile from "~/components/LiveProfile.vue";
import VideoBackground from "~/components/VideoBackground.vue";
import Modal from "~/components/ui/Modal.vue";
import SoulAnchorModal from "~/components/SoulAnchorModal.vue";
import SoulSyncModal   from "~/components/SoulSyncModal.vue";
import ConfirmModal    from "~/components/ConfirmModal.vue";

const router = useRouter();
const { soulContent, soulToken, hasSoul, soulMeta, load, save, enrichFromSession, updateVaultInSoul, importFromText, clear, refreshCert, fetchFromServer, syncStatus } = useSoul();
const { messages, toApiMessages, clearSession } = useSession();
const { appendGrowthEntry } = useChainAnchor();
const { requestPermissions: requestCameraPermissions } = useCamera();
const {
  isSupported: vaultSupported,
  isConnected: vaultConnected,
  contextFiles,
  allFiles,
  fileManifest,
  connectVault,
  restoreVault,
  writeSoulMd,
  loadProfileLocal,
  scanVault
} = useVault();

const { isDark } = useColorScheme();

const certValidating      = ref(true);  // true während der Soul-Cert-Vorprüfung beim Laden
const vaultScanning       = ref(false);
const vaultStatus         = ref(null);
const liveProfileVisible  = ref(false);
const serverChecking      = ref(false);
const headerMenuOpen      = ref(false);
const anchorModalOpen     = ref(false);
const isEnriching        = ref(false);
const enrichStatus     = ref(null);
const certErrorVisible = ref(false);
const aiRole           = ref("session"); // "soul" | "session"

const chatRef       = ref(null);

const hasMessages = computed(() =>
  messages.value.filter(m => m.role === "user").length > 0
);

// ── Onboarding-Banner ─────────────────────────────────────────────────────
const ONBOARDING_KEY = 'sys_onboarding_done';
const showOnboarding = ref(false);

function dismissOnboarding() {
  showOnboarding.value = false;
  localStorage.setItem(ONBOARDING_KEY, '1');
}

onMounted(async () => {
  if (!localStorage.getItem(ONBOARDING_KEY)) {
    showOnboarding.value = true;
  }
  clearSession();
  load();
  if (!hasSoul.value) {
    certValidating.value = false;
    router.replace("/");
    return;
  }

  // ── Server-Sync (non-blocking) ─────────────────────────────────────────
  fetchFromServer().catch(() => {});

  // ── Kamera & Mikrofon vorab anfragen (damit Aufnahme sofort starten kann) ──
  // Nicht-blockierend – Ablehnung ist OK, Kamera-Funktion zeigt dann Fehler
  requestCameraPermissions().catch(() => {});

  // ── Vault zuerst wiederherstellen ─────────────────────────────────────
  // syncVaultSoul() kann soulContent mit einer älteren Vault-Soul überschreiben
  // (inkl. altem Cert) → muss VOR refreshCert() laufen.
  if (soulMeta.value?.id) {
    const restored = await restoreVault(soulMeta.value.id);
    if (restored) {
      syncVaultSoul();
      updateVaultInSoul(fileManifest.value);
    } else {
      loadProfileLocal(soulMeta.value?.id);
    }
  }

  // ── Cert-Vorvalidierung ────────────────────────────────────────────────
  // NACH dem Vault-Restore: Cert immer vom Server holen – überschreibt jeden
  // veralteten Cert aus sessionStorage oder Vault-soul.md.
  await refreshCert();

  try {
    const res = await fetch("/api/validate", {
      headers: { Authorization: `Bearer ${soulToken.value}` }
    });
    if (res.status === 401) {
      // Cert ungültig auch nach Refresh → echte Fake-Soul
      clear();
      router.replace("/");
      return;
    }
  } catch {
    // Netzwerkfehler oder Endpunkt nicht verfügbar (z.B. Static-Build ohne OpenResty).
    // Stille Weiterleitung – /api/chat bleibt als letzte Verteidigungslinie.
  } finally {
    certValidating.value = false;
  }
});


// ── Vault-Soul-Sync ───────────────────────────────────────────────────────────
// Importiert die Vault soul.md wenn sie neuer ist als die sessionStorage-Soul.
// Richtung: Vault → sessionStorage (beim Laden).

function syncVaultSoul() {
  const vaultSoulFile = contextFiles.value.find(f =>
    f.name.toLowerCase().endsWith(".md") && validateSoul(f.text).valid
  );
  if (!vaultSoulFile) return;

  const vaultDate = vaultSoulFile.text.match(/last_session:\s*(.+)/)?.[1]?.trim() ?? "";
  const localDate = soulMeta.value?.lastSession ?? "";

  // Strukturprüfung: Frontmatter-Block darf genau einmal vorkommen (---...---)
  // Doppelter Inhalt (duplizierende Sync-Race) wird so nicht importiert.
  const fenceCount = (vaultSoulFile.text.match(/^---$/gm) || []).length;
  if (fenceCount !== 2) return;

  // Nur importieren wenn Vault-Soul eindeutig neuer ist
  if (vaultDate > localDate) {
    importFromText(vaultSoulFile.text);
  }
}

// Importiert soul.md aus Vault ohne Datums-Check (für manuellen Reload).
function forceReloadVaultSoul() {
  const vaultSoulFile = contextFiles.value.find(f =>
    f.name.toLowerCase().endsWith(".md") && validateSoul(f.text).valid
  );
  if (!vaultSoulFile) return false;
  importFromText(vaultSoulFile.text);
  return true;
}

// ── Vault ────────────────────────────────────────────────────────────────────

async function handleVaultConnect() {
  if (!soulMeta.value?.id) return;

  if (vaultConnected.value) {
    // Bereits verbunden → Vault neu scannen + soul.md erzwungen laden
    vaultScanning.value = true;
    await scanVault();
    forceReloadVaultSoul();
    updateVaultInSoul(fileManifest.value);
    // Cert immer nach Vault-Import auffrischen – Vault-soul.md hat ggf. alten Cert
    await refreshCert();
    vaultScanning.value = false;
    vaultStatus.value = { ok: true };
    setTimeout(() => { vaultStatus.value = null; }, 3000);
    return;
  }

  const connected = await connectVault(soulMeta.value.id);
  if (connected) {
    syncVaultSoul(); // Beim ersten Connect: Datums-Check ist OK
    updateVaultInSoul(fileManifest.value);
    // Cert immer nach Vault-Import auffrischen – Vault-soul.md hat ggf. alten Cert
    await refreshCert();
  }
}

// ── Server-Pull ──────────────────────────────────────────────────────────────

async function handleCheckServer() {
  if (serverChecking.value) return;
  serverChecking.value = true;
  await fetchFromServer().catch(() => {});
  serverChecking.value = false;
}

// ── Voice ────────────────────────────────────────────────────────────────────

// Wird aufgerufen wenn VoiceRecorder eine Stimmprobe im Vault gespeichert hat.
// Schreibt den Verweis auf voice_profile.json in das soul.md Frontmatter.
async function handleVoiceSaved(filename) {
  if (!soulContent.value) return;
  soulContent.value = updateFrontmatterField(
    soulContent.value,
    "voice_profile",
    "voice_samples/voice_profile.json"
  );
  save();
  if (vaultConnected.value) await writeSoulMd(soulContent.value, "soul");
}

// Wird aufgerufen wenn MotionRecorder ein Bewegungsmuster im Vault gespeichert hat.
// Schreibt den Verweis auf motion_profile.json in das soul.md Frontmatter.
async function handleMotionSaved(filename) {
  if (!soulContent.value) return;
  soulContent.value = updateFrontmatterField(
    soulContent.value,
    "motion_profile",
    "motion_samples/motion_profile.json"
  );
  save();
  if (vaultConnected.value) await writeSoulMd(soulContent.value, "soul");
}

// ── Soul-Anreicherung ────────────────────────────────────────────────────────

async function triggerEnrichment() {
  if (isEnriching.value || !hasMessages.value) return;

  isEnriching.value = true;
  enrichStatus.value = { type: "loading", message: "Soul wird analysiert…" };

  try {
    const result = await enrichFromSession(toApiMessages(50));

    if (!result) {
      enrichStatus.value = { type: "error", message: "Verbindung fehlgeschlagen." };
      return;
    }

    if (!result.changed) {
      enrichStatus.value = { type: "success", message: "Nichts Soul-Würdiges gefunden." };
    } else {
      const n = result.sectionsUpdated.length;
      enrichStatus.value = {
        type: "success",
        message: n > 0 ? `${n} Sektion${n > 1 ? "en" : ""} aktualisiert` : "Session-Log eingetragen"
      };

      // Wachstumseintrag automatisch nach Enrichment (HMAC-signiert)
      appendGrowthEntry();

      // Richtung: sessionStorage → Vault (nach jedem Enrichment)
      if (vaultConnected.value) {
        await writeSoulMd(soulContent.value, "soul");
      }
    }

    setTimeout(() => { enrichStatus.value = null; }, 4000);
  } catch {
    enrichStatus.value = { type: "error", message: "Fehler beim Soul-Update." };
  } finally {
    isEnriching.value = false;
  }
}

// ── Cert-Fehler ───────────────────────────────────────────────────────────────
// Fallback falls /api/chat trotzdem 401 liefert (z.B. Cert abgelaufen in langer Session).
// onMounted ruft refreshCert() immer proaktiv auf – dieser Handler ist reiner Fallback.

async function handleCertError() {
  await refreshCert();
  certErrorVisible.value = true;
}

function reloadPage() {
  window.location.reload();
}

// ── Navigation ────────────────────────────────────────────────────────────────

function handleBack() {
  router.push("/");
}
</script>

<style scoped>
.banner-slide-enter-active,
.banner-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease, max-height 0.3s ease;
  overflow: hidden;
  max-height: 200px;
}
.banner-slide-enter-from,
.banner-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
  max-height: 0;
}
</style>
