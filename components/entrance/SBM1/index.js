import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export default function SBM1Controls() {
  const qrRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const makeQr = (base) => {
      const url = `${base}/mobile`;
      QRCode.toString(url, {
      type: 'svg',
      errorCorrectionLevel: 'H',
    width: 280,
      margin: 2,
      color: { dark: '#9333EA', light: '#FAF5FF' }
      }).then(svg => {
        if (!mounted || !qrRef.current) return;
        qrRef.current.innerHTML = svg;
      }).catch((err) => {
        console.error('QR generation failed:', err);
        if (qrRef.current) {
          qrRef.current.textContent = 'QR 생성 실패';
        }
      });
    };

    // 우선순위: /api/network-ip → window.location
    fetch('/api/network-ip')
      .then((r) => r.ok ? r.json() : Promise.reject(new Error('network-ip failed')))
      .then((data) => {
        const base = data?.baseUrl || `${window.location.protocol}//${window.location.host}`;
        makeQr(base);
      })
      .catch(() => {
        const fallback = `${window.location.protocol}//${window.location.host}`;
        makeQr(fallback);
      });

    return () => {
      mounted = false;
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
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
           모바일로 스캔해주세요:D
        </p>
      </div>
    </div>
  );
}
