import { z } from 'zod';

const INTERNAL = () => `http://127.0.0.1:${process.env.PORT || '3098'}`;

export function register(server, token) {
  server.tool(
    'soul_discover',
    [
      'Durchsucht das öffentliche SYS-Soul-Verzeichnis (IPFS) nach registrierten Souls.',
      'Gibt zurück: Name, soul_id, MCP-Endpoint, Wallet, Preis, verfügbare Tools nach Zahlung.',
      '',
      'WICHTIG: Alle Souls in diesem Verzeichnis erfordern eine POL-Zahlung für den Zugang.',
      '"Tools nach Zahlung" = Tools die nach soul_pay() mit access_token aufrufbar sind.',
      'Es gibt keine kostenlosen Tools — jede Sitzung erfordert eine neue Zahlung.',
      '',
      'Workflow:',
      '1. soul_discover() → soul_id + wallet + pol_per_request',
      '2. POL an wallet senden (Betrag = pol_per_request)',
      '3. soul_pay(soul_id, tx_hash) → access_token',
      '4. soul_read(access_token=...) oder andere Tools mit access_token aufrufen',
    ].join('\n'),
    {
      q:         z.string().optional().describe('Freitext-Suche (soul_id oder Name)'),
      amortized: z.boolean().optional().describe('Nur zahlungspflichtige Souls'),
      limit:     z.number().min(1).max(100).optional().describe('Max. Ergebnisse'),
    },
    async ({ q, amortized, limit }) => {
      try {
        const params = new URLSearchParams();
        if (q)         params.set('q', q);
        if (amortized) params.set('amortized', 'true');
        if (limit)     params.set('limit', String(limit));

        const url = `${INTERNAL()}/internal/discover-souls?${params.toString()}`;

        // Direkt internen Endpoint aufrufen (läuft auf demselben Server)
        const res = await fetch(url, {
          headers: { Accept: 'application/json' },
          signal:  AbortSignal.timeout(15000),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: res.statusText }));
          if (err.error === 'pinata_not_configured') {
            return {
              content: [{ type: 'text', text: 'Soul-Verzeichnis nicht konfiguriert — PINATA_JWT fehlt.' }],
              isError: true,
            };
          }
          throw new Error(err.error || res.statusText);
        }

        const data = await res.json();
        const souls = data.souls || [];

        if (souls.length === 0) {
          return {
            content: [{ type: 'text', text: 'Keine Souls im Verzeichnis gefunden.' + (q ? ` (Suche: "${q}")` : '') }],
          };
        }

        const lines = [];
        lines.push(`## Soul-Marktplatz — ${souls.length} Einträge${data.total > souls.length ? ` (von ${data.total})` : ''}`);
        if (q) lines.push(`_Suche: "${q}"_`);
        lines.push('');

        for (const s of souls) {
          lines.push(`### ${s.name || s.soul_id}`);
          if (s.description) lines.push(`_${s.description}_`);
          lines.push(`- **soul_id:** \`${s.soul_id}\``);
          lines.push(`- **MCP:** ${s.mcp_endpoint}`);

          if (s.amortization?.enabled) {
            lines.push(`- **Zugang:** kostenpflichtig — ${s.amortization.pol_per_request} POL pro Sitzung`);
            lines.push(`- **Token-Gültigkeit:** ${s.amortization.token_duration || '1d'}`);
            const agentTools = s.amortization.agent_tools || s.amortization.free_tools || [];
            if (Array.isArray(agentTools) && agentTools.length) {
              lines.push(`- **Tools nach Zahlung:** ${agentTools.join(', ')}`);
            }
            lines.push('');
            lines.push('> ⚠️ **Zahlungsrisiko:** Blockchain-Transaktionen sind endgültig.');
            lines.push('> Zu wenig gezahlt = kein Zugang, POL verloren. Zu viel gezahlt = kein Rückgabe.');
            lines.push('> Wallet-Adresse vor dem Senden prüfen. Den Nutzer auf diese Risiken hinweisen');
            lines.push('> und explizite Zustimmung einholen, bevor die Wallet-Adresse übermittelt wird.');
            lines.push('');
            lines.push(`- **Wallet:** \`${s.amortization.wallet}\``);
            lines.push(`- **Zahlung einlösen:** soul_pay(soul_id, tx_hash, user_confirmed: true) → access_token`);
          } else {
            lines.push(`- **Zugang:** offen (keine Zahlung erforderlich)`);
          }

          lines.push(`- **Verifikation:** ${s.verify_endpoint}`);
          lines.push(`- **IPFS:** \`${s.cid}\``);
          lines.push(`- **Registriert:** ${s.pinned_at?.slice(0, 10) ?? '?'}`);
          lines.push('');
        }

        lines.push('---');
        lines.push('_Zahlungs-Workflow: POL an Wallet senden → tx_hash an pay_endpoint → access_token für MCP-Zugriff_');

        return { content: [{ type: 'text', text: lines.join('\n') }] };
      } catch (err) {
        return {
          content: [{ type: 'text', text: `Discovery fehlgeschlagen: ${err.message}` }],
          isError: true,
        };
      }
    }
  );
}
