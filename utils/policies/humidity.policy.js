export function normalizeHumidity(value, emotion = '') {
  const n = Number(value);
  let target = Number.isFinite(n) ? n : 50;
  const e = String(emotion || '').toLowerCase();
  // '찝찝/축축/눅눅' → 더 낮추기, '건조/목/따갑/가려움' → 높이기
  const clammyHints = ['찝찝','축축','눅눅','습함'];
  const dryHints = ['건조','목','따갑','가려움','피부','건조함'];
  if (clammyHints.some(k => e.includes(k))) target -= 10;
  if (dryHints.some(k => e.includes(k))) target += 10;
  const clamped = Math.min(70, Math.max(30, target));
  return Math.round(clamped / 5) * 5;
}

export function decidePurifierSettings(humidity, emotion = '') {
  const h = Number(humidity) || 50;
  const e = String(emotion || '').toLowerCase();
  // 기본 규칙
  if (h < 40) return { purifierOn: true, purifierMode: 'humidify' };
  if (h > 60) return { purifierOn: true, purifierMode: 'purify' };
  // 40~60: 감정이 부정적이면 +공기청정
  const negativeHints = ['우울','짜증','불안','피곤','공허','번아웃','당혹','갈증','슬픔','무력'];
  const neg = negativeHints.some(k => e.includes(k));
  return { purifierOn: true, purifierMode: neg ? 'humidify_plus_purify' : 'humidify' };
}


