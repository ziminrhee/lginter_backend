import { useState, useEffect } from 'react';
import Head from 'next/head';
import GradientBackground from '../components/GradientBackground';
import QRCodeDisplay from '../components/QRCodeDisplay';
import IPConfig from '../components/IPConfig';

export default function SBM1() {
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    // Auto-generate QR code on page load with default IP
    const defaultUrl = `http://172.20.10.2:3000/mobile1`;
    setQrUrl(defaultUrl);
  }, []);

  const handleIPChange = (url) => {
    setQrUrl(url);
  };

  return (
    <>
      <Head>
        <title>SBM1 - LG StandByMe Display</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="page-container">
        <GradientBackground />
        
        <IPConfig onIPChange={handleIPChange} defaultIP="172.20.10.2" />
        
        <div className="container">
          <div className="main-text">
            QR코드 스캔을 통해<br />전시 관람을 시작하세요!
          </div>
          
          <QRCodeDisplay url={qrUrl} />
        </div>
        
        <div className="bottom-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          background: #f5f5f7;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          overflow: hidden;
          position: relative;
        }
        
        .container {
          text-align: center;
          padding: 60px 40px;
          position: relative;
          z-index: 10;
          max-width: 600px;
        }
        
        .main-text {
          font-size: 1.8em;
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 80px;
          line-height: 1.4;
          letter-spacing: -0.5px;
        }
        
        .bottom-icon {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }
        
        .bottom-icon svg {
          width: 28px;
          height: 28px;
          opacity: 0.6;
        }
      `}</style>
    </>
  );
}

