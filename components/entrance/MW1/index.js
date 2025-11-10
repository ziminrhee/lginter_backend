import { useState, useMemo } from "react";
import useSocketMW1 from "@/utils/hooks/useSocketMW1";
import * as S from './styles';
import { createSocketHandlers } from './logic';

export default function MW1Controls() {
  const [welcomeData, setWelcomeData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const handlers = useMemo(() => createSocketHandlers({ setWelcomeData, setIsVisible }), [setWelcomeData, setIsVisible]);
  const { socket } = useSocketMW1({ onEntranceNewVoice: handlers.onEntranceNewVoice });

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
