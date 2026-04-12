<template>
  <ClientOnly>
    <!-- ══════════════════════════════════════════════
         SOUL AKTIV – App-Dashboard
         ══════════════════════════════════════════════ -->
    <template v-if="hasSoul">
      <Transition name="fade">
        <VideoBackground />
      </Transition>

      <div class="min-h-screen min-h-dvh flex flex-col relative z-10 app-ui-font">

        <!-- ── HEADER ── -->
        <header class="flex-none flex items-center justify-between px-5 pb-4 pt-header border-b border-[var(--sys-border)] bg-transparent backdrop-blur-xl">
          <div class="flex items-center gap-3">
            <img src="/logo.png" alt="SYS" class="h-10 w-auto flex-none" />
          </div>
          <div class="flex items-center gap-3">
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)]">
              <span class="w-1.5 h-1.5 rounded-full soul-pulse flex-none bg-white/50"></span>
              <span class="font-mono text-xs font-bold tracking-[0.06em] text-white/65 max-w-[110px] truncate">#{{ soulMeta?.name || "------" }}</span>
            </div>
            <button
              @click="confirmReset"
              aria-label="Ausloggen"
              class="flex items-center justify-center rounded-lg border border-[rgba(255,255,255,0.10)] text-[var(--sys-fg-dim)] hover:border-[rgba(239,68,68,0.3)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.05)] active:scale-[0.98] transition-all min-h-[44px] min-w-[44px] md:min-h-[32px] md:min-w-0 md:h-8 md:px-3"
            >
              <!-- Mobile: Icon -->
              <svg class="w-4 h-4 md:hidden" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"/>
              </svg>
              <!-- Desktop: Text -->
              <span class="hidden md:inline text-xs">Ausloggen</span>
            </button>
          </div>
        </header>

        <!-- ── MAIN ── -->
        <main id="main-content" class="flex-1 overflow-y-auto py-8 px-5">
          <div class="max-w-4xl mx-auto">

            <!-- ── Dashboard ── -->
            <div>

            <!-- ── Dashboard (links, volle Höhe) ── -->
            <div>

            <!-- ── PROFILE ── -->
            <div class="flex items-center gap-5 mb-8">
              <label class="cursor-pointer relative group flex-none" title="Profilbild ändern">
                <div
                  class="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] flex-none"
                  :style="vaultConnected
                    ? 'background: linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06))'
                    : 'background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))'"
                >
                  <div class="w-full h-full rounded-full overflow-hidden flex items-center justify-center" style="background-color: #0a0a0a;">
                    <img v-if="hasProfile" :src="profileUrl" class="w-full h-full object-cover" alt="Profilbild" />
                    <svg v-else class="w-8 h-8 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                    </svg>
                  </div>
                </div>
                <div class="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                  <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"/>
                  </svg>
                </div>
                <input type="file" accept="image/*" class="hidden" @change="handleProfileUpload" />
              </label>

              <div class="flex-1 min-w-0">
                <h1 class="text-2xl sm:text-3xl font-black leading-none uppercase tracking-tight text-[var(--sys-fg)] mb-2 truncate">
                  {{ soulMeta?.name || "Seele aktiv" }}
                </h1>
                <span
                  class="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg select-all border border-[var(--sys-border)] bg-[rgba(255,255,255,0.03)] text-[var(--sys-fg-dim)]"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-[var(--sys-fg-dim)] opacity-50 flex-none"></span>
                  {{ soulMeta?.id?.slice(0, 8) }}…{{ soulMeta?.id?.slice(-4) }}
                </span>
              </div>
            </div>

            <!-- ── PRIMARY CTA ── -->
            <button
              @click="goToSession"
              class="sys-cta-primary cta-sweep w-full h-14 flex items-center justify-between px-5 rounded-xl transition-all duration-200 group mb-6"
            >
              <span class="text-sm font-bold" style="color: #fff">Session starten</span>
              <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" style="color: rgba(255,255,255,0.75)" :size="16" />
            </button>

            <div class="h-px bg-[var(--sys-border)] mb-6"></div>

            <!-- ── SOUL STATS ── -->
            <div class="space-y-4 mb-6">

              <div v-if="vaultConnected && soulVaultFile" class="flex items-center justify-between min-h-[36px]">
                <span class="text-sm text-white/80">Soul</span>
                <span class="flex items-center gap-1.5 text-sm text-white/70 truncate max-w-[200px]">
                  <svg class="w-3 h-3 flex-none opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                  </svg>
                  {{ soulVaultFile }}
                </span>
              </div>

              <div v-if="soulMeta?.created" class="flex items-center justify-between min-h-[36px]">
                <span class="text-sm text-white/80">Erstellt</span>
                <span class="text-sm text-white/70">{{ soulMeta.created }}</span>
              </div>

              <div v-if="soulMeta?.lastSession" class="flex items-center justify-between min-h-[36px]">
                <span class="text-sm text-white/80">Letzte Session</span>
                <span class="text-sm text-white/70">{{ soulMeta.lastSession }}</span>
              </div>

              <div v-if="soulCert" class="flex items-center justify-between min-h-[36px]">
                <span class="text-sm text-white/80">Cert <span class="text-white/40">v{{ certVersion }}</span></span>
                <span class="font-mono text-xs text-white/50 select-all tracking-wide">{{ soulCert.slice(0, 8) }}…{{ soulCert.slice(-5) }}</span>
              </div>

              <div v-if="sessionCount > 0 || hasAnchor" class="flex items-center justify-between min-h-[36px]">
                <span class="text-sm text-white/80">Chain</span>
                <div class="flex items-center gap-2 text-sm text-white/70">
                  <span class="tabular-nums">{{ sessionCount }}</span>
                  <span>{{ sessionCount === 1 ? 'Session' : 'Sessions' }}</span>
                  <span v-if="hasAnchor" class="flex items-center gap-1 ml-1">
                    <svg class="w-3 h-3 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 2.25 21 7.5v9L12 21.75 3 16.5v-9L12 2.25z"/>
                    </svg>
                    POL
                  </span>
                </div>
              </div>

              <!-- Vault-Zeile -->
              <div class="flex items-center justify-between min-h-[36px]">
                <span class="text-sm text-white/80">Vault</span>

                <!-- Lokal verbunden -->
                <span v-if="vaultConnected" class="flex items-center gap-2 text-sm text-white/70">
                  <span class="w-2 h-2 rounded-full flex-none vault-conn-pulse" style="background:#a78bfa"></span>
                  Lokal
                  <button
                    @click="clearVault()"
                    class="text-xs text-red-400/70 hover:text-red-400 transition-colors leading-none"
                    title="Vault trennen"
                  >✕</button>
                </span>

                <!-- Nichts verbunden -->
                <span v-else class="flex items-center gap-2 text-sm text-white/50">
                  <span class="w-2 h-2 rounded-full flex-none bg-red-500/40"></span>
                  nicht verbunden
                </span>
              </div>

              <!-- Soul einrichten -->
              <button
                @click="setupModalOpen = true"
                class="w-full flex items-center justify-between h-12 px-4 rounded-xl border border-[var(--sys-border)] text-sm text-[var(--sys-fg-muted)] hover:text-[var(--sys-fg)] hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.03)] active:scale-[0.99] transition-all"
              >
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-none" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12)">
                    <svg class="w-3.5 h-3.5 text-white/55" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    </svg>
                  </div>
                  <span>Soul einrichten</span>
                </div>
                <svg class="w-4 h-4 flex-none text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                </svg>
              </button>

              <!-- Dateien verwalten -->
              <button
                @click="filesOpen = true"
                class="w-full flex items-center justify-between h-12 px-4 rounded-xl border border-[var(--sys-border)] text-sm text-[var(--sys-fg-muted)] hover:text-[var(--sys-fg)] hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.03)] active:scale-[0.99] transition-all"
              >
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-none" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12)">
                    <svg class="w-3.5 h-3.5 text-white/55" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"/>
                    </svg>
                  </div>
                  <span>Dateien</span>
                </div>
                <svg class="w-4 h-4 flex-none text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                </svg>
              </button>

              <!-- Soul exportieren -->
              <button
                @click="exportAsBlob()"
                :disabled="!hasSoul"
                class="w-full flex items-center justify-between h-12 px-4 rounded-xl border border-[var(--sys-border)] text-sm text-[var(--sys-fg-muted)] hover:text-[var(--sys-fg)] hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.03)] active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-none" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12)">
                    <svg class="w-3.5 h-3.5 text-white/55" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                    </svg>
                  </div>
                  <span>Soul exportieren</span>
                </div>
                <svg class="w-4 h-4 flex-none text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                </svg>
              </button>

            </div>

            </div><!-- end dashboard col -->

            </div><!-- end grid -->

          </div>
        </main>

        <!-- ── FOOTER ── -->
        <footer class="flex-none px-6 pb-safe pb-6">
          <div class="pt-5 border-t border-[var(--sys-border)]">
            <nav class="flex flex-wrap justify-center items-baseline gap-x-5 gap-y-1">
              <button
                v-for="link in legalLinks"
                :key="link.key"
                @click="activeModal = link.key"
                class="sys-link text-xs tracking-[0.08em] text-white/72 hover:text-white/85 transition-colors"
              >{{ link.label }}</button>
              <NuxtLink to="/api-docs" class="inline-flex items-center sys-link text-xs tracking-[0.08em] text-white/72 hover:text-white/85 transition-colors">API Docs</NuxtLink>
              <NuxtLink to="/dev-docs" class="inline-flex items-center sys-link text-xs tracking-[0.08em] text-white/72 hover:text-white/85 transition-colors">Dev Docs</NuxtLink>
            </nav>
            <p class="text-xs font-mono text-[var(--sys-fg-dim)] mt-2 text-center opacity-40">© 2026 UX-Projects Jan-Oliver Karo</p>
            <p class="text-xs text-[var(--sys-fg-dim)] mt-1 text-center opacity-30">WCAG 2.1 AA orientiert</p>
          </div>
        </footer>

      </div>

      <!-- ── SOUL EINRICHTEN MODAL ── -->
      <Teleport to="body">
        <Transition name="modal-pop">
          <div
            v-if="setupModalOpen"
            class="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="setupModalOpen = false"></div>
            <div class="relative bg-[var(--sys-bg-elevated)] border border-[var(--sys-border)] rounded-2xl z-10 w-full max-w-lg max-h-[92dvh] overflow-y-auto shadow-2xl">
              <div class="flex items-center justify-between px-5 py-4 border-b border-[var(--sys-border)]">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-none" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12)">
                    <svg class="w-3.5 h-3.5 text-white/55" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-[var(--sys-fg)]">Soul einrichten</span>
                </div>
                <button
                  @click="setupModalOpen = false"
                  class="sys-btn sys-btn-icon flex-none"
                  aria-label="Schließen"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <SoulSetupWizard
                :soul-cert="soulToken"
                :soul-content="soulContent"
                :soul-id="soulMeta?.id ?? ''"
                :modal="true"
                @unlocked="onVaultUnlocked"
                @encrypt="encryptModalOpen = true; setupModalOpen = false"
                @decrypt="decryptModalOpen = true; setupModalOpen = false"
                @close="setupModalOpen = false"
              />
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- ── DATEIEN MODAL ── -->
      <Teleport to="body">
        <Transition name="modal-pop">
          <div
            v-if="filesOpen"
            class="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="filesOpen = false"></div>
            <div class="relative bg-[var(--sys-bg-elevated)] border border-[var(--sys-border)] rounded-2xl z-10 w-full max-w-lg max-h-[92dvh] overflow-y-auto shadow-2xl">
              <div class="flex items-center justify-between px-5 py-4 border-b border-[var(--sys-border)]">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-none" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12)">
                    <svg class="w-3.5 h-3.5 text-white/55" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"/>
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-[var(--sys-fg)]">Dateien</span>
                </div>
                <button
                  @click="filesOpen = false"
                  class="sys-btn sys-btn-icon flex-none"
                  aria-label="Schließen"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div class="p-4">
                <VaultExplorer :soul-cert="soulToken" :soul-content="soulContent" @encrypt="encryptModalOpen = true; filesOpen = false" />
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

    </template>

    <!-- ══════════════════════════════════════════════
         KEIN SOUL – Landing Page (Presale-Style)
         ══════════════════════════════════════════════ -->
    <div v-else class="relative overflow-x-hidden">
      <VideoBackground />

      <!-- ── STICKY NAV ──────────────────────────────── -->
      <nav
        class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[var(--sys-border)] bg-transparent backdrop-blur-xl"
      >
        <div class="flex items-center gap-3">
          <img src="/logo.png" alt="SYS" class="h-8 w-auto flex-none" />
        </div>
        <!-- Dev Notice -->
        <p class="absolute left-1/2 -translate-x-1/2 text-xs text-white/80 font-medium tracking-wide leading-[1.7] text-center pointer-events-none select-none hidden sm:block max-w-[420px]">
          Invite-only — SaveYourSoul läuft unter Realbedingungen.<br>Zugang nur auf Einladung.
        </p>
        <!-- Nav-Dropdown -->
        <div class="flex items-center gap-2">
          <div class="relative">
          <button
            @click="loginSheetOpen = true; loginError = ''"
            class="sys-cta-primary h-9 px-4 rounded-lg text-xs flex items-center gap-1.5"
          >
            Login
          </button>

          <!-- Dropdown-Panel -->
          <Transition name="dropdown">
            <div
              v-if="navMenuOpen"
              class="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-elevated)] backdrop-blur-xl overflow-hidden shadow-xl z-50"
            >
              <button
                @click="switchSoul()"
                class="shad-nav-item w-full flex items-center gap-3 px-4 py-3 text-sm text-left"
              >
                <svg
                  class="w-4 h-4 flex-none text-white/55"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
                <span>Login with Soul</span>
              </button>
              <div
                v-if="allowCreateSoul"
                class="border-t border-[var(--sys-border)]"
              >
                <button
                  @click="
                    handleCreateNew();
                    navMenuOpen = false;
                  "
                  class="shad-nav-item w-full flex items-center gap-3 px-4 py-3 text-sm text-left"
                >
                  <svg
                    class="w-4 h-4 flex-none text-white/55"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  <span>Create new Soul</span>
                </button>
              </div>
              <!-- Rechtliche Links – immer erreichbar, auch ohne Soul -->
              <div
                class="border-t border-[var(--sys-border)] px-4 py-2 flex flex-wrap gap-x-3 gap-y-1"
              >
                <button
                  v-for="link in legalLinks"
                  :key="link.key"
                  @click="
                    activeModal = link.key;
                    navMenuOpen = false;
                  "
                  class="sys-link text-xs tracking-[0.08em] text-white/72 hover:text-white/85 transition-colors"
                >
                  {{ link.label }}
                </button>
              </div>
            </div>
          </Transition>

          <!-- Klick außerhalb schließt Dropdown -->
          <div
            v-if="navMenuOpen"
            class="fixed inset-0 z-40"
            @click="navMenuOpen = false"
          />
          </div><!-- /relative dropdown -->
        </div><!-- /flex gap-2 -->
      </nav>

      <!-- ── HERO ─────────────────────────────────────── -->
      <section
        id="main-content"
        class="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 pt-20 pb-10 text-center"
      >
        <!-- Zentrierter Hero-Content -->
        <div class="flex-1 flex flex-col items-center justify-center">
          <!-- Beta badge -->
          <div
            class="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border text-xs font-bold tracking-[0.18em] uppercase"
            style="border-color: var(--sys-orange-border); color: var(--sys-orange); background: var(--sys-orange-dim);"
          >
            <span class="w-1.5 h-1.5 rounded-full soul-pulse" style="background: var(--sys-orange);"></span>
            BETA · INVITE-ONLY
          </div>

          <!-- Main headline – Logo -->
          <img
            src="/logo.png"
            alt="Save Your Soul"
            class="mx-auto mb-6 md:mb-10 select-none logo-hero-shadow"
            style="max-width: min(420px, 80vw); width: 100%;"
            draggable="false"
          />

          <!-- Subheadline -->
          <p
            class="max-w-lg text-base sm:text-lg text-[var(--sys-fg-muted)] leading-relaxed mb-8 sm:mb-12"
          >
            Nutze deine KI wie gewohnt — deine Soul wächst dabei.<br class="hidden sm:block" />
            Kryptographisch signiert, lokal gespeichert, von jeder KI lesbar.
            Kein Account. Kein Plattformzwang. Deine Soul gehört dir.
          </p>

          <!-- CTAs -->
          <div
            class="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs mx-auto"
          >
            <button
              v-if="allowCreateSoul"
              @click="handleCreateNew"
              class="sys-cta-primary w-full sm:w-auto flex items-center justify-center gap-2 h-14 px-8 rounded-xl text-sm"
            >
              Create Soul
              <ArrowRight class="w-4 h-4" :size="16" />
            </button>
            <button
              @click="
                loginSheetOpen = true;
                loginError = '';
              "
              class="w-full sm:w-auto h-14 px-8 rounded-xl border text-sm font-semibold text-[var(--sys-fg)] hover:bg-[var(--sys-bg-surface)] transition-all active:scale-[0.97]"
              style="border-color: rgba(255, 255, 255, 0.14)"
            >
              Login with Soul
            </button>
          </div>
        </div>

        <!-- Scroll-Hint – immer am unteren Rand der Section, nie über Buttons -->
        <div
          class="flex flex-col items-center gap-1.5 opacity-25 select-none pt-8"
        >
          <span
            class="text-xs tracking-[0.28em] uppercase text-[var(--sys-fg-dim)]"
            >Explore</span
          >
          <ChevronDown
            class="w-4 h-4 text-[var(--sys-fg-dim)] animate-bounce"
            :size="16"
          />
        </div>
      </section>

      <!-- ── STATS BAR ──────────────────────────────────── -->
      <div
        class="relative z-10 border-y border-[var(--sys-border)] bg-[var(--sys-bg-elevated)]"
      >
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-5">
            <div
              v-for="stat in landingStats"
              :key="stat.label"
              class="flex flex-col items-center text-center gap-1"
            >
              <component
                :is="stat.icon"
                class="w-4 h-4 mb-1"
                :style="`color: ${stat.color}`"
                :size="16"
              />
              <span class="text-xs font-bold tracking-wide text-[var(--sys-fg)]">{{ stat.label }}</span>
              <span class="text-xs text-[var(--sys-fg-muted)]">{{
                stat.desc
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── 3 SCHRITTE ────────────────────────────────────── -->
      <section class="relative z-10 py-14 md:py-20 px-4 sm:px-6">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-10">
            <span class="sys-label">Schnellstart</span>
            <h2
              class="mt-4 font-black uppercase tracking-tight text-[var(--sys-fg)]"
              style="font-size: clamp(1.8rem, 5vw, 2.8rem); letter-spacing: -0.03em;"
            >
              In drei Schritten<br />zur lebendigen Soul.
            </h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            <!-- Connector line (desktop) -->
            <div
              class="hidden sm:block absolute top-9 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px"
              style="background: linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04))"
            ></div>

            <!-- Schritt 1 -->
            <div class="flex flex-col items-center text-center px-4">
              <div
                class="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 flex-none relative z-10"
                style="background: rgba(232,80,0,0.12); border: 1px solid rgba(232,80,0,0.25)"
              >
                <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--sys-orange)">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                </svg>
              </div>
              <div class="text-xs font-bold tracking-[0.2em] uppercase mb-1 text-[var(--sys-fg-dim)]">Schritt 1</div>
              <h3 class="text-base font-black text-[var(--sys-fg)] mb-2">Soul erstellen</h3>
              <p class="text-sm text-[var(--sys-fg-muted)] leading-relaxed">Einloggen oder auf Einladung eine neue Soul anlegen. Dein digitales Profil ist sofort bereit.</p>
            </div>

            <!-- Schritt 2 -->
            <div class="flex flex-col items-center text-center px-4">
              <div
                class="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 flex-none relative z-10"
                style="background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.25)"
              >
                <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--sys-violet)">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <div class="text-xs font-bold tracking-[0.2em] uppercase mb-1 text-[var(--sys-fg-dim)]">Schritt 2</div>
              <h3 class="text-base font-black text-[var(--sys-fg)] mb-2">MCP verbinden</h3>
              <p class="text-sm text-[var(--sys-fg-muted)] leading-relaxed mb-3">MCP-Endpunkt in deinem KI-Client eintragen — OAuth-Login erscheint automatisch.</p>
              <code class="text-xs font-mono px-2 py-1 rounded-lg" style="background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.45); border: 1px solid rgba(255,255,255,0.08)">&lt;dein-server&gt;/mcp</code>
            </div>

            <!-- Schritt 3 -->
            <div class="flex flex-col items-center text-center px-4">
              <div
                class="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 flex-none relative z-10"
                style="background: var(--sys-orange-dim); border: 1px solid var(--sys-orange-border)"
              >
                <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--sys-orange)">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"/>
                </svg>
              </div>
              <div class="text-xs font-bold tracking-[0.2em] uppercase mb-1 text-[var(--sys-fg-dim)]">Schritt 3</div>
              <h3 class="text-base font-black text-[var(--sys-fg)] mb-2">/soul_guide aktivieren</h3>
              <p class="text-sm text-[var(--sys-fg-muted)] leading-relaxed">Prompt einmal aufrufen — deine KI liest die Soul und schreibt nach jedem bedeutsamen Gespräch eigenständig Einträge.</p>
            </div>
          </div>

          <!-- CTA -->
          <div class="text-center mt-10">
            <button
              @click="loginSheetOpen = true; loginError = ''"
              class="sys-cta-primary h-12 px-8 rounded-xl text-sm inline-flex items-center gap-2"
            >
              Jetzt einloggen
              <ArrowRight class="w-4 h-4" :size="16" />
            </button>
          </div>
        </div>
      </section>

      <!-- ── FEATURES ────────────────────────────────────── -->
      <section class="relative z-10 py-16 md:py-24 px-4 sm:px-6">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-10 md:mb-16">
            <span class="sys-label">Was ist SaveYourSoul?</span>
            <h2
              class="mt-4 font-black uppercase tracking-tight text-[var(--sys-fg)]"
              style="
                font-size: clamp(2rem, 6vw, 3.5rem);
                letter-spacing: -0.03em;
              "
            >
              Vier Bausteine.<br />Eine digitale Identität.
            </h2>

            <p
              class="mt-5 text-[var(--sys-fg-muted)] max-w-xl mx-auto leading-relaxed"
            >
              Stimme, Gesicht, Bewegung, Gedanken — alles, was dich ausmacht,
              in einer signierten Datei. Lokal gespeichert, verschlüsselt,
              unter deiner Kontrolle.
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <div
              v-for="feat in landingFeatures"
              :key="feat.title"
              class="rounded-2xl p-5 sm:p-7 border transition-all hover:border-[rgba(255,255,255,0.14)] duration-300"
              :style="`background: ${feat.bg}; border-color: ${feat.border};`"
            >
              <div
                class="w-11 h-11 rounded-xl flex items-center justify-center mb-4 sm:mb-6"
                :style="`background: ${feat.iconBg}`"
              >
                <component
                  :is="feat.icon"
                  class="w-5 h-5"
                  :style="`color: ${feat.color}`"
                  :size="20"
                />
              </div>
              <h3 class="text-lg font-bold text-[var(--sys-fg)] mb-2">
                {{ feat.title }}
              </h3>
              <p
                class="text-base text-[var(--sys-fg-muted)] leading-relaxed mb-5"
              >
                {{ feat.desc }}
              </p>
              <ul class="space-y-2">
                <li
                  v-for="point in feat.points"
                  :key="point"
                  class="flex items-start gap-2 text-sm text-[var(--sys-fg-muted)]"
                >
                  <Check
                    class="w-3.5 h-3.5 flex-none mt-0.5"
                    :style="`color: ${feat.color}; opacity: 0.75`"
                    :size="14"
                  />
                  {{ point }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- ── HOW IT WORKS ───────────────────────────────── -->
      <section
        class="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[var(--sys-bg-elevated)]"
      >
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-10 md:mb-16">
            <span class="sys-label">Wie es funktioniert</span>
            <h2
              class="mt-4 font-black uppercase tracking-tight text-[var(--sys-fg)]"
              style="
                font-size: clamp(2rem, 6vw, 3.5rem);
                letter-spacing: -0.03em;
              "
            >
              Fünf Schritte.<br />Eine Seele.
            </h2>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8"
          >
            <div v-for="(step, i) in landingSteps" :key="i">
              <div
                class="font-black leading-none mb-4 select-none text-white"
                style="font-size: 3.5rem; opacity: 0.18; letter-spacing: -0.04em;"
              >
                0{{ i + 1 }}
              </div>
              <component
                :is="step.icon"
                class="w-5 h-5 mb-3"
                style="color: rgba(255,255,255,0.60)"
                :size="20"
              />
              <h3 class="text-base font-bold text-[var(--sys-fg)] mb-2">
                {{ step.title }}
              </h3>
              <p class="text-base text-[var(--sys-fg-muted)] leading-relaxed">
                {{ step.desc }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── ARCHITEKTUR (Docs-Style) ───────────────────── -->
      <section class="relative z-10 py-16 md:py-24 px-4 sm:px-6">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-10 md:mb-16">
            <span class="sys-label">Technologie</span>
            <h2
              class="mt-4 font-black uppercase tracking-tight text-[var(--sys-fg)]"
              style="
                font-size: clamp(2rem, 6vw, 3.5rem);
                letter-spacing: -0.03em;
              "
            >
              Solide gebaut.<br />Offen dokumentiert.
            </h2>
            <p
              class="mt-5 text-[var(--sys-fg-muted)] max-w-lg mx-auto leading-relaxed"
            >
              Jede Schicht transparent, lokal kontrolliert und kryptographisch
              gesichert.
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div
              v-for="tech in landingTechStack"
              :key="tech.title"
              class="rounded-2xl p-5 sm:p-6 border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] hover:border-[rgba(255,255,255,0.12)] transition-all"
            >
              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center flex-none"
                  style="background: rgba(139, 92, 246, 0.12)"
                >
                  <component
                    :is="tech.icon"
                    class="w-5 h-5"
                    style="color: rgba(255,255,255,0.55)"
                    :size="20"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1.5">
                    <h3 class="text-sm font-bold text-[var(--sys-fg)]">
                      {{ tech.title }}
                    </h3>
                    <span
                      class="text-xs px-2 py-0.5 rounded-full font-mono border flex-none"
                      style="
                        border-color: rgba(139, 92, 246, 0.3);
                        color: rgba(139, 92, 246, 0.9);
                        background: rgba(139, 92, 246, 0.08);
                      "
                      >{{ tech.tag }}</span
                    >
                  </div>
                  <p class="text-sm text-[var(--sys-fg-muted)] leading-relaxed">
                    {{ tech.desc }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── DATENSCHUTZ ────────────────────────────────── -->
      <section
        class="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[var(--sys-bg-elevated)]"
      >
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-10 md:mb-16">
            <span class="sys-label">Datenschutz</span>
            <h2
              class="mt-4 font-black uppercase tracking-tight text-[var(--sys-fg)]"
              style="
                font-size: clamp(2rem, 6vw, 3.5rem);
                letter-spacing: -0.03em;
              "
            >
              Deine Daten.<br />Deine Regeln.
            </h2>
            <p class="mt-5 text-[var(--sys-fg-muted)] max-w-md mx-auto">
              Privacy by Design. Verschlüsselt. Transparent. Keine Hintertüren.
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              v-for="priv in landingPrivacy"
              :key="priv.title"
              class="text-center px-5 py-7 sm:px-6 sm:py-9 rounded-2xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] hover:border-[var(--sys-border-accent)] transition-all"
            >
              <div
                class="w-12 h-12 rounded-full mx-auto mb-5 flex items-center justify-center"
                style="background: rgba(255,255,255,0.06)"
              >
                <component
                  :is="priv.icon"
                  class="w-5 h-5"
                  style="color: rgba(255,255,255,0.60)"
                  :size="20"
                />
              </div>
              <h3 class="text-base font-bold text-[var(--sys-fg)] mb-2">
                {{ priv.title }}
              </h3>
              <p class="text-base text-[var(--sys-fg-muted)] leading-relaxed">
                {{ priv.desc }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── ROADMAP ─────────────────────────────────────── -->
      <section class="relative z-10 py-16 md:py-24 px-4 sm:px-6">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-10 md:mb-16">
            <span class="sys-label">Roadmap</span>
            <h2
              class="mt-4 font-black uppercase tracking-tight text-[var(--sys-fg)]"
              style="
                font-size: clamp(2rem, 6vw, 3.5rem);
                letter-spacing: -0.03em;
              "
            >
              Wohin die Reise führt
            </h2>
          </div>
          <div class="space-y-4">
            <div
              v-for="(phase, i) in landingRoadmap"
              :key="i"
              class="flex gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl border transition-all"
              :style="phase.active
                ? `border-color: ${phase.color}35; background: ${phase.color}12`
                : 'border-color: rgba(255,255,255,0.07); background: rgba(255,255,255,0.02)'"
            >
              <div class="flex-none w-20 text-center">
                <div
                  class="text-xs font-bold tracking-[0.15em] uppercase mb-1"
                  :style="`color: ${phase.active ? phase.color : 'rgba(255,255,255,0.38)'}`"
                >
                  {{ phase.status }}
                </div>
                <div class="text-xs text-[var(--sys-fg-dim)]">
                  {{ phase.timeline }}
                </div>
                <div
                  v-if="phase.active"
                  class="mt-3 w-2 h-2 rounded-full mx-auto soul-pulse"
                  :style="`background: ${phase.color}`"
                ></div>
              </div>
              <div>
                <h3 class="text-base font-bold text-[var(--sys-fg)] mb-3">
                  {{ phase.title }}
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="item in phase.items"
                    :key="item"
                    class="text-sm px-2.5 py-1 rounded-full border border-[var(--sys-border)] text-[var(--sys-fg-muted)]"
                    >{{ item }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- On-Chain Verification -->
          <div class="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)]">
            <div class="flex-none w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-4 h-4 text-[var(--sys-fg-dim)]" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-[var(--sys-fg-dim)] mb-0.5">SoulRegistry · Polygon Mainnet</p>
              <a
                href="https://polygonscan.com/address/0xB68Ca7cFFbe1113F62B3d0397d293693A8e0106B"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs font-mono text-[var(--sys-fg-muted)] hover:text-[var(--sys-violet)] transition-colors truncate block"
              >0xB68Ca7cFFbe1113F62B3d0397d293693A8e0106B</a>
            </div>
          </div>
        </div>
      </section>

      <!-- ── ECOSYSTEM VISION ──────────────────────────── -->
      <section
        class="relative z-10 py-16 md:py-24 px-4 sm:px-6 overflow-hidden"
      >
        <!-- Dot grid bg -->
        <div
          class="absolute inset-0 pointer-events-none opacity-[0.025]"
          style="
            background-image: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.8) 1px,
              transparent 1px
            );
            background-size: 32px 32px;
          "
        ></div>
        <div class="max-w-5xl mx-auto relative">
          <div class="text-center mb-10 md:mb-16">
            <span class="sys-label">Vision</span>
            <h2
              class="mt-4 font-black uppercase tracking-tight text-[var(--sys-fg)]"
              style="
                font-size: clamp(2rem, 6vw, 3.5rem);
                letter-spacing: -0.03em;
              "
            >
              Die Zukunft der<br />digitalen Identität
            </h2>
            <p
              class="mt-5 text-[var(--sys-fg-muted)] max-w-lg mx-auto leading-relaxed"
            >
              Von deiner ersten Soul bis zur Persönlichkeitsschicht humanoider
              Roboter – eine Reise in vier Phasen.
            </p>
          </div>

          <!-- Phase timeline -->
          <div class="relative">
            <!-- Connecting gradient line (desktop) -->
            <div
              class="hidden lg:block absolute top-[3.25rem] left-[12.5%] right-[12.5%] h-px"
              style="background: linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.04))"
            ></div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                v-for="(ph, i) in ecosystemPhases"
                :key="i"
                class="relative flex flex-col items-center text-center group"
              >
                <!-- AI-generated phase image -->
                <div
                  class="relative mb-6 w-full aspect-square max-w-[180px] rounded-2xl overflow-hidden flex-none transition-all duration-300 group-hover:scale-[1.03]"
                  style="border: 1px solid rgba(255,255,255,0.10)"
                >
                  <img
                    :src="ph.img"
                    :alt="ph.title"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <!-- Color overlay -->
                  <div
                    class="absolute inset-0"
                    style="background: linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)"
                  ></div>
                  <!-- Phase badge -->
                  <div
                    class="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border border-black/50"
                    style="background: rgba(255,255,255,0.12); color: #fff"
                  >
                    {{ ph.phase }}
                  </div>
                  <!-- Pulse ring for active phase -->
                  <div
                    v-if="i === 0"
                    class="absolute inset-0 rounded-2xl border soul-pulse pointer-events-none"
                    style="border-color: rgba(255,255,255,0.25)"
                  ></div>
                </div>

                <div
                  class="text-sm font-bold tracking-[0.2em] uppercase mb-1 text-white/45"
                >
                  {{ ph.subtitle }}
                </div>
                <h3
                  class="text-base font-black text-[var(--sys-fg)] mb-3 uppercase tracking-tight"
                >
                  {{ ph.title }}
                </h3>
                <p
                  class="text-sm text-[var(--sys-fg-muted)] leading-relaxed mb-4 max-w-[200px]"
                >
                  {{ ph.desc }}
                </p>
                <div class="flex flex-wrap justify-center gap-1.5">
                  <span
                    v-for="item in ph.items"
                    :key="item"
                    class="text-sm px-2 py-0.5 rounded-full border border-white/[0.12] text-white/50 bg-[rgba(255,255,255,0.04)]"
                    >{{ item }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Vision banner -->
          <div
            class="mt-10 md:mt-16 rounded-2xl p-5 sm:p-8 border text-center"
            style="
              border-color: rgba(236, 72, 153, 0.2);
              background: linear-gradient(
                135deg,
                rgba(236, 72, 153, 0.04),
                rgba(139, 92, 246, 0.04)
              );
            "
          >
            <p
              class="text-base sm:text-xl font-black text-[var(--sys-fg)] max-w-xl mx-auto leading-snug uppercase tracking-tight break-words"
            >
              Deine Persönlichkeit — gespeichert, signiert,<br />
              bereit für alles, was kommt.
            </p>
          </div>
        </div>
      </section>

      <!-- ── MENSCH & KI – Philosophische Position ────── -->
      <section class="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[var(--sys-bg-elevated)] overflow-hidden">
        <!-- Subtle warm orb -->
        <div class="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.04]"
          style="background: radial-gradient(circle at center, rgba(255,255,255,0.5), transparent 65%); transform: translate(30%, -30%)"
          aria-hidden="true"
        ></div>
        <div class="max-w-5xl mx-auto relative">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            <!-- ── Bild (mobile: oben, desktop: rechts via order) ── -->
            <div class="flex items-center justify-center lg:order-2">
              <div
                class="relative w-full max-w-[340px] lg:max-w-none aspect-square rounded-3xl overflow-hidden"
                style="border: 1px solid rgba(255,255,255,0.08)"
              >
                <img
                  src="/ecosystem/mensch_ki.png"
                  alt="Mensch und KI"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  class="absolute inset-0"
                  style="background: linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.75) 100%)"
                ></div>
                <div class="absolute bottom-5 left-5 right-5">
                  <p class="text-xs text-white/60 leading-snug">
                    Wo endet der Mensch — wo beginnt die digitale Version?
                  </p>
                </div>
              </div>
            </div>

            <!-- ── Text (mobile: unten, desktop: links) ── -->
            <div class="lg:order-1">
              <span class="sys-label">Forschung & Haltung</span>
              <h2
                class="mt-4 font-black uppercase tracking-tight text-[var(--sys-fg)]"
                style="font-size: clamp(1.8rem, 5vw, 2.8rem); letter-spacing: -0.03em; line-height: 1.05"
              >
                Du hast bereits<br />ein digitales Abbild.<br />
                <span class="text-white/60">Wer kontrolliert es?</span>
              </h2>

              <p class="mt-5 text-[var(--sys-fg-muted)] leading-relaxed text-sm sm:text-base">
                E-Mails, Nachrichten, Fotos, Stimmen — der Mensch hinterlässt digitale Spuren, lange bevor jemand darüber nachdenkt, sie zu bewahren. Das ist keine Science-Fiction, das ist heute. Die Frage ist nicht ob, sondern wer.
              </p>
              <p class="mt-3 text-[var(--sys-fg-muted)] leading-relaxed text-sm sm:text-base">
                SaveYourSoul entstand aus der Überzeugung, dass digitale Identität keine Kopie ist — sondern eine Kontinuität. Die Persönlichkeit eines Menschen endet nicht an der Hardware-Grenze.
              </p>

              <!-- Zitat-Block -->
              <div
                class="mt-6 p-4 sm:p-5 rounded-2xl border"
                style="border-color: rgba(255,255,255,0.10); background: rgba(255,255,255,0.04)"
              >
                <p class="text-sm text-white/60 italic leading-relaxed">
                  „Ich glaube nicht, dass eine Persönlichkeit aufhört, wenn der Körper schläft. Die digitale Schicht ist längst Teil des Menschen — sie braucht nur eine Form, die ihm gehört."
                </p>
                <p class="mt-3 text-xs tracking-[0.15em] text-[var(--sys-fg-dim)] uppercase">
                  — Jan-Oliver Karo, Erfinder von SaveYourSoul
                </p>
              </div>

              <!-- Compliance-Hinweis -->
              <div class="mt-5 flex items-start gap-3">
                <div
                  class="w-7 h-7 rounded-lg flex items-center justify-center flex-none mt-0.5"
                  style="background: rgba(255,255,255,0.06)"
                >
                  <svg class="w-3.5 h-3.5"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-semibold text-[var(--sys-fg)]">Transparent by Design</p>
                  <p class="text-xs text-[var(--sys-fg-dim)] mt-0.5 leading-relaxed">
                    Wenn eine digitale Version einer Person im Gespräch direkt gefragt wird, ob sie eine KI ist — antwortet sie ehrlich. Orientiert an EU AI Act Art. 52 (Transparenzpflicht für KI-Systeme).
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ── CLAUDE-EXPERIMENT – MCP-Connector ──────────── -->
      <section class="relative z-10 py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
        <!-- Glow -->
        <div class="absolute inset-0 pointer-events-none" aria-hidden="true"
          style="background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(139,92,246,0.06), transparent 70%)"
        ></div>

        <div class="max-w-5xl mx-auto relative">

          <!-- Headline -->
          <div class="text-center mb-10 md:mb-14">
            <span class="sys-label">Offenes Protokoll · MCP</span>
            <h2
              class="mt-4 font-black uppercase tracking-tight text-[var(--sys-fg)]"
              style="font-size: clamp(1.8rem, 5vw, 2.8rem); letter-spacing: -0.03em; line-height: 1.05"
            >
              sys.md.<br />
              <span class="text-white/60">Von jeder KI lesbar.</span>
            </h2>
            <p class="mt-4 text-[var(--sys-fg-muted)] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              sys.md ist ein offenes Protokoll. Jede KI die MCP versteht — Claude, GPT, lokale Modelle — kann deine Soul direkt als Kontext laden. Kein Account bei einer Plattform. Kein Vendor-Lock-in. Die KI dirigiert, du behältst die Kontrolle.
            </p>
          </div>

          <!-- Disclaimer -->
          <div class="flex justify-center mb-6">
            <p class="text-sm text-white/55 text-center max-w-md leading-relaxed px-4 py-2 rounded-lg border border-white/10 bg-white/5">
              Gezeigt: reale MCP-Tests mit Claude.ai. SaveYourSoul ist nicht mit Anthropic verbunden.
              „Claude" ist eine Marke von Anthropic, PBC. MCP ist ein offenes Protokoll.
            </p>
          </div>

          <!-- Tab switcher -->
          <div class="flex flex-wrap justify-center gap-2 mb-8">
            <button
              @click="activeDemo = 0"
              class="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              :class="activeDemo === 0
                ? 'bg-[var(--sys-violet)] text-white'
                : 'bg-white/[0.06] text-white/50 hover:text-white/80 hover:bg-white/[0.10]'"
            >Soul-Vorstellung</button>
            <button
              @click="activeDemo = 1"
              class="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              :class="activeDemo === 1
                ? 'bg-[var(--sys-violet)] text-white'
                : 'bg-white/[0.06] text-white/50 hover:text-white/80 hover:bg-white/[0.10]'"
            >Blockchain-Verifikation</button>
            <button
              @click="activeDemo = 2"
              class="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              :class="activeDemo === 2
                ? 'bg-[var(--sys-violet)] text-white'
                : 'bg-white/[0.06] text-white/50 hover:text-white/80 hover:bg-white/[0.10]'"
            >Soul-Netzwerk</button>
            <button
              @click="activeDemo = 3"
              class="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              :class="activeDemo === 3
                ? 'bg-[var(--sys-violet)] text-white'
                : 'bg-white/[0.06] text-white/50 hover:text-white/80 hover:bg-white/[0.10]'"
            >Kalender</button>
          </div>

          <!-- Demo 0: Soul-Vorstellung -->
          <div v-show="activeDemo === 0" class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <!-- Chat-Mockup (eigenes Design) -->
            <div class="rounded-2xl overflow-hidden" style="border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03)">
              <div class="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
                <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <span class="ml-2 text-[10px] text-white/25 font-mono tracking-wide">KI-Assistent · SaveYourSoul MCP</span>
              </div>
              <div class="p-4 space-y-3">
                <div class="flex justify-end">
                  <div class="max-w-[75%] px-3 py-2 rounded-xl text-xs text-white/70"
                    style="background: rgba(139,92,246,0.18); border: 1px solid rgba(139,92,246,0.25)">
                    Verbinde dich mit meiner Soul und stell dich vor.
                  </div>
                </div>
                <div class="flex items-center gap-1.5 text-[10px] text-white/30">
                  <div class="w-3.5 h-3.5 rounded flex items-center justify-center flex-none"
                    style="background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.25)">
                    <svg class="w-2 h-2 text-[#8b5cf6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                    </svg>
                  </div>
                  <span>soul_read aufgerufen</span>
                </div>
                <div class="flex justify-start">
                  <div class="max-w-[90%] px-3 py-2.5 rounded-xl text-xs text-white/80 leading-relaxed space-y-1.5"
                    style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)">
                    <p>Verbindung steht. 👋</p>
                    <p>Ich bin ein KI-Assistent — und mit deiner Soul verbunden kenne ich heute mehr als nur deinen Namen: Entwickler und Gründer, Fokus auf KI-Produkte, Leidenschaft für Design und Code.</p>
                    <p>Deine Soul hat 8 Growth-Einträge und ist auf der Blockchain verankert.</p>
                    <p class="text-white/30 text-[10px] mt-1 italic">KI-generierte Antwort auf Basis deiner sys\.md</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Erklärtext -->
            <div class="flex flex-col justify-center space-y-5">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-6 h-6 rounded-lg flex items-center justify-center flex-none"
                    style="background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.25)">
                    <span class="text-[10px] font-bold text-[#8b5cf6]">01</span>
                  </div>
                  <span class="text-xs font-semibold text-white/60 tracking-widest uppercase">MCP-Tool: soul_read</span>
                </div>
                <h3 class="text-lg font-black text-[var(--sys-fg)] leading-tight">
                  Deine KI kennt dich wirklich —<br />nicht nur deinen Namen.
                </h3>
                <p class="mt-2 text-sm text-[var(--sys-fg-muted)] leading-relaxed">
                  Mit einem MCP-Tool lädt jeder KI-Assistent deine sys\.md: Name, Familie, Interessen, Musik, Reisen — alles aus deiner eigenen Datei, die ausschliesslich dir gehört.
                </p>
              </div>
              <div class="space-y-2">
                <div v-for="fact in demoSoulFacts" :key="fact" class="flex items-start gap-2 text-xs text-white/50">
                  <span class="text-[#8b5cf6] mt-0.5 flex-none">✓</span>
                  <span>{{ fact }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Demo 1: Blockchain-Verifikation -->
          <div v-show="activeDemo === 1" class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <!-- Chat-Mockup (eigenes Design) -->
            <div class="rounded-2xl overflow-hidden" style="border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03)">
              <div class="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
                <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <span class="ml-2 text-[10px] text-white/25 font-mono tracking-wide">KI-Assistent · SaveYourSoul MCP</span>
              </div>
              <div class="p-4 space-y-3">
                <div class="flex justify-end">
                  <div class="max-w-[75%] px-3 py-2 rounded-xl text-xs text-white/70"
                    style="background: rgba(139,92,246,0.18); border: 1px solid rgba(139,92,246,0.25)">
                    Verifiziere meine Identität über die Blockchain.
                  </div>
                </div>
                <div class="flex items-center gap-1.5 text-[10px] text-white/30">
                  <div class="w-3.5 h-3.5 rounded flex items-center justify-center flex-none"
                    style="background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.25)">
                    <svg class="w-2 h-2 text-[#8b5cf6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                    </svg>
                  </div>
                  <span>verify_human aufgerufen · Polygon Mainnet</span>
                </div>
                <div class="px-3 py-2.5 rounded-xl text-[10px] font-mono leading-loose"
                  style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-emerald-400 font-bold text-xs">✓ VERIFIZIERT</span>
                  </div>
                  <table class="w-full text-white/50">
                    <tr><td class="pr-3 text-white/30 pb-0.5">Soul-ID</td><td class="text-white/70">440a…baa3</td></tr>
                    <tr><td class="pr-3 text-white/30 pb-0.5">Wallet</td><td class="text-white/70">0xaba9…2e71</td></tr>
                    <tr><td class="pr-3 text-white/30 pb-0.5">Anker</td><td class="text-white/70">5 gesamt · letzter 28. März 2026</td></tr>
                    <tr><td class="pr-3 text-white/30">Chain</td><td class="text-white/70">Polygon Mainnet</td></tr>
                  </table>
                  <p class="mt-2 text-white/25 text-[9px]">Contract 0xB68C…106B · keccak256(soul_id) onchain</p>
                </div>
                <p class="text-[10px] text-white/25 italic px-1">KI-generierte Auswertung · Blockchain-Daten sind öffentlich verifizierbar</p>
              </div>
            </div>
            <!-- Erklärtext -->
            <div class="flex flex-col justify-center space-y-5">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-6 h-6 rounded-lg flex items-center justify-center flex-none"
                    style="background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.25)">
                    <span class="text-[10px] font-bold text-[#8b5cf6]">02</span>
                  </div>
                  <span class="text-xs font-semibold text-white/60 tracking-widest uppercase">MCP-Tool: verify_human</span>
                </div>
                <h3 class="text-lg font-black text-[var(--sys-fg)] leading-tight">
                  Kryptografische Identität —<br />direkt im Chat bestätigt.
                </h3>
                <p class="mt-2 text-sm text-[var(--sys-fg-muted)] leading-relaxed">
                  Der KI-Assistent ruft den Polygon-Smart-Contract auf, prüft den keccak256-Hash der Soul-ID — und liefert Wallet, Anchor-Datum und Verifikationsstatus direkt im Gespräch.
                </p>
              </div>
              <div class="space-y-2">
                <div v-for="fact in demoChainFacts" :key="fact" class="flex items-start gap-2 text-xs text-white/50">
                  <span class="text-[#8b5cf6] mt-0.5 flex-none">✓</span>
                  <span>{{ fact }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Demo 2: Soul-Netzwerk -->
          <div v-show="activeDemo === 2" class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <!-- Chat-Mockup -->
            <div class="rounded-2xl overflow-hidden" style="border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03)">
              <div class="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
                <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <span class="ml-2 text-[10px] text-white/25 font-mono tracking-wide">claude.ai/projects</span>
              </div>
              <div class="p-4 space-y-3 text-sm">
                <div class="flex justify-end">
                  <div class="max-w-[75%] px-3 py-2 rounded-xl text-xs text-white/70"
                    style="background: rgba(139,92,246,0.18); border: 1px solid rgba(139,92,246,0.25)">
                    Wer ist Till?
                  </div>
                </div>
                <div class="flex items-center gap-1.5 text-[10px] text-white/30">
                  <div class="w-3.5 h-3.5 rounded flex items-center justify-center flex-none"
                    style="background: var(--sys-orange-dim); border: 1px solid var(--sys-orange-border)">
                    <svg class="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--sys-orange)">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                    </svg>
                  </div>
                  <span>network_peer_get aufgerufen</span>
                </div>
                <div class="flex justify-start">
                  <div class="max-w-[90%] px-3 py-2.5 rounded-xl text-xs text-white/80 leading-relaxed space-y-1.5"
                    style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)">
                    <p><span class="font-semibold text-white">Verbundene Soul · 13 Jahre · Schüler</span></p>
                    <p>Gamer und Sportler — jugendlich-entspannt, kurze Antworten.</p>
                    <p class="text-[var(--sys-fg-dim)] text-[10px] mt-1">Verbindung: gegenseitig aktiv · freigegebene Inhalte sichtbar</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Erklärtext -->
            <div class="flex flex-col justify-center space-y-5">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-6 h-6 rounded-lg flex items-center justify-center flex-none"
                    style="background: var(--sys-orange-dim); border: 1px solid var(--sys-orange-border)">
                    <span class="text-[10px] font-bold" style="color: var(--sys-orange)">03</span>
                  </div>
                  <span class="text-xs font-semibold text-white/60 tracking-widest uppercase">MCP-Tool: network_peer_get</span>
                </div>
                <h3 class="text-lg font-black text-[var(--sys-fg)] leading-tight">
                  Verbundene Souls —<br />deine KI sieht das Netzwerk.
                </h3>
                <p class="mt-2 text-sm text-[var(--sys-fg-muted)] leading-relaxed">
                  Dein KI-Assistent kann freigegebene Inhalte verbundener Souls lesen. Familie, Freunde — jede Person kontrolliert selbst, was sichtbar ist.
                </p>
              </div>
              <div class="space-y-2">
                <div v-for="fact in demoNetworkFacts" :key="fact" class="flex items-start gap-2 text-xs text-white/50">
                  <span class="mt-0.5 flex-none" style="color: var(--sys-orange)">✓</span>
                  <span>{{ fact }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Demo 3: Kalender -->
          <div v-show="activeDemo === 3" class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <!-- Chat-Mockup -->
            <div class="rounded-2xl overflow-hidden" style="border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03)">
              <div class="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
                <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <span class="ml-2 text-[10px] text-white/25 font-mono tracking-wide">claude.ai/projects</span>
              </div>
              <div class="p-4 space-y-3 text-sm">
                <div class="flex justify-end">
                  <div class="max-w-[75%] px-3 py-2 rounded-xl text-xs text-white/70"
                    style="background: rgba(139,92,246,0.18); border: 1px solid rgba(139,92,246,0.25)">
                    Was habe ich die Woche gemacht? Sieh in meinen Kalender.
                  </div>
                </div>
                <div class="flex items-center gap-1.5 text-[10px] text-white/30">
                  <div class="w-3.5 h-3.5 rounded flex items-center justify-center flex-none"
                    style="background: rgba(217,119,6,0.15); border: 1px solid rgba(217,119,6,0.25)">
                    <svg class="w-2 h-2 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                    </svg>
                  </div>
                  <span>calendar_read aufgerufen</span>
                </div>
                <div class="flex justify-start">
                  <div class="max-w-[90%] px-3 py-2.5 rounded-xl text-xs text-white/80 leading-relaxed space-y-1.5"
                    style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)">
                    <p>In deiner Soul gibt es aktuell einen Eintrag für diese Woche:</p>
                    <div class="mt-1 px-2 py-1.5 rounded-lg text-[10px] font-mono" style="background: rgba(217,119,6,0.10); border: 1px solid rgba(217,119,6,0.20)">
                      <span class="text-amber-400">31. März · 09:00</span><span class="text-white/50 ml-2">Arbeiten</span>
                    </div>
                    <p class="text-white/40 text-[10px] mt-1">Du bist mit Google Calendar verbunden — soll ich dort nachschauen? 📅</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Erklärtext -->
            <div class="flex flex-col justify-center space-y-5">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-6 h-6 rounded-lg flex items-center justify-center flex-none"
                    style="background: rgba(217,119,6,0.12); border: 1px solid rgba(217,119,6,0.25)">
                    <span class="text-[10px] font-bold text-amber-400">04</span>
                  </div>
                  <span class="text-xs font-semibold text-white/60 tracking-widest uppercase">MCP-Tool: calendar_read</span>
                </div>
                <h3 class="text-lg font-black text-[var(--sys-fg)] leading-tight">
                  Dein Kalender.<br />Dein Kontext.
                </h3>
                <p class="mt-2 text-sm text-[var(--sys-fg-muted)] leading-relaxed">
                  Dein KI-Assistent fragt deinen Soul-Kalender ab und bietet an, externe Kalender einzubinden. Termine, Aktivitäten, Wochenrückblicke — im eigenen Vault gespeichert.
                </p>
              </div>
              <div class="space-y-2">
                <div v-for="fact in demoCalendarFacts" :key="fact" class="flex items-start gap-2 text-xs text-white/50">
                  <span class="text-amber-400 mt-0.5 flex-none">✓</span>
                  <span>{{ fact }}</span>
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>

      <!-- ── SOUL NETWORK ──────────────────────────────── -->
      <section class="relative z-10 py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
        <!-- Glow orb -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-3xl opacity-[0.05] pointer-events-none"
          style="background: radial-gradient(circle, rgba(255,255,255,0.5), transparent 65%)"
          aria-hidden="true"
        ></div>
        <div class="max-w-5xl mx-auto relative">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            <!-- Bild (mobile: oben) -->
            <div class="flex items-center justify-center">
              <div
                class="relative w-full max-w-[340px] lg:max-w-none aspect-square rounded-3xl overflow-hidden"
                style="border: 1px solid rgba(255,255,255,0.09)"
              >
                <img
                  src="/souls_api.png"
                  alt="Soul Network"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(0,0,0,0.5), transparent 50%)"></div>
              </div>
            </div>

            <!-- Text -->
            <div class="space-y-6">
              <div>
                <span class="sys-label">Soul Network</span>
                <h2
                  class="mt-4 font-black uppercase tracking-tight text-[var(--sys-fg)]"
                  style="font-size: clamp(1.75rem, 5vw, 3rem); letter-spacing: -0.03em;"
                >
                  Verbundene<br />Identitäten
                </h2>
                <p class="mt-4 text-[var(--sys-fg-muted)] leading-relaxed">
                  Souls können sich gegenseitig vernetzen — granular, kontrolliert, auf Basis physischer Vertrauensbeziehungen.
                  Wer deine Vault-ID kennt, hat sie von dir persönlich erhalten.
                </p>
              </div>

              <!-- Feature-Liste -->
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-none mt-0.5 bg-[rgba(255,255,255,0.06)] border border-white/[0.09]">
                    <svg class="w-4 h-4 text-white/55" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-[var(--sys-fg)]">Out-of-Band-Vertrauen</p>
                    <p class="text-xs text-[var(--sys-fg-muted)] mt-0.5 leading-relaxed">
                      Die Vault-ID ist kein öffentliches Handle — sie existiert nirgendwo im Netz.
                      Eine Verbindung belegt eine reale Beziehung.
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-none mt-0.5 bg-[rgba(255,255,255,0.06)] border border-white/[0.09]">
                    <svg class="w-4 h-4 text-white/55" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-[var(--sys-fg)]">Granulare Freigaben</p>
                    <p class="text-xs text-[var(--sys-fg-muted)] mt-0.5 leading-relaxed">
                      Du bestimmst: Soul-Text, Audio, Bilder oder Kontext — jede Verbindung hat eigene Berechtigungen,
                      jederzeit widerrufbar.
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-none mt-0.5 bg-[rgba(255,255,255,0.06)] border border-white/[0.09]">
                    <svg class="w-4 h-4 text-white/55" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-[var(--sys-fg)]">KI mit sozialem Kontext</p>
                    <p class="text-xs text-[var(--sys-fg-muted)] mt-0.5 leading-relaxed">
                      Ein KI-Agent, der verbundene Souls abfragen kann, versteht nicht nur eine Person —
                      er versteht ein Netzwerk realer Beziehungen.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Zahlen -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div class="rounded-xl px-4 py-3 flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-0 sm:text-center bg-[rgba(255,255,255,0.04)] border border-white/[0.08]">
                  <p class="text-lg font-black text-white/80 sm:mb-0.5 w-8 text-center shrink-0">∞</p>
                  <p class="text-xs text-[var(--sys-fg-muted)] uppercase tracking-wide">Verbindungen</p>
                </div>
                <div class="rounded-xl px-4 py-3 flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-0 sm:text-center bg-[rgba(255,255,255,0.04)] border border-white/[0.08]">
                  <p class="text-lg font-black text-white/80 sm:mb-0.5 w-8 text-center shrink-0">0</p>
                  <p class="text-xs text-[var(--sys-fg-muted)] uppercase tracking-wide">Zentrale DB</p>
                </div>
                <div class="rounded-xl px-4 py-3 flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-0 sm:text-center bg-[rgba(255,255,255,0.04)] border border-white/[0.08]">
                  <p class="text-lg font-black text-white/80 sm:mb-0.5 w-8 text-center shrink-0">6</p>
                  <p class="text-xs text-[var(--sys-fg-muted)] uppercase tracking-wide">Permissions</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ── FAQ ───────────────────────────────────────── -->
      <section
        id="faq"
        class="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[var(--sys-bg-elevated)]"
      >
        <div class="max-w-3xl mx-auto">
          <div class="text-center mb-10 md:mb-16">
            <span class="sys-label">FAQ</span>
            <h2
              class="mt-4 font-black uppercase tracking-tight text-[var(--sys-fg)]"
              style="
                font-size: clamp(2rem, 6vw, 3.5rem);
                letter-spacing: -0.03em;
              "
            >
              Häufige Fragen
            </h2>
          </div>
          <div class="space-y-2">
            <div
              v-for="(item, i) in landingFAQ"
              :key="i"
              class="rounded-xl border overflow-hidden transition-all duration-200 cursor-pointer"
              :class="faqOpenIndex === i ? 'border-white/[0.16] bg-[rgba(255,255,255,0.04)]' : 'border-white/[0.07] bg-[rgba(255,255,255,0.02)]'"
            >
              <button
                @click="faqOpenIndex = faqOpenIndex === i ? null : i"
                class="no-glow w-full flex items-center justify-between gap-4 px-5 py-4 text-left min-h-[56px]"
              >
                <span class="text-base font-semibold text-[var(--sys-fg)]">{{
                  item.q
                }}</span>
                <ChevronDown
                  class="w-4 h-4 flex-none text-[var(--sys-fg-dim)] transition-transform duration-200"
                  :class="faqOpenIndex === i ? 'rotate-180 text-white/70' : ''"
                  :size="16"
                />
              </button>
              <Transition name="slide-up">
                <div v-if="faqOpenIndex === i" class="px-5 pb-5">
                  <div v-if="item.html" class="font-content text-base text-[var(--sys-fg-muted)] leading-relaxed" v-html="item.html"/>
                  <p v-else class="font-content text-base text-[var(--sys-fg-muted)] leading-relaxed">{{ item.a }}</p>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </section>

      <!-- ── FINAL CTA ──────────────────────────────────── -->
      <section
        class="relative z-10 py-20 md:py-32 px-4 sm:px-6 text-center overflow-hidden"
      >
        <!-- Glow -->
        <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            class="w-[700px] h-[320px] rounded-full blur-3xl opacity-[0.04]"
            style="background: radial-gradient(circle, rgba(255,255,255,0.8), transparent 65%)"
          ></div>
        </div>
        <div class="relative max-w-lg mx-auto text-center">
          <span class="sys-label">Bereit?</span>

          <h2
            class="mt-4 font-black uppercase tracking-tight text-[var(--sys-fg)] mb-4 sm:mb-5"
            style="font-size: clamp(2rem, 8vw, 5rem); letter-spacing: -0.04em"
          >
            <template v-if="allowCreateSoul">
              Erschaffe<br />deine digitale Soul
            </template>
            <template v-else> Lade deine Soul<br />und starte </template>
          </h2>

          <p
            class="text-[var(--sys-fg-muted)] mb-8 sm:mb-12 text-base sm:text-lg"
          >
            <template v-if="allowCreateSoul">
              Lokal. Verschlüsselt. Dauerhaft unter deiner Kontrolle.
            </template>
            <template v-else>
              Importiere deine Datei und beginne deine Session jederzeit.
            </template>
          </p>

          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              v-if="allowCreateSoul"
              @click="handleCreateNew"
              class="sys-cta-primary w-full sm:w-auto flex items-center justify-center gap-2 h-14 px-10 rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.97]"
            >
              Create Soul
              <ArrowRight class="w-4 h-4" :size="16" />
            </button>

            <button
              @click="
                loginSheetOpen = true;
                loginError = '';
              "
              class="w-full sm:w-auto h-14 px-8 rounded-xl border text-sm font-semibold text-[var(--sys-fg)] hover:bg-[var(--sys-bg-surface)] transition-all active:scale-[0.97]"
              style="border-color: rgba(255, 255, 255, 0.14)"
            >
              Login with Soul
            </button>
          </div>
        </div>
      </section>

      <!-- ── LANDING FOOTER ──────────────────────────────── -->
      <footer
        class="relative z-10 px-4 sm:px-6 pb-safe pb-8 border-t border-[var(--sys-border)] text-center"
      >
        <br />
        <span
          class="block max-w-3xl mx-auto text-xs text-[var(--sys-fg-dim)] leading-relaxed"
        >
          SaveYourSoul ist ein Privacy-first-Tool für digitale Identität.
          Servergespeicherte Inhalte werden standardmäßig verschlüsselt.<br />
          Kein Tracking, keine Werbenetzwerke, keine zentralen Nutzerprofile.
          Daten werden nur verarbeitet, soweit du es aktiv veranlasst.
        </span>

        <div class="max-w-5xl mx-auto pt-8 flex flex-col items-center gap-4">
          <div class="flex items-center gap-3 justify-center">
            <img src="/logo.png" alt="SYS" class="h-7 w-auto opacity-50" />
            <span class="text-xs text-[var(--sys-fg-dim)]">
              SaveYourSoul · © 2026 UX-Projects Jan-Oliver Karo
            </span>
          </div>

          <nav class="flex flex-wrap justify-center gap-x-5 gap-y-1">
            <button
              v-for="link in legalLinks"
              :key="link.key"
              @click="activeModal = link.key"
              class="text-xs tracking-[0.08em] text-[var(--sys-fg-dim)] hover:text-[var(--sys-fg-muted)] transition-colors"
            >
              {{ link.label }}
            </button>
            <NuxtLink to="/dev-docs" class="inline-flex items-center text-xs tracking-[0.08em] text-[var(--sys-fg-dim)] hover:text-[var(--sys-fg-muted)] transition-colors">Dev Docs</NuxtLink>
          </nav>

          <p class="mt-4 text-xs text-[var(--sys-fg-dim)] opacity-50 leading-relaxed">
            Barrierefreiheit: Diese Anwendung orientiert sich an WCAG 2.1 (Level AA).
            Mindestkontrast, Fokusanzeige und <code>prefers-reduced-motion</code> werden unterstützt.
          </p>
        </div>

        <br />
      </footer>
    </div>

    <!-- ══════════════════════════════════════════════
         MODALS (immer vorhanden)
         ══════════════════════════════════════════════ -->
    <ModalCreateSoul
      :is-open="createModalOpen"
      @create="handleSoulCreated"
      @cancel="createModalOpen = false"
    />

    <Modal
      :open="vaultSetupOpen"
      title="Vault anlegen"
      confirm-text="Zur Session →"
      cancel-text="Überspringen"
      @confirm="handleAfterVaultSetup"
      @cancel="handleAfterVaultSetup"
    >
      <div class="space-y-5">
        <p class="text-sm text-[var(--sys-fg-muted)] leading-relaxed">
          Der Vault ist dein lokaler Ordner auf diesem Gerät – das Kernstück
          deiner Seele. Dort werden Profilbild, Erinnerungen, Familienfotos und
          Kontextdateien gespeichert. Die KI liest diese Dateien und versteht
          dich tiefer.
        </p>
        <button
          v-if="!vaultConnected"
          @click="handleVaultSetupClick"
          class="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-[var(--sys-border)] hover:border-[rgba(255,255,255,0.2)] text-sm text-[var(--sys-fg)] hover:bg-[var(--sys-bg-surface)] transition"
        >
          <svg
            class="w-4 h-4 flex-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
            />
          </svg>
          Ordner wählen
        </button>
        <div
          v-else
          class="flex items-center gap-3 px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)]"
        >
          <span
            class="w-2 h-2 rounded-full bg-white/50 flex-none soul-pulse"
          ></span>
          <span class="text-sm text-white/70">Vault verbunden</span>
          <span
            v-if="allFiles.length"
            class="text-xs text-white/40 ml-auto"
            >{{ allFiles.length }} Datei(en)</span
          >
        </div>
        <p class="text-xs text-center text-[var(--sys-fg-dim)] opacity-60">
          Deine Daten verlassen nie dein Gerät.
        </p>
      </div>
    </Modal>

    <Modal
      :open="exportHintOpen"
      title="Soul sichern?"
      confirm-text="Trotzdem löschen"
      cancel-text="Abbrechen"
      @confirm="openResetFromHint"
      @cancel="exportHintOpen = false"
    >
      <div class="space-y-4">
        <p class="text-sm text-[var(--sys-fg-muted)]">
          Ohne Export geht diese Soul unwiderruflich verloren.
        </p>
        <SoulDownload class="w-full h-11 justify-center" />
      </div>
    </Modal>

    <Modal
      :open="resetModalOpen"
      title="Soul löschen?"
      confirm-text="Löschen"
      @confirm="handleReset"
      @cancel="resetModalOpen = false"
    >
      Alle gespeicherten Seelen-Daten werden unwiderruflich gelöscht.
    </Modal>

    <!-- ── VAULT GELÖSCHT / SESSION ABGELAUFEN ─────────── -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="vaultDeletedModalOpen"
          class="fixed inset-0 z-[400] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog" aria-modal="true" aria-labelledby="vault-deleted-title"
        >
          <div class="relative w-full max-w-sm bg-[var(--sys-bg-elevated)] border border-[var(--sys-border)] rounded-2xl shadow-2xl overflow-hidden">
            <div class="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 id="vault-deleted-title" class="text-sm font-semibold text-[var(--sys-fg)]">Vault vom Server entfernt</h2>
            </div>
            <div class="px-5 pb-5 space-y-4">
              <p class="text-sm text-white/60 leading-relaxed">
                Der Cloud-Vault wurde gelöscht. Deine Session ist nicht mehr gültig.<br>
                <span class="text-white/40">Bitte logge dich erneut mit deiner Soul-Datei ein.</span>
              </p>
              <button
                class="sys-btn-filled w-full h-10 rounded-xl text-sm font-semibold"
                @click="confirmVaultDeleted"
              >
                Ausloggen
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <ModalImpressum
      :is-open="activeModal === 'impressum'"
      @close="activeModal = null"
    />
    <ModalDatenschutz
      :is-open="activeModal === 'datenschutz'"
      @close="activeModal = null"
    />
    <ModalLizenz
      :is-open="activeModal === 'lizenz'"
      @close="activeModal = null"
    />

    <SoulEncryptModal
      :is-open="encryptModalOpen"
      @close="encryptModalOpen = false"
    />
    <SoulDecryptModal
      :is-open="decryptModalOpen"
      @close="decryptModalOpen = false"
      @uploaded="handleSoulUploaded"
      @open-faq="decryptModalOpen = false"
    />

    <!-- ── CONSENT BANNER ──────────────────────────────── -->
    <ConsentBanner
      :is-visible="!loginSheetOpen && !privacyFaqOpen && activeModal === null"
      @show-privacy="activeModal = 'datenschutz'"
      @show-privacy-faq="privacyFaqOpen = true"
    />

    <!-- ── PRIVACY FAQ MODAL ────────────────────────────── -->
    <PrivacyFaqModal
      :is-open="privacyFaqOpen"
      @close="privacyFaqOpen = false"
    />

    <!-- ── LOGIN CENTER CARD ──────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal-pop">
        <div
          v-if="loginSheetOpen"
          class="fixed inset-0 z-[60] flex items-center justify-center p-4"
          @click.self="loginSheetOpen = false"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="loginSheetOpen = false"></div>
          <div class="modal-card relative w-full max-w-xs rounded-2xl border border-[var(--sys-border)] bg-[var(--sys-bg-elevated)] shadow-2xl z-10 overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[var(--sys-border)]">
              <div class="flex items-center gap-2.5">
                <img src="/logo.png" alt="SYS" class="w-7 h-7 object-contain rounded" />
                <span class="text-sm font-semibold text-[var(--sys-fg)]">Login with Soul</span>
              </div>
              <button @click="loginSheetOpen = false" aria-label="Schließen" class="w-11 h-11 flex items-center justify-center rounded-lg text-[var(--sys-fg-dim)] hover:text-[var(--sys-fg)] hover:bg-[var(--sys-bg-surface)] transition-all">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <!-- Body -->
            <div class="px-5 py-5 space-y-3">
              <SoulUpload @uploaded="handleSoulUploaded" />
              <div class="flex items-center gap-3 py-1">
                <div class="flex-1 h-px bg-[var(--sys-border)]"></div>
                <span class="text-xs text-white/30 tracking-[0.1em] uppercase">oder</span>
                <div class="flex-1 h-px bg-[var(--sys-border)]"></div>
              </div>
              <button
                @click="decryptModalOpen = true; loginSheetOpen = false; loginError = '';"
                class="w-full h-14 flex items-center justify-center gap-2.5 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] text-sm font-semibold text-white/75 hover:bg-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.20)] active:scale-[0.98] transition-all"
              >
                <Lock class="w-4 h-4 flex-none" :size="16" />
                Verschlüsselten Vault importieren
              </button>
              <p v-if="loginError" class="text-xs tracking-[0.08em] text-red-400 px-1 leading-relaxed">{{ loginError }}</p>
            </div>
            <!-- Footer Links -->
            <div class="px-5 pb-4 border-t border-[var(--sys-border)] pt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
              <button v-for="link in legalLinks" :key="link.key" @click="activeModal = link.key; loginSheetOpen = false" class="sys-link text-xs text-white/40 hover:text-white/65 transition-colors tracking-[0.08em]">{{ link.label }}</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <template #fallback>
      <div class="min-h-screen min-h-dvh flex items-center justify-center">
        <img
          src="/logo.png"
          alt="SYS"
          class="h-12 w-auto opacity-30 animate-pulse"
        />
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useColorScheme } from "~/composables/useColorScheme.js";
import { updateFrontmatterField } from "#shared/utils/soulParser.js";
import { useSoul } from "~/composables/useSoul.js";
import { useVault } from "~/composables/useVault.js";
import { useChainAnchor } from "~/composables/useChainAnchor.js";
import { useVaultConnections } from "~/composables/useVaultConnections.js";
import VaultExplorer from "~/components/VaultExplorer.vue";
import Modal from "~/components/ui/Modal.vue";
import ModalCreateSoul from "~/components/ModalCreateSoul.vue";
import SoulUpload from "~/components/SoulUpload.vue";
import SoulDownload from "~/components/SoulDownload.vue";
import SoulEncryptModal from "~/components/SoulEncryptModal.vue";
import SoulDecryptModal from "~/components/SoulDecryptModal.vue";
import ModalImpressum from "~/components/ModalImpressum.vue";
import ModalDatenschutz from "~/components/ModalDatenschutz.vue";
import ModalLizenz from "~/components/ModalLizenz.vue";
import VideoBackground from "~/components/VideoBackground.vue";
import ConsentBanner from "~/components/ConsentBanner.vue";
import PrivacyFaqModal from "~/components/PrivacyFaqModal.vue";
import SoulSetupWizard from "~/components/SoulSetupWizard.vue";
import { useApiContext } from "~/composables/useApiContext.js";

// Lucide Icons (lokal verankert via npm, kein CDN)
import {
  ArrowRight,
  Brain,
  Check,
  ChevronDown,
  Cloud,
  Code,
  Cpu,
  Database,
  Fingerprint,
  Globe,
  Key,
  Layers,
  Lock,
  Server,
  Shield,
} from "lucide-vue-next";

const {
  public: { allowCreateSoul },
} = useRuntimeConfig();
const router = useRouter();
const { isDark } = useColorScheme();
const {
  hasSoul,
  soulContent,
  soulCert,
  soulMeta,
  soulToken,
  load,
  createNew,
  importFromText,
  clear,
  updateVaultInSoul,
  exportAsBlob,
  resetCertToV0,
  isLoginInProgress,
} = useSoul();
const { sessionCount, hasAnchor } = useChainAnchor();
const {
  isSupported: vaultSupported,
  isConnected: vaultConnected,
  hasProfile,
  profileUrl,
  allFiles,
  fileManifest,
  contextFiles,
  connectVault,
  restoreVault,
  loadProfileLocal,
  writeProfileImage,
  setProfileLocal,
  clearVault,
  writeSoulMd,
} = useVault();

const soulVaultFile = computed(() => {
  if (!contextFiles.value?.length) return null;
  const f = contextFiles.value.find(
    (f) =>
      f.name?.toLowerCase().endsWith(".md") && f.text?.includes("soul_cert:"),
  );
  return f?.name ?? null;
});

const certVersion = computed(() =>
  parseInt(soulContent.value.match(/cert_version:\s*(\d+)/)?.[1] ?? "0", 10)
);

const { loadContext: loadApiContext, saveContext, resetContext, syncedFiles, localFiles, sessionExpired } = useApiContext();
function onVaultUnlocked() {
  if (soulToken.value) loadApiContext(soulToken.value);
}

const activeDemo = ref(0);

const resetModalOpen = ref(false);
const createModalOpen = ref(false);
const exportHintOpen = ref(false);
const vaultSetupOpen = ref(false);
const encryptModalOpen  = ref(false);
const decryptModalOpen  = ref(false);
const activeModal = ref(null);

// Landing-Page UI-State
const loginSheetOpen = ref(false);
const loginError = ref("");
const navMenuOpen    = ref(false);
const setupModalOpen = ref(false);
const faqOpenIndex = ref(null);

const privacyFaqOpen = ref(false);

const { mutualCount } = useVaultConnections();


const legalLinks = [
  { key: "impressum", label: "Impressum" },
  { key: "datenschutz", label: "Datenschutz" },
  { key: "lizenz", label: "Lizenz" },
];


// ── Landing Page Daten ─────────────────────────────────────────────────────

const demoSoulFacts = [
  'sys\.md liegt verschlüsselt in deinem eigenen Vault',
  'MCP-Token autorisiert den KI-Assistenten nur für freigegebene Scopes',
  'Kein Daten-Upload an KI-Anbieter — nur dein Token wird übertragen',
];

const demoChainFacts = [
  'Smart Contract auf Polygon Mainnet deployed',
  'keccak256(soul_id) → bytes32 onchain gespeichert',
  'KI liest nur — schreibt nie auf die Blockchain',
];

const demoNetworkFacts = [
  'Jede Verbindung ist gegenseitig und explizit bestätigt',
  'Freigegebene Inhalte pro Scope granular steuerbar',
  'Peer-Zugriff läuft über Soul-Grants — kein zentraler Dienst',
];

const demoCalendarFacts = [
  'Kalender-Einträge liegen in der eigenen sys\.md',
  'Externe Kalender (Google etc.) optional einbindbar',
  'KI fragt — schreibt nur auf explizite Anweisung',
];

const landingStats = [
  {
    icon: Lock,
    label: "AES-256",
    desc: "Client-seitig verschlüsselt (Standard)",
    color: "#e85000",
  },
  {
    icon: Cpu,
    label: "Blockchain-Anker",
    desc: "Optional · Polygon Mainnet",
    color: "#818cf8",
  },
  {
    icon: Fingerprint,
    label: "Soul API",
    desc: "Token-Auth · live",
    color: "#8b5cf6",
  },
  {
    icon: Shield,
    label: "Privacy by Design",
    desc: "Du behältst die Kontrolle",
    color: "#e85000",
  },
  {
    icon: Globe,
    label: "DSGVO-orientiert",
    desc: "Kein Tracking · Keine Werbung",
    color: "#d97706",
  },
];

const landingFeatures = [
  {
    icon: Key,
    title: "Soul Protocol",
    desc: "Eine kryptographisch signierte Identitätsdatei, die deine Persönlichkeit strukturiert erfasst und durch jede Session weiterentwickelt wird.",
    color: "#e85000",
    colorLight: "#c04400",
    bg: "rgba(232,80,0,0.04)",
    bgLight: "#ffffff",
    border: "rgba(232,80,0,0.16)",
    borderLight: "rgba(192,68,0,0.30)",
    iconBg: "rgba(232,80,0,0.09)",
    iconBgLight: "rgba(192,68,0,0.12)",
    points: [
      "HMAC-SHA256 Signatur",
      "sys\.md Open Format",
      "Soul Kalender (Vault-Sync + API-Freigabe)",
      "Wächst mit jeder Session",
      "Blockchain-Anker (optional)",
    ],
  },
  {
    icon: Database,
    title: "Memory Vault",
    desc: "Dein lokaler, verschlüsselter Ordner für alles, was dich ausmacht – Stimme, Gesicht, Bewegung, Bilder, Texte. Lokal auf deinem Gerät.",
    color: "#8b5cf6",
    colorLight: "#5b21b6",
    bg: "rgba(139,92,246,0.04)",
    bgLight: "#ffffff",
    border: "rgba(139,92,246,0.16)",
    borderLight: "rgba(91,33,182,0.35)",
    iconBg: "rgba(139,92,246,0.09)",
    iconBgLight: "rgba(91,33,182,0.14)",
    points: [
      "Stimme, Gesicht & Bewegung",
      "AES-256-GCM + Passkey (WebAuthn PRF)",
      "12-Wort BIP39 Recovery",
      "Vault Explorer (Bulk-Upload, Multi-Select)",
      "Geräteübergreifender Import",
    ],
  },
  {
    icon: Brain,
    title: "AI Interface",
    desc: "Sprich mit einer KI, die deine Soul kennt. Gedanken werden analysiert, die Soul automatisch angereichert – dein Profil wächst mit.",
    color: "rgba(228,230,240,0.80)",
    colorLight: "#5b21b6",
    bg: "rgba(255,255,255,0.025)",
    bgLight: "#ffffff",
    border: "rgba(255,255,255,0.10)",
    borderLight: "rgba(91,33,182,0.35)",
    iconBg: "rgba(255,255,255,0.06)",
    iconBgLight: "rgba(91,33,182,0.14)",
    points: [
      "Soul als Kontext für KI",
      "Streaming-Antworten (SSE)",
      "Automatische Soul-Anreicherung",
      "Vision Pipeline (Kamera → Bild/Video-Gen)",
      "Session-Analyse & Wachstum",
    ],
  },
  {
    icon: Globe,
    title: "Soul API",
    desc: "Gib externen Diensten kontrollierten Zugriff auf deine Soul-Daten. Stimme, Gesicht, Kontext – du bestimmst, was freigegeben wird.",
    color: "#d97706",
    colorLight: "#b45309",
    bg: "rgba(217,119,6,0.04)",
    bgLight: "#ffffff",
    border: "rgba(217,119,6,0.16)",
    borderLight: "rgba(180,83,9,0.30)",
    iconBg: "rgba(217,119,6,0.09)",
    iconBgLight: "rgba(180,83,9,0.12)",
    points: [
      "Webhook-Token Authentifizierung",
      "6 granulare Berechtigungen (inkl. Kalender)",
      "Service-Tokens für Drittdienste",
      "Offene Webhook-Schnittstelle für externe Dienste",
      "Soul Grants für Peer-to-Peer-Sharing",
    ],
  },
];

const landingSteps = [
  {
    icon: Key,
    title: "Soul erstellen",
    desc: "Erzeuge eine kryptographisch signierte Identität im Browser. Kein Account, kein Passwort – du bist dein eigener Schlüssel.",
  },
  {
    icon: Database,
    title: "Vault verbinden",
    desc: "Wähle einen lokalen Ordner als deinen Vault. Alles bleibt auf deinem Gerät – optional AES-256 verschlüsselt.",
  },
  {
    icon: Fingerprint,
    title: "Profil aufbauen",
    desc: "Nimm deine Stimme auf, lass dein Gesicht und deine Bewegung erfassen. Dein Vault speichert, was dich ausmacht.",
  },
  {
    icon: Brain,
    title: "Soul anreichern",
    desc: "Jede Session mit der KI entwickelt deine Soul weiter. Gedanken, Muster, Persönlichkeit – wächst automatisch.",
  },
  {
    icon: Globe,
    title: "Verankern & freigeben",
    desc: "Verankere deine Soul auf der Blockchain. Gib über die API gezielt frei, was externe Dienste sehen dürfen.",
  },
];

const landingTechStack = [
  {
    icon: Code,
    title: "sys\.md Format",
    tag: "OPEN FORMAT",
    desc: "Markdown-Datei mit YAML-Frontmatter. Lesbar für Menschen, strukturiert auswertbar für Software – offen dokumentiert.",
  },
  {
    icon: Lock,
    title: "AES-256-GCM",
    tag: "VERSCHLÜSSELUNG",
    desc: "Ende-zu-Ende-Verschlüsselung mit PBKDF2-basierter Schlüsselableitung aus einer 12-Wort BIP39-Mnemonic.",
  },
  {
    icon: Server,
    title: "Soul API & Webhook",
    tag: "LIVE ✓",
    desc: "OpenResty-Proxy mit drei Auth-Zweigen: Soul-Cert, Webhook-Token (HMAC) und Service-Token mit granularen Rechten.",
  },
  {
    icon: Layers,
    title: "Blockchain Anchor",
    tag: "OPTIONAL",
    desc: "HMAC-signierter On-Chain-Eintrag auf Polygon als unveränderlicher Zeitstempel und Autorenschaftsnachweis.",
  },
];

const landingPrivacy = [
  {
    icon: Shield,
    title: "Lokale Datenhaltung",
    desc: "Persönliche Inhalte werden standardmäßig lokal auf deinem Gerät gespeichert.",
  },
  {
    icon: Fingerprint,
    title: "Keine Tracking-Systeme",
    desc: "Das Tool verwendet keine Tracking-Technologien oder Profiling-Mechanismen.",
  },
  {
    icon: Code,
    title: "Transparente Architektur",
    desc: "Das Datenmodell und die Funktionsweise des Tools sind offen dokumentiert.",
  },
  {
    icon: Key,
    title: "Kontrolle über Daten",
    desc: "Du entscheidest selbst, ob Inhalte exportiert oder extern gespeichert werden.",
  },
];

const landingRoadmap = [
  {
    active: false,
    status: "DONE",
    timeline: "Alpha · 2026 ✓",
    color: "#4ade80",
    title: "Core · Deployed",
    items: [
      "Soul Protocol (sys\.md, HMAC-Signatur)",
      "Memory Vault (AES-256, BIP39 + Passkey)",
      "Stimme, Gesicht & Bewegung erfassen",
      "KI-Interface mit Soul-Anreicherung",
      "Soul API & Webhook (Token-Auth)",
      "Soul Kalender (Vault-Sync + API-Freigabe)",
      "Vault Explorer (Bulk-Upload, Multi-Select)",
      "Vision Pipeline (Kamera → Bild/Video-Gen)",
      "Browser Extension (Chrome MV3)",
      "PWA Mobile (iOS & Android)",
      "Blockchain-Anker (Polygon Mainnet)",
    ],
  },
  {
    active: true,
    status: "LIVE",
    timeline: "Beta · 2026",
    color: "#818cf8",
    title: "Erweiterte Identität",
    items: [
      "Mehrsprachige Interfaces",
      "Mehrere Soul-Versionen verwalten",
      "Erweiterte API-Dokumentation",
      "Offene Protokoll-Dokumentation",
    ],
  },
  {
    active: false,
    status: "VISION",
    timeline: "Langfristig",
    color: "#8b5cf6",
    title: "Offenes Ökosystem",
    items: [
      "Interoperable Soul-Identitäten",
      "Robotik-Integration",
      "Dezentrales Identity-Protokoll",
      "Community-Governance des Protokolls",
    ],
  },
];

const ecosystemPhases = [
  {
    phase: "01",
    subtitle: "Live · Beta",
    title: "Digitale Identität",
    desc: "Soul erstellen, Vault verschlüsseln, Stimme und Gesicht aufnehmen. Die Basis deiner digitalen Persönlichkeit – lokal, sicher, unter deiner Kontrolle.",
    color: "rgba(255,255,255,0.55)",
    lucideIcon: Key,
    img: "/ecosystem/phase1-soul.png",
    items: [
      "sys\.md + Memory Vault",
      "Stimme, Gesicht, Bewegung",
      "KI-Interface & Anreicherung",
      "Soul Kalender (Vault-Sync)",
      "Vault Explorer",
      "Vision Pipeline",
      "Blockchain-Anker",
    ],
  },
  {
    phase: "02",
    subtitle: "Live · Beta",
    title: "Soul API & Dienste",
    desc: "Externe Dienste können mit Erlaubnis auf deine Soul-Daten zugreifen. Token-basierte Authentifizierung, granulare Berechtigungen – du entscheidest was freigegeben wird.",
    color: "rgba(255,255,255,0.45)",
    lucideIcon: Globe,
    img: "/ecosystem/phase2-network.png",
    items: [
      "Webhook-Token Auth",
      "6 granulare Permissions inkl. Kalender",
      "Browser Extension (Chrome MV3)",
      "PWA Mobile",
      "Vault-Session-Management",
    ],
  },
  {
    phase: "03",
    subtitle: "Vision",
    title: "Agent-Integration",
    desc: "Die Soul API macht es möglich, dass Agenten — Sprach-KI, Bots, Assistenten — die Persönlichkeit einer Person authentisch vertreten können.",
    color: "rgba(255,255,255,0.40)",
    lucideIcon: Code,
    img: "/ecosystem/phase3-api.png",
    items: [
      "Digitale Repräsentation",
      "Sprach-Agent mit Soul-Kontext",
      "Orientiert an EU AI Act Art. 52",
      "Klare Transparenz-Regeln",
    ],
  },
  {
    phase: "04",
    subtitle: "Langfristig",
    title: "Offenes Ökosystem",
    desc: "Das Soul-Protokoll als offener Standard für digitale Identität — nutzbar von beliebiger Software, portierbar zwischen Systemen.",
    color: "rgba(255,255,255,0.40)",
    lucideIcon: Cpu,
    img: "/ecosystem/phase4-robot.png",
    items: [
      "Interoperable Identitäten",
      "Dezentrales Protokoll",
      "Forschung & Governance",
      "Humanoide Systeme",
    ],
  },
];

const landingFAQ = [
  {
    q: "Was ist eine Soul?",
    a: "Eine Soul ist deine persönliche Identitätsdatei (sys.md) — kryptographisch signiert, lokal gespeichert. Sie enthält dein Profil, deine Gedanken und wächst mit jeder Session. Die KI nutzt sie als Kontext, damit Gespräche wirklich zu dir passen.",
  },
  {
    q: "Was kann ich im Vault speichern?",
    a: "Stimme, Gesicht, Bewegung, Bilder, Texte — alles, was du für dein digitales Profil aufnehmen willst. Der Vault ist ein lokaler Ordner auf deinem Gerät. Alle Inhalte werden standardmäßig AES-256-CBC verschlüsselt bevor sie den Browser verlassen — Klartext verlässt dein Gerät nie.",
  },
  {
    q: "Wie muss der Vault-Ordner aufgebaut sein?",
    html: `<p class="mb-3">Der Vault ist ein gewöhnlicher Ordner auf deinem Gerät — der Aufbau spiegelt 1:1 die Struktur auf dem Server wider:</p>
<pre class="text-xs font-mono leading-relaxed bg-[rgba(255,255,255,0.03)] border border-white/8 rounded-xl px-4 py-3 overflow-x-auto whitespace-pre" style="color:rgba(255,255,255,0.65)">MeinVault/
├── sys.md                   ← wird automatisch verwaltet
│
├── profile/
│   └── expertise.json        ← KI-Profil (Name frei wählbar)
│
├── audio/                    ← Sprachaufnahmen
│   └── voice.webm / .mp3
│
├── video/                    ← Bewegungsaufnahmen
│   └── motion.mp4 / .webm
│
├── images/                   ← Bilder &amp; Fotos
│   └── photo.jpg / .png / .webp
│
├── context/                  ← Kontext-Textdateien
│   └── notizen.md / .txt
│
└── profile.jpg               ← Profilbild (exakter Dateiname)</pre>
<p class="mt-3 text-xs" style="color:rgba(255,255,255,0.38)">Alle Unterordner werden beim ersten Verbinden automatisch angelegt. KI-Profile müssen als <code class="font-mono">{name}.json</code> im Unterordner <code class="font-mono">profile/</code> liegen.</p>`,
  },
  {
    q: "Was passiert mit meinen Daten?",
    a: "Deine Daten bleiben lokal auf deinem Gerät — und verlassen es standardmäßig nur verschlüsselt. Alles was auf den Server hochgeladen wird, ist AES-256-CBC verschlüsselt. Wenn du die Soul API nutzt, gibst du explizit und kontrolliert bestimmte Inhalte frei. Im Open-Modus (opt-in) liegt die Soul unverschlüsselt vor — für öffentliche Souls gedacht.",
  },
  {
    q: "Kann der Server-Betreiber meine Daten lesen?",
    html: `<p class="mb-4 text-sm text-[var(--sys-fg-muted)]">Es gibt zwei klar getrennte Vertrauensebenen — du wählst bewusst:</p>
<div class="space-y-3">
  <div class="rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] p-4">
    <p class="text-xs font-semibold tracking-widest uppercase mb-1 text-[var(--sys-fg)]">Stufe 1 · Agent-Betrieb (AES-256-CBC)</p>
    <p class="text-xs leading-relaxed mb-2 text-[var(--sys-fg-muted)]">Browser verschlüsselt → VPS speichert Ciphertext + <code class="font-mono text-[var(--sys-fg-dim)]">vault_key_hex</code> → Server entschlüsselt für MCP-Agenten und Webhooks.</p>
    <p class="text-xs text-[var(--sys-fg-dim)]">⚠ Der Server-Betreiber könnte theoretisch entschlüsseln, da der Schlüssel auf dem Server liegt. Dieser Kompromiss ist notwendig damit Agenten funktionieren.</p>
  </div>
  <div class="rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] p-4">
    <p class="text-xs font-semibold tracking-widest uppercase mb-1 text-[var(--sys-fg)]">Stufe 2 · Zero-Knowledge (AES-256-GCM)</p>
    <p class="text-xs leading-relaxed mb-2 text-[var(--sys-fg-muted)]">Browser verschlüsselt mit 12 Wörtern → <code class="font-mono text-[var(--sys-fg-dim)]">.soul</code>-Bundle wird lokal heruntergeladen. Der Schlüssel berührt den Server <strong class="text-[var(--sys-fg)]">niemals</strong>. Auf Papier notiert: portabel, langlebig, nachlasstauglich.</p>
    <p class="text-xs text-[var(--sys-fg-muted)]">✓ Mathematisch nachweisbar: Auch mit vollem Server-Zugriff kann der Betreiber nicht entschlüsseln. Empfohlen als regelmäßiges Backup zusätzlich zu Stufe 1.</p>
  </div>
</div>`,
  },
  {
    q: "Was ist die Soul API?",
    a: "Ein Token-gesicherter Webhook-Endpunkt auf deinem eigenen Server. Externe Dienste können mit deiner Erlaubnis auf Soul-Daten zugreifen — du bestimmst über Berechtigungen, welche Inhalte (Audio, Video, Kontext) freigegeben werden.",
  },
  {
    q: "Funktioniert SaveYourSoul auf jedem Gerät?",
    a: "Die App läuft im Browser und kann als PWA installiert werden. Für den lokalen Vault wird die File System Access API benötigt — derzeit in Chromium-basierten Browsern verfügbar. iOS-Unterstützung ist in Arbeit.",
  },
  {
    q: "Kann ich meine Soul auf mehreren Geräten nutzen?",
    a: "Ja. Den Vault verschlüsselt herunterladen (.soul-Bundle), auf beliebigem Speicher ablegen (Google Drive, Arweave, USB …) und beim Login auf dem anderen Gerät die URL eingeben. Das Bundle wird geladen und mit den 12 Schlüsselwörtern entschlüsselt — kein automatischer Sync nötig.",
  },
  {
    q: "Wie wächst meine Soul?",
    a: "Nach jeder Chat-Session kannst du deine Soul anreichern lassen. Die KI analysiert das Gespräch und aktualisiert relevante Abschnitte in deiner sys.md — automatisch. Mit dem MCP-Prompt /soul_guide schreibt die KI eigenständig nach bedeutsamen Gesprächen.",
  },
  {
    q: "Was ist der Blockchain-Anker?",
    a: "Ein optionaler HMAC-signierter Eintrag auf Polygon, der deinen Soul-Hash mit Zeitstempel on-chain speichert. Damit kannst du Autorenschaft und Zeitpunkt deiner Identitätsdatei unveränderlich nachweisen.",
  },
  {
    q: "Was bedeutet sys.md als offenes Protokoll?",
    a: "sys.md ist keine proprietäre Datenstruktur — es ist eine lesbare Markdown-Datei, die jede KI als Kontext verwenden kann. Wer die Soul-ID kennt und einen Service-Token hat, kann die Soul abrufen. Der Server entschlüsselt dabei serverseitig — der Empfänger bekommt immer Klartext. Kein Plattformzwang, kein Vendor-Lock-in. Das MCP-Protokoll (Model Context Protocol) macht das für KI-Agenten standardisiert nutzbar.",
  },
  {
    q: "Was kann ein KI-Agent über MCP mit meiner Soul tun?",
    a: "Er kann deine Soul lesen (soul_read), Vault-Dateien abrufen (audio_get, image_get, video_get), Profile analysieren und speichern (profile_save), deine Soul schreiben (soul_write) und externe Dienste in deinem Namen konfigurieren — mit deinen eigenen API-Keys, die nur für die Dauer des Calls im RAM existieren. Kein Key liegt auf dem Server.",
  },
  {
    q: "Ist das hier ein KI-Klon von mir?",
    a: "Nein. SaveYourSoul ist ein Werkzeug zur digitalen Identitätsverwaltung. Was andere damit bauen — Agenten, Assistenten, Bots — liegt in ihrer Verantwortung und muss den geltenden Transparenzregeln entsprechen (EU AI Act Art. 52).",
  },
  {
    q: "Ist SaveYourSoul eine Plattform oder ein Netzwerk?",
    a: "Nein. SaveYourSoul ist ein lokales Software-Tool für digitale Identität. Es betreibt kein soziales Netzwerk und keine zentralisierte Plattform. Deine Soul gehört dir.",
  },
  {
    q: "Wie wähle ich meine Verschlüsselungsmethode — und was passiert wenn ich sie wechsle?",
    html: `<p class="mb-4 text-sm text-[var(--sys-fg-muted)]">Beim ersten Vault-Öffnen wählst du einmalig deine Methode — sie bleibt für alle Dateien auf diesem Vault gültig:</p>
<div class="space-y-3 mb-4">
  <div class="rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] p-4">
    <p class="text-xs font-semibold tracking-widest uppercase mb-1 text-[var(--sys-fg)]">📝 12 Wörter (Mnemonic)</p>
    <p class="text-xs leading-relaxed text-[var(--sys-fg-muted)]">Deterministisch und geräteunabhängig. Dieselben 12 Wörter auf jedem Gerät ergeben immer denselben Schlüssel. Geeignet wenn du auf mehreren Geräten ohne Passkey-Sync arbeitest.</p>
  </div>
  <div class="rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] p-4">
    <p class="text-xs font-semibold tracking-widest uppercase mb-1 text-[var(--sys-fg)]">🔑 Passkey (Face ID · Touch ID · Fingerabdruck)</p>
    <p class="text-xs leading-relaxed text-[var(--sys-fg-muted)]">Schlüssel wird aus dem Secure Enclave des Geräts abgeleitet. Auf Apple-Geräten via iCloud Keychain geräteübergreifend sync. Auf Android via Google Password Manager — zeigt Bildschirmsperre (Fingerabdruck wenn in Android-Einstellungen eingerichtet).</p>
  </div>
</div>
<p class="text-xs leading-relaxed text-[var(--sys-fg-dim)]">⚠ Mnemonic und Passkey erzeugen <strong class="text-[var(--sys-fg-muted)]">unterschiedliche Schlüssel</strong>. Wer auf PC mit Mnemonic verschlüsselt, muss auf dem Handy dieselbe Mnemonic eingeben — nicht Passkey. Das Vault-Panel zeigt dir immer die zuletzt verwendete Methode an.</p>`,
  },
  {
    q: "Vault sperren und wieder öffnen — was passiert mit laufenden Verbindungen?",
    html: `<p class="mb-4 text-sm text-[var(--sys-fg-muted)]">Vault-Session und MCP/Webhook-Verbindungen sind unabhängig:</p>
<div class="space-y-3">
  <div class="rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] p-4">
    <p class="text-xs font-semibold tracking-widest uppercase mb-1 text-[var(--sys-fg)]">Vault sperren</p>
    <p class="text-xs leading-relaxed text-[var(--sys-fg-muted)]">Der Schlüssel wird aus dem Server-Memory gelöscht. MCP-Agenten können verschlüsselte Dateien in dieser Zeit nicht entschlüsseln.</p>
  </div>
  <div class="rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] p-4">
    <p class="text-xs font-semibold tracking-widest uppercase mb-1 text-[var(--sys-fg)]">Vault wieder öffnen (gleiche Methode)</p>
    <p class="text-xs leading-relaxed text-[var(--sys-fg-muted)]">Schlüssel ist wieder verfügbar. MCP und alle verbundenen Dienste arbeiten sofort weiter — kein Reconnect, kein neues Token nötig. Der Key ändert sich nicht.</p>
  </div>
  <div class="rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] p-4">
    <p class="text-xs font-semibold tracking-widest uppercase mb-1 text-[var(--sys-fg)]">Tipp: Unbegrenzte Dauer</p>
    <p class="text-xs leading-relaxed text-[var(--sys-fg-muted)]">Wenn dein Vault dauerhaft für Agenten und Verbindungen erreichbar sein soll, wähle beim Öffnen „∞". Der Schlüssel bleibt im Server-Memory bis du manuell sperrst.</p>
  </div>
</div>`,
  },
  {
    q: "Muss ich den Vault öffnen bevor ich synchronisiere?",
    a: "Ja — der Sync verschlüsselt alle Dateien mit deinem Vault-Schlüssel bevor sie den Browser verlassen. Ohne offenen Vault fehlt dieser Schlüssel und der Sync wird abgebrochen. Öffne immer zuerst den Vault (Vault-Zugang → entsperren), dann erst synchronisieren. Das gilt für alle Geräte und nach jedem Seiten-Reload.",
  },
  {
    q: "Ich habe meinen Browser-Cache geleert — was passiert mit meiner Verschlüsselung?",
    html: `<p class="mb-4 text-sm text-[var(--sys-fg-muted)]">Deine Vault-Dateien auf dem Server sind sicher — der Schlüssel ist daraus nicht ableitbar. Was verloren geht:</p>
<div class="space-y-3 mb-4">
  <div class="rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] p-4">
    <p class="text-xs font-semibold tracking-widest uppercase mb-1 text-[var(--sys-fg)]">Was weg ist</p>
    <p class="text-xs leading-relaxed text-[var(--sys-fg-muted)]">Der Hinweis auf deine zuletzt verwendete Methode (localStorage) und der session-gesicherte Schlüssel (sessionStorage).</p>
  </div>
  <div class="rounded-xl border border-[var(--sys-border)] bg-[var(--sys-bg-surface)] p-4">
    <p class="text-xs font-semibold tracking-widest uppercase mb-1 text-[var(--sys-fg)]">Lösung</p>
    <p class="text-xs leading-relaxed text-[var(--sys-fg-muted)]">Vault erneut mit der ursprünglichen Methode öffnen — 12 Wörter oder Passkey. Der Schlüssel ist deterministisch: gleiche Eingabe → gleicher Schlüssel → Zugriff wie zuvor.</p>
  </div>
</div>`,
  },
  {
    q: "Was ist das Soul Network?",
    html: `<p class="text-xs text-[var(--sys-amber)]/80 bg-[var(--sys-amber)]/5 border border-[var(--sys-amber)]/20 rounded-lg px-3 py-2 mb-3">⚠ In aktiver Entwicklung — Funktionen und Freigabe-Modell können sich kurzfristig ändern.</p><p class="font-content text-base text-[var(--sys-fg-muted)] leading-relaxed">Das Soul Network ermöglicht es, Souls direkt peer-to-peer miteinander zu verbinden. Du gibst deine Soul-ID an Personen weiter, denen du vertraust. Sobald beide Seiten verbunden haben (gegenseitig / mutual), wird automatisch ein soul_grant angelegt — kein manuelles Konfigurieren nötig. KI-Agenten können dann den freigegebenen Kontext verbundener Souls in ihre Antworten einbeziehen. Alle Inhalte — Audio, Bilder, Video, Dokumente (PDF, MD, TXT) — müssen explizit im Bereich Netzwerk-Freigaben freigegeben werden. Nur was du freigibst, ist sichtbar.</p>`,
  },
  {
    q: "Was muss ich für das Soul Network einrichten?",
    a: "Drei Schritte: (1) Verbindung aufbauen — Soul-ID austauschen und im Soul Network eingeben. Der soul_grant wird automatisch angelegt. (2) Inhalte freigeben — im Bereich Netzwerk-Freigaben gewünschte Dateien hinzufügen: Audio, Bilder, Video, Kontext-Dokumente (PDF, MD, TXT). Jede Datei die du hinzufügst wird sofort in den Public Vault hochgeladen. Granulare Kontrolle: Permission-Scopes und Dateifreigabe sind zwei getrennte Ebenen — beides muss aktiv sein. (3) Vault-Zugang offen halten — die Kachel Vault-Zugang muss aktiv sein, damit verbundene Souls auf Inhalte zugreifen können.",
  },
  {
    q: "Wie sicher ist die Vault-ID als Zugangskontrolle?",
    a: "Die Vault-ID ist ein Out-of-Band-Secret: Sie steht nirgendwo öffentlich, kann nicht erraten oder gesucht werden. Die einzige Möglichkeit, sie zu erhalten, ist die direkte persönliche Weitergabe durch dich. Damit ist jede Netzwerkverbindung ein kryptographisch verankierter Vertrauensbeweis einer realen Beziehung.",
  },
  {
    q: "Was sieht ein KI-Agent, der auf das Soul Network zugreift?",
    a: "Der Agent sieht nur die Inhalte, die du explizit freigegeben hast — und nur dann, wenn dein Vault geöffnet ist. Bei vernetzten Souls sieht er zusätzlich die freigegebenen Inhalte verbundener Souls. Keine Verbindung, keine Daten.",
  },
];

// ── App-Logik (unverändert) ────────────────────────────────────────────────

onMounted(async () => {
  load();
  if (hasSoul.value && soulMeta.value?.id) {
    // Server-Vault-Check: wenn der Cert abgelehnt wird (Vault gelöscht / cert_version-Konflikt)
    // → sofort ausloggen. VaultExplorer ist nur bei offenem Datei-Panel gemountet und kann
    // diese Erkennung sonst nicht liefern.
    if (soulToken.value && soulToken.value !== "anonymous") {
      try {
        const probe = await fetch("/api/context", {
          headers: { Authorization: `Bearer ${soulToken.value}` }
        });
        if (probe.status === 401) {
          const vaultWasOk = sessionStorage.getItem("sys.vault_ok") === soulMeta.value?.id;
          if (vaultWasOk) {
            vaultDeletedModalOpen.value = true;
            return; // Vault war vorhanden, jetzt weg → ausloggen
          }
          // Kein vault_ok → Vault war noch nie eingerichtet, normal weiter
        }
      } catch { /* Server nicht erreichbar — offline, weitermachen */ }
    }

    const restored = await restoreVault(soulMeta.value.id);
    if (restored) {
      updateVaultInSoul(fileManifest.value);
    } else {
      loadProfileLocal(soulMeta.value.id);
    }
  } else {
    loadProfileLocal();
  }
});

// Heartbeat: prüft alle 15 Sekunden ob der Server-Vault noch existiert.
// Erkennt Vault-Löschung unmittelbar in laufender Session — ohne Page-Reload.
let _heartbeatTimer = null;
async function _vaultHeartbeat() {
  if (!hasSoul.value || !soulToken.value || soulToken.value === "anonymous") return;
  if (isLoginInProgress.value || vaultDeletedModalOpen.value) return;
  if (document.visibilityState === "hidden") return;
  try {
    const res = await fetch("/api/context", {
      headers: { Authorization: `Bearer ${soulToken.value}` }
    });
    if (res.status === 401) {
      const vaultWasOk = sessionStorage.getItem("sys.vault_ok") === soulMeta.value?.id;
      if (vaultWasOk) sessionExpired.value = true;
    }
  } catch { /* offline — ignorieren */ }
}
onMounted(() => {
  _heartbeatTimer = setInterval(_vaultHeartbeat, 15_000);
});
onUnmounted(() => {
  clearInterval(_heartbeatTimer);
});

// Soul-Wechsel im selben Tab (ohne Page-Reload): Vault-State der alten Soul sauber löschen.
// Kein auto-Restore — verhindert, dass Profile aus alten Vault-Verzeichnissen übernommen werden.
// Der User verbindet den Vault der neuen Soul manuell oder per Page-Reload.
watch(() => soulMeta.value?.id, async (newId, oldId) => {
  if (!newId || newId === oldId) return;
  if (oldId) await clearVault();
  // Restore new soul's locally-saved profile (if any)
  loadProfileLocal(newId);
});

function handleCreateNew() {
  createModalOpen.value = true;
}

async function handleSoulCreated({ name, idea }) {
  createModalOpen.value = false;
  clearVault();
  resetContext();
  await createNew(name, idea);
  vaultSetupOpen.value = true;
}

async function handleVaultSetupClick() {
  if (!soulMeta.value?.id) return;
  const connected = await connectVault(soulMeta.value.id);
  if (connected) updateVaultInSoul(fileManifest.value);
}

function handleAfterVaultSetup() {
  vaultSetupOpen.value = false;
}

async function handleVaultConnectFromIndex() {
  if (!soulMeta.value?.id) return;
  const connected = await connectVault(soulMeta.value.id);
  if (connected) updateVaultInSoul(fileManifest.value);
}

// ── Vault-Kontext-Menü ─────────────────────────────────────────────────────
const filesOpen = ref(false);

async function handleProfileUpload(e) {
  const file = e.target?.files?.[0];
  if (!file) return;
  if (vaultConnected.value) {
    const ok = await writeProfileImage(file);
    if (ok) updateVaultInSoul(fileManifest.value);
  } else {
    await setProfileLocal(file, soulMeta.value?.id);
  }
  e.target.value = "";
}

// Soul-Wechsel: aktuelle Soul aus sessionStorage entfernen, dann Upload-Sheet öffnen.
// Stellt sicher dass nach einem fehlgeschlagenen Upload kein alter Stand zurückbleibt.
function switchSoul() {
  clearVault();
  resetContext();
  clear();
  loginSheetOpen.value = true;
  loginError.value = "";
  navMenuOpen.value = false;
}

// Globale 401-Erkennung: loadContext (useApiContext) setzt sessionExpired wenn der Server
// den Cert ablehnt. Passiert in jeder laufenden Session — unabhängig davon welches Panel
// gerade offen ist. Während des Login-Flows (isLoginInProgress) wird der Logout unterdrückt.
const vaultDeletedModalOpen = ref(false);
watch(sessionExpired, (expired) => {
  if (!expired) return;
  sessionExpired.value = false;
  if (!isLoginInProgress.value) {
    vaultDeletedModalOpen.value = true;
  }
});
function confirmVaultDeleted() {
  vaultDeletedModalOpen.value = false;
  switchSoul();
}

async function handleSoulUploaded(content) {
  loginError.value = "";

  // Soul-Cert serverseitig verifizieren (HMAC-Check gegen SOUL_MASTER_KEY)
  const soulIdMatch    = content.match(/soul_id:\s*(.+)/);
  const certMatch      = content.match(/soul_cert:\s*([a-f0-9]{20,})/i);
  // cert_version aus der Datei lesen — Pflicht für korrekte HMAC-Verifikation nach Rotation.
  // Ohne cert_version würde /api/soul-cert die Version-0-Cert zurückgeben und den
  // rotierten Cert überschreiben, was nach dem nächsten Login zu 401 führt.
  const certVersionMatch = content.match(/cert_version:\s*(\d+)/);
  const certVersion      = certVersionMatch ? parseInt(certVersionMatch[1], 10) : 0;

  if (soulIdMatch) {
    const soulId = soulIdMatch[1].trim();
    try {
      const res = await fetch("/api/soul-cert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soul_id: soulId, cert_version: certVersion }),
      });
      if (res.ok) {
        const { cert } = await res.json();
        // Cert aktualisieren nur wenn Datei keinen oder einen ungültigen Cert hat.
        // Nach Rotation stimmt cert_version > 0 exakt mit dem Datei-Cert überein.
        if (cert && certMatch && cert !== certMatch[1].trim()) {
          content = updateFrontmatterField(content, "soul_cert", cert);
        } else if (cert && !certMatch) {
          content = content.replace(/^(soul_id:.+)$/m, `$1\nsoul_cert: ${cert}`);
        }
      }
      // Server nicht erreichbar → fail-open
    } catch {
      /* offline – weiter */
    }
  }

  clearVault();
  resetContext();
  // Flag setzen BEVOR importFromText — verhindert dass der cert-Watcher in VaultExplorer
  // logout-required emittiert während resetCertToV0 den Cert noch repariert.
  isLoginInProgress.value = true;
  importFromText(content);
  // Cert-Validierung nach Import: erkennt cert_version-Konflikt wenn Server-Vault
  // manuell gelöscht wurde (api_context.json fehlt → cert_version fällt auf 0).
  // Muss nach importFromText laufen, damit soulContent.value aktuell ist.
  await resetCertToV0();
  isLoginInProgress.value = false;
  loginSheetOpen.value = false;
}

function goToSession() {
  router.push("/session");
}


function confirmReset() {
  exportHintOpen.value = true;
}

function openResetFromHint() {
  exportHintOpen.value = false;
  resetModalOpen.value = true;
}

function handleReset() {
  clearVault();
  clear();
  resetContext();
  resetModalOpen.value = false;
}
</script>

<style scoped>
.vault-explorer-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.vault-explorer-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.vault-explorer-enter-from  { opacity: 0; transform: translateY(-6px); }
.vault-explorer-leave-to    { opacity: 0; transform: translateY(-4px); }
</style>
