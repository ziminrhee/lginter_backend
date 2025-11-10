function isHexColor(s) {
  return typeof s === 'string' && /^#?[0-9a-f]{6}$/i.test(s);
}

function sanitizeHex(s) {
  if (!isHexColor(s)) return '#FFFFFF';
  return s.startsWith('#') ? s.toUpperCase() : `#${s.toUpperCase()}`;
}

// Avoid very saturated pure blue for safety (map to softer blue)
export function normalizeLightColor(value) {
  const hex = sanitizeHex(value);
  const pureBlue = /^#0000FF$/i.test(hex);
  return pureBlue ? '#5EA9FF' : hex;
}


