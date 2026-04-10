import { z } from 'zod';
import { getJson } from '../lib/api.mjs';

export function register(server, token) {
  server.tool(
    'network_peer_get',
    [
      'Liest alle freigegebenen Inhalte einer verbundenen Soul:',
      '- soul_content: Soul.md der Person (wenn freigegeben)',
      '- context_files: Alle freigegebenen Kontext-/Textdateien mit vollständigem Inhalt',
      '- files: Manifest aller freigegebenen Dateien (Bilder, Audio, Video)',
      '',
      'Zugriff basiert auf den Berechtigungen der Verbindung (permissions) und dem',
      'soul_grant in der vault_public/config.json der Ziel-Soul.',
      'Nur Dateien die explizit freigegeben wurden sind sichtbar.',
    ].join('\n'),
    {
      soul_id: z.string().describe('UUID der verbundenen Soul (aus network_list)'),
      file:    z.string().optional().describe('Einzelne Datei lesen (optional, z.B. "about.md")'),
    },
    async ({ soul_id, file }) => {
      try {
        const path = file
          ? `/api/vault/connections/peer-files?soul_id=${encodeURIComponent(soul_id)}&file=${encodeURIComponent(file)}`
          : `/api/vault/connections/peer-files?soul_id=${encodeURIComponent(soul_id)}`;

        const data = await getJson(path, token);

        // Lesbare Zusammenfassung für Claude
        const lines = [];

        if (data.alias)  lines.push(`## ${data.alias} (${soul_id})`);
        if (data.mutual) lines.push('Verbindung: gegenseitig ✓');
        if (data.granted_scopes?.length) {
          lines.push(`Freigegebene Scopes: ${data.granted_scopes.join(', ')}`);
        }

        if (data.soul_content) {
          lines.push('\n### Soul.md\n');
          lines.push(data.soul_content);
        }

        if (Array.isArray(data.context_files) && data.context_files.length > 0) {
          for (const cf of data.context_files) {
            lines.push(`\n### ${cf.name}\n`);
            lines.push(cf.content);
          }
        }

        if (Array.isArray(data.files) && data.files.length > 0) {
          lines.push('\n### Weitere freigegebene Dateien');
          for (const f of data.files) {
            if (f.type !== 'context_files') {
              lines.push(`- ${f.name} (${f.type})`);
            }
          }
        }

        if (data.note) {
          lines.push(`\n_Hinweis: ${data.note}_`);
        }

        const text = lines.length > 0
          ? lines.join('\n')
          : JSON.stringify(data, null, 2);

        return { content: [{ type: 'text', text }] };
      } catch (err) {
        return { content: [{ type: 'text', text: err.message }], isError: true };
      }
    }
  );
}
