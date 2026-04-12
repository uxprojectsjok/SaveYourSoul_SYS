// app/composables/useApiContext.js
// Verwaltet den API-Kontext: Berechtigungen, Vault-Sync
// Singleton – alle Komponenten teilen denselben State

import { ref, computed } from "vue";
import { useVault } from "~/composables/useVault.js";

// ── Singleton-State ────────────────────────────────────────────────────────

const loaded           = ref(false);
const lastCert         = ref("");       // Soul-Cert des zuletzt geladenen Kontexts — Wechsel triggert Reset
const enabled          = ref(false);
const cipherMode       = ref("ciphered"); // "open" | "ciphered" — zuletzt auf VPS gespeicherter Modus
const permissions      = ref({
  soul:          false,
  calendar:      false,
  audio:         false,
  video:         false,
  images:        false,
  context_files: false
});
const syncedFiles = ref({ audio: [], video: [], images: [], context: [] });
const activeFiles = ref({ audio: "", video: [], images: "", context: "" });
const localFiles  = ref({ audio: [], video: [], images: [], context: [], profiles: [] });
const isSyncing   = ref(false);
const syncError   = ref(null);
const saveError   = ref(null);

// ── Public Vault Singleton-State ───────────────────────────────────────────
// Freigaben für externe Dienste (API-Grants) und verbundene Seelen (Soul-Grants)
// public_files: [{ name, cipher: "open"|"ciphered" }]
// api_grants:   [{ id, label, scope, token, token_masked, created }]
// soul_grants:  [{ id, label, soul_id, scope, created }]
const publicShare       = ref({ enabled: false, public_files: [], api_grants: [], soul_grants: [] });
const publicShareLoaded = ref(false);
const publicSyncing     = ref(false);
const publicSyncError   = ref(null);

export function useApiContext() {
  const { allFiles, readImageFile, contextFiles, readAllVaultFiles, listVaultPaths, readShareConfig, writeShareConfig } = useVault();

  // ── AES-256-CBC Verschlüsselung ──────────────────────────────────────────
  // Format: "SYS\x01" (4 Bytes) + IV (16 Bytes) + AES-CBC-Ciphertext
  // Kompatibel mit resty.aes auf dem Server (OpenSSL / PKCS7-Padding)

  const MAGIC = new Uint8Array([0x53, 0x59, 0x53, 0x01]); // "SYS\x01"

  async function encryptData(vaultKeyHex, arrayBuffer) {
    // Sicherheitsprüfung: Hex-String muss genau 64 Zeichen lang sein (32 Byte = AES-256)
    if (!vaultKeyHex || !/^[0-9a-f]{64}$/i.test(vaultKeyHex)) {
      throw new Error("Vault-Schlüssel ungültig. Bitte Vault sperren und erneut öffnen.")
    }
    const keyBytes = new Uint8Array(vaultKeyHex.match(/../g).map(h => parseInt(h, 16)));
    const key      = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-CBC" }, false, ["encrypt"]);
    const iv       = crypto.getRandomValues(new Uint8Array(16));
    const cipher   = await crypto.subtle.encrypt({ name: "AES-CBC", iv }, key, arrayBuffer);

    // Zusammensetzen: MAGIC(4) + IV(16) + Ciphertext
    const result = new Uint8Array(4 + 16 + cipher.byteLength);
    result.set(MAGIC, 0);
    result.set(iv, 4);
    result.set(new Uint8Array(cipher), 20);
    return result.buffer;
  }

  // ── API-Aufrufe ────────────────────────────────────────────────────────────

  async function loadContext(soulCert) {
    // Reset bei jedem Cert-Wechsel — verhindert Cross-Soul-Kontamination
    // auch ohne Seiten-Reload (z.B. Ausloggen + neue Soul einloggen im selben Tab).
    // Bedingung ohne lastCert.value-Guard: leerer → neuer Cert zählt ebenfalls als Wechsel.
    if (lastCert.value !== soulCert) {
      syncedFiles.value     = { audio: [], video: [], images: [], context: [] };
      activeFiles.value     = { audio: "", video: [], images: "", context: "" };
      localFiles.value      = { audio: [], video: [], images: [], context: [], profiles: [] };
      enabled.value         = false;
      cipherMode.value      = "ciphered";
      loaded.value          = false;
    }
    lastCert.value = soulCert;
    try {
      const res = await fetch("/api/context", {
        headers: { Authorization: `Bearer ${soulCert}` }
      });
      if (!res.ok) {
        // VPS hat keine Daten (frischer Start / gelöscht) → lokale Dateien trotzdem anzeigen
        await scanVault();
        loaded.value = true;
        return;
      }
      const data = await res.json();
      enabled.value         = data.enabled            ?? false;
      cipherMode.value      = data.cipher_mode        ?? "ciphered";
      permissions.value     = { soul: false, calendar: false, audio: false, video: false, images: false, context_files: false, ...data.permissions };
      syncedFiles.value  = { audio: [], video: [], images: [], context: [], profiles: [], ...data.synced_files };
      const af = data.active_files || {};
      activeFiles.value  = {
        audio:   af.audio   ?? "",
        video:   Array.isArray(af.video) ? af.video : (af.video ? [af.video] : []),
        images:  af.images  ?? "",
        context: af.context ?? ""
      };
      loaded.value       = true;
      await scanVault();
    } catch (e) { console.error("[useApiContext] loadContext:", e); }
  }

  async function saveContext(soulCert, updates) {
    saveError.value = null;
    try {
      const res = await fetch("/api/context", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${soulCert}` },
        body: JSON.stringify(updates)
      });
      if (!res.ok) {
        saveError.value = `HTTP ${res.status}`;
        return false;
      }
      return true;
    } catch (e) { saveError.value = e.message; return false; }
  }

  async function scanVault() {
    try {
      const paths  = await listVaultPaths();
      const result = { audio: [], video: [], images: [], context: [], profiles: [] };
      for (const name of paths) {
        const lower    = name.toLowerCase();
        const parts    = lower.split("/");
        const folder   = parts.length > 1 ? parts[parts.length - 2] : "";
        const baseName = name.split("/").pop();

        // KI-Profile: alle Dateien in profile/ → profiles-Key als Dateiname (ohne Endung)
        if (folder === "profile") {
          const ptype = baseName.replace(/\.[^.]+$/, "");
          if (!result.profiles.includes(ptype)) result.profiles.push(ptype);
          continue;
        }

        const type = fileTypeFromPath(name);
        if (!type) continue;
        // fileTypeFromPath gibt "image" zurück, localFiles nutzt key "images"
        const key = type === "image" ? "images" : type;
        if (result[key] && !result[key].includes(baseName)) result[key].push(baseName);
      }
      localFiles.value = result;
    } catch (e) { console.error("[scanVault]", e); }
  }

  // Extracts the semantic group from a video filename:
  // "motion_face_abc_2026.mp4" → "face",  "motion_body_abc.mp4" → "body"
  function videoGroup(name) {
    const lower = name.toLowerCase();
    if (lower.includes("face")) return "face";
    if (lower.includes("body")) return "body";
    return lower.replace(/[_\-]?\d{4}-\d{2}-\d{2}.*/, "").split(/[_\-]/)[0];
  }

  async function setActive(soulCert, type, name) {
    let newVal;
    if (type === "video") {
      const current = Array.isArray(activeFiles.value.video) ? [...activeFiles.value.video] : [];
      const idx     = current.indexOf(name);
      if (idx !== -1) {
        // deselect
        current.splice(idx, 1);
      } else {
        // remove any other file in same group, then add
        const g = videoGroup(name);
        newVal  = current.filter(f => videoGroup(f) !== g);
        newVal.push(name);
      }
      newVal = newVal ?? current;
    } else {
      // toggle: erneuter Klick auf aktive Datei deaktiviert sie
      newVal = activeFiles.value[type] === name ? "" : name;
    }
    const updated = { ...activeFiles.value, [type]: newVal };
    const ok = await saveContext(soulCert, { active_files: updated });
    if (ok) activeFiles.value = updated;
    return ok;
  }

  // ── Datei-Sync ────────────────────────────────────────────────────────────

  // vaultKeyHex: optionaler 64-Hex-String – falls gesetzt wird die Datei verschlüsselt
  async function syncFile(soulCert, type, name, arrayBufferOrFile, vaultKeyHex = "") {
    let ab = (arrayBufferOrFile instanceof File || arrayBufferOrFile instanceof Blob)
      ? await arrayBufferOrFile.arrayBuffer()
      : arrayBufferOrFile;

    // Verschlüsseln falls vault_key vorhanden
    if (vaultKeyHex) {
      ab = await encryptData(vaultKeyHex, ab);
    }

    // Chunked btoa – verhindert "Maximum call stack size exceeded" bei großen Dateien
    const bytes = new Uint8Array(ab);
    let binary = "";
    const CHUNK = 8192;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    const base64 = btoa(binary);

    const res = await fetch("/api/vault/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${soulCert}` },
      body: JSON.stringify({ type, name, data: base64, encrypted: !!vaultKeyHex })
    });
    if (!res.ok) {
      try {
        const err = await res.json();
        return { ok: false, error: err.error || `HTTP ${res.status}` };
      } catch { return { ok: false, error: `HTTP ${res.status}` }; }
    }
    return { ok: true };
  }

  // Typ aus vollem Vault-Pfad ableiten
  // Extension hat Vorrang vor Ordner — verhindert z.B. profile.jpg in voice_samples → Audio
  function fileTypeFromPath(path) {
    const lower = path.toLowerCase();
    const folder = lower.split("/").slice(-2, -1)[0] || "";
    const ext    = lower.split(".").pop();

    // Metadaten/Config-Dateien niemals syncen
    if (ext === "json") return null;

    // WebM ist dual-use (Audio + Video) → Ordner entscheidet
    if (/\.webm$/.test(lower)) {
      if (folder === "motion_samples" || folder === "video_samples" || folder === "videos") return "video";
      return "audio"; // voice_samples oder unbekannt → Audio
    }

    // Extension (eindeutig)
    if (/\.(mp3|wav|ogg|m4a|opus|flac|aac)$/.test(lower))  return "audio";
    if (/\.(mp4|mov|avi|mkv)$/.test(lower))                 return "video";
    if (/\.(jpe?g|png|webp|gif|avif)$/.test(lower))         return "image";
    if (/\.(md|txt)$/.test(lower))                          return "context";

    // Ordner-Fallback
    if (folder === "motion_samples" || folder === "video_samples" || folder === "videos") return "video";
    if (folder === "voice_samples")  return "audio";

    return null;
  }

  // vaultKeyHex: optionaler Schlüssel – wird an syncFile durchgereicht + für sys.md verwendet
  async function syncAll(soulCert, soulContent, vaultKeyHex = "") {
    // Kontext muss geladen sein – sonst würden Defaults (enabled=false, alle Perms false)
    // auf den Server geschrieben und die API-Konfiguration überschrieben.
    if (!loaded.value) {
      syncError.value = "Kontext noch nicht geladen – bitte kurz warten und erneut versuchen.";
      return;
    }
    isSyncing.value = true;
    syncError.value = null;

    // Verschlüsselung ist Pflicht — kein Upload ohne Vault-Key
    if (!vaultKeyHex) {
      syncError.value = "Vault-Schlüssel fehlt — bitte Vault entsperren bevor du synchronisierst.";
      isSyncing.value = false;
      return;
    }

    let errors = 0;
    try {
      // Soul-Inhalt hochladen — immer verschlüsselt
      if (soulContent) {
        const enc = new TextEncoder();
        const encryptedBuffer = await encryptData(vaultKeyHex, enc.encode(soulContent));
        const bytes = new Uint8Array(encryptedBuffer);
        let binary = "";
        const CHUNK = 8192;
        for (let i = 0; i < bytes.length; i += CHUNK) {
          binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
        }
        const contentUpdate = {
          soul_content_encrypted: btoa(binary),
          cipher_mode: "ciphered",
        };
        const ok = await saveContext(soulCert, contentUpdate);
        if (!ok) errors++;
      }

      // Alle Vault-Dateien (rekursiv, ArrayBuffer)
      const vaultFiles = await readAllVaultFiles();

      for (const { name, buffer } of vaultFiles) {
        const baseName = name.split("/").pop(); // Unterordner entfernen für VPS-Namen
        // sys.md wird bereits via soul_content/soul_content_encrypted hochgeladen
        if (baseName.toLowerCase() === "sys.md") continue;

        // KI-Profile: alle Dateien in profile/ → PUT /api/vault/profile/{type}
        if (name.startsWith("profile/")) {
          const ptype = baseName.replace(/\.[^.]+$/, "") || baseName;
          try {
            const text = new TextDecoder().decode(buffer);
            const res  = await fetch(`/api/vault/profile/${encodeURIComponent(ptype)}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${soulCert}` },
              body: text
            });
            if (!res.ok) errors++;
          } catch { errors++; }
          continue;
        }

        const type = fileTypeFromPath(name); // voller Pfad inkl. Ordner
        if (!type) continue;
        const res = await syncFile(soulCert, type, baseName, buffer, vaultKeyHex);
        if (!res.ok) errors++;
      }

      if (errors > 0) syncError.value = `${errors} Datei(en) konnten nicht hochgeladen werden.`;

      cipherMode.value = "ciphered";

      // Kontext neu laden – aber lokale enabled/permissions beibehalten (wurden gerade gespeichert)
      const savedEnabled     = enabled.value;
      const savedPermissions = { ...permissions.value };
      await loadContext(soulCert);
      // Werte zurückschreiben falls loadContext sie fälschlicherweise überschrieben hat
      enabled.value     = savedEnabled;
      permissions.value = savedPermissions;
      await scanVault();
    } catch (e) {
      syncError.value = e.message;
    } finally {
      isSyncing.value = false;
    }
  }

  // ── Computed ──────────────────────────────────────────────────────────────

  const baseUrl = computed(() =>
    typeof window !== "undefined" ? window.location.origin : "https://YOUR_DOMAIN"
  );

  const apiEndpoints = computed(() => ({
    manifest: `${baseUrl.value}/api/vault/manifest`,
    soul:     `${baseUrl.value}/api/soul`,
    audio:    `${baseUrl.value}/api/vault/audio`,
    video:    `${baseUrl.value}/api/vault/video`,
    images:   `${baseUrl.value}/api/vault/images`,
    context:  `${baseUrl.value}/api/vault/context`,
    webhook:  `${baseUrl.value}/api/webhook`
  }));

  const totalSynced = computed(() =>
    (syncedFiles.value.audio?.length   ?? 0) +
    (syncedFiles.value.video?.length   ?? 0) +
    (syncedFiles.value.images?.length  ?? 0) +
    (syncedFiles.value.context?.length ?? 0)
  );

  // ── Public Vault ──────────────────────────────────────────────────────────

  /** Kryptographisch sicherer Token für API-Grants */
  function generatePublicToken() {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    return "pub_" + Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  }

  /** Kurzform-ID für Grant-Objekte */
  function generateGrantId(prefix = "ag") {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    return prefix + "_" + Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Lädt die Public-Share-Konfiguration vom VPS.
   * VPS gibt api_grants mit token_masked zurück; volles Token nur in vault-share.json.
   */
  async function loadPublicShare(soulCert) {
    try {
      const res = await fetch("/api/vault/public/config", {
        headers: { Authorization: `Bearer ${soulCert}` }
      });
      if (!res.ok) { publicShareLoaded.value = true; return; }
      const data = await res.json();
      // Lokale vault-share.json lesen um volle Tokens zu mergen
      const local = await readShareConfig();
      const localGrantTokens = {};
      if (local?.api_grants) {
        for (const g of local.api_grants) {
          if (g.id && g.token) localGrantTokens[g.id] = g.token;
        }
      }
      const rawGrants = Array.isArray(data.api_grants) ? data.api_grants : [];
      const grants = rawGrants.map(g => ({
        ...g,
        token: localGrantTokens[g.id] ?? g.token ?? null
      }));
      publicShare.value = {
        enabled:      data.enabled     ?? false,
        public_files: Array.isArray(data.public_files) ? data.public_files : [],
        api_grants:   grants,
        soul_grants:  Array.isArray(data.soul_grants) ? data.soul_grants : []
      };
      publicShareLoaded.value = true;
    } catch (e) { console.error("[publicShare] loadPublicShare:", e); }
  }

  /**
   * Speichert die Public-Share-Konfiguration auf VPS + lokal in vault-share.json.
   */
  async function savePublicShare(soulCert) {
    try {
      const config = {
        v:            1,
        enabled:      publicShare.value.enabled,
        public_files: publicShare.value.public_files,
        api_grants:   publicShare.value.api_grants,
        soul_grants:  publicShare.value.soul_grants
      };
      // Lokal speichern (volles Token)
      await writeShareConfig(config);
      // VPS speichern
      const res = await fetch("/api/vault/public/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${soulCert}` },
        body: JSON.stringify(config)
      });
      return res.ok;
    } catch { return false; }
  }

  /**
   * Lädt alle public_files aus dem lokalen Vault und lädt sie auf den VPS hoch.
   * cipher: "open" → klar, "ciphered" → AES-CBC mit vaultKeyHex.
   */
  async function syncPublicFiles(soulCert, vaultKeyHex = "") {
    publicSyncing.value   = true;
    publicSyncError.value = null;
    try {
      const vaultFiles = await readAllVaultFiles();
      let errors = 0;
      for (const pf of publicShare.value.public_files) {
        const name   = typeof pf === "string" ? pf : pf.name;
        const cipher = typeof pf === "object" ? (pf.cipher || "open") : "open";
        const vf = vaultFiles.find(f => f.name.split("/").pop() === name);
        if (!vf) continue;
        let ab = vf.buffer;
        if (cipher === "ciphered" && vaultKeyHex) {
          ab = await encryptData(vaultKeyHex, ab);
        }
        // Chunked btoa
        const bytes = new Uint8Array(ab);
        let binary = "";
        const CHUNK = 8192;
        for (let i = 0; i < bytes.length; i += CHUNK) {
          binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
        }
        const res = await fetch("/api/vault/public/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${soulCert}` },
          body: JSON.stringify({ name, data: btoa(binary), encrypted: cipher === "ciphered" })
        });
        if (!res.ok) errors++;
      }
      if (errors > 0) publicSyncError.value = `${errors} Datei(en) konnten nicht hochgeladen werden.`;
    } catch (e) {
      publicSyncError.value = e.message;
    } finally {
      publicSyncing.value = false;
    }
  }

  /**
   * Löscht eine einzelne Datei aus dem privaten Vault auf dem VPS
   * und entfernt sie aus synced_files / active_files in api_context.json.
   */
  async function deleteVaultFile(soulCert, type, name) {
    try {
      // Profile haben einen eigenen Endpunkt (/api/vault/profile/{type})
      const url = type === 'profiles'
        ? `/api/vault/profile/${encodeURIComponent(name)}`
        : `/api/vault/${encodeURIComponent(type)}/${encodeURIComponent(name)}`;
      const res = await fetch(url, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${soulCert}` }
      });
      if (res.ok) {
        // Optimistisch aus lokalem State entfernen
        const sf = { ...syncedFiles.value };
        sf[type] = (sf[type] || []).filter(f => f !== name);
        syncedFiles.value = sf;
        // active_files bereinigen
        const af = { ...activeFiles.value };
        if (Array.isArray(af[type])) {
          af[type] = af[type].filter(f => f !== name);
        } else if (af[type] === name) {
          af[type] = type === "video" ? [] : "";
        }
        activeFiles.value = af;
      }
      return res.ok;
    } catch { return false; }
  }

  /**
   * Entfernt eine Datei aus dem Public Vault auf dem VPS.
   */
  async function removePublicFile(soulCert, filename) {
    try {
      const res = await fetch(`/api/vault/public/${encodeURIComponent(filename)}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${soulCert}` }
      });
      return res.ok;
    } catch { return false; }
  }

  /**
   * Fetcht alle Vault-Dateien vom VPS als Plaintext-ArrayBuffer.
   * Falls VPS eine aktive Vault-Session hat, entschlüsselt er CBC-Dateien automatisch.
   * Dateien die noch verschlüsselt ankommen (SYS\x01-Magic) werden übersprungen.
   * @param {string} soulToken – soul_id.cert
   * @returns {Promise<Array<{ name: string, buffer: ArrayBuffer }>>}
   */
  async function fetchVpsVaultFiles(soulToken) {
    const results = []
    const sf      = syncedFiles.value
    const cats    = ['audio', 'video', 'images', 'context']

    for (const cat of cats) {
      const names = Array.isArray(sf[cat]) ? sf[cat] : []
      for (const name of names) {
        try {
          const res = await fetch(`/api/vault/${cat}/${encodeURIComponent(name)}`, {
            headers: { Authorization: `Bearer ${soulToken}` }
          })
          if (!res.ok) continue
          const buffer = await res.arrayBuffer()
          if (buffer.byteLength < 4) continue
          // CBC-verschlüsselte Dateien (SYS\x01-Magic) überspringen —
          // VPS kann sie nur entschlüsseln wenn eine aktive Vault-Session vorliegt.
          const head = new Uint8Array(buffer, 0, 4)
          if (head[0] === 0x53 && head[1] === 0x59 && head[2] === 0x53 && head[3] === 0x01) continue
          results.push({ name, buffer })
        } catch { /* weiter */ }
      }
    }

    // Profile: separater Endpunkt /api/vault/profile/{type}
    const profileTypes = Array.isArray(sf.profiles) ? sf.profiles : []
    for (const ptype of profileTypes) {
      try {
        const res = await fetch(`/api/vault/profile/${encodeURIComponent(ptype)}`, {
          headers: { Authorization: `Bearer ${soulToken}` }
        })
        if (!res.ok) continue
        const buffer = await res.arrayBuffer()
        if (buffer.byteLength < 2) continue
        const head = new Uint8Array(buffer, 0, 4)
        if (head[0] === 0x53 && head[1] === 0x59 && head[2] === 0x53 && head[3] === 0x01) continue
        results.push({ name: `profile_${ptype}.json`, buffer })
      } catch { /* weiter */ }
    }

    return results
  }

  function resetContext() {
    syncedFiles.value    = { audio: [], video: [], images: [], context: [], profiles: [] };
    activeFiles.value    = { audio: "", video: [], images: "", context: "" };
    localFiles.value     = { audio: [], video: [], images: [], context: [], profiles: [] };
    loaded.value         = false;
    enabled.value        = false;
    cipherMode.value     = "ciphered";
    lastCert.value       = "";
    publicShare.value       = { enabled: false, public_files: [], api_grants: [], soul_grants: [] };
    publicShareLoaded.value = false;
  }

  return {
    // State
    loaded, enabled, cipherMode, permissions, syncedFiles, activeFiles, localFiles, isSyncing, syncError, saveError,
    // Public Vault State
    publicShare, publicShareLoaded, publicSyncing, publicSyncError,
    // Computed
    apiEndpoints, totalSynced, baseUrl,
    // Methods
    loadContext, saveContext, syncAll, syncFile, setActive, scanVault, resetContext, encryptData, fetchVpsVaultFiles,
    deleteVaultFile,
    // Public Vault Methods
    loadPublicShare, savePublicShare, syncPublicFiles, removePublicFile,
    generatePublicToken, generateGrantId
  };
}
