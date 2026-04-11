-- /etc/openresty/lua/soul_auth.lua
-- access_by_lua_file für /api/chat und /api/validate
-- Prüft "Authorization: Bearer {soul_id}.{cert}"
-- soul_cert = HMAC-SHA256(SOUL_MASTER_KEY, soul_id).hex().slice(0, 32)
-- Gibt ngx.exit(401) wenn ungültig, andernfalls fall-through.

local master_key = os.getenv("SOUL_MASTER_KEY")
if not master_key or master_key == "" then
  -- Kein Master-Key gesetzt → Auth überspringen (z.B. Test-Env ohne Key)
  return
end

local auth  = ngx.req.get_headers()["authorization"] or ""
local token = auth:match("^[Bb]earer%s+(.+)$")
if not token then return ngx.exit(401) end

local dot = token:find(".", 1, true)
if not dot then return ngx.exit(401) end

local soul_id = token:sub(1, dot - 1)
local cert    = token:sub(dot + 1)
if soul_id == "" or cert == "" then return ngx.exit(401) end

local sha256 = require("resty.sha256")
local rstr   = require("resty.string")
local BLOCK  = 64
local key    = master_key

if #key > BLOCK then
  local h = sha256:new(); h:update(key); key = h:final()
end
key = key .. string.rep("\0", BLOCK - #key)

local ipad, opad = {}, {}
for i = 1, BLOCK do
  local b = key:byte(i)
  ipad[i] = string.char(bit.bxor(b, 0x36))
  opad[i] = string.char(bit.bxor(b, 0x5c))
end

local hi = sha256:new(); hi:update(table.concat(ipad) .. soul_id)
local ho = sha256:new(); ho:update(table.concat(opad) .. hi:final())
local hex = rstr.to_hex(ho:final())

if cert ~= hex:sub(1, 32) then
  ngx.log(ngx.WARN, "[sys/auth] Ungültiges Cert soul_id=", soul_id)
  return ngx.exit(401)
end

-- Auth OK – soul_id für Content-Phase bereitstellen (z.B. soul_token_jwt.lua)
ngx.ctx.soul_id = soul_id
-- Authorization-Header entfernen bevor er weitergegeben wird
ngx.req.clear_header("Authorization")
