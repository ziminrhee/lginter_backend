import React from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// Note: This is the preserved legacy blob implementation (not mounted anywhere).
// Kept as a base template/reference. Do not import in index.js by default.

const GlobalProps = createGlobalStyle`
  /* CSS variable registration for smooth gradient center animation */
  @property --p1x { syntax: '<percentage>'; inherits: false; initial-value: 72%; }
  @property --p1y { syntax: '<percentage>'; inherits: false; initial-value: 52%; }
  @property --p2x { syntax: '<percentage>'; inherits: false; initial-value: 46%; }
  @property --p2y { syntax: '<percentage>'; inherits: false; initial-value: 68%; }
  @property --p3x { syntax: '<percentage>'; inherits: false; initial-value: 32%; }
  @property --p3y { syntax: '<percentage>'; inherits: false; initial-value: 28%; }
  @property --p4x { syntax: '<percentage>'; inherits: false; initial-value: 58%; }
  @property --p4y { syntax: '<percentage>'; inherits: false; initial-value: 28%; }
  @property --s1 { syntax: '<percentage>'; inherits: false; initial-value: 30%; }
  @property --s1o { syntax: '<percentage>'; inherits: false; initial-value: 60%; }
  @property --s2 { syntax: '<percentage>'; inherits: false; initial-value: 44%; }
  @property --s2o { syntax: '<percentage>'; inherits: false; initial-value: 80%; }
  @property --s3 { syntax: '<percentage>'; inherits: false; initial-value: 56%; }
  @property --s3o { syntax: '<percentage>'; inherits: false; initial-value: 72%; }
  @property --s4 { syntax: '<percentage>'; inherits: false; initial-value: 40%; }
  @property --s4o { syntax: '<percentage>'; inherits: false; initial-value: 70%; }
`;

const l1 = keyframes`
  0% { --p1x: 74%; --p1y: 50%; }
  50% { --p1x: 56%; --p1y: 40%; }
  100% { --p1x: 68%; --p1y: 66%; }
`;
const l2 = keyframes`
  0% { --p2x: 44%; --p2y: 70%; }
  50% { --p2x: 60%; --p2y: 56%; }
  100% { --p2x: 38%; --p2y: 76%; }
`;
const l3 = keyframes`
  0% { --p3x: 30%; --p3y: 26%; }
  50% { --p3x: 46%; --p3y: 36%; }
  100% { --p3x: 24%; --p3y: 22%; }
`;
const l4 = keyframes`
  0% { --p4x: 60%; --p4y: 26%; }
  50% { --p4x: 74%; --p4y: 34%; }
  100% { --p4x: 52%; --p4y: 18%; }
`;
const b1 = keyframes`
  0% { --s1: 22%; --s1o: 52%; }
  50% { --s1: 42%; --s1o: 72%; }
  100% { --s1: 24%; --s1o: 54%; }
`;
const b2 = keyframes`
  0% { --s2: 38%; --s2o: 74%; }
  50% { --s2: 58%; --s2o: 88%; }
  100% { --s2: 40%; --s2o: 76%; }
`;
const b3 = keyframes`
  0% { --s3: 46%; --s3o: 66%; }
  50% { --s3: 64%; --s3o: 78%; }
  100% { --s3: 48%; --s3o: 68%; }
`;
const b4 = keyframes`
  0% { --s4: 36%; --s4o: 64%; }
  50% { --s4: 56%; --s4o: 80%; }
  100% { --s4: 38%; --s4o: 66%; }
`;

const Root = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #FFFFFF;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, Roboto, "Helvetica Neue", Arial, sans-serif;
`;

const BgLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const BlobMono = styled.div`
  position: absolute;
  border-radius: 50%;
  width: 82vmin;
  height: 82vmin;
  left: 14vw;
  top: 24vh;
  clip-path: circle(50% at 50% 50%);
  --p1x: 72%; --p1y: 52%;
  --p2x: 46%; --p2y: 68%;
  --p3x: 32%; --p3y: 28%;
  --p4x: 58%; --p4y: 28%;
  background:
    radial-gradient(farthest-side at var(--p1x) var(--p1y), rgba(255,120,170,0.90) 0%, rgba(255,120,170,0.48) var(--s1), rgba(255,120,170,0.00) var(--s1o)),
    radial-gradient(farthest-side at var(--p2x) var(--p2y), rgba(255,214,168,0.92) 0%, rgba(255,214,168,0.55) var(--s2), rgba(255,214,168,0.00) var(--s2o)),
    radial-gradient(farthest-side at var(--p3x) var(--p3y), rgba(206,232,232,0.70) 0%, rgba(206,232,232,0.00) var(--s3)),
    radial-gradient(farthest-side at var(--p4x) var(--p4y), rgba(200,170,255,0.65) 0%, rgba(200,170,255,0.00) var(--s4)),
    radial-gradient(closest-side at 50% 50%, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.86) 62%, rgba(255,255,255,0.00) 76%);
  filter: blur(6px) saturate(125%);
  animation:
    ${l1} 4.5s ease-in-out infinite alternate,
    ${l2} 5s ease-in-out infinite alternate,
    ${l3} 5.5s ease-in-out infinite alternate,
    ${l4} 6s ease-in-out infinite alternate,
    ${b1} 5s ease-in-out infinite alternate,
    ${b2} 5.5s ease-in-out infinite alternate,
    ${b3} 6s ease-in-out infinite alternate,
    ${b4} 6.5s ease-in-out infinite alternate;

  &::before {
    content: '';
    position: absolute;
    inset: -1vmin;
    border-radius: 50%;
    background: radial-gradient(farthest-side at 50% 50%, rgba(255,255,255,0) 92%, rgba(255,255,255,0.75) 97%, rgba(255,255,255,0) 100%);
    filter: blur(10px);
    opacity: 0.65;
    mix-blend-mode: screen;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -12vmin;
    border-radius: 50%;
    background: radial-gradient(farthest-side, rgba(255,255,255,0.85), rgba(255,255,255,0.15) 55%, rgba(255,255,255,0.00) 80%);
    filter: blur(22px);
    opacity: 0.9;
    /* retain inner rim */
    box-shadow: inset 0 0 0 2px rgba(255,255,255,0.85);
    pointer-events: none;
    mix-blend-mode: screen;
  }
`;

export default function Blob() {
  return (
    <Root>
      <GlobalProps />
      <BgLayer>
        <BlobMono />
      </BgLayer>
    </Root>
  );
}


