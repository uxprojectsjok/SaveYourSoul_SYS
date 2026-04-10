// app/composables/useMotion.js
// MediaRecorder-Composable für Bewegungsmuster-Aufnahme (Video)
// Singleton-State: bleibt über Komponenten-Mounts hinaus erhalten

import { ref } from "vue";

// Singleton-State
const isRecording  = ref(false);
const isPreview    = ref(false);
const duration     = ref(0);
const captureMode  = ref(null); // 'face' | 'body'
const lastSample   = ref(null); // { blob, url, mimeType, width, height, fps, duration, date, ts, mode }
const motionError  = ref(null);

export function useMotion() {
  let mediaRecorder = null;
  let stream        = null;
  let chunks        = [];
  let durationTimer = null;
  let previewUrl    = null;
  let trackSettings = {};

  // ── Aufnahme starten ───────────────────────────────────────────────────────

  /**
   * Startet die Video-Aufnahme.
   * @param {HTMLVideoElement|null} liveEl - <video>-Element für Live-Preview
   */
  async function startRecording(liveEl) {
    motionError.value = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 480 }, height: { ideal: 640 }, frameRate: { ideal: 30 } },
        audio: false
      });

      // Track-Einstellungen für Metadaten auslesen
      const vTrack = stream.getVideoTracks()[0];
      trackSettings = vTrack?.getSettings() ?? {};

      // Live-Vorschau im Video-Element anzeigen
      if (liveEl) {
        liveEl.srcObject = stream;
        await liveEl.play().catch(() => {});
      }

      // Codec-Auswahl: VP9 > VP8 > WebM > MP4 (Android/iOS)
      const mimeType =
        MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" :
        MediaRecorder.isTypeSupported("video/webm;codecs=vp8") ? "video/webm;codecs=vp8" :
        MediaRecorder.isTypeSupported("video/webm")            ? "video/webm"            :
        MediaRecorder.isTypeSupported("video/mp4")             ? "video/mp4"             :
        "";

      chunks = [];
      mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      mediaRecorder.start(100);

      isRecording.value = true;
      duration.value    = 0;
      durationTimer = setInterval(() => { duration.value++; }, 1000);
    } catch (e) {
      motionError.value =
        e.name === "NotAllowedError"   ? "Kamera-Zugriff verweigert."                              :
        e.name === "NotFoundError"     ? "Keine Kamera gefunden."                                  :
        e.name === "NotSupportedError" ? "Video-Aufnahme wird auf diesem Gerät nicht unterstützt." :
        "Kamera nicht verfügbar.";
    }
  }

  // ── Aufnahme stoppen ───────────────────────────────────────────────────────

  /**
   * @param {HTMLVideoElement|null} liveEl - Live-Preview deaktivieren
   * @returns {Promise<Blob|null>}
   */
  function stopRecording(liveEl) {
    return new Promise(resolve => {
      if (!mediaRecorder || mediaRecorder.state === "inactive") return resolve(null);

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || "video/webm";
        const blob     = new Blob(chunks, { type: mimeType });

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = URL.createObjectURL(blob);

        lastSample.value = {
          blob,
          url:      previewUrl,
          mimeType,
          width:    trackSettings.width    ?? 480,
          height:   trackSettings.height   ?? 640,
          fps:      trackSettings.frameRate ?? 30,
          duration: duration.value,
          date:     new Date().toISOString().split("T")[0],
          ts:       new Date().toISOString(),
          mode:     captureMode.value
        };
        isPreview.value = true;
        resolve(blob);
      };

      clearInterval(durationTimer);
      mediaRecorder.stop();

      // Live-Preview beenden
      if (liveEl) {
        liveEl.pause();
        liveEl.srcObject = null;
      }
      stream?.getTracks().forEach(t => t.stop());
      isRecording.value = false;
    });
  }

  // ── Sample verwerfen ───────────────────────────────────────────────────────

  function discardSample() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl       = null;
    lastSample.value = null;
    isPreview.value  = false;
    duration.value   = 0;
  }

  // ── Hilfsfunktionen ────────────────────────────────────────────────────────

  function formatDuration(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function setCaptureMode(mode) { captureMode.value = mode; }

  return {
    isRecording,
    isPreview,
    duration,
    captureMode,
    lastSample,
    motionError,
    startRecording,
    stopRecording,
    discardSample,
    formatDuration,
    setCaptureMode
  };
}
