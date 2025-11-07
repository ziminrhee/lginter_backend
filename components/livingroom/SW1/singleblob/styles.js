import styled from 'styled-components';

export const Root = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #FFFFFF;
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
  font-size: clamp(14px, 2.0vmin, 24px);
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
  top: 48%;
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
  text-shadow: 0 3px 12px rgba(0,0,0,0.12);
`;

export const CenterMode = styled.div`
  margin-top: 0.6vmin;
  font-size: clamp(25px, 4.5vmin, 65px);
  font-weight: 500;
  color: #0F172A;
`;


