import { fonts, spacing, typography, colors } from '../styles/tokens';

export default function HeroText({ isModal = false }) {
  return (
    <div style={{ marginBottom: spacing.hero.blockMarginBottom }}>
      <h1 style={{
        fontSize: typography.heroTitleSize,
        color: colors.textPrimary,
        marginBottom: '0.25rem',
        fontWeight: typography.heroTitleWeight,
        textAlign: isModal ? 'center' : 'left',
        lineHeight: typography.heroTitleLineHeight,
        fontFamily: fonts.ui
      }}>
        만나서<br/>반가워요!
      </h1>
      <p style={{
        fontSize: typography.heroSubtextSize,
        color: colors.textSecondary,
        marginTop: spacing.hero.subtextMarginTop,
        fontWeight: 500,
        textAlign: isModal ? 'center' : 'left',
        fontFamily: fonts.ui
      }}>
        저는 퓨론이라고 합니다.
      </p>
    </div>
  );
}


