import styled, { createGlobalStyle } from 'styled-components';

export const Root = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -10;
  pointer-events: none;
  overflow: hidden;
  background: ${(p) => p.$bg || 'transparent'};
`;

export const PreMountCover = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  background: ${(p) => p.$bg || 'transparent'};
`;

export const BlobWrapper = styled.div`
  position: absolute;
  top: ${(p) => p.$top};
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  filter: ${(p) => `brightness(${p.$brightness || 1})`};
  opacity: ${(p) => p.$opacity};
  transition: ${(p) => `opacity ${p.$opacityMs}ms ease`};
  pointer-events: none;
`;

export const Cluster = styled.div`
  position: absolute;
  inset: 0;
  animation: ${(p) => (p.$spin ? 'clusterSpin 6s linear infinite' : 'none')};
  pointer-events: none;
`;

export const OrbitWrap = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: ${(p) => p.$d}px;
  height: ${(p) => p.$d}px;
  z-index: 0;
  animation: ${(p) => p.$anim || 'none'};
`;

export const OrbitShape = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: ${(p) => `translate(-50%, -50%) rotate(${p.$rotate}deg)`};
  width: ${(p) => p.$w}px;
  height: ${(p) => p.$h}px;
  border-radius: 50% / 50%;
  filter: ${(p) => `blur(${p.$blur}px)`};
  background: ${(p) => p.$bg};
`;

export const Label = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  animation: ${(p) => p.$anim};
  color: #111;
  font-weight: 800;
  font-family: inherit;
  font-size: clamp(1rem, 3.4vw, 1.25rem);
`;

export const NewOrbWrap = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  width: ${(p) => (p.$d != null ? `${p.$d}px` : 'auto')};
  height: ${(p) => (p.$d != null ? `${p.$d}px` : 'auto')};
`;

export const NewOrbShape = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(85.988deg);
  opacity: 0.7;
  filter: blur(10px);
  animation: ${(p) => `newOrbEnter ${p.$enterMs}ms ease-out forwards`};
  background: linear-gradient(167deg, #F8E3B7 9.32%, #FF85B1 61.8%, #E3FFF4 103.45%);
  width: ${(p) => (p.$w != null ? `${p.$w}px` : 'auto')};
  height: ${(p) => (p.$h != null ? `${p.$h}px` : 'auto')};
  border-radius: ${(p) => (p.$br != null ? `${p.$br}px` : '50%')};
`;

export const FinalOrbWrap = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  animation: orbitCW 16s linear infinite;
  width: ${(p) => (p.$w != null ? `${p.$w}px` : 'auto')};
  height: ${(p) => (p.$h != null ? `${p.$h}px` : 'auto')};
`;

export const FinalOrbShape = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(-85.44deg);
  width: ${(p) => (p.$w != null ? `${p.$w}px` : 'auto')};
  height: ${(p) => (p.$h != null ? `${p.$h}px` : 'auto')};
  border-radius: ${(p) => (p.$br != null ? `${p.$br}px` : '50%')};
  filter: blur(50px);
  opacity: 0.95;
  animation: finalOrbAppear 900ms ease-out forwards;
  background: linear-gradient(180deg, #E291C7 0%, #FFD8E0 75.48%);
`;

export const CenterGlow = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: ${(p) => (p.$d != null ? `${p.$d}px` : 'auto')};
  height: ${(p) => (p.$d != null ? `${p.$d}px` : 'auto')};
  border-radius: ${(p) => (p.$d != null ? `${p.$d}px` : '50%')};
  opacity: 0.7;
  mix-blend-mode: overlay;
  filter: blur(29.5px);
  animation: centerGlowPulse 3s ease-in-out infinite;
  background: radial-gradient(50% 50% at 50% 50%, #FFF 39.42%, rgba(255, 255, 255, 0.00) 100%);
`;

export const BGGlow = styled.div`
  position: absolute;
  width: 80vmin;
  aspect-ratio: 1;
  border-radius: 50%;
  left: 64%;
  top: 66%;
  transform: translate(-50%, -50%);
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(circle at 50% 50%, rgba(235,201,255,0.42) 0%, rgba(235,201,255,0.26) 40%, rgba(235,201,255,0) 72%);
  filter: blur(70px);
`;

export const KeyframesGlobal = createGlobalStyle`
  @keyframes shaderWave {
    0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
    12.5% { transform: translate(-50.3%, -50.2%) scale(1.008) rotate(0.3deg); }
    25% { transform: translate(-50.5%, -49.8%) scale(1.012) rotate(0.5deg); }
    37.5% { transform: translate(-50.2%, -50.5%) scale(1.005) rotate(0.2deg); }
    50% { transform: translate(-49.8%, -50.3%) scale(0.998) rotate(-0.2deg); }
    62.5% { transform: translate(-50.2%, -49.7%) scale(1.002) rotate(0.1deg); }
    75% { transform: translate(-49.6%, -50.1%) scale(1.006) rotate(-0.3deg); }
    87.5% { transform: translate(-50.4%, -50.4%) scale(1.003) rotate(0.2deg); }
  }

  @keyframes sharpBloomEffect {
    0%, 100% { filter: blur(${(p) => p.$blurIncrease}px) brightness(1); }
    25% { filter: blur(${(p) => 20 + p.$blurIncrease}px) brightness(1.3); }
    50% { filter: blur(${(p) => 40 + p.$blurIncrease}px) brightness(1.6); }
    75% { filter: blur(${(p) => 20 + p.$blurIncrease}px) brightness(1.3); }
  }

  @keyframes bloomEffect {
    0%, 100% { filter: blur(${(p) => 25 + p.$blurIncrease * 2}px) brightness(1); }
    25% { filter: blur(${(p) => 60 + p.$blurIncrease * 2}px) brightness(1.3); }
    50% { filter: blur(${(p) => 100 + p.$blurIncrease * 2}px) brightness(1.6); }
    75% { filter: blur(${(p) => 60 + p.$blurIncrease * 2}px) brightness(1.3); }
  }

  @keyframes clusterSpin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }

  @keyframes orbitCW {
    0% { transform: translate(-50%, -50%) rotate(0deg) translateX(${(p) => p.$blobSize * 0.6}px); }
    100% { transform: translate(-50%, -50%) rotate(360deg) translateX(${(p) => p.$blobSize * 0.6}px); }
  }
  @keyframes orbitCCW {
    0% { transform: translate(-50%, -50%) rotate(0deg) translateX(${(p) => p.$blobSize * 0.5}px); }
    100% { transform: translate(-50%, -50%) rotate(-360deg) translateX(${(p) => p.$blobSize * 0.5}px); }
  }

  @keyframes newOrbEnter {
    0% { transform: translate(-50%, -50%) rotate(85.988deg) translateX(${(p) => p.$blobSize * 1.8}px); opacity: 0; }
    100% { transform: translate(-50%, -50%) rotate(85.988deg) translateX(${(p) => p.$blobSize * 0.58 * (p.$orbitRadiusScale || 1)}px); opacity: 0.7; }
  }
  @keyframes finalOrbAppear { 0% { opacity: 0; transform: translate(-50%, -50%) rotate(-85.44deg) scale(0.9);} 100% { opacity: 0.95; transform: translate(-50%, -50%) rotate(-85.44deg) scale(1);} }
  @keyframes centerGlowPulse { 0%,100% { opacity: 0.6; filter: blur(29.5px);} 50% { opacity: 0.85; filter: blur(22px);} }

  @keyframes labelCW {
    0% { transform: translate(-50%, -50%) rotate(0deg) translateX(${(p) => p.$blobSize * 0.58}px) rotate(0deg) translateY(-18px); }
    100% { transform: translate(-50%, -50%) rotate(360deg) translateX(${(p) => p.$blobSize * 0.58}px) rotate(-360deg) translateY(-18px); }
  }
  @keyframes labelCCW {
    0% { transform: translate(-50%, -50%) rotate(0deg) translateX(${(p) => p.$blobSize * 0.5}px) rotate(0deg) translateY(-18px); }
    100% { transform: translate(-50%, -50%) rotate(-360deg) translateX(${(p) => p.$blobSize * 0.5}px) rotate(360deg) translateY(-18px); }
  }
  @keyframes labelCWBottom {
    0% { transform: translate(-50%, -50%) rotate(0deg) translateX(${(p) => p.$blobSize * 0.58}px) rotate(0deg) translateY(26px); }
    100% { transform: translate(-50%, -50%) rotate(360deg) translateX(${(p) => p.$blobSize * 0.58}px) rotate(-360deg) translateY(26px); }
  }
  @keyframes labelCCWBottom {
    0% { transform: translate(-50%, -50%) rotate(0deg) translateX(${(p) => p.$blobSize * 0.5}px) rotate(0deg) translateY(26px); }
    100% { transform: translate(-50%, -50%) rotate(-360deg) translateX(${(p) => p.$blobSize * 0.5}px) rotate(360deg) translateY(26px); }
  }
  @keyframes ringPulse {
    0%, 100% {
      --start-wobble: calc(0% - var(--start));
      --end-wobble: 0%;
      --feather-wobble: 0%;
      --blur-wobble: calc(0px - var(--blur));
    }
    50% {
      --start-wobble: calc(90% - var(--start));
      --end-wobble: 0%;
      --feather-wobble: 5%;
      --blur-wobble: calc(120px - var(--blur));
    }
  }
`;

export const BlobCssGlobal = createGlobalStyle`
  @property --start-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
  @property --end-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
  @property --feather-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
  @property --blur-wobble { syntax: '<length>'; inherits: true; initial-value: 0px; }

  .blob {
    position: relative;
    border-radius: 50%;
    background: none;
    isolation: isolate;
    --start-anim: clamp(0%, calc(var(--start) + var(--start-wobble)), 90%);
    --end-anim: clamp(0%, calc(var(--end) + var(--end-wobble)), 100%);
    --feather-anim: clamp(0%, calc(var(--feather) + var(--feather-wobble)), 25%);
    animation: ringPulse 6s ease-in-out infinite;
  }

  .blob.frozen {
    animation: none !important;
    --start-wobble: calc(0% - var(--start));
    --end-wobble: 0%;
    --feather-wobble: 0%;
    --blur-wobble: calc(0px - var(--blur));
  }

  .ring-boost {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    pointer-events: none;
    background:
      var(--bg),
      radial-gradient(circle at var(--center-x) var(--center-y),
        rgba(235, 201, 255, 0) 0 calc(var(--end) - (var(--feather) * 0.7)),
        rgba(235, 201, 255, calc(var(--tint-alpha) * 0.9)) calc(var(--end) + (var(--feather) * 0.3)));
    background-blend-mode: normal, screen;
    filter: blur(calc((var(--blur) + var(--blur-wobble)) * var(--boost))) drop-shadow(0 26px 40px rgba(186, 136, 255, 0.35));
    -webkit-mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--end) - var(--feather)), #000 calc(var(--end) - var(--feather)) calc(var(--end) + (var(--feather) * 1.6)), transparent calc(var(--end) + (var(--feather) * 1.8)));
            mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--end) - var(--feather)), #000 calc(var(--end) - var(--feather)) calc(var(--end) + (var(--feather) * 1.6)), transparent calc(var(--end) + (var(--feather) * 1.8)));
  }

  .blob::before,
  .blob::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--bg);
  }

  .blob::before {
    filter: blur(var(--inner-blur));
    -webkit-mask: radial-gradient(
      circle at var(--center-x) var(--center-y),
      #000 0 calc(var(--start-anim) - var(--feather-anim)),
      transparent calc(var(--start-anim) + var(--feather-anim))
    );
            mask: radial-gradient(
      circle at var(--center-x) var(--center-y),
      #000 0 calc(var(--start-anim) - var(--feather-anim)),
      transparent calc(var(--start-anim) + var(--feather-anim))
    );
  }

  .blob::after {
    background:
      var(--bg),
      radial-gradient(circle at var(--center-x) var(--center-y),
        rgba(235, 201, 255, 0) 0 calc(var(--start-anim) - var(--feather-anim)),
        rgba(235, 201, 255, var(--tint-alpha)) var(--end-anim));
    background-blend-mode: normal, screen;
    filter: blur(calc(var(--blur) + var(--blur-wobble))) drop-shadow(0 24px 36px rgba(186, 136, 255, 0.4));
    opacity: 1;
    -webkit-mask: radial-gradient(
      circle at var(--center-x) var(--center-y),
      transparent 0 calc(var(--start-anim) - var(--feather-anim)),
      #000 var(--start-anim) var(--end-anim),
      transparent calc(var(--end-anim) + var(--feather-anim))
    );
            mask: radial-gradient(
      circle at var(--center-x) var(--center-y),
      transparent 0 calc(var(--start-anim) - var(--feather-anim)),
      #000 var(--start-anim) var(--end-anim),
      transparent calc(var(--end-anim) + var(--feather-anim))
    );
  }

  @supports (mask-composite: intersect) {
    .blob::after {
      mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--start-anim) - var(--feather-anim)), #000 var(--start-anim) var(--end-anim), transparent calc(var(--end-anim) + var(--feather-anim))), linear-gradient(calc(180deg + var(--rim-tilt)), transparent 35%, #000 60%);
      mask-composite: intersect;
    }
  }

  @supports (-webkit-mask-composite: source-in) {
    .blob::after {
      -webkit-mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--start-anim) - var(--feather-anim)), #000 var(--start-anim) var(--end-anim), transparent calc(var(--end-anim) + var(--feather-anim))), linear-gradient(calc(180deg + var(--rim-tilt)), transparent 35%, #000 60%);
      -webkit-mask-composite: source-in;
    }
  }
`;


