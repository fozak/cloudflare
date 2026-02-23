//Adapter.http-gate
{
  "execute": "async function(run_doc) { const req = run_doc.request; if (!req) return run_doc; run_doc.request = { ip: req.headers?.get?.('CF-Connecting-IP') || req.ip, method: req.method, contentType: req.headers?.get?.('Content-Type'), authorization: req.headers?.get?.('Authorization') }; if (!this.checkRateLimit(`ip:${run_doc.request.ip}`, run_doc._rateLimits, this.config.rateLimit.requests, this.config.rateLimit.window)) { run_doc.input._state = { '0.0_1.HTTP.receive': '-1' }; run_doc._error = '429 Too Many Requests'; return run_doc; } run_doc.input._state = { '0.0_1.HTTP.receive': '1' }; return run_doc; }",
  "checkRateLimit": "function(key, rateLimits, max, windowMs) { const now = Date.now(); let times = rateLimits.get(key); if (!times) { times = []; rateLimits.set(key, times); } while (times.length > 0 && times[0] <= now - windowMs) { times.shift(); } if (times.length >= max) return false; times.push(now); return true; }"
}

//current version Adapter.auth

{
  "execute": "async function(run_doc) { const authHeader = run_doc.request?.authorization; if (!authHeader) return run_doc; const token = authHeader.replace('Bearer ', ''); const payload = await this.verifyJWT(token, this.config.jwtSecret); if (!payload) { run_doc.input._state = { '0.1_2.JWT.verify': '-1' }; run_doc._error = 'Invalid token'; return run_doc; } run_doc.user = { sub: payload.sub, name: payload.name, _allowed_read: payload._allowed_read, auth_status: payload.auth_status, email_status: payload.email_status }; run_doc.input._state = { '0.1_2.JWT.verify': '1' }; return run_doc; }",
  "verifyJWT": "async function(token, secret) { try { const [headerB64, payloadB64, signatureB64] = token.split('.'); const data = `${headerB64}.${payloadB64}`; const encoder = new TextEncoder(); const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']); const signature = this.base64UrlDecode(signatureB64); const valid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(data)); if (!valid) return null; const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))); if (payload.exp && payload.exp < Date.now() / 1000) return null; return payload; } catch { return null; } }",
  "base64UrlDecode": "function(str) { const base64 = str.replace(/-/g, '+').replace(/_/g, '/'); const binary = atob(base64); const bytes = new Uint8Array(binary.length); for (let i = 0; i < binary.length; i++) { bytes[i] = binary.charCodeAt(i); } return bytes; }",
  "generateToken": "async function(run_doc) { const user = run_doc.target.data[0]; const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })); const payload = btoa(JSON.stringify({ sub: user.email, name: user.name, _allowed_read: user._allowed_read, auth_status: user.auth_status, email_status: user.email_status, exp: Math.floor(Date.now() / 1000) + 86400 })); const data = header + '.' + payload; const encoder = new TextEncoder(); const key = await crypto.subtle.importKey('raw', encoder.encode(this.config.jwtSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data)); run_doc.user = run_doc.user || {}; run_doc.user.token = data + '.' + btoa(String.fromCharCode(...new Uint8Array(sig))); run_doc.input._state = { '0.2_3.Auth.generateToken': '1' }; return run_doc; }",
  "generateTokenKey": "function(run_doc) { run_doc.input.tokenKey = crypto.randomUUID(); return run_doc; }"
}



Yes — is_virtual: 1 fields are ephemeral, never persisted. Token belongs on run_doc.user since it's session-related:
javascriptgenerateToken: "async function(run_doc) {
  const user = run_doc.target.data[0];
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.email,
    name: user.name,
    _allowed_read: user._allowed_read,
    exp: Math.floor(Date.now() / 1000) + 86400
  }));
  const data = header + '.' + payload;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(this.config.jwtSecret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  
  // is_virtual — ephemeral, never persisted, lives on run_doc.user
  run_doc.user = run_doc.user || {};
  run_doc.user.token = data + '.' + btoa(String.fromCharCode(...new Uint8Array(sig)));
  
  return run_doc;
}"
Schema definition for virtual fields:
javascript// User schema
{ fieldname: "token", fieldtype: "Data", is_virtual: 1 }
// verification_code is also virtual
{ fieldname: "verification_code", fieldtype: "Data", is_virtual: 1 }
Controller strips is_virtual fields before persist:
javascript// in persist — before DB write
const doc = { ...run_doc.target.data[0] };
for (const field of schema.fields) {
  if (field.is_virtual) delete doc[field.fieldname];
}
// only non-virtual fields written to DB
is_virtual: 1 is the single flag that governs ephemerality across the entire system — schema-driven, no hardcoding.see what we missed to set in payload from previuos discussion3:59 PMFrom previous discussion — tokenKey is missing from payload. But we established tokenKey is for invalidation only — stays in DB, never in token.
What IS missing — tokenVersion or equivalent invalidation handle. Without it tokens are irrevocable until expiry.
But more importantly — looking at your User schema from auth adapter:
javascript// fields on user that should be in payload but aren't:
{
  sub: user.email,          // ✅
  name: user.name,          // ✅
  _allowed_read: user._allowed_read,  // ✅
  exp: ...                  // ✅
  
  // MISSING:
  email_status: user.email_status,  // is email verified?
  auth_status: user.auth_status,    // is account active/locked?
}
auth_status and email_status are critical — gateway needs to know if account is locked or unverified without a DB hit. Currently these are only in DB, so gateway can't check them from token alone.


//old Adapter.auth

{
  "execute": "async function(gatewayResult, env, rateLimits) { if (!gatewayResult.ok) return gatewayResult; const r = gatewayResult.req; let userAuth = null; if (r.authHeader) { const token = r.authHeader.replace('Bearer ', ''); const jwtPayload = await this.verifyJWT(token, this.config.jwtSecret); if (!jwtPayload) return [401, 'Invalid token']; userAuth = await this.getUserWithCapabilities(jwtPayload.sub, env); if (!userAuth) return [401, 'User not found']; if (!this.checkRateLimit(`user:${userAuth.id}`, rateLimits, this.config.userRateLimit.requests, this.config.userRateLimit.window)) { return [429, 'User rate limit exceeded']; } } return { ok: true, req: r, user: userAuth }; }",
  "verifyJWT": "async function(token, secret) { try { const [headerB64, payloadB64, signatureB64] = token.split('.'); const data = `${headerB64}.${payloadB64}`; const encoder = new TextEncoder(); const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']); const signature = this.base64UrlDecode(signatureB64); const valid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(data)); if (!valid) return null; const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))); if (payload.exp && payload.exp < Date.now() / 1000) return null; return payload; } catch { return null; } }",
  "base64UrlDecode": "function(str) { const base64 = str.replace(/-/g, '+').replace(/_/g, '/'); const binary = atob(base64); const bytes = new Uint8Array(binary.length); for (let i = 0; i < binary.length; i++) { bytes[i] = binary.charCodeAt(i); } return bytes; }",
  "getUserWithCapabilities": "async function(userId, env) { if (!env.DB) { console.warn('No DB in env, returning mock user'); return { id: userId, capabilities: ['role_user'], profile: { id: userId } }; } const userProfile = await env.DB.prepare(`SELECT id, owner, _allowed, _allowed_read, data FROM item WHERE doctype = 'User' AND json_extract(data, '$.user_id') = ?`).bind(userId).first(); if (!userProfile) return null; const capabilities = JSON.parse(userProfile._allowed_read || '[]'); return { id: userId, capabilities: capabilities, profile: userProfile }; }",
  "checkRateLimit": "function(key, rateLimits, max, windowMs) { const now = Date.now(); let times = rateLimits.get(key); if (!times) { times = []; rateLimits.set(key, times); } while (times.length > 0 && times[0] <= now - windowMs) { times.shift(); } if (times.length >= max) return false; times.push(now); return true; }"
}