import { useState, useEffect, useRef } from "react";
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
        timestamp: Date.now(),
        // 각 키워드마다 고유한 랜덤 속성 저장
        size: Math.random() * 2.5 + 2, // 2rem ~ 4.5rem
        x: Math.random() * 80 + 10, // 10% ~ 90%
        color: ['#EC4899', '#9333EA', '#C084FC', '#DB2777', '#7C3AED', '#F472B6', '#A855F7'][Math.floor(Math.random() * 7)],
        rotation: Math.random() * 30 - 15 // -15deg ~ 15deg
      }].slice(-40)); // 최근 40개까지 유지
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
      position: 'relative',
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
          opacity: 0.5,
          marginTop: '10rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💭</div>
          <p style={{
            color: '#9333EA',
            fontSize: '1.5rem',
            fontWeight: '500'
          }}>
            감정 키워드가 위에서 떨어져 쌓입니다
          </p>
        </div>
      ) : (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80vh',
          pointerEvents: 'none'
        }}>
          {keywords.map((item, index) => (
            <FallingStackingText 
              key={item.id}
              text={item.mood}
              index={index}
              totalCount={keywords.length}
              size={item.size}
              x={item.x}
              color={item.color}
              rotation={item.rotation}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 떨어져서 쌓이는 텍스트 컴포넌트
function FallingStackingText({ text, index, totalCount, size, x, color, rotation }) {
  const [position, setPosition] = useState({ y: -100 });
  const [settled, setSettled] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    // 약간의 딜레이 후 떨어지기 시작
    const fallTimer = setTimeout(() => {
      // 바닥에서부터 쌓이는 높이 계산 (px 단위)
      // 최근 것일수록 위에 쌓임
      const stackHeightPx = (totalCount - index - 1) * (size * 16 * 0.6); // rem을 px로 (1rem = 16px), 겹침을 위해 0.6 배수
      // 화면 안에만 존재하도록 제한 (화면 하단 20px ~ 화면 높이의 80%)
      const maxHeight = window.innerHeight * 0.8;
      const finalY = -Math.min(stackHeightPx, maxHeight) + 20; // 20px는 바닥 여백
      
      setPosition({ y: finalY });
      
      // 떨어지는 시간 후 안착
      setTimeout(() => {
        setSettled(true);
      }, 1500);
    }, index * 100); // 순차적으로 떨어짐
    
    return () => clearTimeout(fallTimer);
  }, [index, totalCount, size]);
  
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: `${x}%`,
        bottom: '20px', // 화면 하단 고정
        transform: `translateX(-50%) translateY(${position.y}px) rotate(${settled ? rotation : 0}deg)`,
        color: color,
        fontSize: `${size}rem`,
        fontWeight: '900',
        textShadow: `
          0 0 15px ${color}80,
          0 0 30px ${color}40,
          3px 3px 6px rgba(0, 0, 0, 0.3)
        `,
        transition: settled 
          ? 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)' // 안착 시 바운스
          : 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)', // 떨어질 때 탄성
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        userSelect: 'none',
        opacity: 0.95,
        animation: settled 
          ? `wobble ${3 + index * 0.2}s ease-in-out infinite, breathe ${4 + index * 0.3}s ease-in-out infinite`
          : 'spin 1.5s ease-out',
        zIndex: totalCount - index,
        maxWidth: '90vw', // 좌우로 화면 밖으로 안 나가도록
        overflow: 'visible'
      }}
    >
      {text}
      
      <style jsx>{`
        @keyframes wobble {
          0%, 100% {
            transform: translateX(-50%) translateY(${position.y}px) rotate(${rotation - 3}deg);
          }
          25% {
            transform: translateX(-50%) translateY(${position.y - 5}px) rotate(${rotation + 2}deg);
          }
          50% {
            transform: translateX(-50%) translateY(${position.y}px) rotate(${rotation + 3}deg);
          }
          75% {
            transform: translateX(-50%) translateY(${position.y - 5}px) rotate(${rotation - 2}deg);
          }
        }
        
        @keyframes breathe {
          0%, 100% {
            font-size: ${size}rem;
          }
          50% {
            font-size: ${size * 1.05}rem;
          }
        }
        
        @keyframes spin {
          0% {
            transform: translateX(-50%) translateY(-100vh) rotate(0deg) scale(0.5);
            opacity: 0;
          }
          60% {
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(${position.y}px) rotate(${rotation * 2}deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
