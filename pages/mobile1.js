import { useEffect } from 'react';
import Head from 'next/head';
import useSocket from '../hooks/useSocket';
import NicknameForm from '../components/NicknameForm';

export default function Mobile1() {
  const { socket, isConnected } = useSocket();

  return (
    <>
      <Head>
        <title>Mobile1 - User Interface</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="page-container">
        <div className="container">
          <h1>📱 Mobile1</h1>
          <p className="subtitle">환영합니다! 닉네임을 입력해주세요</p>
          
          <NicknameForm socket={socket} isConnected={isConnected} />
          
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 서버 연결됨' : '🔴 서버 연결 끊김'}
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        
        .container {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 20px;
          padding: 40px 30px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        
        h1 {
          color: #667eea;
          text-align: center;
          margin-bottom: 10px;
          font-size: 2em;
        }
        
        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
          font-size: 0.95em;
        }
        
        .connection-status {
          margin-top: 20px;
          text-align: center;
          font-size: 0.85em;
          padding: 8px;
          border-radius: 8px;
        }
        
        .connection-status.connected {
          color: #155724;
          background: #d4edda;
        }
        
        .connection-status.disconnected {
          color: #721c24;
          background: #f8d7da;
        }
      `}</style>
    </>
  );
}

