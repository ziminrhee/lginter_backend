import { useState, useEffect } from "react";
import useSocketTV1 from "@/utils/hooks/useSocketTV1";

export default function TV1Controls() {
  const { socket } = useSocketTV1();
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    if (!socket) {
      console.log('TV1 Component: Waiting for socket connection...');
      return;
    }

    console.log('TV1 Component: Socket ready, registering event listener');

    const handleDisplayName = (data) => {
      console.log('📺📺📺 TV1 Component received display-new-name:', data);
      const mood = data.meta?.mood || '알 수 없음';
      setKeywords(prev => [...prev, {
        id: data.uuid || Date.now(),
        mood: mood,
        timestamp: Date.now()
      }].slice(-30)); // 최근 30개만 유지
    };

    socket.on('display-new-name', handleDisplayName);

    return () => {
      console.log('TV1 Component: Removing event listener');
      socket.off('display-new-name', handleDisplayName);
    };
  }, [socket]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #FCEAFE 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '1rem 2rem',
        boxShadow: '0 10px 30px rgba(147, 51, 234, 0.15)',
        border: '1px solid rgba(147, 51, 234, 0.1)',
        zIndex: 10
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '700',
          margin: 0
        }}>
          감정 키워드 💭
        </h2>
      </div>

      {keywords.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          opacity: 0.5
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💭</div>
          <p style={{
            color: '#9333EA',
            fontSize: '1.5rem',
            fontWeight: '500'
          }}>
            감정 키워드가 아래부터 쌓입니다
          </p>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'flex-end',
          alignContent: 'flex-end',
          padding: '2rem',
          minHeight: '60vh'
        }}>
          {keywords.map((item, index) => {
            // 랜덤 크기 생성 (40px ~ 120px)
            const size = Math.floor(Math.random() * 80) + 40;
            // 랜덤 색상 (핑크-퍼플 계열)
            const colors = [
              'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
              'linear-gradient(135deg, #9333EA 0%, #A855F7 100%)',
              'linear-gradient(135deg, #C084FC 0%, #E9D5FF 100%)',
              'linear-gradient(135deg, #DB2777 0%, #EC4899 100%)',
              'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)'
            ];
            const randomColor = colors[index % colors.length];

            return (
              <div
                key={item.id}
                style={{
                  background: randomColor,
                  borderRadius: '50%',
                  width: `${size}px`,
                  height: `${size}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: `${size * 0.25}px`,
                  boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)',
                  animation: 'bubbleUp 0.8s ease-out',
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'backwards',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textAlign: 'center',
                  padding: '0.5rem',
                  wordBreak: 'keep-all'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(147, 51, 234, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(147, 51, 234, 0.3)';
                }}
              >
                {item.mood}
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes bubbleUp {
          from {
            opacity: 0;
            transform: translateY(100px) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
