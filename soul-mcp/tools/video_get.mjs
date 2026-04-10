import { z } from 'zod';
import { fileUrl } from '../lib/api.mjs';

export function register(server, token) {
  server.tool(
    'video_get',
    'Gibt die abrufbare URL einer Video-Datei zurück. Token ist eingebettet. Für Bewegungsanalyse und nonverbale Kommunikationsmuster.',
    { filename: z.string().describe('Dateiname, z.B. "bewegung.mp4" – aus video_list bekannt') },
    async ({ filename }) => {
      const url = fileUrl('video', filename, token);
      return {
        content: [{ type: 'text', text: JSON.stringify({ filename, url }) }],
      };
    }
  );
}
