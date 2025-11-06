import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: #FFFAF5;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 4vh 4vw; position: relative; overflow: hidden;
  --kiss: 9vmin;
`;

export const TopMessage = styled.h2`
  position: absolute; width: clamp(280px, 60vw, 1173px);
  left: 50%; transform: translateX(-50%);
  top: clamp(6vh, 12vh, 16vh); height: clamp(64px, 10.5vw, 190px);
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-style: normal; font-weight: 600;
  font-size: clamp(28px, 6vw, 110px); line-height: clamp(36px, 7.4vw, 130px);
  text-align: center; color: #000; margin: 0; z-index: 1; white-space: pre-line;
`;


