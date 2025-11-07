// Styles for HeroText (mobile intro copy)
// Extracted from components/mobile/sections/HeroText.js

import { fonts, spacing, typography, colors } from '../../styles/tokens';

export const root = {
  marginBottom: spacing.hero.blockMarginBottom
};

export const title = (isModal) => ({
  fontSize: typography.heroTitleSize,
  color: colors.textPrimary,
  marginBottom: '0.25rem',
  fontWeight: typography.heroTitleWeight,
  textAlign: isModal ? 'center' : 'left',
  lineHeight: typography.heroTitleLineHeight,
  fontFamily: fonts.ui
});

export const sub = (isModal) => ({
  fontSize: 'clamp(1.1rem, 3.7vw, 1.25rem)',
  color: colors.textSecondary,
  marginTop: spacing.hero.subtextMarginTop,
  fontWeight: 500,
  textAlign: isModal ? 'center' : 'left',
  fontFamily: fonts.ui
});


