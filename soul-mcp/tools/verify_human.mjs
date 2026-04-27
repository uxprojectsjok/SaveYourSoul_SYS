import { z } from 'zod';
import { getJson, getText } from '../lib/api.mjs';
import { parseFrontmatter } from '../lib/soul_parser.mjs';
import { verifyHuman as blockchainVerify } from '../lib/blockchain.mjs';

export function register(server, token) {
  server.tool(
    'verify_human',
    [
      'Prüft ob die Soul einer echten menschlichen Person gehört, indem der Polygon-Blockchain-Anker verifiziert wird. Gibt Verifikationsstatus, Wallet-Adresse, Anker-Datum und Session-Anzahl zurück.',
      '',
      'Optional: access_token aus soul_pay() für Verifikation fremder Souls.',
    ].join('\n'),
    {
      access_token: z.string().optional().describe('pol_access_token aus soul_pay() — für Verifikation fremder Souls'),
    },
    async ({ access_token } = {}) => {
      const useToken = access_token || token;
      const isPaid   = !!access_token;
      try {
        let soulId;

        if (isPaid) {
          // soul_id aus paid-read sys.md Frontmatter extrahieren
          const md = await getText('/api/soul/paid-read', useToken);
          const fm = parseFrontmatter(md);
          soulId = fm.soul_id;
        } else {
          // soul_id aus Manifest holen
          const manifest = await getJson('/api/vault/manifest', useToken);
          soulId = manifest.soul_id;
        }

        if (!soulId) {
          return {
            content: [{ type: 'text', text: 'soul_id nicht gefunden.' }],
            isError: true,
          };
        }

        const result = await blockchainVerify(soulId);

        const summary = result.verified
          ? `✓ Verifiziert – ${result.anchor_count} Blockchain-Anker, ${result.total_sessions} Sessions, erste Verankerung: ${result.first_anchor}`
          : `✗ Nicht verifiziert – keine Blockchain-Einträge gefunden`;

        return {
          content: [
            { type: 'text', text: summary },
            { type: 'text', text: JSON.stringify(result, null, 2) },
          ],
        };
      } catch (err) {
        return { content: [{ type: 'text', text: err.message }], isError: true };
      }
    }
  );
}
