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
          margin-bottom: 8px;
          color: #333;
          font-weight: 600;
          font-size: 0.95em;
        }
        
        input[type="text"] {
          width: 100%;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        
        input[type="text"]:focus {
          outline: none;
          border-color: #667eea;
        }
        
        button {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.1em;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        
        button:active {
          transform: translateY(0);
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .status {
          margin-top: 20px;
          padding: 15px;
          border-radius: 10px;
          text-align: center;
          font-size: 0.9em;
        }
        
        .status.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .status.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      `}</style>
    </form>
  );
}

