import { useEffect } from 'react';
import Head from 'next/head';
import useSocket from '../hooks/useSocket';
import NicknameForm from '../components/NicknameForm';
import GradientBackground from '../components/GradientBackground';

export default function Mobile1() {
  const { socket, isConnected } = useSocket();

  return (
    <>
      <Head>
        <title>Mobile1 - User Interface</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="page-container">
        <GradientBackground />
        
        <div className="container">
          <div className="header">
            <div className="icon">👤</div>
            <h1>환영합니다!</h1>
            <p className="subtitle">닉네임을 입력하고 전시에 참여하세요</p>
          </div>
          
          <NicknameForm socket={socket} isConnected={isConnected} />
          
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            {isConnected ? '서버 연결됨' : '서버 연결 끊김'}
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          background: #f5f5f7;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }
        
        .container {
          width: 100%;
          max-width: 420px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95),
            rgba(255, 255, 255, 0.85)
          );
          backdrop-filter: blur(30px) saturate(180%);
          -webkit-backdrop-filter: blur(30px) saturate(180%);
          border-radius: 30px;
          padding: 40px 35px;
          box-shadow: 
            0 15px 60px 0 rgba(31, 38, 135, 0.2),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 0 rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.25);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
          position: relative;
          z-index: 10;
        }
        
        .container:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 20px 80px 0 rgba(31, 38, 135, 0.3),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.6),
            inset 0 -1px 0 0 rgba(255, 255, 255, 0.3);
        }
        
        .header {
          text-align: center;
          margin-bottom: 35px;
        }
        
        .icon {
          font-size: 4em;
          margin-bottom: 15px;
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        h1 {
          color: #1d1d1f;
          text-align: center;
          margin-bottom: 12px;
          font-size: 2em;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        
        .subtitle {
          text-align: center;
          color: #6e6e73;
          margin-bottom: 0;
          font-size: 1em;
          line-height: 1.5;
        }
        
        .connection-status {
          margin-top: 25px;
          text-align: center;
          font-size: 0.9em;
          padding: 12px 20px;
          border-radius: 15px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .connection-status.connected {
          color: #0a5f0a;
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          border: 1px solid rgba(195, 230, 203, 0.5);
        }
        
        .connection-status.connected .status-dot {
          background: #28a745;
          box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
        }
        
        .connection-status.disconnected {
          color: #721c24;
          background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
          border: 1px solid rgba(245, 198, 203, 0.5);
        }
        
        .connection-status.disconnected .status-dot {
          background: #dc3545;
          box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
        }
        
        @media (min-width: 768px) {
          .container {
            max-width: 520px;
            padding: 50px 45px;
          }
          
          .icon {
            font-size: 5em;
          }
          
          h1 {
            font-size: 2.5em;
          }
          
          .subtitle {
            font-size: 1.1em;
          }
        }
        
        @media (min-width: 1024px) {
          .container {
            max-width: 600px;
            padding: 60px 55px;
          }
          
          h1 {
            font-size: 2.8em;
          }
          
          .subtitle {
            font-size: 1.15em;
          }
        }
      `}</style>
    </>
  );
}

