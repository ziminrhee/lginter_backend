import { container as containerStyle, topLabel, circleWrap, ringBase, text as textStyle, textFade } from '../modules/voice/listening.styles';

export default function ListeningOverlay({ topLabel: topLabelText = '듣고 있어요', centerText, stage = 'live' }) {
  const fading = stage === 'fadeOut';
  const fadeMs = 600;


  return (
    <div style={containerStyle()}>
      <div style={topLabel}>{topLabelText}</div>

      <div style={circleWrap()}>
        {/* outward ripples */}
        <div style={{ ...ringBase, animation: 'outwardRipple 1600ms ease-out infinite' }} />
        <div style={{ ...ringBase, animation: 'outwardRipple 1600ms ease-out infinite 800ms' }} />
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
            <div style={{ ...textStyle, ...textFade(fading, fadeMs) }}>{centerText}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}


