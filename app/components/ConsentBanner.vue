<template>
  <Transition name="slide-up">
    <div
      v-if="showBanner && isVisible"
      ref="dialogRef"
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      class="fixed z-[900] bottom-4 left-0 right-0 px-3 sm:px-6 lg:px-8"
    >
      <div
        class="max-w-4xl mx-auto bg-[var(--sys-bg-elevated)] backdrop-blur-xl rounded-xl border border-[var(--sys-border)] shadow-2xl p-4 sm:p-5"
      >
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">

          <!-- Content -->
          <div class="flex-1 space-y-1.5">
            <h3 id="consent-title" class="text-sm font-semibold text-[var(--sys-fg)] tracking-wide">
              Datenschutz &amp; anonyme Statistik
            </h3>

            <p class="text-xs text-[var(--sys-fg-muted)] leading-relaxed">
              Diese Website verwendet eine
              <strong class="text-[var(--sys-fg)]">anonyme, cookielose Reichweitenmessung</strong>,
              um Inhalte in aggregierter Form auszuwerten. Es werden
              <strong class="text-[var(--sys-fg)]">keine personenbezogenen Profile</strong> erstellt.
              Weitere Informationen in der
              <button
                @click="$emit('showPrivacy')"
                class="sys-link text-[var(--sys-accent)] underline underline-offset-2 hover:opacity-80 transition-opacity bg-transparent border-0 p-0"
                aria-label="Datenschutzerklärung öffnen"
              >Datenschutzerklärung</button>
              oder der
              <button
                @click="$emit('showPrivacyFaq')"
                class="sys-link text-[var(--sys-accent)] underline underline-offset-2 hover:opacity-80 transition-opacity bg-transparent border-0 p-0"
                aria-label="Datenschutz kurz erklärt öffnen"
              >Kurzfassung (FAQ)</button>.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-row sm:flex-col w-full sm:w-auto gap-2 sm:gap-2">
            <button
              ref="acceptButtonRef"
              @click="handleAccept"
              class="flex-1 sm:flex-none sm:w-44 h-11 px-4 rounded-xl sys-cta-primary text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sys-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label="Anonyme Statistik erlauben"
            >
              ✓ Statistik erlauben
            </button>

            <button
              @click="handleDecline"
              class="flex-1 sm:flex-none sm:w-44 h-11 px-4 rounded-xl border border-[var(--sys-border)] text-xs text-[var(--sys-fg-muted)] hover:text-[var(--sys-fg)] hover:border-[rgba(255,255,255,0.15)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sys-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label="Keine Statistik verwenden"
            >
              ✕ Keine Statistik
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onUnmounted } from "vue";

defineProps({
  isVisible: Boolean
});

const emit = defineEmits(["accept", "decline", "showPrivacy", "showPrivacyFaq"]);

const CONSENT_KEY = "plausible-consent";

const showBanner = ref(false);
const dialogRef = ref(null);
const acceptButtonRef = ref(null);
let lastFocusedElement = null;

/* ---------- Init ---------- */
onMounted(() => {
  if (process.client) {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent !== "granted" && consent !== "denied") {
      showBanner.value = true;
    }
  }
});

/* ---------- Fokus & ESC ---------- */
function onKeydown(e) {
  if (e.key === "Escape") {
    handleDecline();
  }
}

watch(showBanner, async (open) => {
  if (open) {
    lastFocusedElement = document.activeElement;
    await nextTick();
    acceptButtonRef.value?.focus();
    document.addEventListener("keydown", onKeydown);
  } else {
    document.removeEventListener("keydown", onKeydown);
    lastFocusedElement?.focus();
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
});

/* ---------- Actions ---------- */
const handleAccept = () => {
  localStorage.setItem(CONSENT_KEY, "granted");
  showBanner.value = false;
  emit("accept");
  loadPlausible();
};

const handleDecline = () => {
  localStorage.setItem(CONSENT_KEY, "denied");
  showBanner.value = false;
  emit("decline");
};

function loadPlausible() {
  if (document.getElementById("plausible-script")) return;

  const script = document.createElement("script");
  script.defer = true;
  script.setAttribute("data-domain", "uxprojects-jok.com");
  script.src = "https://analytics.uxprojects-jok.com/js/script.js";
  script.id = "plausible-script";
  document.head.appendChild(script);
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease;
}
.slide-up-enter-from {
  transform: translateY(100px);
  opacity: 0;
}
.slide-up-leave-to {
  transform: translateY(100px);
  opacity: 0;
}
</style>
