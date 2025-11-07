// Styles for ListeningOverlay (mobile voice state)
// Extracted from components/mobile/modules/voice/listening.styles.js

import { colors, fonts } from '../../styles/tokens';
import { fullscreenOverlay, centeredCircleWrap, fixedTopLabel } from '../../styles/shared/layout';

export const container = () => fullscreenOverlay();

export const topLabel = {
  ...fixedTopLabel(),
  color: colors.textSecondary,
  fontFamily: fonts.ui,
  fontSize: '1rem',
  fontWeight: 600,
  opacity: 0.8
};

export const circleWrap = () => ({
  ...centeredCircleWrap(),
  filter: 'none'
});

export const ringBase = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'calc(100% + 32px)',
  height: 'calc(100% + 32px)',
  borderRadius: '50%',
  background:
    'radial-gradient(closest-side, rgba(255,255,255,0) 82%, rgba(255,255,255,0.95) 88%, rgba(255,255,255,0.55) 92%, rgba(255,255,255,0) 100%)',
  filter: 'blur(6px)',
  mixBlendMode: 'screen',
  opacity: 0
};

export const text = {
  color: 'white',
  fontFamily: fonts.ui,
  fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
  fontWeight: 500,
  textShadow: '0 4px 18px rgba(0,0,0,0.10)',
  letterSpacing: '-0.02em',
  textAlign: 'center',
  padding: '0 1rem',
  lineHeight: 1.2,
  maxWidth: '92%'
};

export const textFade = (fading, ms = 600) => ({
  opacity: fading ? 0 : 1,
  filter: fading ? 'blur(6px)' : 'none',
  transition: `opacity ${ms}ms ease, filter ${ms}ms ease`
});



