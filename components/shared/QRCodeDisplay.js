import { useEffect, useRef } from 'react';

export default function QRCodeDisplay({ url }) {
  const qrcodeRef = useRef(null);
  const qrInstanceRef = useRef(null);

  useEffect(() => {
    // Dynamically load QRCode library
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
      script.async = true;
      script.onload = () => {
        generateQR();
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  useEffect(() => {
    if (url && typeof window !== 'undefined' && window.QRCode) {
      generateQR();
    }
  }, [url]);

  const generateQR = () => {
    if (!qrcodeRef.current || !url) return;

    // Clear previous QR code
    qrcodeRef.current.innerHTML = '';

    try {
      if (window.QRCode) {
        qrInstanceRef.current = new window.QRCode(qrcodeRef.current, {
          text: url,
          width: 250,
          height: 250,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: window.QRCode.CorrectLevel?.H || 2
        });
      }
    } catch (error) {
      console.error('QR code generation error:', error);
      qrcodeRef.current.innerHTML = '<p style="color: red;">QR 코드 생성 실패</p>';
    }
  };

  return (
    <div className="qrcode-container">
      <div ref={qrcodeRef} className="qrcode"></div>
      
      <style jsx>{`
        .qrcode-container {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05)
          );
          backdrop-filter: blur(30px) saturate(180%);
          -webkit-backdrop-filter: blur(30px) saturate(180%);
          padding: 30px;
          border-radius: 25px;
          display: inline-block;
          box-shadow: 
            0 8px 32px 0 rgba(31, 38, 135, 0.15),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 0 rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
          min-height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
          position: relative;
          overflow: hidden;
        }
        
        .qrcode-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s;
        }
        
        .qrcode-container:hover::before {
          left: 100%;
        }
        
        .qrcode-container:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 
            0 15px 60px 0 rgba(31, 38, 135, 0.25),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 0 rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        .qrcode {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 15px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
        }
        
        .qrcode :global(canvas),
        .qrcode :global(img) {
          display: block;
        }
      `}</style>
    </div>
  );
}

