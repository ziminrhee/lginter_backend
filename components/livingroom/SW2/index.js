import { useState, useEffect } from "react";
import useSocketSW2 from "@/utils/hooks/useSocketSW2";

export default function SW2Controls() {
  const { socket } = useSocketSW2();
  const [ambienceData, setAmbienceData] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState({ light: 'N/A', music: 'N/A' });

  useEffect(() => {
    if (!socket) {
      console.log('SW2 Component: Waiting for socket connection...');
      return;
    }

    console.log('SW2 Component: Socket ready, registering event listener');

    const handleDeviceDecision = (data) => {
      console.log('💡 SW2 received device-decision:', data);
      if (data.device === 'sw2') {
        console.log('✅ SW2: Data matched, updating state');
        setAmbienceData(data);
        if (data.assignedUsers) {
          setAssignedUsers(data.assignedUsers);
          console.log('👥 SW2: Assigned users:', data.assignedUsers);
        }
      } else {
        console.log('⏭️ SW2: Data not for this device, skipping');
      }
    };

    socket.on('device-decision', handleDeviceDecision);

    return () => {
      console.log('SW2 Component: Removing event listener');
      socket.off('device-decision', handleDeviceDecision);
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
            💡 조명 & 음악 제어
          </h1>
          <p style={{
            color: '#9333EA',
            fontSize: '1rem',
            opacity: 0.7,
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            Smart Ambience Controller SW2
          </p>

          {ambienceData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '15px',
                padding: '2rem',
                border: '2px solid #F3E8FF'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '15px',
                    background: ambienceData.lightColor,
                    boxShadow: `0 8px 24px ${ambienceData.lightColor}80`,
                    border: '3px solid white'
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '1rem',
                      color: '#9333EA',
                      opacity: 0.7,
                      marginBottom: '0.5rem'
                    }}>
                      💡 조명 색상
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#9333EA'
                    }}>
                      {ambienceData.lightColor}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#EC4899',
                      fontWeight: '600',
                      marginTop: '0.75rem',
                      padding: '0.75rem',
                      background: 'rgba(236, 72, 153, 0.1)',
                      borderRadius: '10px'
                    }}>
                      👤 {assignedUsers.light}
                    </div>
                  </div>
                </div>

                <div style={{
                  borderTop: '2px solid #F3E8FF',
                  paddingTop: '1.5rem'
                }}>
                  <div style={{
                    fontSize: '1rem',
                    color: '#9333EA',
                    opacity: 0.7,
                    marginBottom: '0.5rem'
                  }}>
                    🎵 재생 중인 음악
                  </div>
                  <div style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: '#9333EA',
                    lineHeight: '1.4'
                  }}>
                    {ambienceData.song}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#EC4899',
                    fontWeight: '600',
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    background: 'rgba(236, 72, 153, 0.1)',
                    borderRadius: '10px'
                  }}>
                    👤 {assignedUsers.music}
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
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>💡</div>
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
