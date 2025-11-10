import { MUSIC_CATALOG } from '../data/musicCatalog';

export function pickMusicByEmotion(emotionText) {
  const e = String(emotionText || '').toLowerCase();
  if (!e) return MUSIC_CATALOG[0]?.id;
  const candidates = MUSIC_CATALOG.filter(
    t => (t.mood || []).some(m => e.includes(String(m).toLowerCase()))
      || (t.tags || []).some(tag => e.includes(String(tag).toLowerCase()))
  );
  return (candidates[0] || MUSIC_CATALOG[0])?.id;
}

export function normalizeMusic(input, emotionText) {
  // If already a valid id, keep it; otherwise map using emotion
  const ids = new Set(MUSIC_CATALOG.map(t => t.id));
  if (ids.has(input)) return input;
  return pickMusicByEmotion(emotionText);
}


