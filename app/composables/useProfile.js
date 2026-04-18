// app/composables/useProfile.js
// Singleton-Composable für das Profilbild im Dashboard
// Speichert das hochgeladene Bild als DataURL in sessionStorage

import { ref } from 'vue'

// ── Singleton-State (überlebt Component-Unmount) ──────────────────────────
const hasProfile = ref(false)
const profileUrl = ref('')

// Beim ersten Load: sessionStorage wiederherstellen
if (typeof window !== 'undefined') {
  try {
    const stored = sessionStorage.getItem('sys.profile.dataUrl')
    if (stored) {
      hasProfile.value = true
      profileUrl.value = stored
    }
  } catch {}
}

export function useProfile() {
  /**
   * @param {Event} event — Change-Event von <input type="file">
   */
  function handleUpload(event) {
    const file = event?.target?.files?.[0]
    if (!file || !file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      profileUrl.value = dataUrl
      hasProfile.value = true
      try {
        sessionStorage.setItem('sys.profile.dataUrl', dataUrl)
      } catch {}
    }
    reader.readAsDataURL(file)
  }

  return { hasProfile, profileUrl, handleUpload }
}
