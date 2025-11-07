import styled, { keyframes } from 'styled-components';

export const Root = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

const breathe = keyframes`
  0% { flex-basis: 24%; }
  50% { flex-basis: 26%; }
  100% { flex-basis: 24%; }
`;

export const PanelRow = styled.div`
  position: absolute; inset: 0;
  display: flex; gap: 0;
`;

export const Panel = styled.div`
  position: relative;
  flex: 0 0 auto;
  contain: layout paint;
  overflow: hidden;
  /* springy transition (quick overshoot/settle) + ~10s freeze per state (44s loop total) */
  /* States: A(0%)→B(25%)→C(50%)→D(75%)→A(100%) */
  @keyframes p1 {
    /* A: 36% */ 0%{ width:36%; }
    2%{ width:27%; } 3.5%{ width:29.5%; } 5%{ width:28%; } /* spring to B (28%) */
    25%{ width:28%; } /* freeze ~10s */
    27%{ width:23%; } 28.5%{ width:21%; } 30%{ width:22%; } /* to C (22%) */
    50%{ width:22%; }
    52%{ width:31.5%; } 53.5%{ width:29%; } 55%{ width:30%; } /* to D (30%) */
    75%{ width:30%; }
    77%{ width:37.5%; } 78.5%{ width:34%; } 80%{ width:36%; } /* back to A (36%) */
    100%{ width:36%; }
  }
  @keyframes p2 {
    /* A: 18% */ 0%{ width:18%; }
    2%{ width:36%; } 3.5%{ width:32%; } 5%{ width:34%; } /* B: 34% */
    25%{ width:34%; }
    27%{ width:19.5%; } 28.5%{ width:17%; } 30%{ width:18%; } /* C: 18% */
    50%{ width:18%; }
    52%{ width:13%; } 53.5%{ width:15.5%; } 55%{ width:14%; } /* D: 14% */
    75%{ width:14%; }
    77%{ width:20.5%; } 78.5%{ width:17.5%; } 80%{ width:18%; } /* A: 18% */
    100%{ width:18%; }
  }
  @keyframes p3 {
    /* A: 16% */ 0%{ width:16%; }
    2%{ width:14%; } 3.5%{ width:17.5%; } 5%{ width:16%; } /* B: 16% (almost same, light spring) */
    25%{ width:16%; }
    27%{ width:45%; } 28.5%{ width:39%; } 30%{ width:42%; } /* C: 42% */
    50%{ width:42%; }
    52%{ width:12%; } 53.5%{ width:16.5%; } 55%{ width:14%; } /* D: 14% */
    75%{ width:14%; }
    77%{ width:17.5%; } 78.5%{ width:15%; } 80%{ width:16%; } /* A: 16% */
    100%{ width:16%; }
  }
  @keyframes p4 {
    /* A: 30% */ 0%{ width:30%; }
    2%{ width:20%; } 3.5%{ width:24%; } 5%{ width:22%; } /* B: 22% */
    25%{ width:22%; }
    27%{ width:16%; } 28.5%{ width:20%; } 30%{ width:18%; } /* C: 18% */
    50%{ width:18%; }
    52%{ width:45%; } 53.5%{ width:39%; } 55%{ width:42%; } /* D: 42% */
    75%{ width:42%; }
    77%{ width:27%; } 78.5%{ width:31%; } 80%{ width:30%; } /* A: 30% */
    100%{ width:30%; }
  }
  /* grow variable synced with width for child blob intensity */
  @keyframes g1 {
    0%{ --grow:.9; --blur:3px; }
    5%{ --grow:.7; --blur:4px; }
    25%{ --grow:.6; --blur:5px; }
    30%{ --grow:.25; --blur:6px; }
    50%{ --grow:.25; --blur:6px; }
    55%{ --grow:.7; --blur:4px; }
    75%{ --grow:.7; --blur:4px; }
    80%{ --grow:.9; --blur:3px; }
    100%{ --grow:.9; --blur:3px; }
  }
  @keyframes g2 {
    0%{ --grow:.35; --blur:6px; }
    5%{ --grow:.95; --blur:3px; }
    25%{ --grow:.95; --blur:3px; }
    30%{ --grow:.35; --blur:6px; }
    50%{ --grow:.35; --blur:6px; }
    55%{ --grow:.15; --blur:6px; }
    75%{ --grow:.15; --blur:6px; }
    80%{ --grow:.35; --blur:6px; }
    100%{ --grow:.35; --blur:6px; }
  }
  @keyframes g3 {
    0%{ --grow:.25; --blur:6px; }
    25%{ --grow:.25; --blur:6px; }
    30%{ --grow:1.0; --blur:3px; }
    50%{ --grow:1.0; --blur:3px; }
    55%{ --grow:.15; --blur:6px; }
    75%{ --grow:.15; --blur:6px; }
    80%{ --grow:.25; --blur:6px; }
    100%{ --grow:.25; --blur:6px; }
  }
  @keyframes g4 {
    0%{ --grow:.7; --blur:4px; }
    5%{ --grow:.35; --blur:6px; }
    25%{ --grow:.35; --blur:6px; }
    30%{ --grow:.25; --blur:6px; }
    50%{ --grow:.25; --blur:6px; }
    55%{ --grow:1.0; --blur:3px; }
    75%{ --grow:1.0; --blur:3px; }
    80%{ --grow:.7; --blur:4px; }
    100%{ --grow:.7; --blur:4px; }
  }
  &:nth-child(1){ animation: p1 40s linear infinite, g1 40s linear infinite; --delay: 0s; }
  &:nth-child(2){ animation: p2 40s linear infinite, g2 40s linear infinite; --delay: .15s; }
  &:nth-child(3){ animation: p3 40s linear infinite, g3 40s linear infinite; --delay: .3s; }
  &:nth-child(4){ animation: p4 40s linear infinite, g4 40s linear infinite; --delay: .45s; }
`;

export const BlobLayer = styled.div`
  position: absolute; inset: 0; pointer-events: none;
  filter: blur(var(--blur, 6px));
  display: grid;
  place-items: center; /* 항상 중앙 정렬 */
  transition: opacity 1200ms ease-in-out;
`;

export const BlobCircle = styled.div`
  position: relative;
  /* 패널 비율이 바뀌어도 원형이 찌그러지지 않도록 고정 비율 유지 */
  aspect-ratio: 1 / 1;
  width: min(120%, 60vmin);
  border-radius: 50%;
  /* 패널 확장 정도에 비례해 크기/채도/명도 강화 */
  transform: scale(calc(1 + (var(--grow, 0) * 0.12)));
  /* 더 높은 기본 채도 + 성장 시 강하게 */
  filter: saturate(calc(1.25 + (var(--grow, 0) * 0.75))) brightness(calc(1 - (var(--grow, 0) * 0.12)));
  transition: filter 600ms ease-in-out, transform 600ms ease-in-out, background 1200ms ease-in-out;
  /* blob_origin 기반 레이어드 그라디언트 (주색만 변수로) */
  background:
    radial-gradient(farthest-side at var(--p1x,72%) var(--p1y,52%), var(--main) 0%, transparent 60%),
    radial-gradient(farthest-side at var(--p2x,46%) var(--p2y,68%), var(--a) 0%, transparent 70%),
    radial-gradient(farthest-side at var(--p3x,32%) var(--p3y,28%), var(--b) 0%, transparent 75%);
  opacity: 0.95;
  will-change: transform, filter;
  animation: l1 9s ease-in-out infinite alternate, l2 11s ease-in-out infinite alternate, b1 10s ease-in-out infinite alternate;
  animation-delay: var(--delay, 0s);
  /* rim and halo */
  &::before{
    content:''; position:absolute; inset:-1vmin; border-radius:50%;
    background: radial-gradient(farthest-side at 50% 50%, rgba(255,255,255,0) 92%, rgba(255,255,255,0.75) 97%, rgba(255,255,255,0) 100%);
    filter: blur(10px); opacity:.65; mix-blend-mode:screen; pointer-events:none;
  }
  &::after{
    content:''; position:absolute; inset:-12vmin; border-radius:50%;
    background: radial-gradient(farthest-side, rgba(255,255,255,0.85), rgba(255,255,255,0.15) 55%, rgba(255,255,255,0.00) 80%);
    filter: blur(22px); opacity:.9; pointer-events:none;
  }

  @keyframes l1 {
    0%   { --p1x: 74%; --p1y: 50%; }
    50%  { --p1x: 56%; --p1y: 40%; }
    100% { --p1x: 68%; --p1y: 66%; }
  }
  @keyframes l2 {
    0%   { --p2x: 44%; --p2y: 70%; }
    50%  { --p2x: 60%; --p2y: 56%; }
    100% { --p2x: 38%; --p2y: 76%; }
  }
  @keyframes b1 {
    0%   { --s1: 26%; --s1o: 56%; --s2: 42%; --s2o: 78%; }
    50%  { --s1: 38%; --s1o: 68%; --s2: 52%; --s2o: 84%; }
    100% { --s1: 24%; --s1o: 54%; --s2: 40%; --s2o: 76%; }
  }
`;


