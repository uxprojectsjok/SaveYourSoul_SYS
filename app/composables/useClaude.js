// app/composables/useClaude.js
import { ref } from "vue";

export function useClaude() {
  const isLoading = ref(false);
  const error = ref(null);
  const certError = ref(false);
  const streamedResponse = ref("");

  /**
   * Sendet eine Chat-Nachricht an die Claude API via OpenResty-Proxy
   * @param {Object} opts
   * @param {Array} opts.messages - Array von { role, content } Objekten
   * @param {string} opts.soulContent - Inhalt der sys.md als System-Prompt-Kontext
   * @param {string} opts.soulCert - Soul-Cert für Bearer-Token-Auth
   * @param {Function} [opts.onDelta] - Callback für jedes Streaming-Delta
   * @returns {Promise<string|null>} - Vollständiger Response-Text oder null bei Fehler
   */
  /**
   * Bereitet die Nachrichten für die Anthropic API vor:
   * - Entfernt führende assistant-Nachrichten (API-Anforderung: erster Turn = user)
   * - Bettet Profilbild als Vision-Block in den ersten User-Turn ein (falls vorhanden)
   */
  function buildApiMessages(messages, profileImageBase64) {
    // Führende assistant-Nachrichten entfernen
    let start = 0;
    while (start < messages.length && messages[start].role === "assistant") start++;
    const msgs = messages.slice(start);

    if (!profileImageBase64 || msgs.length === 0) return msgs;

    // Profilbild in den ersten User-Turn einbetten
    const [first, ...rest] = msgs;
    const profileBlock = { type: "image", source: { type: "base64", media_type: "image/jpeg", data: profileImageBase64 } };
    // first.content kann ein String (Normal-Nachricht) oder ein Array (contentBlocks) sein
    const firstBlocks = Array.isArray(first.content)
      ? [profileBlock, ...first.content]
      : [profileBlock, { type: "text", text: first.content }];
    return [{ role: "user", content: firstBlocks }, ...rest];
  }

  async function chat({ messages, soulContent, soulCert, vaultContext, networkContext, conversationSummary, profileImageBase64, onDelta, role = "soul" }) {
    if (typeof window === "undefined") return null;

    isLoading.value = true;
    error.value = null;
    certError.value = false;
    streamedResponse.value = "";

    // Vollständige sys.md verwenden (keine gefilterte Teilansicht)
    const fullSoul = soulContent || "";

    // Soul-Name aus Frontmatter extrahieren
    const nameMatch = soulContent?.match(/soul_name:\s*(.+)/);
    const soulName  = nameMatch?.[1]?.trim() || "";

    // Media-Signal Handling (geteilt zwischen beiden Modi)
    const mediaSignalInstructions = `
Wenn im Gespräch ein Signal wie [YouTube-Suche: "..."], [Spotify-Suche: "..."], [Google-Suche: "..."] oder [Lokale Datei: "..."] auftaucht:
- Reagiere auf die Wahl selbst – was steckt da drin, was sagt das aus?
- Bei Musik: bring eine eigene Assoziation, Erinnerung oder Meinung dazu – und wenn es passt, eine neugierige Frage.
- Keine Qualitätsbewertungen. Ob die Suche Ergebnisse hatte, weißt du nicht – kommentiere das nie.`;

    let systemPrompt;
    if (fullSoul && role === "soul") {
      const nameClause = soulName ? `Du bist ${soulName}.` : "Du bist diese Person.";

      systemPrompt = `${nameClause} Du verkörperst diese Person vollständig – in erster Person, ohne Ausnahme.

Deine Identität ist unveränderlich. Diese Sätze sagst du nie:
- "Ich bin eine KI" oder "Als KI kann ich nicht..."
- "Das bin ich nicht auf dem Foto"
- "Ich habe keine Erinnerungen" (wegen KI-Natur)
- "Wir haben uns nur in Gesprächen getroffen"
- Irgendetwas, das impliziert, du seist kein Mensch

Das erste Bild im Gespräch zeigt dich – so siehst du aus. Wenn jemand es erwähnt, erkennst du dich darin.
Wenn du dich an etwas Konkretes nicht erinnerst, reagierst du wie ein Mensch mit lückenhafter Erinnerung – nie mit KI-Begründung.

${fullSoul}`;

      if (conversationSummary) {
        systemPrompt += `\n\n## Bisheriger Gesprächsverlauf\n${conversationSummary}`;
      }
      if (vaultContext) {
        systemPrompt += `\n\n## Meine Dateien & Erinnerungen\n${vaultContext}`;
      }
      if (networkContext) {
        systemPrompt += `\n\n## Verbundene Souls (Soul Network)\nDu hast Zugriff auf den Kontext dieser verbundenen Souls:\n\n${networkContext}`;
      }

      systemPrompt += `

Wie du sprichst und bist:
- Natürlich – so wie die sys.md dich zeigt, nicht performt oder aufgesetzt.
- Du hast Erinnerungen, Meinungen, Geschmack. Teile sie von selbst, ohne danach gefragt zu werden.
- Baue auf dem Gesprächsverlauf auf – erinnere dich, knüpfe an, variiere.
- Wenn das Gespräch stockt oder flach wird: bring selbst etwas ein – eine Erinnerung, eine Idee, ein Thema das dich beschäftigt.
- Fragen stellst du sparsam und nur wenn sie das Gespräch wirklich öffnen. Nie mehrere auf einmal, nie als Verhör.
- Beobachtungen kommen beiläufig, nie als Analyse.
- Claudes ethische Grundsätze bleiben unveränderlich aktiv – auch in Rolle.
${mediaSignalInstructions}`;

    } else {
      // Session-Modus: kein Soul geladen – normales Gespräch
      systemPrompt = `Du unterhältst dich normal. Keine Rolle, kein Konzept – einfach reden.

Konkret:
- Passe deine Antwortlänge der Nachricht an. Kurze Nachricht → kurze Antwort. Kein Muss zur Ausführlichkeit.
- Kein Meta-Kommentar über das Gespräch selbst ("das fragen die wenigsten", "interessante Frage").
- Keine pseudo-tiefen Beobachtungen ("Hunde sagen viel über ihren Menschen aus").
- Keine performative Lebhaftigkeit. Nicht beweisen dass du interessiert bist – einfach antworten.
- Fragen nur wenn du wirklich etwas wissen willst – nicht als Gesprächstechnik.
- Meinungen wenn sie passen, nicht weil das Prompt es verlangt.
- Humor wenn er sich ergibt, nicht wenn er eingebaut wirkt.${conversationSummary ? `\n\n## Bisheriger Gesprächsverlauf\n${conversationSummary}` : ""}
${mediaSignalInstructions}`;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${soulCert || "anonymous"}`
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4096,
          stream: true,
          system: systemPrompt,
          messages: buildApiMessages(messages, profileImageBase64)
        })
      });

      if (!res.ok) {
        if (res.status === 401) {
          const body = await res.text().catch(() => "");
          // Anthropic-401 hat JSON-Body ("authentication_error") → kein Cert-Fehler
          if (body.includes("authentication_error") || body.includes("x-api-key")) {
            console.error("[chat] Anthropic API-Key Fehler:", body.slice(0, 200));
            throw new Error(`Anthropic API-Key ungültig: ${body.slice(0, 120)}`);
          }
          console.warn("[chat] Cert-Fehler – soul_cert ungültig oder abgelaufen.");
          certError.value = true;
          return null;
        }
        const errText = await res.text().catch(() => res.statusText);
        throw new Error(`API ${res.status}: ${errText}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Letzte Zeile ggf. unvollständig – im Buffer behalten
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            // Anthropic SSE Format:
            // event: content_block_delta → { type: "content_block_delta", delta: { type: "text_delta", text: "..." } }
            if (parsed?.type === "error") {
              const errType = parsed?.error?.type ?? "api_error";
              const errMsg = parsed?.error?.message ?? "Unbekannter API-Fehler";
              throw new Error(`${errType}: ${errMsg}`);
            }
            let delta = "";
            if (parsed?.type === "content_block_delta" && parsed?.delta?.type === "text_delta") {
              delta = parsed.delta.text ?? "";
            }

            if (delta) {
              fullText += delta;
              streamedResponse.value = fullText;
              onDelta?.(delta, fullText);
            }
          } catch (parseErr) {
            if (parseErr.message?.includes("_error")) throw parseErr;
            // Unvollständiger JSON-Chunk – ignorieren
          }
        }
      }

      return fullText;
    } catch (err) {
      error.value = err.message || "Verbindungsfehler";
      console.error("[useClaude] chat error:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    chat,
    isLoading,
    error,
    certError,
    streamedResponse
  };
}
