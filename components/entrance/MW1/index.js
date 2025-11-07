import { useState, useEffect, useCallback } from "react";
import useSocketMW1 from "@/utils/hooks/useSocketMW1";
import * as S from './styles';

export default function MW1Controls() {
  const [welcomeData, setWelcomeData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleDisplayVoice = useCallback((data) => {
    console.log('🎤 MW1 Component received entrance-new-voice:', data);
    setWelcomeData({
      name: data.userId || '손님',
      text: data.text,
      emotion: data.emotion
    });
    setIsVisible(true);
    
    // 8초 후 사라짐 (감정 표시가 있으므로 더 길게)
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setWelcomeData(null), 500); // 페이드아웃 후 데이터 클리어
    }, 8000);
  }, []);

  const { socket } = useSocketMW1({ onEntranceNewVoice: handleDisplayVoice });

  return (
    <S.Container>
      <S.BackgroundTopRight />
      <S.BackgroundBottomLeft />
      {!isVisible && (
        <S.DefaultTextWrap>
          <S.Title>Media Wall</S.Title>
          <S.Subtitle>입장을 기다리고 있습니다...</S.Subtitle>
        </S.DefaultTextWrap>
      )}

      {isVisible && welcomeData && (
        <S.WelcomeCard>
          <S.EmojiLarge>🎉</S.EmojiLarge>
          <S.WelcomeTitle>환영합니다!</S.WelcomeTitle>
          <S.WelcomeText>"{welcomeData.text || welcomeData.emotion}"</S.WelcomeText>
          {welcomeData.emotion && (
            <S.EmotionText>감정: {welcomeData.emotion}</S.EmotionText>
          )}
        </S.WelcomeCard>
      )}
    </S.Container>
  );
}
