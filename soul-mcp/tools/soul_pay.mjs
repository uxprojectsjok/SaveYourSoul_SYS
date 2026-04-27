import { z } from 'zod';

const INTERNAL = () => `http://127.0.0.1:${process.env.PORT || '3098'}`;

const RISK_WARNING = [
  '⚠️  ZAHLUNGSRISIKO — BITTE VOR DEM SENDEN LESEN:',
  '',
  '1. ZU WENIG GEZAHLT: Transaktion ist durch, aber kein Zugang wird gewährt.',
  '   Das gezahlte POL ist unwiederbringlich verloren. Kein Rückgabe-Mechanismus.',
  '',
  '2. ZU VIEL GEZAHLT: Überschuss geht an den Soul-Besitzer. Keine Rückerstattung.',
  '',
  '3. FALSCHE WALLET: Zahlung an die falsche Adresse ist nicht rückgängig zu machen.',
  '   Wallet-Adresse vor dem Senden sorgfältig prüfen.',
  '',
  '4. BLOCKCHAIN-TRANSAKTIONEN SIND ENDGÜLTIG. Es gibt keine Chargeback-Option.',
  '',
  'Um fortzufahren: soul_pay erneut aufrufen mit user_confirmed: true.',
  'Damit bestätigt der Nutzer, dass er die Risiken verstanden und akzeptiert hat.',
].join('\n');

export function register(server) {
  server.tool(
    'soul_pay',
    [
      'Löst eine POL-Transaktion ein und gibt einen Zugangs-Token zurück.',
      '',
      'WICHTIG: user_confirmed muss explizit auf true gesetzt sein.',
      'Ohne Bestätigung gibt das Tool nur den Risikohinweis zurück — keine Zahlung.',
      'Die KI muss dem Nutzer die Risiken zeigen und eine explizite Zustimmung einholen.',
      '',
      'Workflow:',
      '1. soul_discover() → soul_id + wallet + pol_per_request ermitteln',
      '2. soul_pay(soul_id, tx_hash, user_confirmed: false) → Risikohinweis anzeigen',
      '3. Nutzer bestätigt → soul_pay(soul_id, tx_hash, user_confirmed: true) → access_token',
      '4. Paid Tools mit access_token aufrufen',
    ].join('\n'),
    {
      soul_id:        z.string().describe('UUID der Soul (aus soul_discover)'),
      tx_hash:        z.string().describe('Polygon TX-Hash (0x…)'),
      user_confirmed: z.boolean().describe(
        'Muss true sein. Bestätigt dass der Nutzer die Zahlungsrisiken (kein Rückgabe, Verlust bei Unterzahlung) explizit verstanden und akzeptiert hat.'
      ),
    },
    async ({ soul_id, tx_hash, user_confirmed }) => {
      if (!user_confirmed) {
        return {
          content: [{ type: 'text', text: RISK_WARNING }],
        };
      }

      try {
        const res = await fetch(`${INTERNAL()}/internal/verify-tx-and-pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ soul_id, tx_hash }),
          signal: AbortSignal.timeout(20000),
        });

        const data = await res.json();

        if (!res.ok || !data.ok) {
          return {
            content: [{ type: 'text', text: `Zahlung fehlgeschlagen: ${data.error || data.message || res.statusText}` }],
            isError: true,
          };
        }

        return {
          content: [{
            type: 'text',
            text: [
              '✓ Zahlung bestätigt.',
              '',
              `access_token: ${data.access_token}`,
              `Gültig bis:   ${data.expires_at}`,
              `POL:          ${data.pol_amount}`,
              '',
              'Verwende access_token jetzt bei soul_read(access_token=...) oder anderen freigegebenen Tools.',
            ].join('\n'),
          }],
        };
      } catch (err) {
        return {
          content: [{ type: 'text', text: `soul_pay fehlgeschlagen: ${err.message}` }],
          isError: true,
        };
      }
    }
  );
}
