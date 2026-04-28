-- /etc/openresty/lua/soul_cert.lua
-- Ersetzt server/api/soul-cert.post.js in Production (OpenResty).
-- POST /api/soul-cert  {"soul_id":"...", "cert_version": 0, "proof": "<current_cert>"}
-- cert = HMAC-SHA256(SOUL_MASTER_KEY, soul_id [+ ":" + cert_version]).hex().slice(0, 32)
-- cert_version == 0 (default): altes Format – rückwärtskompatibel
--
-- Sicherheitsregel:
--   Neue Soul  (kein api_context.json): kein proof erforderlich.
--   Bestehende Soul: proof = aktuell gültiger soul_cert muss mitgesendet werden.
--   Server prüft HMAC für cert_versions 0..20 — akzeptiert bei erstem Treffer.
--   Unterstützt Grace-Period: prüft auch vorherigen Master-Key nach Rotation.

local cfg        = require("config_reader")
local master_key = cfg.get_master_key()

if not master_key or master_key == "" then
  ngx.status = 500
  ngx.header["Content-Type"] = "application/json"
  ngx.say('{"error":"SOUL_MASTER_KEY nicht konfiguriert"}')
  return
end

ngx.req.read_body()
local body = ngx.req.get_body_data()

if not body or body == "" then
  ngx.status = 400
  ngx.header["Content-Type"] = "application/json"
  ngx.say('{"error":"soul_id erforderlich"}')
  return
end

local cjson = require("cjson.safe")
local ok, data = pcall(cjson.decode, body)
if not ok or type(data) ~= "table" or type(data.soul_id) ~= "string" or #data.soul_id < 1 then
  ngx.status = 400
  ngx.header["Content-Type"] = "application/json"
  ngx.say('{"error":"soul_id erforderlich"}')
  return
end

local soul_id      = data.soul_id
local cert_version = tonumber(data.cert_version) or 0
local proof        = (type(data.proof) == "string" and #data.proof >= 20) and data.proof or nil

-- UUID-Format prüfen (Path Traversal verhindern)
local UUID_PAT = "^%x%x%x%x%x%x%x%x%-%x%x%x%x%-%x%x%x%x%-%x%x%x%x%-%x%x%x%x%x%x%x%x%x%x%x%x$"
if not soul_id:match(UUID_PAT) then
  ngx.status = 400
  ngx.header["Content-Type"] = "application/json"
  ngx.say('{"error":"invalid_soul_id"}')
  return
end

local hmac = require("hmac_helper")

-- Prüfen ob Soul bereits auf dem Server existiert
local SOULS_DIR = "/var/lib/sys/souls/"
local ctx_file  = SOULS_DIR .. soul_id .. "/api_context.json"
local cf = io.open(ctx_file, "r")

if cf then
  cf:close()
  -- Bestehende Soul → proof erforderlich
  if not proof then
    ngx.status = 401
    ngx.header["Content-Type"] = "application/json"
    ngx.say('{"error":"proof_required","message":"Für bestehende Souls ist proof (soul_cert) erforderlich."}')
    return
  end

  -- Alle cert_versions 0..20 prüfen — aktueller Key + vorheriger Key (Grace-Period)
  local prev_key = cfg.get_master_key_prev()
  local valid = false
  for v = 0, 20 do
    if hmac.cert_for_soul(master_key, soul_id, v) == proof then
      valid = true; break
    end
    if prev_key and prev_key ~= "" then
      if hmac.cert_for_soul(prev_key, soul_id, v) == proof then
        valid = true; break
      end
    end
  end

  if not valid then
    ngx.status = 401
    ngx.header["Content-Type"] = "application/json"
    ngx.say('{"error":"invalid_proof","message":"soul_cert Nachweis ungültig. Nur der Inhaber dieser Soul kann einen Cert abrufen."}')
    return
  end
end

-- Cert ausstellen (immer mit aktuellem Key)
local cert = hmac.cert_for_soul(master_key, soul_id, cert_version)

ngx.header["Content-Type"] = "application/json"
ngx.header["Cache-Control"] = "no-store"
ngx.say('{"cert":"' .. cert .. '"}')
