import { memo } from 'react';
import { colors, fonts } from '../styles/tokens';

const LoadingScreen = memo(function LoadingScreen() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3rem 2rem',
      background: 'linear-gradient(135deg, #F3E8FF 0%, #FCEAFE 100%)',
      borderRadius: '15px'
    }}>
      <div style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        margin: '0 auto 1.5rem'
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '4px solid #F3E8FF',
          borderTop: '4px solid #9333EA',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '60px',
          height: '60px',
          top: '10px',
          left: '10px',
          border: '3px solid #F3E8FF',
          borderBottom: '3px solid #EC4899',
          borderRadius: '50%',
          animation: 'spin 1.5s linear infinite reverse'
        }} />
      </div>
      <p style={{
        color: colors.accentPrimary,
        fontFamily: fonts.ui,
        fontSize: '1.2rem',
        fontWeight: 700,
        marginBottom: '0.5rem',
        animation: 'fadeInOut 2s ease-in-out infinite'
      }}>
        LG ThinQ AI 분석 중...
      </p>
      <p style={{
        color: colors.accentPrimary,
        fontFamily: fonts.ui,
        fontSize: '0.9rem',
        opacity: 0.7
      }}>
        당신의 감정에 맞는 최적의 환경을 찾고 있어요 💭
      </p>
    </div>
  );
});

export default LoadingScreen;


