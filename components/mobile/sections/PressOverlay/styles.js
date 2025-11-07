// Styles for the mobile press overlay.
// Extracted from components/mobile/modules/press/pressOverlay.styles.js

import { pressOverlayContainer, circleHitArea } from '../../styles/shared/layout';

export const container = (zIndex) => pressOverlayContainer(undefined, zIndex);

export const hitArea = circleHitArea();

export const dot = {
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  background: 'white',
  boxShadow: '0 0 16px rgba(255,255,255,0.95), 0 0 36px rgba(255,255,255,0.7)'
};

export const ringPulse = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '140px',
  height: '140px',
  borderRadius: '50%',
  background:
    'radial-gradient(closest-side, rgba(255,255,255,0) 58%, rgba(255,255,255,0.9) 68%, rgba(255,255,255,0.55) 74%, rgba(255,255,255,0) 86%)',
  filter: 'blur(8px)',
  mixBlendMode: 'screen',
  opacity: 0
};



