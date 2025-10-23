import { useState, useEffect } from 'react';
import Head from 'next/head';
import useSocket from '@/utils/hooks/useSocket';
import NicknameCard from '@/components/shared/NicknameCard';
import GradientBackground from '@/components/shared/GradientBackground';

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
        <GradientBackground />
        
        <div className="header">
          <h1>실시간 참여자</h1>
          <p className="subtitle">전시에 참여한 모든 분들을 환영합니다</p>
        </div>
        
        <div className="nicknames-container">
          {nicknames.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p>아직 참여자가 없습니다</p>
            </div>
          ) : (
            nicknames.map((data, index) => (
              <NicknameCard key={`${data.uuid}-${index}`} data={data} />
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .page-container {
          background: #f5f5f7;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.25),
            rgba(255, 255, 255, 0.15)
          );
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          padding: 40px 30px;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 10px 40px rgba(31, 38, 135, 0.1);
          position: relative;
          z-index: 10;
        }
        
        .header h1 {
          color: #1d1d1f;
          font-size: 3em;
          font-weight: 700;
          letter-spacing: -1px;
          margin: 0;
          margin-bottom: 12px;
        }
        
        .header .subtitle {
          color: #1d1d1f;
          opacity: 0.8;
          font-size: 1.3em;
          margin: 0;
          font-weight: 400;
        }
        
        .nicknames-container {
          padding: 60px 40px;
          display: flex;
          flex-wrap: wrap;
          gap: 25px;
          justify-content: center;
          align-items: flex-start;
          max-height: calc(100vh - 200px);
          overflow-y: auto;
          position: relative;
          z-index: 10;
        }
        
        .nicknames-container::-webkit-scrollbar {
          width: 8px;
        }
        
        .nicknames-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        .nicknames-container::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        
        .nicknames-container::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        
        .empty-state {
          text-align: center;
          color: #1d1d1f;
          padding: 100px 40px;
          width: 100%;
        }
        
        .empty-icon {
          font-size: 5em;
          margin-bottom: 20px;
          opacity: 0.6;
          animation: float 3s ease-in-out infinite;
        }
        
        .empty-state p {
          font-size: 1.8em;
          opacity: 0.7;
          font-weight: 500;
          margin: 0;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @media (max-width: 768px) {
          .header h1 {
            font-size: 2em;
          }
          
          .header .subtitle {
            font-size: 1em;
          }
          
          .nicknames-container {
            padding: 30px 20px;
            gap: 15px;
          }
          
          .empty-icon {
            font-size: 3em;
          }
          
          .empty-state p {
            font-size: 1.2em;
          }
        }
      `}</style>
    </>
  );
}
