import React, { useMemo } from "react";
import { useBlobVars } from "./blob/blob.logic";
import * as S from './styles';
import { BlobCircle } from "./blob/blob.styles";

export default function TV2Controls() {
  // 기본 env (컨트롤 타워 연동 전까지 임시)
  const env = useMemo(()=>({
    temp: 24, humidity: 38, lightColor: '#6EA7FF', music: '시원한 EDM',
    lightLabel: 'Blue Light',
    reasons: { temp:['사용자 평균 선호','최근 입력: 24°C'],
               humidity:['쾌적한 범위','최근 입력: 58%'],
               light:['안정감 제공','최근 입력: Yellow'],
               music:['에너지 유지','최근 입력: EDM'] },
    inputs: { temp:['24°C'], humidity:['58%'], light:['Yellow'], music:['EDM'] }
  }),[]);

  const cssVars = useBlobVars(env);

  return (
    <S.Root>
      <S.Header>
        <S.HeaderIcon>
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 6.5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 0 0 0-11z" stroke="white" strokeWidth="1.8"/><path d="M12 1v3M12 20v3M23 12h-3M4 12H1M19.1 4.9l-2.1 2.1M7 17l-2.1 2.1M19.1 19.1L17 17M7 7L4.9 4.9" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </S.HeaderIcon>
        <S.HeaderTitle>{env.lightLabel || 'Blue Light'}</S.HeaderTitle>
      </S.Header>
      <S.Content>
        <S.LeftPanel>
          <S.AngularSweep />
          <S.AngularSharp />
          <S.MusicRow>
            <S.MusicIcon>
              <svg viewBox="0 0 24 24" fill="none"><path d="M9 17a3 3 0 1 1-2.5-2.96V6.5l11-2V14a3 3 0 1 1-2 2.83V8.6l-6 1.1V17z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/></svg>
            </S.MusicIcon>
            <div>{env.music}</div>
          </S.MusicRow>
          <S.AlbumCard />
          <S.TrackTitle>Sunny Side Up</S.TrackTitle>
          <S.Artist>Victor Lundberg</S.Artist>
        </S.LeftPanel>
        <S.RightPanel style={cssVars}>
          <S.ClimateGroup>
            <S.ClimateRow>
              <S.ClimateIcon>
                <svg viewBox="0 0 24 24" fill="none"><path d="M10 14V5a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </S.ClimateIcon>
              <div>{env.temp}°C</div>
            </S.ClimateRow>
            <S.ClimateRow>
              <S.ClimateIcon>
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5C12 3.5 6 11 6 14.5a6 6 0 1 0 12 0c0-3.5-6-11-6-11z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/></svg>
              </S.ClimateIcon>
              <div>{env.humidity}%</div>
            </S.ClimateRow>
          </S.ClimateGroup>
          <S.BlobSpot>
            <BlobCircle style={{ '--main':'var(--p3-main)', '--a':'var(--p3-a)', '--b':'var(--p3-b)', ...cssVars, filter: 'saturate(1.2) blur(var(--blur,6px))' }} />
          </S.BlobSpot>
        </S.RightPanel>
      </S.Content>
    </S.Root>
  );
}
