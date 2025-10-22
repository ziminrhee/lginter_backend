import { useState, useEffect } from "react";
import useSocketTV1 from "@/utils/hooks/useSocketTV1";

export default function TV1Controls() {
  const { socket } = useSocketTV1();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!socket) {
      console.log('TV1 Component: Waiting for socket connection...');
      return;
    }

    console.log('TV1 Component: Socket ready, registering event listener');

    const handleDisplayName = (data) => {
      console.log('📺📺📺 TV1 Component received display-new-name:', data);
      setEntries(prev => [{
        id: data.uuid || Date.now(),
        name: data.name || '익명',
        mood: data.meta?.mood || '알 수 없음',
        timestamp: new Date().toLocaleTimeString('ko-KR')
      }, ...prev].slice(0, 20)); // 최근 20개만 유지
    };

    // mobile-new-name 이벤트 수신
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
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '25px',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(147, 51, 234, 0.15)',
          border: '1px solid rgba(147, 51, 234, 0.1)',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            실시간 참여자
          </h1>
          <p style={{
            color: '#9333EA',
            fontSize: '1rem',
            opacity: 0.7
          }}>
            총 {entries.length}명이 입장했습니다
          </p>
        </div>

        {entries.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '3rem',
            textAlign: 'center',
            border: '2px dashed rgba(147, 51, 234, 0.2)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>👥</div>
            <p style={{
              color: '#9333EA',
              fontSize: '1.2rem',
              opacity: 0.6
            }}>
              아직 입장한 참여자가 없습니다
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
          }}>
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  boxShadow: '0 10px 30px rgba(147, 51, 234, 0.1)',
                  border: '1px solid rgba(147, 51, 234, 0.1)',
                  animation: 'slideInFromTop 0.5s ease-out',
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'backwards',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(147, 51, 234, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(147, 51, 234, 0.1)';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem'
                }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    color: '#9333EA',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    {entry.name}
                  </h3>
                  <span style={{
                    fontSize: '0.85rem',
                    color: '#9333EA',
                    opacity: 0.5
                  }}>
                    {entry.timestamp}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{
                    fontSize: '1.5rem'
                  }}>
                    💭
                  </span>
                  <p style={{
                    fontSize: '1rem',
                    color: '#EC4899',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {entry.mood}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <style jsx>{`
          @keyframes slideInFromTop {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
