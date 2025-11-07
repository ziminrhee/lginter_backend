import styled, { keyframes } from 'styled-components';

export const Root = styled.div`
  min-height: 100vh;
  background: transparent;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Container = styled.div`
  max-width: 600px;
  width: 100%;
`;

export const Panel = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 3rem 2rem;
  box-shadow: 0 20px 60px rgba(147, 51, 234, 0.15);
  border: 1px solid rgba(147, 51, 234, 0.1);
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
`;

export const Subtitle = styled.p`
  color: #9333EA;
  font-size: 1rem;
  opacity: 0.7;
  text-align: center;
  margin-bottom: 2rem;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Tile = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 2rem;
  border: 2px solid #F3E8FF;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const ColorBox = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 15px;
  background: ${(p) => p.$color};
  box-shadow: 0 8px 24px ${(p) => (p.$color ? `${p.$color}80` : '#00000000')};
  border: 3px solid white;
`;

export const Flex1 = styled.div`
  flex: 1;
`;

export const LabelSmall = styled.div`
  font-size: 1rem;
  color: #9333EA;
  opacity: 0.7;
  margin-bottom: 0.5rem;
`;

export const ValueLarge = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #9333EA;
`;

export const AssignedTag = styled.div`
  font-size: 0.9rem;
  color: #EC4899;
  font-weight: 600;
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: rgba(236, 72, 153, 0.1);
  border-radius: 10px;
`;

export const Divider = styled.div`
  border-top: 2px solid #F3E8FF;
  padding-top: 1.5rem;
`;

export const SongTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #9333EA;
  line-height: 1.4;
  margin-bottom: 1rem;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingBlock = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(147, 51, 234, 0.05);
  border-radius: 12px;
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #F3E8FF;
  border-top: 3px solid #9333EA;
  border-radius: 50%;
  margin: 0 auto;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingNote = styled.p`
  color: #9333EA;
  font-size: 0.9rem;
  margin-top: 1rem;
  opacity: 0.7;
`;

export const PlayerWrap = styled.div`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(147, 51, 234, 0.15);
`;

export const PlayerNote = styled.p`
  font-size: 0.85rem;
  color: #9333EA;
  margin-top: 0.5rem;
  text-align: center;
  opacity: 0.7;
`;

export const SearchBlock = styled.div`
  padding: 1rem;
  background: rgba(147, 51, 234, 0.05);
  border-radius: 12px;
  text-align: center;
`;

export const SearchTitle = styled.p`
  color: #9333EA;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  opacity: 0.7;
`;

export const SearchLink = styled.a`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
  transition: transform 0.2s;
  &:hover { transform: scale(1.05); }
`;

export const StatusCard = styled.div`
  background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  color: white;
`;

export const StatusCaption = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
`;

export const StatusText = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 15px;
  border: 2px dashed rgba(147, 51, 234, 0.3);
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

export const EmptyText = styled.p`
  color: #9333EA;
  font-size: 1.2rem;
  opacity: 0.6;
`;


