-- /etc/openresty/lua/soul_cert.lua
-- Ersetzt server/api/soul-cert.post.js in Production (OpenResty).
-- POST /api/soul-cert  {"soul_id":"..."}  → {"cert":"<32 hex chars>"}
-- HMAC-SHA256(SOUL_MASTER_KEY, soul_id).hex().slice(0, 32)

local master_key = os.getenv("SOUL_MASTER_KEY")
if not master_key or master_key == "" then
  ngx.status = 500
  ngx.header["Content-Type"] = "application/json"
  ngx.say('{"error":"SOUL_MASTER_KEY nicht gesetzt"}')
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

local ok, data = pcall(require("cjson").decode, body)
if not ok or type(data) ~= "table" or type(data.soul_id) ~= "string" or #data.soul_id < 1 then
  ngx.status = 400
  ngx.header["Content-Type"] = "application/json"
  ngx.say('{"error":"soul_id erforderlich"}')
  return
end

local soul_id = data.soul_id

-- HMAC-SHA256 via resty.sha256 + resty.string (Standard-OpenResty-Bundle)
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
local hex  = rstr.to_hex(ho:final())
local cert = hex:sub(1, 32)

ngx.header["Content-Type"] = "application/json"
ngx.header["Cache-Control"] = "no-store"
ngx.say('{"cert":"' .. cert .. '"}')
