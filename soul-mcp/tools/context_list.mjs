import { z } from 'zod';
import { getJson } from '../lib/api.mjs';

export function register(server, token) {
  server.tool(
    'context_list',
    [
      'Listet alle Text-Kontext-Dateien im Vault auf: Notizen, Dokumente, Wissensbasis (.md, .txt). Gibt Namen und URL zurück.',
      '',
      'Optional: access_token aus soul_pay() für Kontext-Liste fremder Souls.',
    ].join('\n'),
    {
      access_token: z.string().optional().describe('pol_access_token aus soul_pay() — für Kontext-Liste fremder Souls'),
    },
    async ({ access_token } = {}) => {
      const useToken = access_token || token;
      const path     = '/api/vault/context';
      try {
        const data = await getJson(path, useToken);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { content: [{ type: 'text', text: apiErrMsg(err) }], isError: true };
      }
    }
  );
}

function apiErrMsg(err) {
  if (err.status === 403) return 'Vault gesperrt oder Kontext-Berechtigung fehlt.';
  return err.message;
}
