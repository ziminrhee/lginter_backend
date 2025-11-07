import React, { useMemo } from "react";
import { BlobBackground } from "./blob/blob.ui";
import { useBlobVars } from "./blob/blob.logic";
import { TextOverlay } from "./text/text.ui";
import { useTextRotation } from "./text/text.logic";
import * as S from './styles';

export default function TV2Controls() {
  // 기본 env (컨트롤 타워 연동 전까지 임시)
  const env = useMemo(()=>({
    temp: 24, humidity: 58, lightColor: '#FFD166', music: '시원한 EDM',
    reasons: { temp:['사용자 평균 선호','최근 입력: 24°C'],
               humidity:['쾌적한 범위','최근 입력: 58%'],
               light:['안정감 제공','최근 입력: Yellow'],
               music:['에너지 유지','최근 입력: EDM'] },
    inputs: { temp:['24°C'], humidity:['58%'], light:['Yellow'], music:['EDM'] }
  }),[]);

  const cssVars = useBlobVars(env);
  const text = useTextRotation(env);

  return (
    <S.Root>
      <BlobBackground cssVars={cssVars} />
      <TextOverlay panels={text.panels} />
    </S.Root>
  );
}
