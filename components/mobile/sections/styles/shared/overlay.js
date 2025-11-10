import styled from 'styled-components';
import { z } from './elevation';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: ${z.modal};
  pointer-events: none;
`;


