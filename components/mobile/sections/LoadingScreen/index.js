import { memo } from 'react';
import * as S from './styles';
import { keyframesCss } from '../../styles/shared/keyframes.css.js';

const LoadingScreen = memo(function LoadingScreen() {
  return (
    <div style={S.root}>
      <div style={S.spinner}>
        <div style={S.ringOuter} />
        <div style={S.ringInner} />
      </div>
      <p style={S.label}>
        LG ThinQ AI 분석 중...
      </p>
      <p style={S.sub}>
        당신의 감정에 맞는 최적의 환경을 찾고 있어요 💭
      </p>
      <style jsx>{keyframesCss}</style>
    </div>
  );
});

export default LoadingScreen;



