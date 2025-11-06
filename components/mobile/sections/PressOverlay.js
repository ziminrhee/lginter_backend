import { container as pressContainer, hitArea, dot as dotBase, ringPulse as ringPulseBase } from '../modules/press/pressOverlay.styles';

export default function PressOverlay({
  pressProgress = 0,
  onPressStart,
  onPressEnd
}) {
  const isPressing = pressProgress > 0;


  return (
    <div
      style={pressContainer()}
      onTouchStart={onPressStart}
      onTouchEnd={onPressEnd}
      onMouseDown={onPressStart}
      onMouseUp={onPressEnd}
      onMouseLeave={onPressEnd}
      aria-label="hold for 3 seconds to speak"
    >
      <div style={hitArea}>
        {/* Soft blurred ripple pulses */}
        <div
          style={{
            ...ringPulseBase,
            animation: isPressing ? 'softRipple 1600ms ease-out infinite' : 'none'
          }}
        />
        <div
          style={{
            ...ringPulseBase,
            animation: isPressing ? 'softRipple 1600ms ease-out infinite 800ms' : 'none'
          }}
        />
        {/* Core white dot */}
        <div style={{ ...dotBase, animation: isPressing ? 'glowPulse 1.2s ease-in-out infinite' : 'none' }} />
      </div>
    </div>
  );
}


