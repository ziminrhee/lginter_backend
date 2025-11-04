import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #FCEAFE 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 4vh 4vw;
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 3vh;
  padding: 6vh 5vw;
  box-shadow: 0 2vh 6vh rgba(147, 51, 234, 0.15);
  border: 1px solid rgba(147, 51, 234, 0.1);
  text-align: center;
  max-width: 60vw;
`;

export const Title = styled.h1`
  font-size: 6vh;
  background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 2vh 0;
  font-weight: 700;
`;

export const Subtitle = styled.p`
  color: #9333EA;
  font-size: 2.2vh;
  margin: 0 0 3vh 0;
  opacity: 0.8;
`;

export const QRWrap = styled.div`
  background: white;
  padding: 2vh 2vw;
  border-radius: 2vh;
  display: inline-block;
  box-shadow: 0 1vh 3vh rgba(147, 51, 234, 0.1);
  border: 2px solid #F3E8FF;
`;


