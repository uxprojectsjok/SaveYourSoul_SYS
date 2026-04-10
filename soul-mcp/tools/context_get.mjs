import { z } from 'zod';
import { getText, fileUrl } from '../lib/api.mjs';

export function register(server, token) {
  server.tool(
    'context_get',
    'Liest den Inhalt einer Text-Kontext-Datei (.md oder .txt) direkt als Text. Für Wissensdokumente, Notizen und strukturierte Informationen der Person.',
    { filename: z.string().describe('Dateiname, z.B. "notizen.md" – aus context_list bekannt') },
    async ({ filename }) => {
      try {
        const text = await getText(`/api/vault/context/${encodeURIComponent(filename)}`, token);
        return { content: [{ type: 'text', text }] };
      } catch (err) {
        // Fallback: URL zurückgeben
        const url = fileUrl('context', filename, token);
        return {
          content: [{ type: 'text', text: `Direkt-Abruf fehlgeschlagen. URL: ${url}\nFehler: ${err.message}` }],
          isError: true,
        };
      }
    }
  );
}
