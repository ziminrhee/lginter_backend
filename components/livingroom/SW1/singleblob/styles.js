import styled, { createGlobalStyle, keyframes } from 'styled-components';

export const MotionProps = createGlobalStyle`
  @property --p1x { syntax: '<percentage>'; inherits: false; initial-value: 50%; }
  @property --p1y { syntax: '<percentage>'; inherits: false; initial-value: 50%; }
  @property --holeInner { syntax: '<length>'; inherits: false; initial-value: 14vmin; }
  @property --outerFeather { syntax: '<length>'; inherits: false; initial-value: 8vmin; }
  @property --blobScale { syntax: '<number>'; inherits: false; initial-value: 1; }
`;

const drift = keyframes`
  0%   { --p1x: 50%; --p1y: 50%; }
  100% { --p1x: 50%; --p1y: 50%; }
`;

const pulse = keyframes`
  /* Center ~16vmin, amplitude +30% from current (0.6 -> 0.78) */
  0%   { --holeInner: 15.22vmin; }
  50%  { --holeInner: 16.78vmin; }
  100% { --holeInner: 15.22vmin; }
`;

const rimPulse = keyframes`
  /* Center ~9vmin, amplitude +50% from current (1.8 -> 2.7) */
  0%   { --outerFeather: 6.3vmin; }
  50%  { --outerFeather: 11.7vmin; }
  100% { --outerFeather: 6.3vmin; }
`;

const rimScale = keyframes`
  /* Size swell amplitude +50% (1.06 -> 1.09) */
  0%   { --blobScale: 1; }
  50%  { --blobScale: 1.09; }
  100% { --blobScale: 1; }
`;

export const Root = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #FFFFFF;
  background-image: ${({ $backgroundUrl }) => ($backgroundUrl ? `url(${$backgroundUrl})` : 'none')};
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  font-family: Inter, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  overflow: hidden;
`;

export const TopStatus = styled.div`
  position: absolute;
  top: 5vh;
  left: 50%;
  transform: translateX(-50%);
  color: #334155;
  font-weight: 600;
  letter-spacing: -0.2px;
  text-align: center;
  font-size: clamp(25px, 3.6vmin, 43px);
  text-shadow: 0 2px 12px rgba(0,0,0,0.08);
  pointer-events: none;
  z-index: 10;
`;

export const Stage = styled.div`
  position: absolute;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
`;

export const GradientEllipse = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2552px;
  height: 2553px;
  transform: translate(-50%, -50%) rotate(90deg) scale(var(--blobScale));
  background: radial-gradient(closest-side at 50% 50%, #FFC1BA 2.4%, rgba(187, 180, 156, 0.62) 67.31%, #FBB2D3 86.06%, #FFFFFF 100%);
  /* Lower saturation slightly and set brightness to +8% net with soft bloom */
  filter: blur(60px) saturate(0.8) brightness(1.08);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  /* Create a soft transparent hole in the center and feather the outer edge */
  --holeInner: 14vmin; /* radius where fully transparent begins (tweak as needed) */
  --holeFeather: 6vmin; /* softness of the inner edge */
  --outerFeather: 8vmin; /* softness of the outer edge */
  -webkit-mask-image: radial-gradient(circle closest-side at 50% 50%,
    rgba(255,255,255,0) var(--holeInner),
    rgba(255,255,255,1) calc(var(--holeInner) + var(--holeFeather)),
    rgba(255,255,255,1) calc(100% - var(--outerFeather)),
    rgba(255,255,255,0) 100%
  );
  mask-image: radial-gradient(circle closest-side at 50% 50%,
    rgba(255,255,255,0) var(--holeInner),
    rgba(255,255,255,1) calc(var(--holeInner) + var(--holeFeather)),
    rgba(255,255,255,1) calc(100% - var(--outerFeather)),
    rgba(255,255,255,0) 100%
  );
  /* Center locked; slow down by 300% (durations ×3) and updated amplitudes */
  animation: ${pulse} 4.5s ease-in-out infinite alternate,
             ${rimPulse} 4.5s ease-in-out infinite alternate,
             ${rimScale} 4.5s ease-in-out infinite alternate;
`;

export const EllipseLayer = styled.div`
  display: none;
`;

export const Ellipse = styled.div`
  /* Fallback for narrow screens */
  width: 100vw;
  @media (min-width: 1520px) {
    width: calc(100vw - 1520px); /* leave 760px on left and right */
    max-width: calc(100vw - 1520px);
  }
  height: 100vh; /* allow vertical crop */
  background-image: ${({ $ellipseUrl }) => ($ellipseUrl ? `url(${$ellipseUrl})` : 'none')};
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 50% auto; /* reduce to 50% of previous width */
`;

export const CircleContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100vh * 5 / 7);
  height: calc(100vh * 5 / 7);
  border-radius: 50%;
  z-index: 0;
`;

export const BaseWhite = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #FFFFFF;
`;

export const GradientBlur = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% * 3012 / 3104);
  height: calc(100% * 3012 / 3104);
  border-radius: 50%;
  background: radial-gradient(50.02% 50.02% at 50.02% 50.02%, #FFFFFF 34.13%, #FCCCC1 44.23%, #DDDBDD 79.81%, #FFC9E3 87.98%, #FFFFFF 100%);
  filter: blur(50px);
`;

export const CenterTextWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 5;
`;

export const CenterTemp = styled.div`
  font-size: clamp(25px, 4.5vmin, 65px);
  line-height: 1.08;
  font-weight: 600;
  color: #111827;
  text-shadow: 0 1px 0 rgba(0,0,0,0.64), 0 3px 12px rgba(0,0,0,0.48);
`;

export const CenterMode = styled.div`
  margin-top: 0.6vmin;
  font-size: clamp(25px, 4.5vmin, 65px);
  font-weight: 500;
  color: #0F172A;
  text-shadow: 0 1px 0 rgba(0,0,0,0.48), 0 3px 12px rgba(0,0,0,0.36);
`;



export const Dots = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 0.2em;
`;

export const Dot = styled.span`
  transition: opacity 120ms linear;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
`;