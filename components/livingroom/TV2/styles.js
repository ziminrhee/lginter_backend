import styled, { keyframes } from 'styled-components';

export const Root = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #FFFFFF;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, Roboto, "Helvetica Neue", Arial, sans-serif;
`;

export const Header = styled.div`
  position: absolute; top: 0; left: 0; right: 0; height: 10vh; min-height: 64px;
  display: flex; align-items: center; gap: 2vw; padding: 0 3vw;
  color: #fff;
  background: linear-gradient(90deg, rgba(102,157,255,1) 0%, rgba(143,168,224,1) 45%, rgba(196,201,206,1) 100%);
  box-shadow: 0 10px 40px rgba(0,0,0,0.08) inset;
  z-index: 3;
`;

export const HeaderIcon = styled.div`
  width: 32px; height: 32px; min-width: 32px;
  border-radius: 50%;
  display: grid; place-items: center;
  color: #fff;
  svg { width: 28px; height: 28px; }
`;

export const HeaderTitle = styled.div`
  font-size: clamp(18px, 2.2vw, 32px);
  font-weight: 600;
  letter-spacing: 0.02em;
`;

export const Content = styled.div`
  position: absolute; inset: 10vh 0 0 0; /* below header */
  display: grid; grid-template-columns: 3fr 2fr;
  height: calc(100vh - 10vh);
`;

export const LeftPanel = styled.div`
  position: relative;
  overflow: hidden;
  padding: 4vh 4vw;
  /* Base gradient and sweeping band per spec */
  --album-x: 58%; --album-y: 46%;
  /* starting azimuth for angular sweep to align with orange→white seam */
  --sweep-start: 110deg;
  background: linear-gradient(180deg, #F28A3A 0%, #F28A3A 40%, #B0B7E8 100%);
  color: #fff;
  &::after{
    /* soft horizontal blur band near the bottom like the mock */
    content:''; position:absolute; left:8%; right:6%; bottom:7%;
    height: 16vh; border-radius: 24px;
    filter: blur(18px); opacity:.25;
    background: linear-gradient(180deg, rgba(255,255,255,0.0), rgba(255,255,255,0.25), rgba(255,255,255,0.0));
    pointer-events: none;
  }
`;

export const LeftSweep = styled.div`
  position: absolute; inset: 0; pointer-events: none;
  z-index: 0; /* keep below content */
  transform-origin: 56% 46%;
  background:
    conic-gradient(from 0deg at 56% 46%,
      rgba(255,255,255,0.60) 0deg,
      rgba(255,255,255,0.28) 16deg,
      rgba(255,255,255,0.00) 26deg 360deg);
  filter: blur(8px);
  mix-blend-mode: normal;
  animation: spin 8s linear infinite;
  /* moving bright tip */
  &::after{
    content:''; position:absolute;
    left: 56%; top: 46%;
    width: 28vmin; height: 1px; /* invisible guide for transform */
    transform-origin: 0 50%;
    transform: rotate(0deg);
    /* the tip is a circle moved to the end of the guide using translateX */
    box-shadow: none;
  }
  &::before{
    content:''; position:absolute;
    left: 56%; top: 46%;
    width: 0; height: 0;
    transform-origin: 0 50%;
    transform: rotate(0deg) translateX(28vmin);
    border-radius: 50%;
    box-shadow:
      0 0 30px 14px rgba(255,255,255,0.28),
      0 0 80px 36px rgba(255,255,255,0.18);
  }
  @keyframes spin{
    from{ transform: rotate(0deg); }
    to  { transform: rotate(360deg); }
  }
`;

export const LeftSweepTrail = styled(LeftSweep)`
  background:
    conic-gradient(from 0deg at 56% 46%,
      rgba(255,255,255,0.35) 0deg,
      rgba(255,255,255,0.00) 28deg 360deg);
  filter: blur(16px);
  opacity: .6;
  animation: spin 8s linear infinite;
  animation-delay: -0.25s;
`;

export const LeftSweepTrail2 = styled(LeftSweep)`
  background:
    conic-gradient(from 0deg at 56% 46%,
      rgba(255,255,255,0.22) 0deg,
      rgba(255,255,255,0.00) 40deg 360deg);
  filter: blur(24px);
  opacity: .45;
  animation: spin 8s linear infinite;
  animation-delay: -0.5s;
`;

export const LeftSweepWide = styled(LeftSweep)`
  background:
    conic-gradient(from 0deg at 56% 46%,
      rgba(255,255,255,0.40) 0deg,
      rgba(255,255,255,0.16) 42deg,
      rgba(255,255,255,0.00) 70deg 360deg);
  filter: blur(28px);
  opacity: .7;
  animation: spin 8s linear infinite;
  animation-delay: -0.12s;
`;

export const MusicRow = styled.div`
  position: absolute;
  left: calc(var(--album-x) - 30vw);
  top: calc(var(--album-y) - 8%);
  display: flex; align-items: center; gap: 1.4vw;
  font-size: clamp(18px, 2.6vw, 36px);
  font-weight: 500;
  opacity: .95;
`;

export const MusicIcon = styled.div`
  svg { width: clamp(22px, 2.4vw, 32px); height: clamp(22px, 2.4vw, 32px); color: #fff; }
`;

const spinSweep = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

export const SweepTrail = styled.div`
  position: absolute; inset: -50%; pointer-events: none;
  transform-origin: 50% 50%;
  z-index: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%);
  filter: blur(40px);
  mix-blend-mode: screen;
  animation: ${spinSweep} 12s linear infinite;
`;

export const SweepCore = styled(SweepTrail)`
  background: linear-gradient(90deg, rgba(255,255,255,0) 49%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 51%);
  filter: blur(12px);
  opacity: .95;
  animation: ${spinSweep} 12s linear infinite;
`;

export const AngularSweep = styled.div`
  position: absolute; inset: -35%; pointer-events: none;
  transform-origin: 50% 50%;
  z-index: 0;
  background: conic-gradient(from var(--sweep-start) at 56% 46%,
    #A15C2E 0%,
    #F5813F 21%,
    #F5813F 32%,
    #AEAEC5 70%,
    #F6E4CD 100%);
  filter: blur(28px) saturate(1.05);
  mix-blend-mode: normal;
  opacity: .9;
  animation: ${spinSweep} 12s linear infinite;
`;

export const AngularSharp = styled.div`
  position: absolute; inset: -35%; pointer-events: none;
  transform-origin: 50% 50%;
  z-index: 0;
  background: rgba(255,255,255,0.95);
  /* Conic mask creates a crisp wedge (no blur) that rotates with the element */
  -webkit-mask-image: conic-gradient(from var(--sweep-start) at 56% 46%,
    rgba(0,0,0,0) 0deg,
    rgba(0,0,0,1) 8deg,
    rgba(0,0,0,1) 18deg,
    rgba(0,0,0,0) 22deg 360deg);
  mask-image: conic-gradient(from var(--sweep-start) at 56% 46%,
    rgba(0,0,0,0) 0deg,
    rgba(0,0,0,1) 8deg,
    rgba(0,0,0,1) 18deg,
    rgba(0,0,0,0) 22deg 360deg);
  mix-blend-mode: screen;
  animation: ${spinSweep} 12s linear infinite;
  opacity: .85;
`;

export const AlbumCard = styled.div`
  position: absolute; left: var(--album-x); top: var(--album-y);
  transform: translate(-50%, -50%);
  width: min(34vh, 32vw); aspect-ratio: 1 / 1; border-radius: 20px;
  background: radial-gradient(120% 120% at 35% 25%, #c7e3ff 0%, #c9d2e8 40%, #f7efe8 100%);
  box-shadow:
    0 20px 50px rgba(0,0,0,0.25),
    inset 0 -8px 30px rgba(255,255,255,0.55),
    inset 0 12px 24px rgba(255,255,255,0.35);
  overflow: hidden;
  display: grid; place-items: center;
`;

export const TrackTitle = styled.div`
  position: absolute;
  left: var(--album-x);
  top: calc(var(--album-y) + min(34vh, 32vw) * 0.62);
  transform: translateX(-50%);
  font-size: clamp(18px, 2.0vw, 30px);
  font-weight: 700;
  color: rgba(255,255,255,0.98);
  text-shadow: 0 8px 20px rgba(0,0,0,0.2);
`;

export const Artist = styled.div`
  position: absolute;
  left: var(--album-x);
  top: calc(var(--album-y) + min(34vh, 32vw) * 0.62 + 3.2vh);
  transform: translateX(-50%);
  font-size: clamp(12px, 1.2vw, 18px);
  color: rgba(255,255,255,0.9);
`;

export const RightPanel = styled.div`
  position: relative;
  overflow: hidden;
  display: grid; place-items: center;
  background: linear-gradient(135deg, rgba(255,241,241,0.95), rgba(253,222,222,0.75) 55%, rgba(255,255,255,0.9) 100%);
`;

export const ClimateGroup = styled.div`
  position: absolute; left: 6%; top: 40%;
  display: grid; gap: 4vh;
  color: #fff;
  filter: drop-shadow(0 10px 40px rgba(0,0,0,0.15));
`;

export const ClimateRow = styled.div`
  display: flex; align-items: center; gap: 1.2vw;
  font-size: clamp(20px, 2.6vw, 44px);
`;

export const ClimateIcon = styled.div`
  svg { width: clamp(22px, 2.6vw, 40px); height: clamp(22px, 2.6vw, 40px); color: #fff; }
`;

export const BlobSpot = styled.div`
  position: absolute; right: -10%; top: 20%;
  width: 80vmin; height: 80vmin; display: grid; place-items: center; pointer-events:none;
`;


