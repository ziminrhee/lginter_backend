// Declarative mapping from categories/tones to catalog ids
export const MUSIC_CATEGORY_MAP = {
  '잔잔/위로': ['clean-soul', 'life-is-scott', 'borealis', 'echoes'],
  '사색/평정/시네마틱': ['echoes', 'borealis', 'solstice', 'travelling-symphony'],
  '산책/낮은에너지/어쿠스틱': ['happy-stroll', 'sunny-side-up', 'ukulele-dance'],
  '휴식/여유/편안': ['clean-soul', 'life-is-scott', 'glow-scott'],
  '희망/새로운시작/긍정': ['a-kind-of-hope', 'glow-scott', 'life-is-scott'],
  '몰입/웅장': ['shoulders-of-giants', 'travelling-symphony'],
  '정화/정리': ['solace', 'solstice', 'echoes'],
};

// naive tokenization to match categories from emotionKeyword/text
export function categoryCandidates(emotion = '') {
  const e = String(emotion || '').replace(/\s+/g, '').toLowerCase();
  const picks = [];
  const rules = [
    ['잔잔/위로', ['잔잔', '위로', '차분', '평온', '진정']],
    ['사색/평정/시네마틱', ['사색', '평정', '고요', '시네마틱']],
    ['산책/낮은에너지/어쿠스틱', ['산책', '낮은에너지', '어쿠스틱']],
    ['휴식/여유/편안', ['휴식', '여유', '편안']],
    ['희망/새로운시작/긍정', ['희망', '새로운시작', '긍정']],
    ['몰입/웅장', ['몰입', '웅장']],
    ['정화/정리', ['정화', '정리']],
  ];
  rules.forEach(([key, tokens]) => {
    if (tokens.some((t) => e.includes(t))) picks.push(...(MUSIC_CATEGORY_MAP[key] || []));
  });
  return picks;
}


