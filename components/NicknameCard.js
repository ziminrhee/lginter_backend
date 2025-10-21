export default function NicknameCard({ data }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="nickname-card">
      <div className="nickname">👤 {data.nickname}</div>
      <div className="timestamp">⏰ {formatTimestamp(data.timestamp)}</div>
      <div className="uuid">ID: {data.uuid.substring(0, 8)}...</div>
      
      <style jsx>{`
        .nickname-card {
          background: white;
          padding: 30px 40px;
          border-radius: 15px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.5s ease-out;
          min-width: 200px;
          text-align: center;
        }
        
        .nickname {
          font-size: 2em;
          font-weight: bold;
          color: #1e3c72;
          margin-bottom: 10px;
        }
        
        .timestamp {
          font-size: 0.9em;
          color: #666;
        }
        
        .uuid {
          font-size: 0.75em;
          color: #999;
          margin-top: 5px;
          word-break: break-all;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

