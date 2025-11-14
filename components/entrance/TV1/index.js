import { useState, useMemo, useEffect } from "react";
import useSocketTV1 from "@/utils/hooks/useSocketTV1";
import * as S from './styles';
import { createSocketHandlers } from './logic';

export default function TV1Controls() {
  const [keywords, setKeywords] = useState([]);
  const [tv2Color, setTv2Color] = useState('#FFD166');
  const [dotCount, setDotCount] = useState(0);
  const unifiedFont = '\'Pretendard\', \'Pretendard Variable\', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif';

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDotCount((count) => (count >= 3 ? 0 : count + 1));
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  const handlers = useMemo(
    () => createSocketHandlers({ setKeywords, unifiedFont, setTv2Color }),
    [setKeywords, unifiedFont, setTv2Color]
  );

  const { socket } = useSocketTV1({
    onEntranceNewVoice: handlers.onEntranceNewVoice,
    onDeviceDecision: handlers.onDeviceDecision,
    onDeviceNewDecision: handlers.onDeviceNewDecision,
  });

  return (
    <S.Root $fontFamily={unifiedFont}>
      <S.TopText $fontFamily={unifiedFont}>
        <S.Bold>오늘</S.Bold>
        <span>의 감정들은</span>
        <S.Dots aria-hidden="true">
          <S.Dot $visible={dotCount >= 1}>.</S.Dot>
          <S.Dot $visible={dotCount >= 2}>.</S.Dot>
          <S.Dot $visible={dotCount >= 3}>.</S.Dot>
        </S.Dots>
      </S.TopText>
      <S.ContentBox $fontFamily={unifiedFont}>흥미로움</S.ContentBox>
      <div className="pill-wrap">
        {keywords.map((kw) => (
          <div
            key={kw.id}
            className="pill"
          >
            <span className="pill-text">{kw.text}</span>
          </div>
        ))}
      </div>
    </S.Root>
  );
}
