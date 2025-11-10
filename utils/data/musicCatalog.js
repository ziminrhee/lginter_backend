// 16 fixed music tracks catalog used by controller decisions
// Keep ids stable; UI or devices can map ids to actual playback sources
export const MUSIC_CATALOG = [
  { id: 'uplift-01', title: 'Life is Soft', artist: 'Bunho', mood: ['긍정','활력'], tags: ['uplifting','bright'] },
  { id: 'uplift-02', title: 'Morning Rays', artist: 'Studio A', mood: ['밝음','희망'], tags: ['daylight','acoustic'] },
  { id: 'calm-01',   title: 'Cozy Humidification', artist: 'Atmo', mood: ['차분','안정'], tags: ['ambient','warm'] },
  { id: 'calm-02',   title: 'Soft Linen', artist: 'Clouds', mood: ['휴식','나른'], tags: ['lofi','soft'] },
  { id: 'focus-01',  title: 'Deep Focus', artist: 'Flow', mood: ['집중','냉정'], tags: ['minimal','steady'] },
  { id: 'focus-02',  title: 'Pulse Lines', artist: 'Sequence', mood: ['집중','기계적'], tags: ['tech','pattern'] },
  { id: 'neutral-01',title: 'Neutral Air', artist: 'Mono', mood: ['중립'], tags: ['neutral','light'] },
  { id: 'neutral-02',title: 'Center', artist: 'Axis', mood: ['중립'], tags: ['simple','calm'] },
  { id: 'happy-01',  title: 'Pocket Sunshine', artist: 'Jelly', mood: ['행복','밝음'], tags: ['cute','pop'] },
  { id: 'happy-02',  title: 'Glitter Road', artist: 'LightLab', mood: ['설렘','기대'], tags: ['sparkle','pop'] },
  { id: 'sad-01',    title: 'Grey Window', artist: 'RainLab', mood: ['우울','서정'], tags: ['piano','slow'] },
  { id: 'sad-02',    title: 'Distant Street', artist: 'Night', mood: ['쓸쓸'], tags: ['jazz','nocturne'] },
  { id: 'angry-01',  title: 'Cooling Down', artist: 'Breathe', mood: ['분노','진정'], tags: ['breath','slow'] },
  { id: 'angry-02',  title: 'Ground', artist: 'Root', mood: ['분노','안정'], tags: ['drone','earth'] },
  { id: 'tired-01',  title: 'Warm Blanket', artist: 'Home', mood: ['피곤','휴식'], tags: ['warm','rest'] },
  { id: 'tired-02',  title: 'Late Tea', artist: 'Leaf', mood: ['피곤','회복'], tags: ['lofi','warm'] },
];


