// Styles for LoadingScreen (mobile) using styled-components

import styled from 'styled-components';
import { colors, fonts } from '../styles/tokens';

export const Root = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #F3E8FF 0%, #FCEAFE 100%);
  border-radius: 15px;
`;

export const Spinner = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
`;

export const RingOuter = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid #F3E8FF;
  border-top: 4px solid ${colors.accentPrimary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

export const RingInner = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  top: 10px;
  left: 10px;
  border: 3px solid #F3E8FF;
  border-bottom: 3px solid ${colors.listening};
  border-radius: 50%;
  animation: spin 1.5s linear infinite reverse;
`;

export const Label = styled.p`
  color: ${colors.accentPrimary};
  font-family: ${fonts.ui};
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  animation: fadeInOut 2s ease-in-out infinite;
`;

export const Sub = styled.p`
  color: ${colors.accentPrimary};
  font-family: ${fonts.ui};
  font-size: 0.9rem;
  opacity: 0.7;
`;



