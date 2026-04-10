// server/utils/validateSoulToken.js  (dev server — mirrors soul_auth.lua in production)
//
// Validates "Authorization: Bearer {soul_id}.{cert}" headers.
// cert = HMAC-SHA256(SOUL_MASTER_KEY, soul_id).hex()[0:32]
// Returns true if valid (or if SOUL_MASTER_KEY is not set — dev bypass).
//
// ⚠  Owner's implementation — not included in this distribution.
//    Production: handled by server/openresty/soul_auth.lua
//    Contact: contact@uxprojects-jok.com

export function validateSoulToken(_authHeader) {
  // Owner's implementation — returns true in dev mode (no SOUL_MASTER_KEY set).
  if (!process.env.SOUL_MASTER_KEY) return true;
  throw new Error("validateSoulToken: owner implementation required.");
}
