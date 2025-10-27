/**
 * Generate a compact unique id without external deps
 * @returns {string}
 */
export function makeId() {
  const rnd = Math.random().toString(36).slice(2, 8);
  return `id-${Date.now()}-${rnd}`;
}


