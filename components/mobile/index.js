import { useEffect } from 'react';
import Head from 'next/head';
import useSocket from '@/utils/hooks/useSocket';
import NicknameForm from '@/components/shared/NicknameForm';
import GradientBackground from '@/components/shared/GradientBackground';

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
            <h1>환영합니다!</h1>
            <p className="subtitle">닉네임을 입력하고 전시에 참여하세요</p>
          </div>
          
          <NicknameForm socket={socket} isConnected={isConnected} />
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
            rgba(255, 255, 255, 0.25),
            rgba(255, 255, 255, 0.15)
          );
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border-radius: 30px;
          padding: 50px 40px;
          box-shadow: 
            0 15px 60px 0 rgba(31, 38, 135, 0.15),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
            inset 0 -1px 0 0 rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
          position: relative;
          z-index: 10;
        }
        
        .container:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 20px 80px 0 rgba(31, 38, 135, 0.2),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 0 rgba(255, 255, 255, 0.2);
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        h1 {
          color: #1d1d1f;
          text-align: center;
          margin-bottom: 15px;
          font-size: 2.2em;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        
        .subtitle {
          text-align: center;
          color: #1d1d1f;
          margin-bottom: 0;
          font-size: 1em;
          line-height: 1.5;
          opacity: 0.8;
        }
        
        @media (min-width: 768px) {
          .container {
            max-width: 520px;
            padding: 60px 50px;
          }
          
          h1 {
            font-size: 2.6em;
          }
          
          .subtitle {
            font-size: 1.1em;
          }
        }
        
        @media (min-width: 1024px) {
          .container {
            max-width: 600px;
            padding: 70px 60px;
          }
          
          h1 {
            font-size: 3em;
          }
          
          .subtitle {
            font-size: 1.15em;
          }
        }
      `}</style>
    </>
  );
}
