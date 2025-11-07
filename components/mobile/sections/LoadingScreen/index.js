import { memo } from 'react';
import * as S from './styles';
import { keyframesCss } from '../styles/shared/keyframes.css.js';

const LoadingScreen = memo(function LoadingScreen() {
  return (
    <S.Root>
      <S.Spinner>
        <S.RingOuter />
        <S.RingInner />
      </S.Spinner>
      <S.Label>LG ThinQ AI 분석 중...</S.Label>
      <S.Sub>당신의 감정에 맞는 최적의 환경을 찾고 있어요 💭</S.Sub>
      <style jsx>{keyframesCss}</style>
    </S.Root>
  );
});

export default LoadingScreen;



