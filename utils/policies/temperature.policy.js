export function normalizeTemperature(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 24;
  const clamped = Math.min(30, Math.max(16, Math.round(n)));
  return clamped;
}


