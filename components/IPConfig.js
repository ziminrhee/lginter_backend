import { useState } from 'react';

export default function IPConfig({ onIPChange, defaultIP = '172.20.10.2' }) {
  const [ip, setIP] = useState(defaultIP);
  const [currentUrl, setCurrentUrl] = useState('');

  const handleGenerate = () => {
    if (!ip.trim()) {
      alert('IP 주소를 입력해주세요!');
      return;
    }
    const url = `http://${ip}:3000/mobile1`;
    setCurrentUrl(url);
    onIPChange && onIPChange(url);
  };

  return (
    <div className="ip-config">
      <label>서버 IP 주소</label>
      <input
        type="text"
        value={ip}
        onChange={(e) => setIP(e.target.value)}
        placeholder="172.20.10.2"
      />
      <button onClick={handleGenerate}>QR 생성</button>
      {currentUrl && <div className="current-url">URL: {currentUrl}</div>}
      
      <style jsx>{`
        .ip-config {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          font-size: 0.85em;
          max-width: 300px;
        }
        
        label {
          color: #1d1d1f;
          font-weight: 600;
          display: block;
          margin-bottom: 8px;
          font-size: 0.9em;
        }
        
        input {
          padding: 8px 12px;
          font-size: 0.95em;
          border: 1px solid #d1d1d6;
          border-radius: 8px;
          width: 100%;
          margin-bottom: 8px;
          font-family: monospace;
        }
        
        button {
          padding: 8px 16px;
          font-size: 0.9em;
          background: #007aff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          width: 100%;
          transition: background 0.2s;
        }
        
        button:hover {
          background: #0051d5;
        }
        
        .current-url {
          font-size: 0.75em;
          margin-top: 8px;
          color: #86868b;
          word-break: break-all;
          line-height: 1.3;
        }
      `}</style>
    </div>
  );
}

