// app/composables/useConnectedVault.js
// Lädt Dateien aus den Public Vaults verbundener Souls für den Chat-Kontext.
//
// Ablauf pro verbundener Soul:
//  1. GET /api/vault/public/{soul_id}          → Manifest (kein Auth)
//  2. GET /api/vault/public/{soul_id}/{file}   → Datei mit eigenem Soul-Cert als Bearer

/**
 * Holt das Manifest + Textdateien einer einzelnen verbundenen Soul.
 * Verschlüsselte Dateien werden übersprungen (kein lokaler Key verfügbar).
 */
async function fetchOneSoulVault(soulCert, soul_id, alias) {
  try {
    const mRes = await fetch(`/api/vault/public/${soul_id}`)
    if (!mRes.ok) return null
    const manifest = await mRes.json()
    if (!Array.isArray(manifest.files) || !manifest.files.length) return null

    const result = { soul_id, alias, textContent: '', imageFiles: [], cipheredImageFiles: [], audioFiles: [] }

    await Promise.all(manifest.files.map(async (file) => {
      if (file.type === 'context_files') {
        if (file.cipher === 'ciphered') return // kein Schlüssel → überspringen
        const fRes = await fetch(`/api/vault/public/${soul_id}/${file.name}`, {
          headers: { Authorization: `Bearer ${soulCert}` }
        })
        if (fRes.ok) {
          const text = await fRes.text()
          result.textContent += `\n\n**${file.name}**\n${text.trim()}`
        }
      } else if (file.type === 'images') {
        if (file.cipher === 'ciphered') {
          result.cipheredImageFiles.push(file.name) // vorhanden aber verschlüsselt
        } else {
          result.imageFiles.push(file.name)
        }
      } else if (file.type === 'audio') {
        if (file.cipher !== 'ciphered') result.audioFiles.push(file.name)
      }
    }))

    return result
  } catch { return null }
}

/**
 * Holt Public Vault Kontext für alle verbundenen Souls.
 *
 * @param {string} soulCert       - Eigenes Soul-Cert (Bearer-Auth)
 * @param {Array}  connections    - Array von { soul_id, alias } aus useVaultConnections
 * @returns {{ publicVaultContext: string|null, imageManifest: Object }}
 *   imageManifest: { [soul_id]: { alias, files: string[] } }
 */
export async function fetchAllPublicVaults(soulCert, connections) {
  if (!soulCert || !Array.isArray(connections) || !connections.length) {
    return { publicVaultContext: null, imageManifest: {} }
  }

  const results = await Promise.all(
    connections.map(c => fetchOneSoulVault(soulCert, c.soul_id, c.alias))
  )

  const contextParts = []
  const imageManifest = {}

  for (const r of results) {
    if (!r) continue
    if (r.textContent) {
      contextParts.push(`### ${r.alias} – Geteilte Kontextdateien\n${r.textContent.trim()}`)
    }
    if (r.imageFiles.length || r.cipheredImageFiles.length) {
      imageManifest[r.soul_id] = {
        alias:         r.alias,
        files:         r.imageFiles,
        cipheredFiles: r.cipheredImageFiles
      }
    }
  }

  return {
    publicVaultContext: contextParts.length ? contextParts.join('\n\n') : null,
    imageManifest
  }
}

/**
 * Lädt ein einzelnes Bild aus dem Public Vault (für Chat-Anzeige).
 * @returns {Promise<string|null>} Blob-URL oder null
 */
export async function fetchPublicVaultImage(soulCert, soul_id, filename) {
  try {
    const res = await fetch(`/api/vault/public/${soul_id}/${filename}`, {
      headers: { Authorization: `Bearer ${soulCert}` }
    })
    if (!res.ok) return null
    const blob = await res.blob()
    return URL.createObjectURL(blob)
  } catch { return null }
}
