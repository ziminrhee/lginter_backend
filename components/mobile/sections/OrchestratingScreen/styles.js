// Styles for OrchestratingScreen (mobile voice state)
// Extracted from components/mobile/modules/voice/orchestrating.styles.js

import { fonts } from '../../styles/tokens';
import { fullscreenOverlay, centeredCircleWrap } from '../../styles/shared/layout';

export const container = () => fullscreenOverlay();

export const circleWrap = () => centeredCircleWrap();

export const text = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  color: '#222',
  fontFamily: fonts.ui,
  fontWeight: 700,
  letterSpacing: '0.08em',
  fontSize: 'clamp(1.6rem, 6.2vw, 2.2rem)',
  textTransform: 'uppercase',
  opacity: 0,
  animation: 'orchestrateLabel 1800ms ease forwards'
};



