import { useState, useEffect } from "react";
import useSocketTV2 from "@/utils/hooks/useSocketTV2";

export default function TV2Controls() {
  const { socket } = useSocketTV2();
  const [aggregatedData, setAggregatedData] = useState({
    temperature: 22,
    humidity: 50,
    lightColor: '#FFFFFF',
    song: 'N/A',
    assignedUsers: {
      temperature: 'N/A',
      humidity: 'N/A',
      light: 'N/A',
      music: 'N/A'
    }
  });

  useEffect(() => {
    if (!socket) {
      console.log('TV2 Component: Waiting for socket connection...');
      return;
    }

    console.log('TV2 Component: Socket ready, registering event listener');

    const handleDeviceDecision = (data) => {
      console.log('📺 TV2 received device-decision:', data);
      
      if (data.device === 'sw1') {
        console.log('✅ TV2: Updating SW1 data (temperature & humidity)');
        setAggregatedData(prev => ({
          ...prev,
          temperature: data.temperature,
          humidity: data.humidity,
          assignedUsers: {
            ...prev.assignedUsers,
            temperature: data.assignedUsers?.temperature || 'N/A',
            humidity: data.assignedUsers?.humidity || 'N/A'
          }
        }));
      } else if (data.device === 'sw2') {
        console.log('✅ TV2: Updating SW2 data (light & music)');
        setAggregatedData(prev => ({
          ...prev,
          lightColor: data.lightColor,
          song: data.song,
          assignedUsers: {
            ...prev.assignedUsers,
            light: data.assignedUsers?.light || 'N/A',
            music: data.assignedUsers?.music || 'N/A'
          }
        }));
      }
    };

    socket.on('device-decision', handleDeviceDecision);

    return () => {
      console.log('TV2 Component: Removing event listener');
      socket.off('device-decision', handleDeviceDecision);
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
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            📊 통합 대시보드
          </h1>
          <p style={{
            color: '#9333EA',
            fontSize: '1rem',
            opacity: 0.7,
            textAlign: 'center'
          }}>
            Smart Home Aggregated View - TV2
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* 온도 카드 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(147, 51, 234, 0.1)',
            border: '2px solid #F3E8FF',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌡️</div>
            <div style={{
              fontSize: '1rem',
              color: '#9333EA',
              opacity: 0.7,
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              온도
            </div>
            <div style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: '#9333EA',
              marginBottom: '0.5rem'
            }}>
              {aggregatedData.temperature}°C
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#EC4899',
              fontWeight: '600',
              padding: '0.75rem',
              background: 'rgba(236, 72, 153, 0.1)',
              borderRadius: '10px',
              marginTop: '1rem'
            }}>
              👤 {aggregatedData.assignedUsers.temperature}
            </div>
          </div>

          {/* 습도 카드 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(147, 51, 234, 0.1)',
            border: '2px solid #F3E8FF',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💧</div>
            <div style={{
              fontSize: '1rem',
              color: '#9333EA',
              opacity: 0.7,
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              습도
            </div>
            <div style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: '#9333EA',
              marginBottom: '0.5rem'
            }}>
              {aggregatedData.humidity}%
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#EC4899',
              fontWeight: '600',
              padding: '0.75rem',
              background: 'rgba(236, 72, 153, 0.1)',
              borderRadius: '10px',
              marginTop: '1rem'
            }}>
              👤 {aggregatedData.assignedUsers.humidity}
            </div>
          </div>

          {/* 조명 카드 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(147, 51, 234, 0.1)',
            border: '2px solid #F3E8FF',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💡</div>
            <div style={{
              fontSize: '1rem',
              color: '#9333EA',
              opacity: 0.7,
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              조명 색상
            </div>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '15px',
              background: aggregatedData.lightColor,
              boxShadow: `0 8px 24px ${aggregatedData.lightColor}80`,
              border: '3px solid white',
              margin: '1rem auto'
            }} />
            <div style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              color: '#9333EA',
              marginTop: '1rem'
            }}>
              {aggregatedData.lightColor}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#EC4899',
              fontWeight: '600',
              padding: '0.75rem',
              background: 'rgba(236, 72, 153, 0.1)',
              borderRadius: '10px',
              marginTop: '1rem'
            }}>
              👤 {aggregatedData.assignedUsers.light}
            </div>
          </div>

          {/* 음악 카드 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(147, 51, 234, 0.1)',
            border: '2px solid #F3E8FF',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎵</div>
            <div style={{
              fontSize: '1rem',
              color: '#9333EA',
              opacity: 0.7,
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              재생 중인 음악
            </div>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#9333EA',
              marginTop: '1rem',
              lineHeight: '1.4',
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {aggregatedData.song}
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#EC4899',
              fontWeight: '600',
              padding: '0.75rem',
              background: 'rgba(236, 72, 153, 0.1)',
              borderRadius: '10px',
              marginTop: '1rem'
            }}>
              👤 {aggregatedData.assignedUsers.music}
            </div>
          </div>
        </div>

        {/* 시스템 상태 */}
        <div style={{
          background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
          borderRadius: '20px',
          padding: '1.5rem',
          marginTop: '2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            fontSize: '1rem',
            opacity: 0.9,
            marginBottom: '0.5rem'
          }}>
            🔄 시스템 상태
          </div>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>
            모든 디바이스 정상 작동 중
          </div>
          <div style={{
            fontSize: '0.9rem',
            opacity: 0.8,
            marginTop: '0.5rem'
          }}>
            15초마다 자동으로 사용자 우선순위 재계산
          </div>
        </div>
      </div>
    </div>
  );
}
