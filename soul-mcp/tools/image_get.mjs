import { z } from 'zod';
import { fileUrl } from '../lib/api.mjs';

export function register(server, token) {
  server.tool(
    'image_get',
    'Gibt die abrufbare URL eines Bildes zurück. Das Token ist eingebettet. Für Gesichtsanalyse oder visuelle Kontext-Erkennung via Claude Vision geeignet.',
    { filename: z.string().describe('Dateiname, z.B. "profil.jpg" – aus image_list bekannt') },
    async ({ filename }) => {
      const url = fileUrl('images', filename, token);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ filename, url, hint: 'URL direkt an Claude Vision übergeben für Bildanalyse.' }),
          },
        ],
      };
    }
  );
}
