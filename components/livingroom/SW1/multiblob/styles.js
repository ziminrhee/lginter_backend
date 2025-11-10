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
  /* radius from center to place small blob centers (kept inside viewport) */
  --R: 34vmin;
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
  font-size: clamp(28px, 3.96vmin, 47px);
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

/* Small peripheral blobs (no motion) */
export const SmallBlobsLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2; /* above bg ellipse, below center text (z=5) */
`;

/* subtle float keyframes per blob (no rotation so labels stay upright) */
const floatA = keyframes`
  0%   { transform: translate(-50%, -50%) translate(0%, 0%); }
  50%  { transform: translate(-50%, -50%) translate(8%, -6%); }
  100% { transform: translate(-50%, -50%) translate(0%, 0%); }
`;
const floatB = keyframes`
  0%   { transform: translate(-50%, -50%) translate(0%, 0%); }
  50%  { transform: translate(-50%, -50%) translate(-8%, 6%); }
  100% { transform: translate(-50%, -50%) translate(0%, 0%); }
`;
const floatC = keyframes`
  0%   { transform: translate(-50%, -50%) translate(0%, 0%); }
  50%  { transform: translate(-50%, -50%) translate(6%, 8%); }
  100% { transform: translate(-50%, -50%) translate(0%, 0%); }
`;
const floatD = keyframes`
  0%   { transform: translate(-50%, -50%) translate(0%, 0%); }
  50%  { transform: translate(-50%, -50%) translate(-6%, -8%); }
  100% { transform: translate(-50%, -50%) translate(0%, 0%); }
`;

const SmallBlobBase = styled.div`
  position: absolute;
  top: var(--top);
  left: var(--left);
  /* translate only; rotation applied to background pseudo so text stays upright */
  transform: translate(-50%, -50%);
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  position: absolute;
  /* background drawn on ::before so text is not blurred */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--bg);
    filter: blur(43.4px);
    transform: rotate(var(--rot, 0deg));
    opacity: 0.9;
    box-shadow: inset 0 0 0 2px rgba(255,255,255,0.35);
  }
`;

/* a: top-left */
export const SmallBlobA = styled(SmallBlobBase)`
  --rot: -56.03deg;
  --top: 24%;
  --left: 22%;
  /* +35% larger from previous */
  --size: clamp(445px, 44.55vmin, 1053px);
  --bg: linear-gradient(180deg, rgba(255, 173, 213, 0.48) 0%, rgba(249, 207, 180, 0.48) 60.58%);
  animation: ${floatA} 18s ease-in-out infinite;
`;

/* b: top-right */
export const SmallBlobB = styled(SmallBlobBase)`
  --rot: 75deg;
  --top: 24%;
  --left: 78%;
  --size: clamp(445px, 48.6vmin, 1134px);
  --bg: linear-gradient(180deg, rgba(255, 138, 182, 0.48) 0%, rgba(221, 233, 227, 0.48) 67.89%);
  animation: ${floatB} 20s ease-in-out infinite;
`;

/* c: bottom-left */
export const SmallBlobC = styled(SmallBlobBase)`
  --rot: 30deg;
  --top: 72%;
  --left: 30%;
  --size: clamp(445px, 46.575vmin, 1093.5px);
  --bg: linear-gradient(180deg, rgba(249, 206, 180, 0.72) 6.25%, rgba(221, 233, 227, 0.72) 38.5%);
  animation: ${floatC} 20s ease-in-out infinite;
`;

/* d: bottom-right */
export const SmallBlobD = styled(SmallBlobBase)`
  --rot: 45deg;
  --top: 72%;
  --left: 74%;
  --size: clamp(445px, 52.65vmin, 1215px);
  --bg: linear-gradient(180deg, rgba(255, 173, 213, 0.61) 0%, rgba(249, 207, 180, 0.61) 60.58%);
  animation: ${floatD} 22s ease-in-out infinite;
`;

/* labels centered inside small blobs */
export const SmallBlobLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-family: Pretendard, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #494343;
  opacity: 0.7;
  line-height: 1.2;
  /* 30% smaller than center temp clamp(25px,4.5vmin,65px) ≈ 70% factor */
  font-size: clamp(17px, 3.15vmin, 45px);
  z-index: 1; /* above blurred background (::before) */
`;

/* 4-way sectioning relative to centered text */
export const SectionGrid = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  z-index: 2; /* behind centered text (z=5), above bg ellipse */
  pointer-events: none;
`;

export const SectionCell = styled.div`
  position: relative;
  overflow: hidden; /* softly clips blur near edges to 'hint' crossing */
`;

/* Shared blob base */
const SectionBlob = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(var(--rot));
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  filter: blur(43.4px);
  opacity: 0.95;
  pointer-events: none;
  will-change: transform;
`;

/* Scale between 25% and 100% of own max (min = 25% of largest rule satisfied) */
const scalePulse = keyframes`
  0%   { transform: translate(-50%, -50%) rotate(var(--rot)) scale(0.25); }
  50%  { transform: translate(-50%, -50%) rotate(var(--rot)) scale(1); }
  100% { transform: translate(-50%, -50%) rotate(var(--rot)) scale(0.25); }
`;

/* Gentle drift within cell - distinct paths per quadrant */
const driftA = keyframes`
  0%   { transform: translate(-50%, -50%) rotate(var(--rot)) translate(-8%, -6%) scale(var(--k,1)); }
  50%  { transform: translate(-50%, -50%) rotate(var(--rot)) translate( 8%,  6%) scale(var(--k,1)); }
  100% { transform: translate(-50%, -50%) rotate(var(--rot)) translate(-8%, -6%) scale(var(--k,1)); }
`;
const driftB = keyframes`
  0%   { transform: translate(-50%, -50%) rotate(var(--rot)) translate( 7%, -7%) scale(var(--k,1)); }
  50%  { transform: translate(-50%, -50%) rotate(var(--rot)) translate(-7%,  7%) scale(var(--k,1)); }
  100% { transform: translate(-50%, -50%) rotate(var(--rot)) translate( 7%, -7%) scale(var(--k,1)); }
`;
const driftC = keyframes`
  0%   { transform: translate(-50%, -50%) rotate(var(--rot)) translate( 6%,  8%) scale(var(--k,1)); }
  50%  { transform: translate(-50%, -50%) rotate(var(--rot)) translate(-6%, -8%) scale(var(--k,1)); }
  100% { transform: translate(-50%, -50%) rotate(var(--rot)) translate( 6%,  8%) scale(var(--k,1)); }
`;
const driftD = keyframes`
  0%   { transform: translate(-50%, -50%) rotate(var(--rot)) translate(-9%,  5%) scale(var(--k,1)); }
  50%  { transform: translate(-50%, -50%) rotate(var(--rot)) translate( 9%, -5%) scale(var(--k,1)); }
  100% { transform: translate(-50%, -50%) rotate(var(--rot)) translate(-9%,  5%) scale(var(--k,1)); }
`;

/* a: top-left */
export const BlobA = styled(SectionBlob)`
  --rot: -56.03deg;
  --size: calc(var(--baseMax) * 0.48); /* < 50% of base */
  background: linear-gradient(180deg, rgba(255, 173, 213, 0.48) 0%, rgba(249, 207, 180, 0.48) 60.58%);
  animation:
    ${scalePulse} 7s ease-in-out infinite alternate,
    ${driftA} 10s ease-in-out infinite alternate;
`;

/* b: top-right */
export const BlobB = styled(SectionBlob)`
  --rot: 75deg;
  --size: calc(var(--baseMax) * 0.42);
  background: linear-gradient(180deg, rgba(255, 138, 182, 0.48) 0%, rgba(221, 233, 227, 0.48) 67.89%);
  animation:
    ${scalePulse} 7.5s ease-in-out infinite alternate,
    ${driftB} 11s ease-in-out infinite alternate;
`;

/* c: bottom-left */
export const BlobC = styled(SectionBlob)`
  --rot: 30deg;
  --size: calc(var(--baseMax) * 0.35);
  background: linear-gradient(180deg, rgba(249, 206, 180, 0.72) 6.25%, rgba(221, 233, 227, 0.72) 38.5%);
  animation:
    ${scalePulse} 8s ease-in-out infinite alternate,
    ${driftC} 12s ease-in-out infinite alternate;
`;

/* d: bottom-right */
export const BlobD = styled(SectionBlob)`
  --rot: 45deg;
  --size: calc(var(--baseMax) * 0.28);
  background: linear-gradient(180deg, rgba(255, 173, 213, 0.61) 0%, rgba(249, 207, 180, 0.61) 60.58%);
  animation:
    ${scalePulse} 8.5s ease-in-out infinite alternate,
    ${driftD} 12.5s ease-in-out infinite alternate;
`;

