<template>
  <Teleport to="body">
    <div
      class="fixed bottom-4 right-4 z-[400] flex flex-col gap-2 items-end pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-auto w-full max-w-xs"
        >
          <Alert
            :variant="t.variant || 'success'"
            :title="t.title"
            :message="t.message"
            :auto-dismiss="t.duration ?? 6000"
            dismissible
            @dismiss="emit('dismiss', t.id)"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import Alert from '~/components/ui/Alert.vue'

defineProps({
  toasts: { type: Array, default: () => [] },
  // Each toast: { id, variant?, title?, message, duration? }
})

const emit = defineEmits(['dismiss'])
</script>

<style scoped>
.toast-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.toast-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-enter-from   { opacity: 0; transform: translateY(8px) scale(0.97); }
.toast-leave-to     { opacity: 0; transform: translateY(4px) scale(0.97); }
.toast-move         { transition: transform 0.25s ease; }
</style>
