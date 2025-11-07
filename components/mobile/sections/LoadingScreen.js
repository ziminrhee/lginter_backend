import { memo } from 'react';
import { root as rootStyle, spinner as spinnerStyle, ringOuter, ringInner, label as labelStyle, sub as subStyle } from '../modules/loading/loadingScreen.styles';
import { keyframesCss } from '../modules/shared/keyframes.css.js';

const LoadingScreen = memo(function LoadingScreen() {
  return (
    <div style={rootStyle}>
      <div style={spinnerStyle}>
        <div style={ringOuter} />
        <div style={ringInner} />
      </div>
      <p style={labelStyle}>
        LG ThinQ AI 분석 중...
      </p>
      <p style={subStyle}>
        당신의 감정에 맞는 최적의 환경을 찾고 있어요 💭
      </p>
      <style jsx>{keyframesCss}</style>
    </div>
  );
});

export default LoadingScreen;


