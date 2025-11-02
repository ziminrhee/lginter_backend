import { spacing, typography, colors, layers, fonts } from '../styles/tokens';

export default function PressOverlay({
  pressProgress = 0,
  onPressStart,
  onPressEnd
}) {
  return (
    <div 
      style={{ 
        position: 'fixed',
        bottom: spacing.press.bottom,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: layers.pressZIndex,
        textAlign: 'center'
      }}
      onTouchStart={onPressStart}
      onTouchEnd={onPressEnd}
      onMouseDown={onPressStart}
      onMouseUp={onPressEnd}
      onMouseLeave={onPressEnd}
    >
      <div style={{
        fontSize: typography.pressLabelSize,
        fontWeight: 500,
        color: colors.pressLabel,
        fontFamily: fonts.ui,
        animation: 'blink 1.5s ease-in-out infinite',
        cursor: 'pointer',
        userSelect: 'none',
        opacity: pressProgress > 0 ? 0.5 + pressProgress * 0.5 : 1
      }}>
        Press
      </div>
      {pressProgress > 0 && (
        <div style={{
          marginTop: '1rem',
          fontSize: typography.progressSize,
          color: colors.accentPrimary,
          fontWeight: 600
        }}>
          {Math.round(pressProgress * 100)}%
        </div>
      )}
    </div>
  );
}


