import styled from 'styled-components';

export const Root = styled.div`
  min-height: 100vh;
  background: linear-gradient(110deg, #FFEAEB 4.45%, #FCE1FF 55.49%, #C8CDFF 100.96%);
`;

export const TopText = styled.div`
  position: absolute;
  top: 614px;
  left: 390px;
  color: #000000;
  font-family: ${(p) => p.$fontFamily};
  font-size: 180px;
  line-height: 1.1;
  letter-spacing: 0.03em;
  white-space: nowrap;
`;

export const Bold = styled.span`
  font-weight: 700;
`;

export const Dots = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 0.2em;
`;

export const Dot = styled.span`
  transition: opacity 120ms linear;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
`;

export const ContentBox = styled.div`
  position: absolute;
  top: 2400px;
  left: 390px;
  width: 1236px;
  height: 522px;
  border-radius: 400px;
  border: 1px solid #FFF;
  background: linear-gradient(99deg, rgba(91, 76, 255, 0.09) 23.61%, rgba(55, 255, 252, 0.05) 73.24%, rgba(66, 255, 142, 0.07) 92.2%);
  box-shadow: 0 16px 10.3px 0 rgba(255, 255, 255, 0.38) inset, 0 -28px 30.9px 0 rgba(255, 255, 255, 0.69) inset;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #000000;
  font-family: ${(p) => p.$fontFamily};
  font-size: 220px;
  line-height: 1;
`;


