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
      console.log('📺📺📺 TV1 Component received new-name:', data);
      const mood = data.meta?.mood || '알 수 없음';
      setKeywords(prev => [...prev, {
        id: data.uuid || Date.now(),
        mood: mood,
        timestamp: Date.now()
      }].slice(-30)); // 최근 30개까지 유지
    };

    socket.on('new-name', handleDisplayName);

    return () => {
      console.log('TV1 Component: Removing event listener');
      socket.off('new-name', handleDisplayName);
    };
  }, [socket]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
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
            감정 키워드가 중력으로 떨어져 쌓입니다
          </p>
        </div>
      ) : (
        <FallingTextCanvas keywords={keywords} />
      )}
    </div>
  );
}

// 물리 엔진 기반 떨어지는 텍스트 캔버스
function FallingTextCanvas({ keywords }) {
  const containerRef = useRef(null);
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 간단한 물리 엔진 구현
    const COLORS = ['#6B21A8', '#7C3AED', '#5B21B6', '#4C1D95']; // 진한 퍼플 그레이
    const GRAVITY = 0.8;
    const BOUNCE = 0.4;
    const FRICTION = 0.98;
    
    const newItems = keywords.map((kw, index) => {
      const fontSize = Math.random() * 80 + 40; // 40px ~ 120px (큰 타이포)
      const existingItem = items.find(item => item.id === kw.id);
      
      if (existingItem) return existingItem;
      
      return {
        id: kw.id,
        text: kw.mood,
        x: Math.random() * (window.innerWidth - 200) + 100,
        y: -fontSize - 50,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        rotation: (Math.random() - 0.5) * 30,
        angularVelocity: (Math.random() - 0.5) * 0.5,
        fontSize: fontSize,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        width: fontSize * kw.mood.length * 0.6,
        height: fontSize,
        settled: false
      };
    });
    
    setItems(newItems);
    
    let animationFrame;
    const animate = () => {
      setItems(prevItems => {
        const containerHeight = window.innerHeight;
        const containerWidth = window.innerWidth;
        
        return prevItems.map(item => {
          if (item.settled && item.y >= containerHeight - item.height - 50) {
            return item;
          }
          
          // 중력 적용
          let newVy = item.vy + GRAVITY;
          let newY = item.y + newVy;
          let newVx = item.vx * FRICTION;
          let newX = item.x + newVx;
          let newRotation = item.rotation + item.angularVelocity;
          let newAngularVelocity = item.angularVelocity * 0.99;
          let settled = item.settled;
          
          // 바닥 충돌
          if (newY >= containerHeight - item.height - 50) {
            newY = containerHeight - item.height - 50;
            newVy = -newVy * BOUNCE;
            newAngularVelocity = newAngularVelocity * 0.8;
            
            if (Math.abs(newVy) < 1) {
              newVy = 0;
              settled = true;
            }
          }
          
          // 좌우 벽 충돌
          if (newX < 0) {
            newX = 0;
            newVx = -newVx * BOUNCE;
          } else if (newX > containerWidth - item.width) {
            newX = containerWidth - item.width;
            newVx = -newVx * BOUNCE;
          }
          
          // 다른 아이템과 충돌 (강력한 겹침 방지)
          prevItems.forEach(other => {
            if (other.id !== item.id) {
              // 실제 텍스트 박스 기반 충돌 감지
              const itemLeft = newX;
              const itemRight = newX + item.width;
              const itemTop = newY;
              const itemBottom = newY + item.height;
              
              const otherLeft = other.x;
              const otherRight = other.x + other.width;
              const otherTop = other.y;
              const otherBottom = other.y + other.height;
              
              // AABB (Axis-Aligned Bounding Box) 충돌 감지
              const overlapX = Math.min(itemRight, otherRight) - Math.max(itemLeft, otherLeft);
              const overlapY = Math.min(itemBottom, otherBottom) - Math.max(itemTop, otherTop);
              
              if (overlapX > 0 && overlapY > 0) {
                // 겹침 발생! 강력하게 밀어내기
                const centerDx = (newX + item.width / 2) - (other.x + other.width / 2);
                const centerDy = (newY + item.height / 2) - (other.y + other.height / 2);
                
                // 겹친 방향으로 밀어내기
                if (Math.abs(centerDx) > Math.abs(centerDy)) {
                  // X축 방향으로 밀기
                  if (centerDx > 0) {
                    newX = otherRight + 5; // 오른쪽으로
                  } else {
                    newX = otherLeft - item.width - 5; // 왼쪽으로
                  }
                  newVx = -newVx * BOUNCE;
                } else {
                  // Y축 방향으로 밀기
                  if (centerDy > 0) {
                    newY = otherBottom + 5; // 아래로
                  } else {
                    newY = otherTop - item.height - 5; // 위로
                  }
                  newVy = -newVy * BOUNCE;
                }
                
                // 충돌 시 회전도 조정
                newAngularVelocity = (Math.random() - 0.5) * 0.3;
              }
            }
          });
          
          return {
            ...item,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: newRotation,
            angularVelocity: newAngularVelocity,
            settled: settled
          };
        });
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [keywords]);
  
  return (
    <div ref={containerRef} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      {items.map(item => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            left: `${item.x}px`,
            top: `${item.y}px`,
            fontSize: `${item.fontSize}px`,
            fontWeight: '900',
            color: item.color,
            transform: `rotate(${item.rotation}deg)`,
            textShadow: `0 2px 4px rgba(0, 0, 0, 0.3)`,
            whiteSpace: 'nowrap',
            userSelect: 'none',
            transition: item.settled ? 'none' : 'transform 0.05s linear',
            willChange: 'transform'
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
