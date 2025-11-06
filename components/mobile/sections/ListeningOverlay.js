import { fonts, colors } from '../styles/tokens';

export default function ListeningOverlay({ topLabel = '듣고 있어요', centerText, stage = 'live' }) {
  const container = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1100,
    pointerEvents: 'none'
  };

  const labelStyle = {
    position: 'fixed',
    top: 'clamp(calc(env(safe-area-inset-top, 0px) + 56px), 12vh, 96px)',
    left: '50%',
    transform: 'translateX(-50%)',
    color: colors.textSecondary,
    fontFamily: fonts.ui,
    fontSize: '1rem',
    fontWeight: 600,
    opacity: 0.8
  };

  const wrap = {
    position: 'fixed',
    left: '50%',
    top: '60vh',
    transform: 'translate(-50%, -50%)',
    width: 'clamp(380px, 76vw, 560px)',
    height: 'clamp(380px, 76vw, 560px)',
    borderRadius: '50%',
    filter: 'none'
  };

  const ringBase = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'calc(100% + 32px)',
    height: 'calc(100% + 32px)',
    borderRadius: '50%',
    background:
      'radial-gradient(closest-side, rgba(255,255,255,0) 82%, rgba(255,255,255,0.95) 88%, rgba(255,255,255,0.55) 92%, rgba(255,255,255,0) 100%)',
    filter: 'blur(6px)',
    mixBlendMode: 'screen',
    opacity: 0
  };

  const textStyle = {
    color: 'white',
    fontFamily: fonts.ui,
    fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
    fontWeight: 500,
    textShadow: '0 4px 18px rgba(0,0,0,0.10)',
    letterSpacing: '-0.02em',
    textAlign: 'center',
    padding: '0 1rem',
    lineHeight: 1.2,
    maxWidth: '92%'
  };

  const fading = stage === 'fadeOut';
  const fadeMs = 600;
  const textFadeStyle = {
    opacity: fading ? 0 : 1,
    filter: fading ? 'blur(6px)' : 'none',
    transition: `opacity ${fadeMs}ms ease, filter ${fadeMs}ms ease`
  };


  return (
    <div style={container}>
      <div style={labelStyle}>{topLabel}</div>

      <div style={wrap}>
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
            <div style={{ ...textStyle, ...textFadeStyle }}>{centerText}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}


