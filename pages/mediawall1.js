import { useState, useEffect } from 'react';
import Head from 'next/head';
import useSocket from '../hooks/useSocket';
import NicknameCard from '../components/NicknameCard';

export default function MediaWall1() {
  const { socket, isConnected } = useSocket();
  const [nicknames, setNicknames] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new nicknames
    socket.on('display-new-name', (data) => {
      console.log('Received new nickname:', data);
      setNicknames((prev) => [...prev, data]);
    });

    return () => {
      socket.off('display-new-name');
    };
  }, [socket]);

  return (
    <>
      <Head>
        <title>MediaWall1 - Display</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="page-container">
        <div className={`status-indicator ${isConnected ? '' : 'disconnected'}`}>
          {isConnected ? '🟢 연결됨' : '🔴 연결 끊김'}
        </div>
        
        <div className="header">
          <h1>📺 MediaWall1</h1>
          <p className="subtitle">실시간 사용자 닉네임 표시</p>
        </div>
        
        <div className="nicknames-container">
          {nicknames.length === 0 ? (
            <div className="empty-state">닉네임이 표시될 공간입니다</div>
          ) : (
            nicknames.map((data, index) => (
              <NicknameCard key={`${data.uuid}-${index}`} data={data} />
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .page-container {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          min-height: 100vh;
          overflow: hidden;
        }
        
        .header {
          background: rgba(0, 0, 0, 0.3);
          padding: 30px;
          text-align: center;
          backdrop-filter: blur(10px);
        }
        
        .header h1 {
          color: white;
          font-size: 3em;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .header .subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.3em;
          margin-top: 10px;
        }
        
        .nicknames-container {
          padding: 40px;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
          align-items: flex-start;
          max-height: calc(100vh - 200px);
          overflow-y: auto;
        }
        
        .empty-state {
          text-align: center;
          color: white;
          padding: 80px 20px;
          font-size: 1.5em;
          opacity: 0.7;
        }
        
        .status-indicator {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 10px 20px;
          background: rgba(0, 255, 0, 0.2);
          border: 2px solid rgba(0, 255, 0, 0.5);
          border-radius: 20px;
          color: white;
          font-weight: 600;
          backdrop-filter: blur(10px);
          z-index: 1000;
        }
        
        .status-indicator.disconnected {
          background: rgba(255, 0, 0, 0.2);
          border-color: rgba(255, 0, 0, 0.5);
        }
      `}</style>
    </>
  );
}

