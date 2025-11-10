export function normalizeTemperature(value, context = {}) {
  const season = String(context.season || 'winter').toLowerCase();
  const n = Number(value);
  const fallback = season === 'winter' ? 22 : 24;
  if (!Number.isFinite(n)) return fallback;
  // 겨울 컨텍스트: -20~30(요구사항) 범위로만 클램프, 실내 추천은 18~26 내에서 수렴
  const clamped = Math.min(30, Math.max(-20, Math.round(n)));
  return clamped;
}

export function normalizeWindLevel(value, emotion = '') {
  const n = Number(value);
  if (Number.isFinite(n)) return Math.min(5, Math.max(1, Math.round(n)));
  const e = String(emotion || '').toLowerCase();
  const calmHints = ['편안','차분','휴식','평온','느긋','진정'];
  const activeHints = ['활력','기대','설렘','드라마틱','성공'];
  if (calmHints.some(k => e.includes(k))) return 2;
  if (activeHints.some(k => e.includes(k))) return 4;
  return 3;
}


