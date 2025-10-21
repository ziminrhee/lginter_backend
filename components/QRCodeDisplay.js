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
          width: 300,
          height: 300,
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
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 40px;
          border-radius: 30px;
          display: inline-block;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          min-height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        
        .qrcode-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2);
        }
        
        .qrcode {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

