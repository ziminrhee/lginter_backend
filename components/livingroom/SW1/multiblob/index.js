import { useState, useEffect } from "react";
import useSocketSW1 from "@/utils/hooks/useSocketSW1";

export default function SW1Controls() {
  const { socket } = useSocketSW1();
  const [climateData, setClimateData] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    const seenUsers = new Set();

    const handleDeviceDecision = (data) => {
      if (data.device === 'sw1') {
        setClimateData({ temperature: data.temperature, humidity: data.humidity });
        if (data.assignedUsers) {
          Object.values(data.assignedUsers).forEach((u) => {
            if (u && u !== 'N/A') seenUsers.add(String(u));
          });
          setParticipantCount(seenUsers.size);
        }
      }
    };

    socket.on('device-decision', handleDeviceDecision);
    return () => {
      socket.off('device-decision', handleDeviceDecision);
    };
  }, [socket]);

  const computeMode = (humidity) => {
    if (humidity == null) return '';
    if (humidity >= 65) return '강력 제습';
    if (humidity >= 55) return '적정 제습';
    if (humidity >= 45) return '기본 제습';
    if (humidity >= 35) return '적정 가습';
    return '강력 가습';
  };

  const baseTemp = climateData?.temperature ?? 23;
  const baseHum = climateData?.humidity ?? 50;

  // animation and blobs removed per request

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      background: '#FFFFFF',
      fontFamily: 'Inter, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflow: 'hidden'
    }}>
      {/* 상단 진행 텍스트 - 조금 더 위로 */}
      <div style={{
        position: 'absolute',
        top: '5vh',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#334155',
        fontWeight: 600,
        letterSpacing: '-0.2px',
        textAlign: 'center',
        fontSize: 'clamp(14px, 2.0vmin, 24px)',
        textShadow: '0 2px 12px rgba(0,0,0,0.08)',
        pointerEvents: 'none',
        zIndex: 10
      }}>
        가족 구성원 4명을 위한 조율중...
      </div>

      {/* 스테이지: 블롭 제거 후 중앙 텍스트만 표시 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none'
      }}>
        {/* Group 1410167377 - 동일 원 크기 내 레이어 구성 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100vh * 5 / 7)',
          height: 'calc(100vh * 5 / 7)',
          borderRadius: '50%',
          zIndex: 0
        }}>
          {/* Ellipse 2793 - base white */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: '#FFFFFF'
          }} />

          {/* Ellipse 2694 - gradient with blur, scaled to 3012/3104 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(100% * 3012 / 3104)',
            height: 'calc(100% * 3012 / 3104)',
            borderRadius: '50%',
            background: 'radial-gradient(50.02% 50.02% at 50.02% 50.02%, #FFFFFF 34.13%, #FCCCC1 44.23%, #DDDBDD 79.81%, #FFC9E3 87.98%, #FFFFFF 100%)',
            filter: 'blur(50px)'
          }} />

        </div>

        {/* 중앙 텍스트 - 정확히 원 중심 배치 */}
        <div style={{
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 5
        }}>
          <div style={{
            fontSize: 'clamp(25px, 4.5vmin, 65px)',
            lineHeight: 1.08,
            fontWeight: 600,
            color: '#111827',
            textShadow: '0 3px 12px rgba(0,0,0,0.12)'
          }}>
            {`${baseTemp}°C`}
          </div>
          <div style={{
            marginTop: '0.6vmin',
            fontSize: 'clamp(25px, 4.5vmin, 65px)',
            fontWeight: 500,
            color: '#0F172A'
          }}>
            {computeMode(baseHum)}
          </div>
        </div>
      </div>
    </div>
  );
}




