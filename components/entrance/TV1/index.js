import { useState, useMemo } from "react";
import useSocketTV1 from "@/utils/hooks/useSocketTV1";
import * as S from './styles';
import { createSocketHandlers } from './logic';

export default function TV1Controls() {
  const [keywords, setKeywords] = useState([]);
  const [tv2Color, setTv2Color] = useState('#FFD166');
  const unifiedFont = '\'Pretendard\', \'Pretendard Variable\', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif';


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
