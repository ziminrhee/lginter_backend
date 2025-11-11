import * as S from './styles';

export default function PressOverlay({
  pressProgress = 0,
  onPressStart,
  onPressEnd
}) {
  const isPressing = pressProgress > 0;


  return (
    <S.Container
      onTouchStart={onPressStart}
      onTouchEnd={onPressEnd}
      onMouseDown={onPressStart}
      onMouseUp={onPressEnd}
      onMouseLeave={onPressEnd}
      aria-label="hold for 3 seconds to speak"
    >
      <S.HitArea>
        <S.RingPulse $anim={isPressing ? 'softRipple 1600ms ease-out infinite' : 'none'} />
        <S.RingPulse $anim={isPressing ? 'softRipple 1600ms ease-out infinite 800ms' : 'none'} />
        <S.Dot $anim={isPressing ? 'glowPulse 1.2s ease-in-out infinite' : 'none'} />
      </S.HitArea>
    </S.Container>
  );
}



