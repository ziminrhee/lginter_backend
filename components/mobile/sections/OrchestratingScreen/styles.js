// Styles for OrchestratingScreen (mobile voice state) using styled-components

import styled from 'styled-components';
import { fonts } from '../styles/tokens';
import { Overlay } from '../styles/shared/overlay';
import { CircleWrap as CircleWrapBase } from '../styles/shared/circle';

export const Container = styled(Overlay)``;
export const CircleWrap = styled(CircleWrapBase)``;

export const Text = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #222;
  font-family: ${fonts.ui};
  font-weight: 700;
  letter-spacing: 0.08em;
  font-size: clamp(1.6rem, 6.2vw, 2.2rem);
  text-transform: uppercase;
  opacity: 0;
  animation: orchestrateLabel 1800ms ease forwards;
`;



