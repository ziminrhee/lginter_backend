import { MUSIC_CATALOG } from '../data/musicCatalog';
import { MUSIC_CATEGORY_MAP, categoryCandidates } from '@/ai/policies/music.map';

function seededShuffle(arr, seed = 1) {
  const a = [...arr];
  let x = Math.abs(seed) + 1;
  for (let i = a.length - 1; i > 0; i--) {
    x = (x * 1664525 + 1013904223) % 4294967296;
    const j = x % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function avoidPrevious(list, prev) {
  const uniq = list.filter((id, idx) => list.indexOf(id) === idx);
  if (!prev) return uniq;
  const i = uniq.indexOf(prev);
  if (i > -1 && uniq.length > 1) {
    const [hit] = uniq.splice(i, 1);
    uniq.push(hit);
  }
  return uniq;
}

export function pickMusicByEmotion(emotionText, previousMusicId = '', seed = Date.now()) {
  const e = String(emotionText || '').toLowerCase();
  const byCategory = categoryCandidates(e);
  const byTags = MUSIC_CATALOG.filter(
    (t) =>
      (t.mood || []).some((m) => e.includes(String(m).toLowerCase())) ||
      (t.tags || []).some((tag) => e.includes(String(tag).toLowerCase()))
  ).map((t) => t.id);
  const candidates = seededShuffle([...byCategory, ...byTags], Math.floor(seed / 60000)); // rotate each minute
  const ordered = avoidPrevious(candidates, previousMusicId);
  return ordered[0] || MUSIC_CATALOG[0]?.id;
}

export function normalizeMusic(input, emotionText, context = {}) {
  const ids = new Set(MUSIC_CATALOG.map((t) => t.id));
  if (ids.has(input)) return input;
  const prev = context?.previousMusicId || '';
  return pickMusicByEmotion(emotionText, prev);
}


