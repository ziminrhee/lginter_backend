export function normalizeHumidity(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 50;
  const clamped = Math.min(70, Math.max(30, n));
  // round to nearest 5
  return Math.round(clamped / 5) * 5;
}


