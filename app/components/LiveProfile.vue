<template>
  <!--
    Mobile + Kamera-Modus (Gesicht / Bewegung): fixed inset-0 → echter Vollbild-Screen
    Desktop (≥ sm) + Kamera-Modus:              normales Panel via sm:-Overrides
    Stimme (immer):                              normales Panel
  -->
  <!-- Overlay backdrop -->
  <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
  <!-- Modal card — always centered, camera stays inside -->
  <div class="relative w-full max-w-md bg-[var(--sys-bg-elevated)] border border-[var(--sys-border)] rounded-2xl shadow-2xl max-h-[90dvh] flex flex-col overflow-hidden">

    <!-- ── Opt-In Consent (muss gesetzt sein) ──────────────────────────── -->
    <div
      v-if="!consentGiven"
      class="flex-1 flex flex-col items-center justify-center px-5 py-8 sm:py-10 text-center gap-5"
    >
      <!-- Icon -->
      <div
        class="w-14 h-14 rounded-2xl flex items-center justify-center flex-none"
        style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12)"
      >
        <svg class="w-7 h-7 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
        </svg>
      </div>

      <!-- Titel -->
      <div class="max-w-xs sm:max-w-sm">
        <h3 class="text-base font-bold text-[var(--sys-fg)] mb-2">Profil-Daten aufzeichnen</h3>
        <p class="text-xs text-[var(--sys-fg-muted)] leading-relaxed">
          Stimme, Gesicht und Bewegung werden in deinem lokalen Vault gespeichert und können auf Wunsch mit deiner digitalen Soul verknüpft werden.
          Die Daten verlassen dein Gerät nur, wenn du es explizit freigibst.
        </p>
      </div>

      <!-- Checkbox + Label -->
      <label
        class="flex items-start gap-3 cursor-pointer group max-w-xs sm:max-w-sm text-left"
      >
        <div class="relative flex-none mt-0.5">
          <input
            type="checkbox"
            v-model="consentChecked"
            class="sr-only"
          />
          <div
            class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150"
            :class="consentChecked
              ? 'bg-[#22c55e] border-[#22c55e]'
              : 'border-[rgba(255,255,255,0.2)] group-hover:border-white/40'"
          >
            <svg
              v-if="consentChecked"
              class="w-3 h-3 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
            </svg>
          </div>
        </div>
        <span class="text-xs text-[var(--sys-fg-muted)] leading-relaxed">
          Ich stimme der Aufzeichnung meiner Stimme, meines Gesichts und meiner Bewegungsdaten zu und bin mir bewusst, dass diese ausschließlich in meinem lokalen Vault gespeichert werden.
        </span>
      </label>

      <!-- Buttons -->
      <div class="flex items-center gap-3 w-full max-w-xs">
        <button
          @click="$emit('close')"
          class="sys-btn sys-btn-ghost flex-1"
        >
          Abbrechen
        </button>
        <button
          @click="confirmConsent"
          :disabled="!consentChecked"
          class="sys-btn flex-1"
          :class="consentChecked
            ? 'sys-btn-tonal !bg-[rgba(255,255,255,0.09)] !text-white/70 !border-white/20 hover:!bg-[rgba(255,255,255,0.14)]'
            : 'sys-btn-ghost opacity-50 cursor-not-allowed'"
        >
          Weiter
        </button>
      </div>

      <!-- Hinweis DSGVO -->
      <p class="text-xs text-[var(--sys-fg-dim)] opacity-50 max-w-[240px] leading-relaxed">
        DSGVO Art. 7 – jederzeit widerrufbar durch Schließen dieses Panels
      </p>
    </div>

    <!-- ── Tab-Bar + Close (nur nach Consent) ────────────────────────────── -->
    <template v-if="consentGiven">
      <!-- Step title -->
      <div class="flex-none flex items-center justify-between px-4 pt-4 pb-2">
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold text-[var(--sys-fg)]">{{ ['Stimme', 'Gesicht', 'Bewegung'][carouselIndex] }}</span>
          <span class="text-xs text-[var(--sys-fg-dim)]">{{ carouselIndex + 1 }} / 3</span>
        </div>
        <button @click="$emit('close')" class="sys-btn sys-btn-icon !w-8 !h-8 !min-h-0" aria-label="Schließen">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="flex-none flex items-center px-2 py-2 border-b border-[var(--sys-border)]">

        <!-- M3 Navigation Tabs: 52px height, wider touch targets -->
        <div class="flex-1 flex items-stretch bg-[var(--sys-bg-elevated)] rounded-xl overflow-hidden" style="height: 52px;">

          <!-- Stimme -->
          <button
            @click="setCarousel(0)"
            class="flex-1 relative flex flex-col items-center justify-center gap-1 transition-all"
            :class="activeTab === 'stimme'
              ? 'text-[var(--sys-accent)]'
              : 'text-[var(--sys-fg-dim)] hover:text-[var(--sys-fg)] hover:bg-white/[0.04]'"
          >
            <svg class="w-5 h-5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
            <span class="text-xs tracking-normal uppercase font-semibold leading-none">Stimme</span>
            <!-- Active underline indicator -->
            <span v-if="activeTab === 'stimme'" class="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-[var(--sys-accent)] transition-all" style="width: 60%;"></span>
          </button>

          <!-- Gesicht -->
          <button
            @click="setCarousel(1)"
            class="flex-1 relative flex flex-col items-center justify-center gap-1 transition-all"
            :class="activeTab === 'gesicht'
              ? 'text-[var(--sys-accent)]'
              : 'text-[var(--sys-fg-dim)] hover:text-[var(--sys-fg)] hover:bg-white/[0.04]'"
          >
            <svg class="w-5 h-5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
              <circle cx="12" cy="8" r="5"/>
              <path stroke-linecap="round" d="M9.5 8.5c.5.8 1.5 1.3 2.5 1.3s2-.5 2.5-1.3"/>
              <path stroke-linecap="round" d="M10 7h.01M14 7h.01"/>
            </svg>
            <span class="text-xs tracking-normal uppercase font-semibold leading-none">Gesicht</span>
            <span v-if="activeTab === 'gesicht'" class="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-[var(--sys-accent)] transition-all" style="width: 60%;"></span>
          </button>

          <!-- Bewegung -->
          <button
            @click="setCarousel(2)"
            class="flex-1 relative flex flex-col items-center justify-center gap-1 transition-all"
            :class="activeTab === 'bewegung'
              ? 'text-[var(--sys-accent)]'
              : 'text-[var(--sys-fg-dim)] hover:text-[var(--sys-fg)] hover:bg-white/[0.04]'"
          >
            <svg class="w-5 h-5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
              <circle cx="12" cy="4" r="2"/>
              <path stroke-linecap="round" d="M12 6v8M9 10h6M9 22l3-8 3 8"/>
              <path stroke-linecap="round" d="M7 10l-2 4M17 10l2 4" opacity=".5"/>
            </svg>
            <span class="text-xs tracking-normal uppercase font-semibold leading-none">Bewegung</span>
            <span v-if="activeTab === 'bewegung'" class="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-[var(--sys-accent)] transition-all" style="width: 60%;"></span>
          </button>

        </div>

      </div>

      <!-- ── Inhalt als Carousel ──────────────────────────────────────────── -->
      <div class="relative flex-1 flex flex-col min-h-0">

        <div class="shad-carousel flex-1">
          <div
            class="shad-carousel-content h-full"
            :style="{ transform: `translateX(-${carouselIndex * 100}%)` }"
          >
            <!-- Slide 1: Stimme -->
            <div class="shad-carousel-item">
              <VoiceRecorder
                :soul-meta="soulMeta"
                :embedded="true"
                @saved="$emit('voice-saved', $event)"
                @close="$emit('close')"
              />
            </div>

            <!-- Slide 2: Gesicht (face mode) -->
            <div class="shad-carousel-item">
              <MotionRecorder
                :soul-meta="soulMeta"
                :embedded="true"
                initial-mode="face"
                @saved="$emit('motion-saved', $event)"
                @close="$emit('close')"
                @next-mode="activeTab = 'bewegung'; setCarousel(2)"
              />
            </div>

            <!-- Slide 3: Bewegung (body mode) -->
            <div class="shad-carousel-item">
              <MotionRecorder
                :soul-meta="soulMeta"
                :embedded="true"
                initial-mode="body"
                @saved="$emit('motion-saved', $event)"
                @close="$emit('close')"
              />
            </div>
          </div>
        </div>

        <!-- Dots -->
        <div class="shad-carousel-dots pb-3">
          <button
            v-for="(_, i) in 3"
            :key="i"
            :class="['shad-carousel-dot', carouselIndex === i ? 'active' : '']"
            @click="setCarousel(i)"
            :aria-label="`Slide ${i + 1}`"
          />
        </div>
      </div>
    </template>

  </div><!-- end inner content wrapper -->
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import VoiceRecorder from "./VoiceRecorder.vue";
import MotionRecorder from "./MotionRecorder.vue";

defineProps({
  soulMeta: { type: Object, default: null }
});

defineEmits(["close", "voice-saved", "motion-saved"]);

const activeTab     = ref("stimme"); // 'stimme' | 'gesicht' | 'bewegung'
const consentGiven   = ref(false);
const consentChecked = ref(false);

// Carousel UI-State (pure display, no logic change)
const carouselIndex = ref(0);
const TAB_TO_INDEX = { stimme: 0, gesicht: 1, bewegung: 2 };
const INDEX_TO_TAB = ["stimme", "gesicht", "bewegung"];
function setCarousel(i) {
  carouselIndex.value = i;
  activeTab.value = INDEX_TO_TAB[i];
}

function confirmConsent() {
  if (consentChecked.value) {
    consentGiven.value = true;
  }
}

// Kamera-Modus → Mobile-Fullscreen aktiv (nur wenn Consent gegeben)
const isCameraMode = computed(() => consentGiven.value && activeTab.value !== "stimme");
</script>
