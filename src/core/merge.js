// Fair-average merge policy (JS-only)
import { hexToRgb, rgbToHsv, hsvToRgb, rgbToHex } from './color';

export function weightedMean(values) {
  // values: Array<{ value:number, weight:number }>
  let wsum = 0, vsum = 0;
  for (const { value, weight } of values || []) {
    const w = Number(weight || 1);
    wsum += w; vsum += Number(value || 0) * w;
  }
  return wsum > 0 ? vsum / wsum : 0;
}

export function hsvCentroid(hexColors = []) {
  if (!hexColors.length) return '#FFFFFF';
  let x = 0, y = 0, vAcc = 0, sAcc = 0;
  for (const hex of hexColors) {
    const { r, g, b } = hexToRgb(hex);
    const { h, s, v } = rgbToHsv(r, g, b);
    const angle = h * 2 * Math.PI;
    x += Math.cos(angle) * s * v;
    y += Math.sin(angle) * s * v;
    vAcc += v; sAcc += s;
  }
  const avgAngle = Math.atan2(y, x);
  const h = (avgAngle / (2 * Math.PI) + 1) % 1;
  const s = sAcc / hexColors.length;
  const v = vAcc / hexColors.length;
  const { r, g, b } = hsvToRgb(h, Math.min(1, Math.max(0, s)), Math.min(1, Math.max(0, v)));
  return rgbToHex(r, g, b);
}

export function majorityVote(items = [], priority = []) {
  const counts = new Map();
  for (const it of items) counts.set(it, (counts.get(it) || 0) + 1);
  let best = null, bestCount = -1;
  for (const [k, c] of counts) {
    if (c > bestCount) { best = k; bestCount = c; }
    else if (c === bestCount) {
      // tie-break by priority order
      const a = priority.indexOf(k);
      const b = priority.indexOf(best);
      if ((a !== -1 && b === -1) || (a !== -1 && b !== -1 && a < b)) best = k;
    }
  }
  return best ?? (items[0] || 'neutral');
}

// Merge API
export function mergeFair(inputs) {
  // inputs: Array<{ userId, params:{ temp, humidity, lightColor, music }, lastSeenTs? }>
  const now = Date.now();
  const toWeight = (ts) => 1 + Math.max(0, 1 - (now - (ts || now)) / (3 * 60 * 1000)); // favor recent within 3m

  const temp = weightedMean(inputs.map(i => ({ value: i.params?.temp, weight: toWeight(i.lastSeenTs) })));
  const humidity = weightedMean(inputs.map(i => ({ value: i.params?.humidity, weight: toWeight(i.lastSeenTs) })));
  const lightColor = hsvCentroid(inputs.map(i => i.params?.lightColor).filter(Boolean));
  const music = majorityVote(inputs.map(i => i.params?.music).filter(Boolean), ['ambient', 'lofi', 'jazz', 'pop', 'classical', 'rock']);

  return { temp, humidity, lightColor, music };
}


