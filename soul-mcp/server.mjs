/**
 * soul-mcp – MCP Server für SaveYourSoul
 *
 * Exponiert Soul-Daten als MCP-Tools für Claude.ai und Claude Desktop.
 * Kommuniziert ausschliesslich via HTTP mit SaveYourSoul API.
 * Kein gemeinsamer Code mit dem SaveYourSoul-Projekt.
 *
 * Endpunkte:
 *   POST /mcp                              – MCP Streamable HTTP (Haupt-Endpunkt)
 *   GET  /.well-known/oauth-authorization-server – OAuth Discovery
 *   GET  /oauth/authorize                  – Consent-Seite
 *   POST /oauth/authorize                  – Cert validieren + Code ausstellen
 *   POST /oauth/token                      – Code → Access Token
 */

import 'dotenv/config';
import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { registerTools } from './tools/index.mjs';
import { registerPrompts } from './prompts/index.mjs';
import { oauthRouter } from './oauth.mjs';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) throw new Error('BASE_URL is not set. Add it to your .env file.');

// ── CORS ──────────────────────────────────────────────────────────────────
// Claude.ai und Claude Desktop rufen den MCP-Server von deren Backend aus auf.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Mcp-Session-Id');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const SCOPES = ['soul', 'calendar', 'audio', 'images', 'video', 'context', 'network'];

// ── OAuth Discovery (RFC 8414) ────────────────────────────────────────────
app.get('/.well-known/oauth-authorization-server', (_req, res) => {
  res.json({
    issuer: BASE_URL,
    authorization_endpoint: `${BASE_URL}/oauth/authorize`,
    token_endpoint: `${BASE_URL}/oauth/token`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code'],
    code_challenge_methods_supported: ['S256'],
    scopes_supported: SCOPES,
    token_endpoint_auth_methods_supported: ['none'],
  });
});

// ── Protected Resource Metadata (RFC 8707) – Claude.ai nutzt diesen Endpoint ──
// Sowohl /mcp-Variante als auch Basis-URL werden abgefragt
app.get('/.well-known/oauth-protected-resource', (_req, res) => {
  res.json({
    resource: `${BASE_URL}/mcp`,
    authorization_servers: [BASE_URL],
    scopes_supported: SCOPES,
    bearer_methods_supported: ['header'],
  });
});
app.get('/.well-known/oauth-protected-resource/mcp', (_req, res) => {
  res.json({
    resource: `${BASE_URL}/mcp`,
    authorization_servers: [BASE_URL],
    scopes_supported: SCOPES,
    bearer_methods_supported: ['header'],
  });
});

// ── OAuth ─────────────────────────────────────────────────────────────────
app.use('/oauth', oauthRouter);

// ── MCP Streamable HTTP ───────────────────────────────────────────────────

function unauthorized(res) {
  // RFC 8707: resource_metadata zeigt auf Protected Resource Metadata (nicht Authorization Server)
  res.setHeader(
    'WWW-Authenticate',
    `Bearer resource_metadata="${BASE_URL}/.well-known/oauth-protected-resource"`
  );
  return res.status(401).json({
    jsonrpc: '2.0',
    error: { code: -32001, message: 'Authorization required.' },
    id: null,
  });
}

async function handleMcp(req, res) {
  const token = extractToken(req);
  if (!token) return unauthorized(res);

  const server = new McpServer({ name: 'soul-mcp', version: '1.0.0' });
  registerTools(server, token);
  registerPrompts(server);

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
  });

  res.on('close', async () => {
    try { await transport.close(); await server.close(); } catch { /* cleanup */ }
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error('[MCP] Request-Fehler:', err.message);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Interner Fehler.' },
        id: null,
      });
    }
  }
}

app.get('/mcp',    handleMcp);
app.post('/mcp',   handleMcp);
app.delete('/mcp', handleMcp);

// Gesundheits-Check
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'soul-mcp', ts: new Date().toISOString() });
});

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '3098', 10);
app.listen(PORT, '127.0.0.1', () => {
  console.log(`soul-mcp läuft auf 127.0.0.1:${PORT}`);
  console.log(`MCP-Endpunkt: ${BASE_URL}/mcp`);
  console.log(`OAuth: ${BASE_URL}/oauth/authorize`);
});

// ── Helpers ────────────────────────────────────────────────────────────────
function extractToken(req) {
  const auth = req.headers.authorization || '';
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (match) return match[1].trim();
  return null;
}
