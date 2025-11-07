import { useState, useMemo } from "react";
import useSocketSW1 from "@/utils/hooks/useSocketSW1";
import * as S from './styles';
import { createSocketHandlers } from './logic';

export default function SW1Controls() {
  const [climateData, setClimateData] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);

  const handlers = useMemo(() => createSocketHandlers({ setClimateData, setParticipantCount }), [setClimateData, setParticipantCount]);

  const { socket } = useSocketSW1({ onDeviceDecision: handlers.onDeviceDecision });

  const computeMode = (humidity) => {
    if (humidity == null) return '';
    if (humidity >= 65) return '강력 제습';
    if (humidity >= 55) return '적정 제습';
    if (humidity >= 45) return '기본 제습';
    if (humidity >= 35) return '적정 가습';
    return '강력 가습';
  };

  const baseTemp = climateData?.temperature ?? 23;
  const baseHum = climateData?.humidity ?? 50;

  // animation and blobs removed per request

  return (
    <S.Root>
      <S.TopStatus>가족 구성원 4명을 위한 조율중...</S.TopStatus>
      <S.Stage>
        <S.CircleContainer>
          <S.BaseWhite />
          <S.GradientBlur />
        </S.CircleContainer>
        <S.CenterTextWrap>
          <S.CenterTemp>{`${baseTemp}°C`}</S.CenterTemp>
          <S.CenterMode>{computeMode(baseHum)}</S.CenterMode>
        </S.CenterTextWrap>
      </S.Stage>
    </S.Root>
  );
}




