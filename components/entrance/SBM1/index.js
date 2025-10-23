import { useEffect, useRef } from "react";

export default function SBM1Controls() {
  const qrRef = useRef(null);

  useEffect(() => {
    // QR코드 라이브러리 로드
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.async = true;
    script.onload = () => {
      if (qrRef.current && window.QRCode) {
        qrRef.current.innerHTML = '';
        new window.QRCode(qrRef.current, {
          text: `http://192.168.45.33:3000/mobile`,
          width: 280,
          height: 280,
          colorDark: '#9333EA',
          colorLight: '#FAF5FF',
          correctLevel: window.QRCode?.CorrectLevel?.H || 2
        });
      }
    };
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #FCEAFE 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        padding: '3rem',
        boxShadow: '0 20px 60px rgba(147, 51, 234, 0.15)',
        border: '1px solid rgba(147, 51, 234, 0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem',
          fontWeight: '700'
        }}>
          환영합니다!
        </h1>
        <p style={{
          color: '#9333EA',
          fontSize: '1.1rem',
          marginBottom: '2rem',
          opacity: 0.8
        }}>
          QR코드를 스캔하여 참여하세요
        </p>
        
        <div ref={qrRef} style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '20px',
          display: 'inline-block',
          boxShadow: '0 10px 30px rgba(147, 51, 234, 0.1)',
          border: '2px solid #F3E8FF'
        }} />
        
        <p style={{
          marginTop: '2rem',
          color: '#9333EA',
          fontSize: '0.95rem',
          opacity: 0.7
        }}>
          📱 모바일로 스캔해주세요
        </p>
      </div>
    </div>
  );
}
