import { fonts } from '../styles/tokens';

export default function OrchestratingScreen() {
  const container = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1100,
    pointerEvents: 'none'
  };

  const circleWrap = {
    position: 'fixed',
    left: '50%',
    top: '60vh',
    transform: 'translate(-50%, -50%)',
    width: 'clamp(380px, 76vw, 560px)',
    height: 'clamp(380px, 76vw, 560px)',
    borderRadius: '50%'
  };

  const textStyle = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#222',
    fontFamily: fonts.ui,
    fontWeight: 700,
    letterSpacing: '0.08em',
    fontSize: 'clamp(1.6rem, 6.2vw, 2.2rem)',
    textTransform: 'uppercase',
    opacity: 0,
    animation: 'orchestrateLabel 1800ms ease forwards'
  };

  return (
    <div style={container}>
      <div style={circleWrap}>
        <div style={textStyle}>ORCHESTRATING</div>
      </div>
    </div>
  );
}


