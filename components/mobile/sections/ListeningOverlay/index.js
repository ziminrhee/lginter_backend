import * as S from './styles';

export default function ListeningOverlay({ topLabel: topLabelText = '듣고 있어요', centerText, stage = 'live' }) {
  const fading = stage === 'fadeOut';
  const fadeMs = 600;


  return (
    <div style={S.container()}>
      <div style={S.topLabel}>{topLabelText}</div>

      <div style={S.circleWrap()}>
        {/* outward ripples */}
        <div style={{ ...S.ringBase, animation: 'outwardRipple 1600ms ease-out infinite' }} />
        <div style={{ ...S.ringBase, animation: 'outwardRipple 1600ms ease-out infinite 800ms' }} />
        {centerText ? (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            <div style={{ ...S.text, ...S.textFade(fading, fadeMs) }}>{centerText}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}



