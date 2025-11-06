import { spacing, layers } from '../styles/tokens';

export default function PressOverlay({
  pressProgress = 0,
  onPressStart,
  onPressEnd
}) {
  const isPressing = pressProgress > 0;

  const containerStyle = {
        position: 'fixed',
        bottom: spacing.press.bottom,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: layers.pressZIndex,
    width: '220px',
    height: '220px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'auto'
  };

  const hitAreaStyle = {
    position: 'relative',
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent'
  };

  const dotStyle = {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: 'white',
    boxShadow: '0 0 16px rgba(255,255,255,0.95), 0 0 36px rgba(255,255,255,0.7)',
    animation: isPressing ? 'glowPulse 1.2s ease-in-out infinite' : 'none'
  };

  const ringPulse = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    /* ring-like band with soft edges */
    background: 'radial-gradient(closest-side, rgba(255,255,255,0) 58%, rgba(255,255,255,0.9) 68%, rgba(255,255,255,0.55) 74%, rgba(255,255,255,0) 86%)',
    filter: 'blur(8px)',
    mixBlendMode: 'screen',
    opacity: 0
  };

  return (
    <div
      style={containerStyle}
      onTouchStart={onPressStart}
      onTouchEnd={onPressEnd}
      onMouseDown={onPressStart}
      onMouseUp={onPressEnd}
      onMouseLeave={onPressEnd}
      aria-label="hold for 3 seconds to speak"
    >
      <div style={hitAreaStyle}>
        {/* Soft blurred ripple pulses */}
        <div
          style={{
            ...ringPulse,
            animation: isPressing ? 'softRipple 1600ms ease-out infinite' : 'none'
          }}
        />
        <div
          style={{
            ...ringPulse,
            animation: isPressing ? 'softRipple 1600ms ease-out infinite 800ms' : 'none'
          }}
        />
        {/* Core white dot */}
        <div style={dotStyle} />
      </div>
    </div>
  );
}


