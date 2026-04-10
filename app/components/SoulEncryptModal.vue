<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex flex-col justify-end"
        @click.self="handleClose"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="handleClose"></div>

        <!-- Sheet -->
        <div
          ref="sheetEl"
          class="relative bg-[var(--sys-bg-surface)] border-t border-[var(--sys-border)] rounded-t-2xl px-5 pt-5 pb-safe-or-6 pb-6 z-10 max-h-[92dvh] overflow-y-auto"
        >
          <!-- Handle + Close -->
          <div class="flex items-center mb-5">
            <div class="flex-1 flex justify-center">
              <div class="w-10 h-0.5 bg-[var(--sys-border)] rounded-full"></div>
            </div>
            <button
              @click="handleClose"
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-[var(--sys-border)] text-[var(--sys-fg-dim)] hover:text-[var(--sys-fg)] hover:border-white/20 transition-all"
              aria-label="Schließen"
            >✕</button>
          </div>

          <!-- Schritt-Indikator -->
          <div class="flex items-center gap-1.5 mb-5">
            <div
              v-for="i in 3"
              :key="i"
              class="h-0.5 flex-1 rounded-full transition-all duration-500"
              :class="i <= step + 1 ? 'bg-white' : 'bg-[var(--sys-border)]'"
            ></div>
          </div>

          <!-- ── Schritt 1: 12 Wörter eingeben ──────────────────────────────── -->
          <template v-if="step === 0">
            <p class="text-xs tracking-[0.22em] text-white/38 uppercase mb-1">Schritt 1 / 3</p>
            <h2 class="text-base font-bold text-[var(--sys-fg)] mb-1">Deine 12 Schlüsselwörter</h2>
            <p class="text-xs text-[var(--sys-fg-muted)] leading-relaxed mb-4">
              Wähle 12 Wörter — auf Deutsch, Englisch oder gemischt.
              Nur Buchstaben, keine Zahlen. Nur du kennst sie.
            </p>

            <datalist id="bip39-words">
              <option v-for="w in BIP39" :key="w" :value="w" />
            </datalist>

            <div class="grid grid-cols-2 gap-2 mb-3">
              <div
                v-for="(_, i) in 12"
                :key="i"
                class="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-[var(--sys-bg)] border transition-colors duration-200"
                :class="wordState(i)"
              >
                <span class="text-xs font-mono w-4 flex-none text-right"
                  :class="isValid(userWords[i]) ? 'text-white/45' : 'text-[var(--sys-fg-dim)]/40'"
                >{{ i + 1 }}</span>
                <input
                  :id="`word-${i}`"
                  :aria-label="`Schlüsselwort ${i + 1} von 12`"
                  list="bip39-words"
                  :value="userWords[i]"
                  autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false"
                  maxlength="12" placeholder="wort…"
                  class="flex-1 min-w-0 bg-transparent text-sm font-bold text-[var(--sys-fg)] outline-none placeholder-[var(--sys-fg-dim)]/30"
                  @input="sanitizeWord(i, $event)"
                />
                <svg v-if="isValid(userWords[i])" class="w-3 h-3 flex-none text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                </svg>
                <svg v-else-if="userWords[i]" class="w-3 h-3 flex-none text-red-400/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
              </div>
            </div>

            <div class="flex items-center justify-between mb-5">
              <span class="text-xs text-[var(--sys-fg-dim)]">
                <span :class="validCount === 12 ? 'text-white' : 'text-[var(--sys-fg)]'">{{ validCount }}</span>
                / 12 gültig
              </span>
              <button @click="fillRandom" class="flex items-center gap-1.5 text-xs text-[var(--sys-fg-dim)] hover:text-white transition-colors">
                <svg class="w-3 h-3 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Zufällig füllen
              </button>
            </div>

            <div class="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] mb-5">
              <svg class="w-4 h-4 flex-none text-white/55 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <p class="text-xs text-white/55 leading-relaxed">
                Diese 12 Wörter sind dein einziger Schlüssel. Notiere sie offline –
                sie können nicht wiederhergestellt werden.
              </p>
            </div>

            <div class="flex gap-3">
              <button @click="handleClose"
                class="flex-1 h-12 rounded-xl border border-[var(--sys-border)] text-sm text-[var(--sys-fg-muted)] hover:text-[var(--sys-fg)] hover:border-[rgba(255,255,255,0.15)] transition-all"
              >← Zurück</button>
              <button @click="step = 1" :disabled="!allValid"
                class="flex-1 h-12 rounded-xl border border-white/20 bg-[rgba(255,255,255,0.08)] text-sm font-semibold text-white/85 disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:bg-[rgba(255,255,255,0.14)] active:not-disabled:scale-[0.98] transition-all"
              >Weiter →</button>
            </div>
          </template>

          <!-- ── Schritt 2: Bestätigen ───────────────────────────────────────── -->
          <template v-else-if="step === 1">
            <p class="text-xs tracking-[0.22em] text-white/38 uppercase mb-1">Schritt 2 / 3</p>
            <h2 class="text-base font-bold text-[var(--sys-fg)] mb-3">Bestätigen</h2>
            <p class="text-xs text-[var(--sys-fg-muted)] leading-relaxed mb-4">
              Letzte Prüfung. Danach wird der Vault verschlüsselt und als
              <code class="text-white/60">.soul</code>-Datei gespeichert.
            </p>

            <div class="grid grid-cols-2 gap-2 mb-5">
              <div
                v-for="(word, i) in Array.from(userWords)"
                :key="i"
                class="flex items-center gap-2 px-2.5 py-2.5 rounded-lg bg-[var(--sys-bg)] border border-white/12"
              >
                <span class="text-xs font-mono text-white/40 w-4 flex-none text-right">{{ i + 1 }}</span>
                <span class="text-sm font-bold text-[var(--sys-fg)] tracking-wide">{{ word }}</span>
              </div>
            </div>

            <label class="flex items-start gap-3 cursor-pointer mb-6 group">
              <div
                class="w-5 h-5 rounded border flex-none mt-0.5 flex items-center justify-center transition-all"
                :class="confirmed ? 'bg-white border-white' : 'border-[var(--sys-border)] group-hover:border-white/50'"
                @click="confirmed = !confirmed"
              >
                <svg v-if="confirmed" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                </svg>
              </div>
              <span class="text-sm text-[var(--sys-fg-muted)] leading-relaxed select-none" @click="confirmed = !confirmed">
                Ich habe alle 12 Wörter sicher offline notiert.
              </span>
            </label>

            <div class="flex gap-3">
              <button @click="step = 0"
                class="flex-1 h-12 rounded-xl border border-[var(--sys-border)] text-sm text-[var(--sys-fg-muted)] hover:text-[var(--sys-fg)] hover:border-[rgba(255,255,255,0.15)] transition-all"
              >← Zurück</button>
              <button @click="handleEncrypt" :disabled="!confirmed"
                class="flex-1 h-12 rounded-xl border border-white/20 bg-[rgba(255,255,255,0.08)] text-sm font-semibold text-white/85 disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:bg-[rgba(255,255,255,0.14)] active:not-disabled:scale-[0.98] transition-all"
              >Verschlüsseln</button>
            </div>
          </template>

          <!-- ── Schritt 3: Ergebnis ─────────────────────────────────────────── -->
          <template v-else-if="step === 2">
            <p class="text-xs tracking-[0.22em] text-white/38 uppercase mb-1">Schritt 3 / 3</p>
            <h2 class="text-base font-bold text-[var(--sys-fg)] mb-6">
              {{ isEncrypting ? 'Verschlüsseln…' : encryptError ? 'Fehler' : 'Vault gesichert' }}
            </h2>

            <!-- Spinner -->
            <div v-if="isEncrypting" class="flex flex-col items-center gap-4 py-8">
              <svg class="w-10 h-10 text-white/70 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <p class="text-sm text-[var(--sys-fg-muted)]">
                {{ isFetchingVps ? 'VPS-Vault wird geladen…' : 'Soul & Vault werden verschlüsselt…' }}
              </p>
            </div>

            <!-- Fehler -->
            <div v-else-if="encryptError" class="flex flex-col items-center gap-4 py-6">
              <div class="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg class="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
              </div>
              <p class="text-sm text-red-400 text-center">{{ encryptError }}</p>
              <button @click="step = 1; encryptError = null"
                class="h-10 px-5 rounded-xl border border-[var(--sys-border)] text-sm text-[var(--sys-fg-muted)] hover:text-[var(--sys-fg)] transition"
              >Zurück</button>
            </div>

            <!-- Erfolg -->
            <div v-else class="flex flex-col gap-5">
              <div class="flex flex-col items-center gap-3 py-4">
                <div class="w-14 h-14 rounded-full bg-[rgba(255,255,255,0.06)] border border-white/25 flex items-center justify-center">
                  <svg class="w-7 h-7 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/>
                  </svg>
                </div>
                <div class="text-center">
                  <p class="text-sm font-semibold text-[var(--sys-fg)]">Vault gesichert</p>
                  <p class="text-xs text-[var(--sys-fg-dim)] mt-1">
                    soul.md · Bilder · Stimme · Motion · AES-256-GCM · 12 Wörter
                  </p>
                </div>
              </div>

              <div class="px-4 py-3 rounded-xl bg-[var(--sys-bg)] border border-[var(--sys-border)]">
                <p class="text-xs text-[var(--sys-fg-muted)] leading-relaxed">
                  Deine <code class="text-white/60">.soul</code>-Datei wurde heruntergeladen.
                  Bewahre sie sicher auf – sie enthält deinen verschlüsselten Vault.
                </p>
              </div>

              <div v-if="vpsWarning" class="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-amber-500/8 border border-amber-500/20">
                <svg class="w-4 h-4 flex-none text-amber-400/70 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <p class="text-xs text-amber-400/70 leading-relaxed">{{ vpsWarning }}</p>
              </div>

            </div>
          </template>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useSoul } from '~/composables/useSoul.js'
import { useVault } from '~/composables/useVault.js'
import { BIP39, generateMnemonicWords, useSoulEncrypt } from '~/composables/useSoulEncrypt.js'
import { useApiContext } from '~/composables/useApiContext.js'

const { soulContent, soulMeta, soulToken } = useSoul()
const { syncedFiles, fetchVpsVaultFiles } = useApiContext()

const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close'])

const { readAllVaultFiles, isConnected: vaultConnected } = useVault()
const { mnemonic, isEncrypting, encryptError, encrypt } = useSoulEncrypt()

const step          = ref(0)
const confirmed     = ref(false)
const sheetEl       = ref(null)
const isFetchingVps = ref(false)
const vpsWarning    = ref('')

// ── 12-Wörter-Logik ──────────────────────────────────────────────────────────
const userWords  = reactive(new Array(12).fill(''))
const WORD_RE    = /^[a-zäöüß]{3,12}$/

function sanitize(raw) {
  return String(raw ?? '').normalize('NFC').toLowerCase().replace(/[^a-zäöüß]/g, '').slice(0, 12)
}
function sanitizeWord(i, event) {
  const clean = sanitize(event.target.value)
  userWords[i] = clean
  if (event.target.value !== clean) {
    const pos = event.target.selectionStart
    event.target.value = clean
    event.target.setSelectionRange(pos, pos)
  }
}
function isValid(w)   { return WORD_RE.test(w ?? '') }
function wordState(i) {
  const w = userWords[i]
  if (!w) return 'border-[var(--sys-border)]'
  return isValid(w) ? 'border-emerald-500/35' : 'border-red-500/35'
}
const validCount = computed(() => userWords.filter(w => isValid(w)).length)
const allValid   = computed(() => validCount.value === 12)
function fillRandom() {
  const words = generateMnemonicWords()
  for (let i = 0; i < 12; i++) userWords[i] = words[i] ?? ''
}
function resetWords() { for (let i = 0; i < 12; i++) userWords[i] = '' }

// ── Verschlüsseln ─────────────────────────────────────────────────────────────
async function handleEncrypt() {
  step.value = 2
  encryptError.value = null
  isEncrypting.value = true

  try {
    // 1. Lokale Vault-Dateien (falls verbunden)
    const localFiles = vaultConnected.value ? await readAllVaultFiles() : []

    // 2. VPS-Dateien holen wenn synced_files vorhanden + soul-Token verfügbar
    const hasVpsFiles = soulToken.value && (
      (syncedFiles.value.audio?.length  ?? 0) +
      (syncedFiles.value.video?.length  ?? 0) +
      (syncedFiles.value.images?.length ?? 0) +
      (syncedFiles.value.context?.length ?? 0)
    ) > 0

    let vpsFiles = []
    vpsWarning.value = ''
    if (hasVpsFiles) {
      isFetchingVps.value = true
      vpsFiles = await fetchVpsVaultFiles(soulToken.value)
      isFetchingVps.value = false
      const expected = (syncedFiles.value.audio?.length ?? 0) +
                       (syncedFiles.value.video?.length ?? 0) +
                       (syncedFiles.value.images?.length ?? 0) +
                       (syncedFiles.value.context?.length ?? 0)
      const skipped = expected - vpsFiles.length
      if (skipped > 0) {
        vpsWarning.value = `${skipped} VPS-Datei(en) konnten nicht entschlüsselt werden (Vault-Session abgelaufen). Nur lokale Dateien wurden eingebunden.`
      }
    }

    // 3. Mergen: lokale Dateien haben Vorrang bei gleichem Basisnamen
    const localBaseNames = new Set(localFiles.map(f => f.name.split('/').pop()))
    const extraVpsFiles  = vpsFiles.filter(f => !localBaseNames.has(f.name.split('/').pop()))
    const allFiles       = [...localFiles, ...extraVpsFiles]

    const name  = soulMeta.value?.name || 'soul'
    const clean = Array.from(userWords).map(sanitize)
    if (clean.length !== 12 || !clean.every(w => isValid(w))) {
      encryptError.value = 'Alle 12 Felder müssen gültige Wörter enthalten.'
      return
    }
    mnemonic.value = clean
    await encrypt(soulContent.value, allFiles, name)
  } finally {
    isFetchingVps.value = false
    isEncrypting.value  = false
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
watch(() => props.isOpen, (val) => {
  if (val) {
    step.value          = 0
    confirmed.value     = false
    encryptError.value  = null
    isFetchingVps.value = false
    vpsWarning.value    = ''
    resetWords()
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

function handleClose() {
  if (isEncrypting.value) return
  emit('close')
}
</script>

<style scoped>
.sheet-enter-active, .sheet-leave-active { transition: opacity 0.25s ease; }
.sheet-enter-active .relative, .sheet-leave-active .relative { transition: transform 0.3s cubic-bezier(0.32,0.72,0,1); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from .relative, .sheet-leave-to .relative { transform: translateY(100%); }
</style>
