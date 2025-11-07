import styled, { keyframes } from 'styled-components';

export const TextRow = styled.div`
  position: absolute; inset: 0; display: flex;
  pointer-events: none; z-index: 2;
`;

const typing = keyframes` from{width:0} to{width:100%} `;
/* slide-in during panel freeze windows; 40s loop to match panels */
const slide1 = keyframes`
  0%{ opacity:0; transform: translateY(14px); }
  2%{ opacity:1; transform: translateY(0); }
  20%{ opacity:1; transform: translateY(0); } /* freeze ends at 25% */
  26%{ opacity:0; transform: translateY(14px); }
  100%{ opacity:0; transform: translateY(14px); }
`;
const slide2 = keyframes`
  0%{ opacity:0; transform: translateY(14px); }
  23%{ opacity:0; transform: translateY(14px); }
  27%{ opacity:1; transform: translateY(0); }
  45%{ opacity:1; transform: translateY(0); } /* ends near 50% */
  51%{ opacity:0; transform: translateY(14px); }
  100%{ opacity:0; transform: translateY(14px); }
`;
const slide3 = keyframes`
  0%{ opacity:0; transform: translateY(14px); }
  48%{ opacity:0; transform: translateY(14px); }
  52%{ opacity:1; transform: translateY(0); }
  70%{ opacity:1; transform: translateY(0); }
  76%{ opacity:0; transform: translateY(14px); }
  100%{ opacity:0; transform: translateY(14px); }
`;
const slide4 = keyframes`
  0%{ opacity:0; transform: translateY(14px); }
  73%{ opacity:0; transform: translateY(14px); }
  77%{ opacity:1; transform: translateY(0); }
  95%{ opacity:1; transform: translateY(0); }
  100%{ opacity:0; transform: translateY(14px); }
`;

export const Cell = styled.div`
  position: relative; display: flex; align-items: center; justify-content: center;
  color: #fff; font-family: 'Pretendard', 'Pretendard Variable', 'Noto Sans KR', system-ui, -apple-system, sans-serif;
  font-weight: 300; text-shadow: 0 10px 30px rgba(0,0,0,0.15);
  /* match panel width timeline so text stays centered per slice */
  @keyframes tp1 { 0%{ width:36%; } 25%{ width:28%; } 50%{ width:22%; } 75%{ width:30%; } 100%{ width:36%; } }
  @keyframes tp2 { 0%{ width:18%; } 25%{ width:34%; } 50%{ width:18%; } 75%{ width:14%; } 100%{ width:18%; } }
  @keyframes tp3 { 0%{ width:16%; } 25%{ width:16%; } 50%{ width:42%; } 75%{ width:14%; } 100%{ width:16%; } }
  @keyframes tp4 { 0%{ width:30%; } 25%{ width:22%; } 50%{ width:18%; } 75%{ width:42%; } 100%{ width:30%; } }
  @keyframes tg1 { 0%{ --grow:.9; } 25%{ --grow:.6; } 50%{ --grow:.25; } 75%{ --grow:.7; } 100%{ --grow:.9; } }
  @keyframes tg2 { 0%{ --grow:.35; } 25%{ --grow:.95; } 50%{ --grow:.35; } 75%{ --grow:.15; } 100%{ --grow:.35; } }
  @keyframes tg3 { 0%{ --grow:.25; } 25%{ --grow:.25; } 50%{ --grow:1.0; } 75%{ --grow:.15; } 100%{ --grow:.25; } }
  @keyframes tg4 { 0%{ --grow:.7; } 25%{ --grow:.35; } 50%{ --grow:.25; } 75%{ --grow:1.0; } 100%{ --grow:.7; } }
  &:nth-child(1){ animation: tp1 40s linear infinite, tg1 40s linear infinite; }
  &:nth-child(2){ animation: tp2 40s linear infinite, tg2 40s linear infinite; }
  &:nth-child(3){ animation: tp3 40s linear infinite, tg3 40s linear infinite; }
  &:nth-child(4){ animation: tp4 40s linear infinite, tg4 40s linear infinite; }
  /* Reason typing appears when its panel is expanded (freeze window) */
  &:nth-child(1) ${props => props.Reason || Reason}{ animation: ${slide1} 40s linear infinite; }
  &:nth-child(2) ${props => props.Reason || Reason}{ animation: ${slide2} 40s linear infinite; }
  &:nth-child(3) ${props => props.Reason || Reason}{ animation: ${slide3} 40s linear infinite; }
  &:nth-child(4) ${props => props.Reason || Reason}{ animation: ${slide4} 40s linear infinite; }
  &:nth-child(1) ${props => props.Typing || Typing}{ animation: ${typing} 8s steps(20,end) infinite; animation-delay: 0s; visibility: hidden; }
  &:nth-child(2) ${props => props.Typing || Typing}{ animation: ${typing} 8s steps(20,end) infinite; animation-delay: 10s; visibility: hidden; }
  &:nth-child(3) ${props => props.Typing || Typing}{ animation: ${typing} 8s steps(20,end) infinite; animation-delay: 20s; visibility: hidden; }
  &:nth-child(4) ${props => props.Typing || Typing}{ animation: ${typing} 8s steps(20,end) infinite; animation-delay: 30s; visibility: hidden; }
`;

export const Value = styled.div`
  font-size: clamp(14px, 2.0vw, 28px);
  transform: scale(calc(0.85 + (var(--grow,0) * 0.9)));
  transform-origin: center;
  transition: transform 240ms ease;
`;

export const Reason = styled.div`
  position: absolute; bottom: 14%; left: 50%; transform: translateX(-50%);
  font-size: clamp(12px, 1.4vw, 18px); opacity: 0; will-change: transform, opacity;
`;

export const Typing = styled.div`
  position: absolute; bottom: 8%; left: 50%; transform: translateX(-50%);
  font-size: clamp(12px, 1.2vw, 16px); opacity: 0.85; white-space: nowrap; overflow:hidden;
  border-right: 2px solid rgba(255,255,255,0.8);
  /* typing will be scheduled via Cell nth-child overrides */
`;


