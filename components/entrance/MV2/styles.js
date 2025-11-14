import styled, { keyframes } from 'styled-components';

const slide = keyframes`
  0% { transform: translateX(-33.333%); }
  100% { transform: translateX(0%); }
`;

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top left, #3c3b5c, #0e0d16 65%);
  color: #f5f5f5;
  overflow: hidden;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
`;

export const Background = styled.div`
  position: absolute;
  width: 120vw;
  height: 120vh;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.08), transparent 60%);
  filter: blur(40px);
  z-index: 0;
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  width: 90vw;
  max-width: 1920px;
  height: 22vh;
  border-radius: 28px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DefaultMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5vh;
  text-align: center;
  opacity: 0.8;

  span {
    font-size: 8vh;
    font-weight: 700;
    letter-spacing: 0.4vh;
  }

  small {
    font-size: 3vh;
    color: rgba(255, 255, 255, 0.7);
  }
`;

export const Marquee = styled.div`
  width: 100%;
  overflow: hidden;
`;

export const MarqueeInner = styled.div`
  display: flex;
  width: 300%;
  animation: ${slide} 12s linear infinite;

  span {
    flex: 0 0 33.3333%;
    padding: 0 4vw;
    font-size: 6vh;
    font-weight: 600;
    text-transform: none;
    color: #f7f1ff;
    text-shadow: 0 0 20px rgba(166, 117, 255, 0.6);
    white-space: nowrap;
  }
`;


