import { useState, useEffect } from "react";
import useSocketMW1 from "@/utils/hooks/useSocketMW1";

export default function MW1Controls() {
  const { socket } = useSocketMW1();
  const [welcomeData, setWelcomeData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!socket) {
      console.log('MW1 Component: Waiting for socket connection...');
      return;
    }

    console.log('MW1 Component: Socket ready, registering event listener');

    const handleDisplayName = (data) => {
      console.log('🎉🎉🎉 MW1 Component received display-new-name:', data);
      setWelcomeData(data);
      setIsVisible(true);
      
      // 5초 후 사라짐
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setWelcomeData(null), 500); // 페이드아웃 후 데이터 클리어
      }, 5000);
    };

    // mobile-new-name 이벤트 수신
    socket.on('display-new-name', handleDisplayName);

    return () => {
      console.log('MW1 Component: Removing event listener');
      socket.off('display-new-name', handleDisplayName);
    };
  }, [socket]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #FCEAFE 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 배경 장식 */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />
      
      {/* 기본 텍스트 */}
      {!isVisible && (
        <div style={{
          textAlign: 'center',
          opacity: 0.5,
          transition: 'opacity 0.5s'
        }}>
          <h1 style={{
            fontSize: '3rem',
            background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            Media Wall
          </h1>
          <p style={{
            color: '#9333EA',
            fontSize: '1.2rem',
            opacity: 0.7
          }}>
            입장을 기다리고 있습니다...
          </p>
        </div>
      )}

      {/* 웰컴 메시지 */}
      {isVisible && welcomeData && (
        <div style={{
          textAlign: 'center',
          animation: 'fadeInScale 0.5s ease-out',
          padding: '3rem',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          boxShadow: '0 30px 80px rgba(147, 51, 234, 0.2)',
          border: '2px solid rgba(147, 51, 234, 0.2)',
          maxWidth: '800px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{
            fontSize: '3.5rem',
            background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            환영합니다!
          </h1>
          <p style={{
            fontSize: '2rem',
            color: '#9333EA',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            {welcomeData.name || '손님'}님
          </p>
          {welcomeData.meta?.mood && (
            <p style={{
              fontSize: '1.5rem',
              color: '#EC4899',
              opacity: 0.8
            }}>
              기분: {welcomeData.meta.mood}
            </p>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
