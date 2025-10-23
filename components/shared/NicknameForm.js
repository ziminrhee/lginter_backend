import { useState } from 'react';

export default function NicknameForm({ socket, isConnected }) {
  const [nickname, setNickname] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      setStatus({ message: '닉네임을 입력해주세요', type: 'error' });
      return;
    }

    if (!socket || !isConnected) {
      setStatus({ message: '서버에 연결되지 않았습니다', type: 'error' });
      return;
    }

    const data = {
      uuid: generateUUID(),
      timestamp: new Date().toISOString(),
      nickname: nickname.trim(),
      clientId: socket.id
    };

    socket.emit('mobile-new-name', data);
    
    setIsSubmitting(true);
    setStatus({ message: '✅ 닉네임이 전송되었습니다!', type: 'success' });
    
    setTimeout(() => {
      setIsSubmitting(false);
      setNickname('');
      setStatus({ message: '', type: '' });
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="nickname-form">
      <div className="form-group">
        <label htmlFor="nickname">닉네임</label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력하세요"
          maxLength={20}
          required
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        입력 완료
      </button>
      
      {status.message && (
        <div className={`status ${status.type}`}>
          {status.message}
        </div>
      )}
      
      <style jsx>{`
        .nickname-form {
          width: 100%;
        }
        
        .form-group {
          margin-bottom: 25px;
        }
        
        label {
          display: block;
          margin-bottom: 10px;
          color: #1d1d1f;
          font-weight: 600;
          font-size: 1em;
          letter-spacing: -0.3px;
        }
        
        input[type="text"] {
          width: 100%;
          padding: 16px 18px;
          border: 2px solid rgba(0, 0, 0, 0.08);
          border-radius: 15px;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          color: #1d1d1f;
        }
        
        input[type="text"]::placeholder {
          color: #86868b;
        }
        
        input[type="text"]:focus {
          outline: none;
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
          transform: translateY(-2px);
        }
        
        button {
          width: 100%;
          padding: 16px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 15px;
          font-size: 1.1em;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          box-shadow: 
            0 8px 30px rgba(102, 126, 234, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }
        
        button:hover:not(:disabled)::before {
          left: 100%;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 
            0 12px 40px rgba(102, 126, 234, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        
        button:active:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 
            0 6px 20px rgba(102, 126, 234, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .status {
          margin-top: 20px;
          padding: 16px 20px;
          border-radius: 15px;
          text-align: center;
          font-size: 0.95em;
          font-weight: 500;
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .status.success {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          color: #0a5f0a;
          border: 1px solid rgba(195, 230, 203, 0.5);
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.15);
        }
        
        .status.error {
          background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
          color: #721c24;
          border: 1px solid rgba(245, 198, 203, 0.5);
          box-shadow: 0 4px 15px rgba(220, 53, 69, 0.15);
        }
      `}</style>
    </form>
  );
}

