<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/70 backdrop-blur-sm"
          @click="handleClose"
        ></div>

        <!-- Card -->
        <div
          class="relative bg-[var(--sys-bg-elevated)] border border-[var(--sys-border)] rounded-2xl px-5 pt-5 pb-6 z-10 max-h-[92dvh] overflow-y-auto w-full max-w-sm shadow-2xl"
        >

          <!-- Header -->
          <div class="flex items-start justify-between mb-5 gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <!-- Polygon hexagon icon -->
              <div class="w-9 h-9 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.10)] flex items-center justify-center flex-none">
                <svg class="w-4 h-4 text-white/55" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 2.25 21 7.5v9L12 21.75 3 16.5v-9L12 2.25z"/>
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-xs tracking-[0.18em] text-white/80 uppercase">Polygon</p>
                <h2 class="text-base font-bold text-[var(--sys-fg)] leading-tight">Soul verankern</h2>
              </div>
            </div>
            <button
              @click="handleClose"
              class="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--sys-border)] text-[var(--sys-fg-dim)] hover:text-[var(--sys-fg)] hover:border-white/20 transition-all flex-none"
              aria-label="Schließen"
            >✕</button>
          </div>

          <!-- ── Anchor status card ────────────────────────────────────────── -->
          <div
            class="relative rounded-2xl overflow-hidden mb-5 border transition-all duration-500"
            :class="hasAnchor
              ? 'border-white/15 bg-[rgba(255,255,255,0.03)]'
              : 'border-[var(--sys-border)] bg-[var(--sys-bg)]'"
          >
            <!-- Radial glow when anchored -->
            <div
              v-if="hasAnchor"
              class="absolute inset-0 pointer-events-none"
              style="background: radial-gradient(ellipse at 50% -10%, rgba(255,255,255,0.04) 0%, transparent 65%)"
            ></div>

            <div class="relative flex items-center gap-3 px-4 py-4">
              <!-- Dot vorne -->
              <span
                class="w-2 h-2 rounded-full flex-none transition-colors duration-500"
                :class="hasAnchor ? 'bg-white/50 soul-pulse' : 'bg-[var(--sys-fg-dim)]/40'"
              ></span>

              <p
                class="flex-1 text-sm font-bold transition-colors duration-500"
                :class="hasAnchor ? 'text-white/70' : 'text-[var(--sys-fg)]'"
              >
                {{ hasAnchor ? 'On-chain verankert' : 'Noch nicht verankert' }}
              </p>

              <!-- Icon hinten -->
              <svg
                class="w-4 h-4 flex-none transition-colors duration-500"
                :class="hasAnchor ? 'text-white/40' : 'text-[var(--sys-fg-dim)]'"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/>
              </svg>
            </div>
          </div>

          <!-- ── Wallet pill ──────────────────────────────────────────────── -->
          <div
            v-if="walletRestoring"
            class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--sys-bg)] border border-[var(--sys-border)] mb-3"
          >
            <svg class="w-3.5 h-3.5 flex-none animate-spin text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" d="M12 3a9 9 0 1 0 9 9"/>
            </svg>
            <span class="text-sm text-white/40">Wallet-Session prüfen…</span>
          </div>
          <div
            v-else-if="isConnected"
            class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--sys-bg)] border border-[var(--sys-border)] mb-3"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-white/50 flex-none soul-pulse"></span>
            <span class="text-sm font-mono text-white/82 truncate flex-1">{{ walletAddress }}</span>
            <span class="text-xs tracking-[0.08em] text-white/65 uppercase flex-none">{{ currentNetwork || 'Wallet' }}</span>
          </div>

          <!-- Separator with label -->
          <div class="flex items-center gap-3 mb-3">
            <div class="h-px flex-1 bg-[var(--sys-border)]"></div>
            <span class="text-xs font-medium text-[var(--sys-fg-dim)] uppercase tracking-widest">Aktionen</span>
            <div class="h-px flex-1 bg-[var(--sys-border)]"></div>
          </div>

          <!-- ── Actions ─────────────────────────────────────────────────── -->
          <div class="space-y-2 mb-4">
            <!-- Kein Ankern ohne Sessions -->
            <Alert v-if="!canAnchor" variant="info">
              Mindestens eine echte Session erforderlich.<br>
              Führe ein Enrichment durch — dann wird automatisch ein Growth-Eintrag gesetzt.
            </Alert>

            <!-- Connect / Disconnect Toggle (nur wenn canAnchor) -->
            <button
              v-if="canAnchor"
              @click="isConnected ? disconnectWallet() : connectWallet()"
              class="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
              :class="isConnected
                ? 'bg-red-950/25 border border-red-500/30 text-red-400/80 hover:bg-red-950/40 hover:border-red-500/50 hover:text-red-400'
                : 'bg-white/6 border border-white/15 text-white/65 hover:bg-white/10 hover:border-white/25 hover:text-white/85'"
            >
              <!-- Disconnect-Icon -->
              <svg v-if="isConnected" class="w-4 h-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"/>
              </svg>
              <!-- Connect-Icon -->
              <svg v-else class="w-4 h-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"/>
              </svg>
              {{ isConnected ? 'Wallet trennen' : 'Wallet verbinden' }}
            </button>

            <button
              @click="isCheckingRateLimit || isAnchoring ? handleCancel() : handleAnchor()"
              :disabled="!isConnected || !canAnchor || (rateLimitActive && !isAnchoring && !isCheckingRateLimit)"
              class="w-full h-12 flex items-center justify-center gap-2.5 rounded-xl text-sm font-bold transition-all active:not-disabled:scale-[0.98] disabled:cursor-not-allowed"
              :class="isCheckingRateLimit || isAnchoring
                ? 'bg-white/5 border border-white/10 text-white/55 hover:text-white/80 hover:border-white/20'
                : isConnected && !rateLimitActive && canAnchor
                  ? 'bg-white text-black hover:bg-white/90 hover:shadow-[0_0_0_2px_rgba(139,92,246,0.45),0_6px_24px_rgba(139,92,246,0.22)]'
                  : 'bg-white/5 border border-white/10 text-white/25'"
            >
              <svg v-if="isCheckingRateLimit || isAnchoring" class="w-4 h-4 animate-spin flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" d="M12 3a9 9 0 1 0 9 9"/>
              </svg>
              <svg v-else class="w-4 h-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/>
              </svg>
              {{ isCheckingRateLimit ? 'Prüfung läuft… Abbrechen' : isAnchoring ? 'Transaktion läuft… Abbrechen' : 'Soul verankern' }}
            </button>
          </div>

          <!-- Mobile-Hinweis während Transaktion -->
          <div v-if="isAnchoring" class="mb-3 sys-alert sys-alert-info">
            <svg class="sys-alert-icon w-3.5 h-3.5 animate-spin flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" d="M12 3a9 9 0 1 0 9 9"/>
            </svg>
            <div class="sys-alert-body">
              <p class="sys-alert-desc">Transaktion läuft — bitte in der Wallet-App bestätigen und danach hierher zurückkehren. Nicht schließen.</p>
            </div>
          </div>

          <!-- Rate-Limit-Hinweis -->
          <Alert v-if="rateLimitActive" variant="warning" class="mb-3">
            Rate-Limit aktiv – nächster Anker möglich:<br>
            <span class="font-semibold">{{ new Date(rateLimitUntil * 1000).toLocaleString('de-DE') }}</span>
          </Alert>

          <!-- Anchor error -->
          <Alert v-if="anchorError" variant="destructive" class="mb-3" :message="anchorError" />

          <!-- TX result card -->
          <Transition name="slide-up">
            <div v-if="anchorTx" class="mb-3 space-y-2">
              <!-- TX Hash + Explorer-Link -->
              <div class="px-4 py-3.5 rounded-xl bg-[var(--sys-bg)] border border-[rgba(255,255,255,0.12)]">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-3.5 h-3.5 text-white/60 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
                  </svg>
                  <span class="text-xs tracking-[0.10em] text-white/80 uppercase">Transaktion · {{ anchorNetwork }}</span>
                </div>
                <a
                  :href="anchorExplorerUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-start gap-1.5 text-xs text-white/90 font-mono hover:underline break-all"
                >
                  <span class="flex-1">{{ anchorTx }}</span>
                  <svg class="w-3 h-3 flex-none mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                  </svg>
                </a>
              </div>

              <!-- Download-Pflicht: sys.md enthält jetzt soul_chain_anchor -->
              <div class="px-3.5 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)]">
                <p class="text-xs text-white/82 leading-relaxed mb-2">
                  Ankereintrag in sys.md speichern – sonst geht er beim nächsten Upload verloren.
                </p>
                <button
                  @click="exportAsBlob"
                  class="sys-btn sys-btn-tonal w-full text-xs"
                >
                  <svg class="w-3.5 h-3.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                  </svg>
                  sys.md jetzt speichern
                </button>
              </div>
            </div>
          </Transition>

          <!-- ── Verification ─────────────────────────────────────────────── -->
          <div class="mb-6">
            <div class="h-px bg-[var(--sys-border)] mb-4"></div>

            <!-- Verifikation ist immer möglich – ohne Anker zeigt die Funktion einen klaren Hinweis -->
            <button
              @click="verifyLoading ? cancelVerify() : handleVerify()"
              class="w-full h-11 flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.03)] text-sm text-white/40 hover:text-white/65 hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.16)] active:scale-[0.98] transition-all"
            >
              <svg v-if="verifyLoading" class="w-3.5 h-3.5 animate-spin flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" d="M12 3a9 9 0 1 0 9 9"/>
              </svg>
              <svg v-else class="w-3.5 h-3.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/>
              </svg>
              {{ verifyLoading ? 'Prüft on-chain… Abbrechen' : 'Echtheit verifizieren' }}
            </button>

            <Transition name="slide-up">
              <div
                v-if="verifyResult || verifyError"
                class="mt-2 px-4 py-3.5 rounded-xl bg-[var(--sys-bg)] border space-y-1.5"
                :class="verifyError && !verifyResult
                  ? 'border-red-500/20'
                  : verifyResult?.found ? 'border-white/15' : 'border-red-500/20'"
              >
                <!-- Network/RPC error (no result) -->
                <div v-if="verifyError && !verifyResult" class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 flex-none text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                  </svg>
                  <span class="text-sm text-red-400 leading-relaxed">{{ verifyError }}</span>
                </div>
                <!-- Normal result -->
                <template v-if="verifyResult">
                  <div class="flex items-center gap-1.5">
                    <svg
                      class="w-4 h-4 flex-none"
                      :class="verifyResult.found ? 'text-white/65' : 'text-red-400'"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    >
                      <path v-if="verifyResult.found" stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
                      <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                    </svg>
                    <span class="text-sm font-semibold" :class="verifyResult.found ? 'text-white/90' : 'text-red-400'">
                      {{ verifyResult.found ? 'Authentisch on-chain' : 'Nicht gefunden' }}
                    </span>
                  </div>
                  <!-- Hash-Vergleich nur wenn tatsächlich Anchor-Daten vorhanden sind -->
                  <div
                    v-if="verifyResult.hashMatch !== undefined"
                    class="text-sm"
                    :class="verifyResult.hashMatch ? 'text-[var(--sys-fg-dim)]' : 'text-white/70'"
                  >
                    Hash: {{ verifyResult.hashMatch ? '✓ unverändert' : '⚠ Inhalt hat sich weiterentwickelt (normal)' }}
                  </div>
                  <div v-if="verifyResult.anchorDate" class="text-sm text-[var(--sys-fg-dim)]">
                    Verankert: <span class="text-[var(--sys-fg-muted)]">{{ verifyResult.anchorDate }}</span>
                  </div>
                  <div v-if="verifyResult.anchorSessions" class="text-sm text-[var(--sys-fg-dim)]">
                    Sessions: <span class="text-[var(--sys-fg-muted)]">{{ verifyResult.anchorSessions }}</span>
                  </div>
                  <div v-if="verifyResult.reason" class="text-sm text-white/70">{{ verifyResult.reason }}</div>
                </template>
              </div>
            </Transition>
          </div>

          <!-- ── Identity Proof ────────────────────────────────────────── -->
          <div v-if="hasAnchor" class="mb-6">
            <div class="h-px bg-[var(--sys-border)] mb-4"></div>

            <button
              @click="isProvingIdentity ? cancelProveIdentity() : handleProveIdentity()"
              class="w-full h-11 flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.03)] text-sm text-white/40 hover:text-white/65 hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.16)] active:scale-[0.98] transition-all"
            >
              <svg v-if="isProvingIdentity" class="w-3.5 h-3.5 animate-spin flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" d="M12 3a9 9 0 1 0 9 9"/>
              </svg>
              <svg v-else class="w-3.5 h-3.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z"/>
              </svg>
              {{ isProvingIdentity ? 'Signiert… Abbrechen' : 'Identität nachweisen' }}
            </button>

            <Transition name="slide-up">
              <div v-if="identityProof" class="mt-2 px-4 py-3.5 rounded-xl bg-[var(--sys-bg)] border border-[rgba(255,255,255,0.12)] space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-white/60 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
                    </svg>
                    <span class="text-sm font-semibold text-white/65">Proof generiert</span>
                  </div>
                  <button
                    @click="copyProof"
                    class="text-xs text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded border border-[rgba(255,255,255,0.10)] hover:border-[rgba(255,255,255,0.20)]"
                  >
                    {{ proofCopied ? '✓ Kopiert' : 'Kopieren' }}
                  </button>
                </div>
                <div class="text-xs text-white/70 space-y-0.5 font-mono">
                  <div>Anker: <span class="text-white/90">{{ identityProof.anchorCount }}</span></div>
                  <div>Seit: <span class="text-white/90">{{ identityProof.firstAnchor }}</span></div>
                  <div>Letzter: <span class="text-white/90">{{ identityProof.latestAnchor }}</span></div>
                  <div class="truncate">Wallet: <span class="text-white/90">{{ identityProof.wallet }}</span></div>
                </div>
                <p class="text-xs text-white/70 leading-relaxed">
                  Kryptographischer Beweis: Diese Wallet besitzt diese Soul ·
                  {{ identityProof.anchorCount }} Anker seit {{ identityProof.firstAnchor }}
                </p>
              </div>
            </Transition>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useChainAnchor } from "~/composables/useChainAnchor.js";
import { useSoul } from "~/composables/useSoul.js";

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["close"]);

const {
  walletAddress,
  currentNetwork,
  isConnected,
  isAnchoring,
  isProvingIdentity,
  anchorError,
  verifyError,
  hasAnchor,
  hasGrowthChain,
  sessionCount,
  connectWallet,
  disconnectWallet,
  anchorSoul,
  cancelAnchor,
  verifyCurrent,
  checkNextAnchorAllowed,
  proveIdentity,
} = useChainAnchor();

const { soulContent, exportAsBlob } = useSoul();

// Local state
const walletRestoring       = ref(false);
const anchorTx              = ref("");
const anchorNetwork         = ref("");
const anchorExplorerUrl     = ref("");
const verifyLoading         = ref(false);
const verifyResult          = ref(null);
const rateLimitUntil        = ref(0);
const isCheckingRateLimit   = ref(false);
const isCancelled           = ref(false);
const identityProof         = ref(null);
const proofCopied           = ref(false);

// Mindestens 1 Growth-Chain-Eintrag erforderlich – schützt vor Ankerung von Fake-/Test-Souls
const canAnchor = computed(() => sessionCount.value > 0);

// Rate-Limit NUR aktiv wenn der Contract-Timestamp WIRKLICH in der Zukunft liegt.
// rateLimitUntil > 0 reicht nicht – Contract gibt oft vergangene Timestamps zurück.
const rateLimitActive = computed(() =>
  rateLimitUntil.value > 0 && rateLimitUntil.value * 1000 > Date.now()
);


// ── Helpers ───────────────────────────────────────────────────────────────────

async function refreshRateLimit() {
  isCancelled.value = false;
  isCheckingRateLimit.value = true;
  try {
    const ts = await checkNextAnchorAllowed();
    if (!isCancelled.value) rateLimitUntil.value = ts;
  } catch {
    if (!isCancelled.value) rateLimitUntil.value = 0;
  } finally {
    isCheckingRateLimit.value = false;
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

watch(() => props.isOpen, async (val) => {
  if (val) {
    anchorTx.value          = "";
    anchorNetwork.value     = "";
    anchorExplorerUrl.value = "";
    verifyResult.value      = null;
    identityProof.value     = null;
    rateLimitUntil.value    = 0;
    anchorError.value       = "";
    verifyError.value       = "";
    document.body.style.overflow = "hidden";

    // Session-Restore: Wenn noch nicht verbunden, kurz auf AppKit-Init warten
    // (besonders Mobile: WC-Session braucht etwas Zeit nach Page-Load)
    if (!isConnected.value) {
      walletRestoring.value = true;
      const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent ?? "");
      await new Promise((r) => setTimeout(r, isMobile ? 1_200 : 400));
      walletRestoring.value = false;
    }

    refreshRateLimit();
  } else {
    document.body.style.overflow = "";
  }
});

// Wenn Wallet verbunden wird → Rate-Limit sofort prüfen
watch(isConnected, (val) => {
  if (val) refreshRateLimit();
});

// ── Actions ───────────────────────────────────────────────────────────────────

function handleClose() {
  emit("close");
}

function handleCancel() {
  isCancelled.value = true;
  isCheckingRateLimit.value = false;
  cancelAnchor();
}

function cancelVerify() {
  verifyLoading.value = false;
}

function cancelProveIdentity() {
  isProvingIdentity.value = false;
}

async function handleAnchor() {
  anchorTx.value          = "";
  anchorExplorerUrl.value = "";
  anchorNetwork.value     = "";

  const tx = await anchorSoul();
  if (tx) {
    anchorTx.value = tx;
    const m = soulContent.value?.match(/soul_chain_anchor:\s*(\{.+\})/m);
    if (m) {
      try {
        const stored            = JSON.parse(m[1]);
        anchorExplorerUrl.value = stored.explorer ?? `https://polygonscan.com/tx/${tx}`;
        anchorNetwork.value     = stored.network  ?? "Polygon Mainnet";
      } catch {
        anchorExplorerUrl.value = `https://polygonscan.com/tx/${tx}`;
        anchorNetwork.value     = "Polygon Mainnet";
      }
    }
    // Rate-Limit nach erfolgreichem Anker sofort aktualisieren
    refreshRateLimit();
  }
}

async function handleVerify() {
  verifyLoading.value = true;
  verifyResult.value  = null;
  verifyError.value   = "";
  verifyResult.value  = await verifyCurrent();
  verifyLoading.value = false;
}

async function handleProveIdentity() {
  identityProof.value = null;
  identityProof.value = await proveIdentity();
}

function copyProof() {
  if (!identityProof.value) return;
  navigator.clipboard.writeText(JSON.stringify(identityProof.value, null, 2));
  proofCopied.value = true;
  setTimeout(() => { proofCopied.value = false; }, 2000);
}
</script>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.2s ease;
}
.sheet-enter-active .relative,
.sheet-leave-active .relative {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from .relative,
.sheet-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.2s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
</style>
