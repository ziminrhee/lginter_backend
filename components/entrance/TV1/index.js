import { useState, useEffect, useCallback } from "react";
import useSocketTV1 from "@/utils/hooks/useSocketTV1";
import * as S from './styles';

export default function TV1Controls() {
  const [keywords, setKeywords] = useState([]);
  const [tv2Color, setTv2Color] = useState('#FFD166');
  const unifiedFont = '\'Pretendard\', \'Pretendard Variable\', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif';


  const handleDisplayVoice = useCallback((data) => {
    console.log('📺 TV1 Component received entrance-new-voice:', data);
    const text = data.text || data.emotion || '알 수 없음';
    // 더 작은 타이포 (0.95rem ~ 1.30rem) + 단일 폰트/굵기
    const fontSize = (Math.random() * 0.35 + 0.95).toFixed(2);
    const fontFamily = unifiedFont;
    const fontStyle = 'normal';
    const fontWeight = 800;
    setKeywords(prev => [{
      id: Date.now() + Math.random(),
      text: text,
      fontSize: `${fontSize}rem`,
      fontFamily,
      fontStyle,
      fontWeight,
      timestamp: Date.now()
    }, ...prev].slice(0, 18)); // 최신이 위쪽/왼쪽부터, 최대 18개 유지
  }, [unifiedFont]);

  const handleDeviceDecision = useCallback((data) => {
    if (data?.device === 'sw2' && data.lightColor) setTv2Color(data.lightColor);
  }, []);

  const handleNewDecision = useCallback((msg) => {
    const env = msg?.env;
    if (!env) return;
    if ((msg?.target === 'tv2' || msg?.target === 'sw2') && env.lightColor) setTv2Color(env.lightColor);
  }, []);

  const { socket } = useSocketTV1({
    onEntranceNewVoice: handleDisplayVoice,
    onDeviceDecision: handleDeviceDecision,
    onDeviceNewDecision: handleNewDecision,
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
