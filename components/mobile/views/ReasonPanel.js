import styled from 'styled-components';
import { fonts } from '../sections/styles/tokens';

const ReasonRoot = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  padding: 2rem;
  box-sizing: border-box;
  overflow: auto;
`;

const ReasonInner = styled.div`
  width: 86%;
  margin: 0 auto;
  word-break: keep-all;
  overflow-wrap: break-word;
  text-align: center;
  font-family: ${fonts.ui};
  color: #111;
  opacity: ${(p) => (p.$fade ? 0 : 1)};
  filter: ${(p) => (p.$fade ? 'blur(6px)' : 'none')};
  transition: opacity 1200ms ease, filter 1200ms ease;
`;

const ReasonParagraph = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  font-weight: ${(p) => (p.$strong ? 800 : 500)};
  margin-top: ${(p) => (p.$first ? 0 : '1.5rem')};
`;

const Caret = styled.span`
  display: inline-block;
  width: 2px;
  height: 1.2rem;
  background: #000;
  margin-left: 3px;
  animation: blink 1s infinite;
  vertical-align: middle;
`;

const Bold = styled.span`
  font-weight: 800;
`;

export default function ReasonPanel({ typedReason, fullTypedText, paragraphs, showHighlights, fadeText }) {
  if (!fullTypedText) return null;
  const typed = typedReason || '';
  const total = fullTypedText ? fullTypedText.length : 0;
  const isTyping = Boolean(fullTypedText) && typed.length < total;
  const newlineLen = 2; // "\n\n"
  let remaining = typed.length;
  let activeIdx = 0;
  const displayBlocks = paragraphs.map((para, i) => {
    if (remaining <= 0) return '';
    const take = Math.min(para.length, remaining);
    const out = para.slice(0, take);
    remaining -= take;
    if (remaining > 0 && i < paragraphs.length - 1) {
      remaining = Math.max(0, remaining - newlineLen);
    }
    if (remaining > 0) activeIdx = i + 1; else activeIdx = i;
    return out;
  });
  const keywordRegex = /(\d+°C|\d+%|#[A-Fa-f0-9]{6}|온도|습도|조명|음악|색상)/g;

  return (
    <ReasonRoot>
      <ReasonInner $fade={fadeText}>
        {displayBlocks.map((block, idx) => (
          <ReasonParagraph key={idx} $first={idx === 0} $strong={idx === 0}>
            {showHighlights
              ? block.split(keywordRegex).map((part, i) => (
                  keywordRegex.test(part)
                    ? <Bold key={i}>{part}</Bold>
                    : <span key={i}>{part}</span>
                ))
              : block}
            {isTyping && idx === activeIdx ? <Caret /> : null}
          </ReasonParagraph>
        ))}
      </ReasonInner>
    </ReasonRoot>
  );
}


