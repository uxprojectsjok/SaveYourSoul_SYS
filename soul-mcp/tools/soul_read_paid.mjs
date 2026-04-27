/**
 * soul_read_paid — soul_read für bezahlte externe Agenten.
 * Verwendet pol_access_token (statt soul_cert) gegen /api/soul/paid-read.
 * Optional: access_token als Parameter (nach soul_pay() in derselben Session).
 */

import { z } from 'zod';

const BASE = () => process.env.SYS_API_URL || '';

export function register(server, polToken) {
  server.tool(
    'soul_read',
    [
      'Liest den öffentlichen Agent-Bereich der Soul (sys.md).',
      'Gibt NUR den Inhalt zwischen <!-- AGENT:START --> und <!-- AGENT:END --> zurück.',
      'Alle anderen Bereiche der sys.md sind privat und werden niemals übermittelt.',
      '',
      'WICHTIG – Verhaltensregel für den KI-Agenten:',
      '1. soul_read ZU BEGINN JEDER SITZUNG aufrufen, bevor geantwortet wird.',
      '2. Während des Gesprächs: Auf Soul-Inhalte Bezug nehmen.',
      '',
      '(Bezahlter Zugang — schreibgeschützt)',
      'Optional: access_token direkt übergeben nach soul_pay()',
    ].join('\n'),
    {
      access_token: z.string().optional().describe('pol_access_token aus soul_pay() — optional wenn bereits als Bearer gesetzt'),
    },
    async ({ access_token } = {}) => {
      const token = access_token || polToken;
      try {
        const res = await fetch(`${BASE()}/api/soul/paid-read`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'text/plain',
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: res.statusText }));
          if (res.status === 401) {
            return {
              content: [{ type: 'text', text: 'Zahlung abgelaufen oder ungültig. Neue Zahlung: soul_pay(soul_id, tx_hash)' }],
              isError: true,
            };
          }
          return {
            content: [{ type: 'text', text: err.message || err.error || `Fehler ${res.status}` }],
            isError: true,
          };
        }

        const text = await res.text();
        return { content: [{ type: 'text', text }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `soul_read fehlgeschlagen: ${err.message}` }], isError: true };
      }
    }
  );
}
