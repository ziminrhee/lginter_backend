import { useState, useEffect } from 'react';
import Head from 'next/head';
import GradientBackground from '@/components/shared/GradientBackground';
import QRCodeDisplay from '@/components/shared/QRCodeDisplay';

export default function SBM1() {
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    // Auto-generate QR code on page load with default IP
    const defaultUrl = `http://172.20.10.2:3000/mobile`;
    setQrUrl(defaultUrl);
  }, []);

  return (
    <>
      <Head>
        <title>SBM1 - LG StandByMe Display</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="page-container">
        <GradientBackground />
        
        <div className="container">
          <div className="main-text">
            QR코드 스캔을 통해<br />전시 관람을 시작하세요!
          </div>
          
          <QRCodeDisplay url={qrUrl} />
        </div>
        
        <div className="bottom-icon">
          <img 
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADjklEQVR4nO2ZW2gcVRjHf7ubTZq0aZO0Tbw0Xqo+iA8+iKhFELyBD4qKYkVQfBB88MFLvYCKF0TwUkFFUVARRPFSH0RRvIGKF7xUjZe0Nm3SNE3TpE2TZnezs+PJ/Ac+hs3szO7O7KY2+cGXzDlzvv/3nfOdc86ZhRVWWOEyRgfQB+wHPgOOAKeAk8Ap4AjwGbAf6AM6L6WAfcAHwEngHDAHlIFKlb8ycA74ADgA9F4KIXuBt4DJBCC7mAQOAjdfDCF3Ax8Ds03C+pkFPgbuughC7gM+a1LIWnwG7L1QQvqBzy+QEBeHgZ0XQsgDwC8XWIiLX4H7WilkH/BLC8C7+AXYfb6E9AEjLRTi4hdg1/kQ0g982yIhLr4Dti+3kL3AmRYLcXEW2LGcQvqAsy0W4uIM0LscQh4Axlospop4XPcshZAB4EyLhbg4A2w5HyEPAX+0WIiLP4AtSxXyMFBosZCgKAA9SxEyCJRaLCQoSqpnsYQMAuUWCwmKErCpGULuBuZbLCQo5ul+s1FC7gJKLRYSFCVg42KE7KF1L7R+cca/EVgHTAPjwHHgODAF9AMbgD5g9QJ1llSvL0J2AzMtFrJDkdMluQ14HXhfCW8K+F2/RXo0O1NA3qn3KvAMsFqfN+vQWYiZWusaZ6mD3LVaJ8SKKMrAU0CXM9YFPAlkSFJSB3b5EfKEXuqN1lmvMX4ktU6qnqf8CHkGKDYpRDTquS6OAz8qg5XUST4pZEyfl4BSs4SIR+V9oxi/VtQyrvl7PCTFT/X5LSBrNUvIVk0OQpTVNyN+07wJYNIa+0bJjBuv1rxtwLTVLCHjmhyEeEJzRoBx4Htn7JRiyXDGJoAxa+wJj+SU1bxFYFKTgxCPas6njrCy5kxZY99ozrAz9rgz56TmLQJpTQ5C3K05Y1ZJHXXG0s7YMc0Zccbu9kjOC81bBK7X5CBEWnOGgavJ9mQjrDc9JfP+S+BqZ+wBj+Q81LxF4AZNDkI8pDkjQJdsV0ZsRp2xU+rLOGO3ezxGT2reIrBbk4MQgzz7Y2/Wex7NvjJwSNcl4BfgFb0Q7lBJfgZ4XglzEPhJXz2p9+tzFk8hIh7V5CDEdZoThNin3wKWoE7gmCb6kcrnE6Kse4Qi20KE3EVzT1wRORUxqxfZWmc85pEU0d1sIU/q0VsKuV1RWA7y6i/rUVyI/cuhv7DCCitcYP4FoRclgVODQsYAAAAASUVORK5CYII=" 
            alt="Logo"
          />
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
          font-size: 1.5em;
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 60px;
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
        
        .bottom-icon img {
          width: 36px;
          height: 36px;
          opacity: 0.7;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
      `}</style>
    </>
  );
}
