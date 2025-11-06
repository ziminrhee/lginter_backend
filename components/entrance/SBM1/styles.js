import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: #FFFAF5; /* 미색 화이트 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 4vh 4vw;
  position: relative;
  overflow: hidden;
  /* control how close blobs sit in corners (kissing) */
  --kiss: 9vmin;
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 3vh;
  padding: 6vh 5vw;
  box-shadow: 0 2vh 6vh rgba(147, 51, 234, 0.15);
  border: 1px solid rgba(147, 51, 234, 0.1);
  text-align: center;
  max-width: 70vw;
  position: relative;
  z-index: 1;
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
  border-radius: 2vh;
  display: inline-block;
  box-shadow: 0 1vh 3vh rgba(147, 51, 234, 0.1);
  border: 2px solid #F3E8FF;
  width: 20vw; height: 20vw; min-width: 200px; min-height: 200px;
  padding: 1.5vh;
  > svg { width: 100%; height: 100%; display: block; }
`;

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

  &::before{
    content: '';
    position: absolute; inset: -1vmin; border-radius: 50%;
    background: radial-gradient(farthest-side at 50% 50%, rgba(255,255,255,0) 92%, rgba(255,255,255,0.75) 97%, rgba(255,255,255,0) 100%);
    filter: blur(10px); opacity: 0.65; mix-blend-mode: screen; pointer-events: none;
  }
  &::after{
    content: '';
    position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 2px rgba(255,255,255,0.85);
    pointer-events: none; mix-blend-mode: screen;
  }

  @keyframes l1 { 0%{--p1x:74%;--p1y:50%;} 50%{--p1x:56%;--p1y:40%;} 100%{--p1x:68%;--p1y:66%;} }
  @keyframes l2 { 0%{--p2x:44%;--p2y:70%;} 50%{--p2x:60%;--p2y:56%;} 100%{--p2x:38%;--p2y:76%;} }
  @keyframes l3 { 0%{--p3x:30%;--p3y:26%;} 50%{--p3x:46%;--p3y:36%;} 100%{--p3x:24%;--p3y:22%;} }
  @keyframes l4 { 0%{--p4x:60%;--p4y:26%;} 50%{--p4x:74%;--p4y:34%;} 100%{--p4x:52%;--p4y:18%;} }
  @keyframes b1 { 0%{--s1:22%;--s1o:52%;} 50%{--s1:42%;--s1o:72%;} 100%{--s1:24%;--s1o:54%;} }
  @keyframes b2 { 0%{--s2:38%;--s2o:74%;} 50%{--s2:58%;--s2o:88%;} 100%{--s2:40%;--s2o:76%;} }
  @keyframes b3 { 0%{--s3:46%;--s3o:66%;} 50%{--s3:64%;--s3o:78%;} 100%{--s3:48%;--s3o:68%;} }
  @keyframes b4 { 0%{--s4:36%;--s4o:64%;} 50%{--s4:56%;--s4o:80%;} 100%{--s4:38%;--s4o:66%;} }
`;

/* Same blob, two placements (don't change style, just position/size) */
export const BlobTR = styled(Blob)`
  left: auto; right: calc(-1 * var(--kiss)); top: calc(-1 * var(--kiss)); width: 74vmin; height: 74vmin; /* bigger */
  /* orient pink lobe toward center (QR side) */
  --p1x: 40%; --p1y: 68%;
  /* flip vertical orientation without rotating */
  transform: scaleY(-1);
  @keyframes bobFloatTR { 0%{ transform: scaleY(-1) translate3d(0,0,0);} 50%{ transform: scaleY(-1) translate3d(-0.6vmin,-0.8vmin,0);} 100%{ transform: scaleY(-1) translate3d(0,0,0);} }
  animation:
    l1 4.5s ease-in-out infinite alternate,
    l2 5s ease-in-out infinite alternate,
    l3 5.5s ease-in-out infinite alternate,
    l4 6s ease-in-out infinite alternate,
    b1 5s ease-in-out infinite alternate,
    b2 5.5s ease-in-out infinite alternate,
    b3 6s ease-in-out infinite alternate,
    b4 6.5s ease-in-out infinite alternate,
    bobFloatTR 10s ease-in-out infinite;
`;
export const BlobBL = styled(Blob)`
  left: calc(-1 * var(--kiss)); top: auto; bottom: calc(-1 * var(--kiss)); width: 134vmin; height: 134vmin; /* bigger */
  /* orient pink lobe toward center (QR side) */
  --p1x: 66%; --p1y: 36%;
  @keyframes bobFloatBL { 0%{ transform: translate3d(0,0,0);} 50%{ transform: translate3d(0.8vmin,0.8vmin,0);} 100%{ transform: translate3d(0,0,0);} }
  animation:
    l1 4.5s ease-in-out infinite alternate,
    l2 5s ease-in-out infinite alternate,
    l3 5.5s ease-in-out infinite alternate,
    l4 6s ease-in-out infinite alternate,
    b1 5s ease-in-out infinite alternate,
    b2 5.5s ease-in-out infinite alternate,
    b3 6s ease-in-out infinite alternate,
    b4 6.5s ease-in-out infinite alternate,
    bobFloatBL 12s ease-in-out infinite;
`;

export const TopMessage = styled.h2`
  position: absolute;
  /* responsive sizing based on viewport */
  width: clamp(280px, 60vw, 1173px);
  left: 50%; transform: translateX(-50%);
  top: clamp(6vh, 12vh, 16vh);
  height: clamp(64px, 10.5vw, 190px);
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: clamp(28px, 6vw, 110px);
  line-height: clamp(36px, 7.4vw, 130px);
  text-align: center;
  color: #000000;
  margin: 0; z-index: 1;
  white-space: pre-line;
`;

export const QRFloat = styled.div`
  position: absolute; top: 58vh; left: 50%; transform: translate(-50%, -50%);
  width: var(--qr-size, 25vw); height: var(--qr-size, 25vw); min-width: 200px; min-height: 200px; /* responsive var with fallback */
  display:flex; align-items:center; justify-content:center; z-index: 1;
  /* only QR visible */
  background: transparent; border: 0; border-radius: 0; box-shadow: none;
  > svg { width: 100%; height: 100%; display: block; }
`;

export const FuronMark = styled.div`
  position: absolute;
  width: clamp(28px, 4.5vw, 82px);
  height: clamp(27px, 4.4vw, 81px);
  left: calc(50% - (clamp(28px, 4.5vw, 82px))/2 - min(29vw, 560px));
  /* Support both top-fixed and bottom-fixed placement via CSS vars */
  top: var(--furon-top, auto);
  bottom: var(--furon-bottom, 3.5vh);
  background-image: url(/image.png);
  background-size: contain; background-repeat: no-repeat; background-position: center;
  mix-blend-mode: overlay;
  pointer-events: none;
  transform-origin: 50% 100%;
  @keyframes tiltSpin { 0%{ transform: perspective(600px) rotateX(55deg) rotateZ(0deg); } 100%{ transform: perspective(600px) rotateX(55deg) rotateZ(360deg); } }
  animation: tiltSpin 22s linear infinite;
  z-index: 1;
`;

