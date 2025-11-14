import styled, { keyframes, createGlobalStyle } from 'styled-components';

export const Root = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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

export const TopStatus = styled.div`
  position: absolute;
  top: 5vh;
  left: 50%;
  transform: translateX(-50%);
  color: #334155;
  font-weight: 600;
  letter-spacing: -0.2px;
  text-align: center;
  font-size: clamp(25px, 3.6vmin, 43px);
  text-shadow: 0 2px 12px rgba(0,0,0,0.08);
  pointer-events: none;
  z-index: 10;
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

/* Full-bleed background image for selected Figma frame */
export const FrameBg = styled.div`
  position: absolute;
  inset: 0;
  background-image: ${({ $url }) => ($url
    ? `url(${$url})`
    : `radial-gradient(60vmin 60vmin at 25% 25%, rgba(255, 129, 171, 0.28), transparent 60%),
       radial-gradient(70vmin 70vmin at 80% 55%, rgba(255, 190, 120, 0.26), transparent 62%),
       radial-gradient(68vmin 68vmin at 20% 80%, rgba(147, 51, 234, 0.20), transparent 65%)`
    )};
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.8;
  z-index: 0;
`;

/* === Mobile blob motion (adapted) ===================================== */
export const BlobMotionCss = createGlobalStyle`
  @property --orbit-angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
  @property --start-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
  @property --end-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
  @property --feather-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
  @property --blur-wobble { syntax: '<length>'; inherits: true; initial-value: 0px; }

  @keyframes ringPulse {
    0%, 100% {
      --start-wobble: calc(0% - var(--start));
      --end-wobble: 0%;
      --feather-wobble: 0%;
      --blur-wobble: calc(0px - var(--blur));
    }
    50% {
      --start-wobble: calc(90% - var(--start));
      --end-wobble: 0%;
      --feather-wobble: 5%;
      --blur-wobble: calc(120px - var(--blur));
    }
  }

  .blob {
    position: relative;
    border-radius: 50%;
    background: none;
    isolation: isolate;
    --start-anim: clamp(0%, calc(var(--start) + var(--start-wobble)), 90%);
    --end-anim: clamp(0%, calc(var(--end) + var(--end-wobble)), 100%);
    --feather-anim: clamp(0%, calc(var(--feather) + var(--feather-wobble)), 25%);
    animation: ringPulse 6s ease-in-out infinite;
  }

  .blob::before,
  .blob::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }

  .blob::before {
    /* Colorless: affect only the backdrop; add near-transparent fill to ensure rendering */
    background: rgba(255, 255, 255, 0.001);
    backdrop-filter: blur(var(--inner-blur));
    -webkit-backdrop-filter: blur(var(--inner-blur));
    -webkit-mask: radial-gradient(
      circle at var(--center-x) var(--center-y),
      #000 0 calc(var(--start-anim) - var(--feather-anim)),
      transparent calc(var(--start-anim) + var(--feather-anim))
    );
            mask: radial-gradient(
      circle at var(--center-x) var(--center-y),
      #000 0 calc(var(--start-anim) - var(--feather-anim)),
      transparent calc(var(--start-anim) + var(--feather-anim))
    );
  }

  .blob::after {
    /* Colorless dynamic ring using only backdrop effects; tiny fill ensures effect applies */
    background: rgba(255, 255, 255, 0.001);
    backdrop-filter: blur(calc(var(--blur) + var(--blur-wobble))) saturate(1.02) brightness(1.03);
    -webkit-backdrop-filter: blur(calc(var(--blur) + var(--blur-wobble))) saturate(1.02) brightness(1.03);
    -webkit-mask: radial-gradient(
      circle at var(--center-x) var(--center-y),
      transparent 0 calc(var(--start-anim) - var(--feather-anim)),
      #000 var(--start-anim) var(--end-anim),
      transparent calc(var(--end-anim) + var(--feather-anim))
    );
            mask: radial-gradient(
      circle at var(--center-x) var(--center-y),
      transparent 0 calc(var(--start-anim) - var(--feather-anim)),
      #000 var(--start-anim) var(--end-anim),
      transparent calc(var(--end-anim) + var(--feather-anim))
    );
  }
`;

export const MotionLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1; /* above bg, below labels and cover */
  pointer-events: none;
`;

export const MotionBlobWrap = styled.div`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  transform: translate(-50%, -50%);
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border-radius: 50%;
`;

export const MotionBlob = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

export const CenterImage = styled.img`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(905px * 1.1);
  height: calc(905px * 1.1);
  object-fit: cover;
  border-radius: 100px;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.28);
  z-index: 3;
`;

export const CaptionWrap = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: calc(40% + 22vmin); /* position relative to small album card */
  text-align: center;
  pointer-events: none;
  z-index: 6;
`;

export const HeadText = styled.div`
  font-family: Pretendard, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 600; /* Semi Bold */
  font-size: clamp(28px, 4.8vmin, 96px);
  color: #111827;
  letter-spacing: 0.02em;
`;

export const SubText = styled.div`
  margin-top: 0.9rem; /* more space between head and sub text */
  font-family: Pretendard, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 400; /* Regular */
  font-size: clamp(16px, 2.6vmin, 56px);
  color: #374151;
  letter-spacing: 0.02em;
`;

/* Blob center labels over background */
export const LabelsLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 7; /* above album card and captions to ensure visibility */
`;

const LabelBase = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  font-family: Pretendard, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 400;
  font-size: clamp(16px, 2.6vmin, 56px); /* match SubText size */
  color: #818181;
  opacity: 0.7;
  text-align: center;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 8px rgba(0,0,0,0.22);
`;

export const LabelA = styled(LabelBase)`
  top: 20%;
  left: 28%;
`;

export const LabelB = styled(LabelBase)`
  top: 74%;
  left: 21%;
`;

export const LabelC = styled(LabelBase)`
  top: 70%;
  left: 80%;
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

/* === Compact album card (square) ========================================= */
export const AlbumCard = styled.div`
  --album-size: min(28vmin, 360px);
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: var(--album-size);
  height: var(--album-size);
  border-radius: 28px;
  background: white;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.18);
  z-index: 4;
  overflow: hidden;
`;

export const AlbumImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const AlbumPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: white;
`;


