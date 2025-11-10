import { useMemo, useState } from "react";
import useSocketMV2 from "@/utils/hooks/useSocketMV2";
import * as S from "./styles";
import { createSocketHandlers } from "./logic";

export default function MV2Display() {
  const [messageState, setMessageState] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const handlers = useMemo(
    () =>
      createSocketHandlers({
        setMessage: setMessageState,
        activateMessage: setIsActive,
      }),
    []
  );

  useSocketMV2({ onEntranceNewVoice: handlers.onEntranceNewVoice });

  return (
    <S.Container>
      <S.Background />
      <S.Content>
        {!isActive && (
          <S.DefaultMessage>
            <span>MV2</span>
            <small>감정 기반 공간 연출 대기 중...</small>
          </S.DefaultMessage>
        )}

        {isActive && messageState?.message && (
          <S.Marquee key={messageState.timestamp}>
            <S.MarqueeInner>
              <span>{messageState.message}</span>
              <span aria-hidden="true">{messageState.message}</span>
              <span aria-hidden="true">{messageState.message}</span>
            </S.MarqueeInner>
          </S.Marquee>
        )}
      </S.Content>
    </S.Container>
  );
}


