-- /etc/openresty/lua/soul_rotate_cert.lua
-- POST /api/soul-rotate-cert
-- Auth: Bearer {soul_id}.{current_cert}   (via vault_auth.lua access phase)
--
-- Inkrementiert cert_version in sys.md und gibt den neuen Cert zurück.
-- Alter Cert wird damit sofort ungültig.

local master_key = os.getenv("SOUL_MASTER_KEY")
if not master_key or master_key == "" then
  ngx.status = 500
  ngx.header["Content-Type"] = "application/json"
  ngx.say('{"error":"SOUL_MASTER_KEY nicht gesetzt"}')
  return
end

local soul_id = ngx.ctx.soul_id
if not soul_id or soul_id == "" then
  ngx.status = 401
  ngx.header["Content-Type"] = "application/json"
  ngx.say('{"error":"Nicht authentifiziert"}')
  return
end

-- sys.md lesen
local path = "/var/lib/sys/souls/" .. soul_id .. "/sys.md"
local f = io.open(path, "r")
if not f then
  ngx.status = 404
  ngx.header["Content-Type"] = "application/json"
  ngx.say('{"error":"sys.md nicht gefunden"}')
  return
end
local content = f:read("*a"); f:close()

-- cert_version lesen und inkrementieren
local hmac         = require("hmac_helper")
local old_version  = hmac.read_cert_version(soul_id)
local new_version  = old_version + 1
local new_cert     = hmac.cert_for_soul(master_key, soul_id, new_version)

-- cert_version in Frontmatter schreiben (oder hinzufügen)
if content:match("cert_version:%s*%d+") then
  content = content:gsub("(cert_version:%s*)%d+", "%1" .. tostring(new_version))
else
  -- Nach soul_cert Zeile einfügen
  content = content:gsub("(soul_cert:%s*[^\n]+\n)", "%1cert_version: " .. tostring(new_version) .. "\n")
end

-- soul_cert in Frontmatter ersetzen
content = content:gsub("(soul_cert:%s*)[^\n]+", "%1" .. new_cert)

-- sys.md schreiben
local wf = io.open(path, "w")
if not wf then
  ngx.status = 500
  ngx.header["Content-Type"] = "application/json"
  ngx.say('{"error":"sys.md konnte nicht geschrieben werden"}')
  return
end
wf:write(content); wf:close()

ngx.log(ngx.INFO, "[soul_rotate_cert] soul_id=", soul_id,
  " version ", old_version, " → ", new_version)

local cjson = require("cjson.safe")
ngx.header["Content-Type"] = "application/json"
ngx.header["Cache-Control"] = "no-store"
ngx.say(cjson.encode({
  cert         = new_cert,
  cert_version = new_version,
}))
