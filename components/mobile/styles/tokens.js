// Mobile design tokens (exact values from current inline styles)
// Note: Do NOT change values here unless the design intentionally changes.

export const fonts = {
  system: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  ui: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif'
};

export const spacing = {
  container: {
    paddingTop: 'calc(env(safe-area-inset-top, 0px) + clamp(96px, 14vh, 180px))',
    paddingRight: 'clamp(28px,7vw,72px)',
    paddingBottom: 'clamp(40px,8vh,96px)',
    paddingLeft: 'clamp(28px,7vw,72px)'
  },
  hero: {
    blockMarginBottom: '1.5rem',
    subtextMarginTop: '0.6rem'
  },
  press: {
    bottom: 'clamp(88px, 18vh, 144px)'
  }
};

export const typography = {
  heroTitleSize: '2.5rem',
  heroTitleWeight: 550,
  heroTitleLineHeight: 1.22,
  heroSubtextSize: '1.3rem',
  pressLabelSize: 'clamp(2.6rem, 8.5vw, 3.4rem)',
  progressSize: 'clamp(1.6rem, 6.5vw, 2.8rem)'
};

export const colors = {
  textPrimary: '#000000',
  textSecondary: '#818181',
  pressLabel: '#565656',
  accentPrimary: '#9333EA',
  listening: '#EC4899'
};

export const layers = {
  pressZIndex: 1000
};


