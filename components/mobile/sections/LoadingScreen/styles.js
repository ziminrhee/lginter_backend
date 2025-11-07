// Styles for LoadingScreen (mobile)
// Extracted from components/mobile/modules/loading/loadingScreen.styles.js

import { colors, fonts } from '../../styles/tokens';

export const root = {
  textAlign: 'center',
  padding: '3rem 2rem',
  background: 'linear-gradient(135deg, #F3E8FF 0%, #FCEAFE 100%)',
  borderRadius: '15px'
};

export const spinner = {
  position: 'relative',
  width: '80px',
  height: '80px',
  margin: '0 auto 1.5rem'
};

export const ringOuter = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  border: '4px solid #F3E8FF',
  borderTop: `4px solid ${colors.accentPrimary}`,
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

export const ringInner = {
  position: 'absolute',
  width: '60px',
  height: '60px',
  top: '10px',
  left: '10px',
  border: '3px solid #F3E8FF',
  borderBottom: `3px solid ${colors.listening}`,
  borderRadius: '50%',
  animation: 'spin 1.5s linear infinite reverse'
};

export const label = {
  color: colors.accentPrimary,
  fontFamily: fonts.ui,
  fontSize: '1.2rem',
  fontWeight: 700,
  marginBottom: '0.5rem',
  animation: 'fadeInOut 2s ease-in-out infinite'
};

export const sub = {
  color: colors.accentPrimary,
  fontFamily: fonts.ui,
  fontSize: '0.9rem',
  opacity: 0.7
};



