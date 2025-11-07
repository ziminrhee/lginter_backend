import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

export const BackgroundTopRight = styled.div`
  position: absolute;
  top: -10%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%);
  border-radius: 50%;
`;

export const BackgroundBottomLeft = styled.div`
  position: absolute;
  bottom: -10%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%);
  border-radius: 50%;
`;

export const DefaultTextWrap = styled.div`
  text-align: center;
  opacity: 0.5;
  transition: opacity 0.5s;
`;

export const Title = styled.h1`
  font-size: 3rem;
  background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const Subtitle = styled.p`
  color: #9333EA;
  font-size: 1.2rem;
  opacity: 0.7;
`;

const fadeInScale = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

export const WelcomeCard = styled.div`
  text-align: center;
  animation: ${fadeInScale} 0.5s ease-out;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  box-shadow: 0 30px 80px rgba(147, 51, 234, 0.2);
  border: 2px solid rgba(147, 51, 234, 0.2);
  max-width: 800px;
`;

export const EmojiLarge = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

export const WelcomeTitle = styled.h1`
  font-size: 3.5rem;
  background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const WelcomeText = styled.p`
  font-size: 2.5rem;
  color: #9333EA;
  font-weight: 600;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

export const EmotionText = styled.p`
  font-size: 1.8rem;
  color: #EC4899;
  opacity: 0.9;
  font-weight: 500;
`;


