-- /etc/openresty/lua/hmac_helper.lua
-- Geteilter HMAC-SHA256 Helper – wird von soul_auth.lua und vault_auth.lua genutzt
-- Usage: local hmac = require("hmac_helper")
--        local hex  = hmac.sign(key_string, message_string)

local sha256 = require("resty.sha256")
local rstr   = require("resty.string")
local BLOCK  = 64

local M = {}

function M.sign(key, msg)
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

  local hi = sha256:new(); hi:update(table.concat(ipad) .. msg)
  local ho = sha256:new(); ho:update(table.concat(opad) .. hi:final())
  return rstr.to_hex(ho:final())
end

return M
