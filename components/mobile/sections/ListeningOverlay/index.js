import * as S from './styles';

export default function ListeningOverlay({ topLabel: topLabelText = '듣고 있어요', centerText, stage = 'live' }) {
  const fading = stage === 'fadeOut';
  const fadeMs = 600;


  return (
    <S.Container>
      <S.TopLabel>{topLabelText}</S.TopLabel>
      <S.CircleWrap>
        <S.Ring />
        <S.RingDelay />
        {centerText ? (
          <S.CenterWrap>
            <S.CenterText $fading={fading} $fadeMs={fadeMs}>{centerText}</S.CenterText>
          </S.CenterWrap>
        ) : null}
      </S.CircleWrap>
    </S.Container>
  );
}



