// server/api/fetch-bundle.post.js
// Proxy für .soul-Bundle-Fetch: umgeht Browser-CORS-Beschränkungen.
// Kein Auth nötig – das Bundle ist client-seitig AES-256-GCM-verschlüsselt.

export default defineEventHandler(async (event) => {
  const { url } = await readBody(event);

  if (!url || typeof url !== "string") {
    throw createError({ statusCode: 400, message: "url-Parameter fehlt." });
  }

  const clean = url.trim();

  if (!clean.startsWith("https://")) {
    throw createError({ statusCode: 400, message: "Nur HTTPS-URLs werden unterstützt." });
  }

  if (clean.length > 2048) {
    throw createError({ statusCode: 400, message: "URL zu lang." });
  }

  // SSRF-Schutz
  let parsed_url;
  try { parsed_url = new URL(clean); } catch {
    throw createError({ statusCode: 400, message: "Ungültige URL." });
  }
  const hostname = parsed_url.hostname;
  const ssrfPatterns = [
    /^localhost$/i, /^127\./, /^10\./, /^192\.168\./,
    /^172\.(1[6-9]|2\d|3[01])\./, /^169\.254\./, /^\[?::1\]?$/, /^0\.0\.0\.0$/,
  ];
  if (ssrfPatterns.some(p => p.test(hostname))) {
    throw createError({ statusCode: 400, message: "Interne Adressen sind nicht erlaubt." });
  }

  // Google Drive Share-URL → Direct-Download umschreiben
  let fetchUrl = clean;
  if (hostname.includes("drive.google.com")) {
    const fileMatch = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const gdId = fileMatch?.[1] ?? parsed_url.searchParams.get("id");
    if (gdId) fetchUrl = `https://drive.google.com/uc?export=download&confirm=t&id=${gdId}`;
  }

  let res;
  try {
    res = await fetch(fetchUrl, {
      signal:  AbortSignal.timeout(20_000),
      headers: { "User-Agent": "SYS-FetchBundle/1.0" },
      redirect: "follow",
    });
  } catch (e) {
    throw createError({
      statusCode: 502,
      message: e.name === "TimeoutError"
        ? "Quelle nicht erreichbar (Timeout 20 s)."
        : (e.message ?? "Verbindung fehlgeschlagen."),
    });
  }

  if (!res.ok) {
    throw createError({ statusCode: 502, message: `Externe Quelle antwortete mit HTTP ${res.status}.` });
  }

  let text;
  try { text = await res.text(); } catch {
    throw createError({ statusCode: 502, message: "Antwort konnte nicht gelesen werden." });
  }

  if (text.length > 50 * 1024 * 1024) {
    throw createError({ statusCode: 502, message: "Bundle überschreitet 50 MB Limit." });
  }

  let bundle;
  try { bundle = JSON.parse(text); } catch {
    throw createError({ statusCode: 502, message: "Antwort ist kein gültiges JSON." });
  }

  return bundle;
});
