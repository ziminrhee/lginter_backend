import { useState, useEffect } from "react";
import useSocketSW1 from "@/utils/hooks/useSocketSW1";

export default function SW1Controls() {
  const { socket } = useSocketSW1();
  const [climateData, setClimateData] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('device-new-decision', (data) => {
      console.log('SW1 received data:', data);
      if (data.device === 'sw1') {
        setClimateData(data);
      }
    });

    return () => {
      socket.off('device-new-decision');
    };
  }, [socket]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #FCEAFE 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '25px',
          padding: '3rem 2rem',
          boxShadow: '0 20px 60px rgba(147, 51, 234, 0.15)',
          border: '1px solid rgba(147, 51, 234, 0.1)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            🌡️ 온도 & 습도 제어
          </h1>
          <p style={{
            color: '#9333EA',
            fontSize: '1rem',
            opacity: 0.7,
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            Smart Weather Controller SW1
          </p>

          {climateData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #F3E8FF 0%, #FCEAFE 100%)',
                borderRadius: '15px',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#9333EA',
                  opacity: 0.7,
                  marginBottom: '0.5rem'
                }}>
                  현재 사용자
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#9333EA'
                }}>
                  {climateData.name}님
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '15px',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  border: '2px solid #F3E8FF'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌡️</div>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: '700',
                    color: '#9333EA',
                    marginBottom: '0.5rem'
                  }}>
                    {climateData.temperature}°C
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    color: '#9333EA',
                    opacity: 0.7
                  }}>
                    설정 온도
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '15px',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  border: '2px solid #F3E8FF'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💧</div>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: '700',
                    color: '#9333EA',
                    marginBottom: '0.5rem'
                  }}>
                    {climateData.humidity}%
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    color: '#9333EA',
                    opacity: 0.7
                  }}>
                    설정 습도
                  </div>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                borderRadius: '15px',
                padding: '1.5rem',
                textAlign: 'center',
                color: 'white'
              }}>
                <div style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                  시스템 상태
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>
                  ✅ 활성화됨
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '15px',
              border: '2px dashed rgba(147, 51, 234, 0.3)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🌡️</div>
              <p style={{
                color: '#9333EA',
                fontSize: '1.2rem',
                opacity: 0.6
              }}>
                설정 대기 중...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
