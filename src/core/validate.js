/** Lightweight runtime checks (no deps). Return { ok, data, errors } */

/** @typedef {{ uuid:string, ts:number }} BaseMeta */

function ensureBase(raw) {
  const base = {
    uuid: typeof raw?.uuid === 'string' && raw.uuid ? raw.uuid : `uuid-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    ts: typeof raw?.ts === 'number' ? raw.ts : Date.now(),
  };
  return base;
}

export function validateMobileNewUser(raw) {
  const base = ensureBase(raw);
  const errors = [];
  if (!raw || typeof raw.userId !== 'string' || !raw.userId) errors.push('userId');
  const data = { ...base, ...raw };
  return { ok: errors.length === 0, data, errors };
}

export function validateMobileNewName(raw) {
  const base = ensureBase(raw);
  const errors = [];
  if (!raw || typeof raw.userId !== 'string' || !raw.userId) errors.push('userId');
  if (!raw || typeof raw.name !== 'string' || !raw.name) errors.push('name');
  const data = { ...base, ...raw };
  return { ok: errors.length === 0, data, errors };
}

export function validateMobileNewVoice(raw) {
  const base = ensureBase(raw);
  const errors = [];
  if (!raw || typeof raw.userId !== 'string' || !raw.userId) errors.push('userId');
  const data = { ...base, ...raw };
  return { ok: errors.length === 0, data, errors };
}

export function validateControllerDecision(raw) {
  const base = ensureBase(raw);
  const errors = [];
  if (!raw || typeof raw.userId !== 'string' || !raw.userId) errors.push('userId');
  const p = raw?.params || {};
  if (typeof p.temp !== 'number') errors.push('params.temp');
  if (typeof p.humidity !== 'number') errors.push('params.humidity');
  if (typeof p.lightColor !== 'string') errors.push('params.lightColor');
  if (typeof p.music !== 'string') errors.push('params.music');
  if (typeof raw?.reason !== 'string') errors.push('reason');
  const data = { ...base, ...raw };
  return { ok: errors.length === 0, data, errors };
}


