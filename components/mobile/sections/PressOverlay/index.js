import * as S from './styles';

export default function PressOverlay({
  pressProgress = 0,
  onPressStart,
  onPressEnd
}) {
  const isPressing = pressProgress > 0;


  return (
    <div
      style={S.container()}
      onTouchStart={onPressStart}
      onTouchEnd={onPressEnd}
      onMouseDown={onPressStart}
      onMouseUp={onPressEnd}
      onMouseLeave={onPressEnd}
      aria-label="hold for 3 seconds to speak"
    >
      <div style={S.hitArea}>
        {/* Soft blurred ripple pulses */}
        <div
          style={{
            ...S.ringPulse,
            animation: isPressing ? 'softRipple 1600ms ease-out infinite' : 'none'
          }}
        />
        <div
          style={{
            ...S.ringPulse,
            animation: isPressing ? 'softRipple 1600ms ease-out infinite 800ms' : 'none'
          }}
        />
        {/* Core white dot */}
        <div style={{ ...S.dot, animation: isPressing ? 'glowPulse 1.2s ease-in-out infinite' : 'none' }} />
      </div>
    </div>
  );
}



