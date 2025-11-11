function isHexColor(s) {
  return typeof s === 'string' && /^#?[0-9a-f]{6}$/i.test(s);
}

function sanitizeHex(s) {
  if (!isHexColor(s)) return '#FFFFFF';
  return s.startsWith('#') ? s.toUpperCase() : `#${s.toUpperCase()}`;
}

// Avoid very saturated pure blue for safety (map to softer blue)
export function normalizeLightColor(value, options = {}) {
  const hex = sanitizeHex(value);
  const pureBlue = /^#0000FF$/i.test(hex);
  const base = pureBlue ? '#5EA9FF' : hex;
  const soft = options.soft === true;
  // 소프트 톤 요구 시 따뜻/부드러운 톤 제안
  if (soft) return '#F5E6CC'; // warm beige
  return base;
}


