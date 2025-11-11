// Styles for ListeningOverlay (mobile voice state) using styled-components

import styled from 'styled-components';
import { colors, fonts } from '../styles/tokens';
import { z } from '../styles/shared/elevation';
import { Overlay } from '../styles/shared/overlay';
import { CircleWrap as CircleWrapBase } from '../styles/shared/circle';

export const Container = styled(Overlay)``;

export const TopLabel = styled.div`
  position: fixed;
  top: clamp(calc(env(safe-area-inset-top, 0px) + 56px), 12vh, 96px);
  left: 50%;
  transform: translateX(-50%);
  color: ${colors.textSecondary};
  font-family: ${fonts.ui};
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.8;
`;

export const CircleWrap = styled(CircleWrapBase)`
  filter: none;
`;

export const Ring = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% + 32px);
  height: calc(100% + 32px);
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(255,255,255,0) 82%, rgba(255,255,255,0.95) 88%, rgba(255,255,255,0.55) 92%, rgba(255,255,255,0) 100%);
  filter: blur(6px);
  mix-blend-mode: screen;
  opacity: 0;
  animation: outwardRipple 1600ms ease-out infinite;
`;

export const RingDelay = styled(Ring)`
  animation: outwardRipple 1600ms ease-out infinite 800ms;
`;

export const CenterWrap = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

export const CenterText = styled.div`
  color: white;
  font-family: ${fonts.ui};
  font-size: clamp(1.6rem, 6vw, 2.2rem);
  font-weight: 500;
  text-shadow: 0 4px 18px rgba(0,0,0,0.10);
  letter-spacing: -0.02em;
  text-align: center;
  padding: 0 1rem;
  line-height: 1.2;
  max-width: 92%;
  opacity: ${(p) => (p.$fading ? 0 : 1)};
  filter: ${(p) => (p.$fading ? 'blur(6px)' : 'none')};
  transition: ${(p) => `opacity ${p.$fadeMs}ms ease, filter ${p.$fadeMs}ms ease`};
`;



