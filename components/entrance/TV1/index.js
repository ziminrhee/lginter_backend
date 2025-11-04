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

    const handleDisplayVoice = (data) => {
      console.log('📺 TV1 Component received entrance-new-voice:', data);
      const text = data.text || data.emotion || '알 수 없음';
      // 랜덤 폰트 크기 (3rem ~ 6rem)
      const fontSize = Math.random() * 3 + 3;
      setKeywords(prev => [...prev, {
        id: Date.now() + Math.random(),
        text: text,
        fontSize: `${fontSize}rem`,
        timestamp: Date.now()
      }].slice(-15)); // 최근 15개까지 유지 (화면에 차곡차곡 쌓임)
    };

    socket.on('entrance-new-voice', handleDisplayVoice);

    return () => {
      console.log('TV1 Component: Removing event listener');
      socket.off('entrance-new-voice', handleDisplayVoice);
    };
  }, [socket]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '3rem',
      position: 'relative',
      overflow: 'auto'
    }}>
      <div style={{
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #E5E7EB'
      }}>
        <h2 style={{
          fontSize: '2rem',
          color: '#000000',
          fontWeight: '700',
          margin: 0
        }}>
          감정 키워드 💭
        </h2>
      </div>

      {keywords.length === 0 ? (
        <div style={{
          textAlign: 'left',
          padding: '2rem 0',
          opacity: 0.4
        }}>
          <p style={{
            color: '#000000',
            fontSize: '1.5rem',
            fontWeight: '400'
          }}>
            키워드가 위에서부터 차곡차곡 쌓입니다...
          </p>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {keywords.map((kw, index) => (
            <div
              key={kw.id}
              style={{
                fontSize: kw.fontSize,
                fontWeight: '900',
                color: '#000000',
                lineHeight: '1.2',
                animation: 'fadeIn 0.5s ease-out',
                wordBreak: 'break-word'
              }}
            >
              {kw.text}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
