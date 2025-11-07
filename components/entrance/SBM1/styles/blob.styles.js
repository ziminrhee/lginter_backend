import styled from 'styled-components';

export const BlobLayer = styled.div`
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
`;

export const Blob = styled.div`
  position: absolute;
  left: 18vw; top: 28vh; width: 82vmin; height: 82vmin; border-radius: 50%;
  clip-path: circle(50% at 50% 50%);

  /* animated blob variables */
  @property --p1x { syntax: '<percentage>'; inherits: false; initial-value: 72%; }
  @property --p1y { syntax: '<percentage>'; inherits: false; initial-value: 52%; }
  @property --p2x { syntax: '<percentage>'; inherits: false; initial-value: 46%; }
  @property --p2y { syntax: '<percentage>'; inherits: false; initial-value: 68%; }
  @property --p3x { syntax: '<percentage>'; inherits: false; initial-value: 32%; }
  @property --p3y { syntax: '<percentage>'; inherits: false; initial-value: 28%; }
  @property --p4x { syntax: '<percentage>'; inherits: false; initial-value: 58%; }
  @property --p4y { syntax: '<percentage>'; inherits: false; initial-value: 28%; }
  @property --s1  { syntax: '<percentage>'; inherits: false; initial-value: 30%; }
  @property --s1o { syntax: '<percentage>'; inherits: false; initial-value: 60%; }
  @property --s2  { syntax: '<percentage>'; inherits: false; initial-value: 44%; }
  @property --s2o { syntax: '<percentage>'; inherits: false; initial-value: 80%; }
  @property --s3  { syntax: '<percentage>'; inherits: false; initial-value: 56%; }
  @property --s3o { syntax: '<percentage>'; inherits: false; initial-value: 72%; }
  @property --s4  { syntax: '<percentage>'; inherits: false; initial-value: 40%; }
  @property --s4o { syntax: '<percentage>'; inherits: false; initial-value: 70%; }

  background:
    radial-gradient(farthest-side at var(--p1x) var(--p1y), rgba(255,120,170,0.90) 0%, rgba(255,120,170,0.48) var(--s1), rgba(255,120,170,0.00) var(--s1o)),
    radial-gradient(farthest-side at var(--p2x) var(--p2y), rgba(255,214,168,0.92) 0%, rgba(255,214,168,0.55) var(--s2), rgba(255,214,168,0.00) var(--s2o)),
    radial-gradient(farthest-side at var(--p3x) var(--p3y), rgba(206,232,232,0.70) 0%, rgba(206,232,232,0.00) var(--s3)),
    radial-gradient(farthest-side at var(--p4x) var(--p4y), rgba(200,170,255,0.65) 0%, rgba(200,170,255,0.00) var(--s4)),
    radial-gradient(closest-side at 50% 50%, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.86) 62%, rgba(255,255,255,0.00) 76%);
  filter: blur(6px) saturate(125%);
  will-change: transform;
  animation:
    l1 10s ease-in-out infinite alternate,
    l2 12s ease-in-out infinite alternate,
    l3 14s ease-in-out infinite alternate,
    l4 16s ease-in-out infinite alternate,
    b1 12s ease-in-out infinite alternate,
    b2 14s ease-in-out infinite alternate,
    b3 16s ease-in-out infinite alternate,
    b4 18s ease-in-out infinite alternate;
  @media (prefers-reduced-motion: reduce){ animation: none; }

  &::before{ content: ''; position: absolute; inset: -1vmin; border-radius: 50%; background: radial-gradient(farthest-side at 50% 50%, rgba(255,255,255,0) 92%, rgba(255,255,255,0.75) 97%, rgba(255,255,255,0) 100%); filter: blur(10px); opacity: 0.65; mix-blend-mode: screen; pointer-events: none; }
  &::after{ content: ''; position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 2px rgba(255,255,255,0.85); pointer-events: none; mix-blend-mode: screen; }

  @keyframes l1 { 0%{--p1x:74%;--p1y:50%;} 50%{--p1x:56%;--p1y:40%;} 100%{--p1x:68%;--p1y:66%;} }
  @keyframes l2 { 0%{--p2x:44%;--p2y:70%;} 50%{--p2x:60%;--p2y:56%;} 100%{--p2x:38%;--p2y:76%;} }
  @keyframes l3 { 0%{--p3x:30%;--p3y:26%;} 50%{--p3x:46%;--p3y:36%;} 100%{--p3x:24%;--p3y:22%;} }
  @keyframes l4 { 0%{--p4x:60%;--p4y:26%;} 50%{--p4x:74%;--p4y:34%;} 100%{--p4x:52%;--p4y:18%;} }
  @keyframes b1 { 0%{--s1:22%;--s1o:52%;} 50%{--s1:42%;--s1o:72%;} 100%{--s1:24%;--s1o:54%;} }
  @keyframes b2 { 0%{--s2:38%;--s2o:74%;} 50%{--s2:58%;--s2o:88%;} 100%{--s2:40%;--s2o:76%;} }
  @keyframes b3 { 0%{--s3:46%;--s3o:66%;} 50%{--s3:64%;--s3o:78%;} 100%{--s3:48%;--s3o:68%;} }
  @keyframes b4 { 0%{--s4:36%;--s4o:64%;} 50%{--s4:56%;--s4o:80%;} 100%{--s4:38%;--s4o:66%;} }
`;

/* placements */
export const BlobTR = styled(Blob)`
  left: auto; right: calc(-1 * var(--kiss)); top: calc(-1 * var(--kiss)); width: 74vmin; height: 74vmin;
  --p1x: 40%; --p1y: 68%;
  transform: scaleY(-1);
  @keyframes bobFloatTR { 0%{ transform: scaleY(-1) translate3d(0,0,0);} 50%{ transform: scaleY(-1) translate3d(-0.6vmin,-0.8vmin,0);} 100%{ transform: scaleY(-1) translate3d(0,0,0);} }
  animation: bobFloatTR 10s ease-in-out infinite;
`;

export const BlobBL = styled(Blob)`
  left: calc(-1 * var(--kiss)); top: auto; bottom: calc(-1 * var(--kiss)); width: 134vmin; height: 134vmin;
  --p1x: 66%; --p1y: 36%;
  @keyframes bobFloatBL { 0%{ transform: translate3d(0,0,0);} 50%{ transform: translate3d(0.8vmin,0.8vmin,0);} 100%{ transform: translate3d(0,0,0);} }
  animation: bobFloatBL 12s ease-in-out infinite;
`;


