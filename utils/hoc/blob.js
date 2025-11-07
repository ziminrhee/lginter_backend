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
  0%   { --p1x: 8%;  --p1y: 12%; }
  50%  { --p1x: 92%; --p1y: 88%; }
  100% { --p1x: 6%;  --p1y: 94%; }
`;
const l2 = keyframes`
  0%   { --p2x: 92%; --p2y: 84%; }
  50%  { --p2x: 12%; --p2y: 16%; }
  100% { --p2x: 88%; --p2y: 10%; }
`;
const l3 = keyframes`
  0%   { --p3x: 15%; --p3y: 85%; }
  50%  { --p3x: 85%; --p3y: 15%; }
  100% { --p3x: 20%; --p3y: 80%; }
`;
const l4 = keyframes`
  0%   { --p4x: 80%; --p4y: 20%; }
  50%  { --p4x: 20%; --p4y: 80%; }
  100% { --p4x: 90%; --p4y: 10%; }
`;
const b1 = keyframes`
  0%   { --s1: 8%;  --s1o: 32%; }
  50%  { --s1: 80%; --s1o: 96%; }
  100% { --s1: 10%; --s1o: 28%; }
`;
const b2 = keyframes`
  0%   { --s2: 10%; --s2o: 36%; }
  50%  { --s2: 86%; --s2o: 98%; }
  100% { --s2: 12%; --s2o: 34%; }
`;
const b3 = keyframes`
  0%   { --s3: 14%; --s3o: 40%; }
  50%  { --s3: 90%; --s3o: 98%; }
  100% { --s3: 16%; --s3o: 38%; }
`;
const b4 = keyframes`
  0%   { --s4: 12%; --s4o: 34%; }
  50%  { --s4: 88%; --s4o: 96%; }
  100% { --s4: 14%; --s4o: 32%; }
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
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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
    ${l1} 2.00s linear infinite alternate,
    ${l2} 2.33s linear infinite alternate,
    ${l3} 2.67s linear infinite alternate,
    ${l4} 3.00s linear infinite alternate,
    ${b1} 2.33s linear infinite alternate,
    ${b2} 2.67s linear infinite alternate,
    ${b3} 3.00s linear infinite alternate,
    ${b4} 3.33s linear infinite alternate;

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


