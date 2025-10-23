export default function NicknameCard({ data }) {
  return (
    <div className="nickname-card">
      <div className="nickname">{data.nickname}</div>
      
      <style jsx>{`
        .nickname-card {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0.2)
          );
          backdrop-filter: blur(30px) saturate(180%);
          -webkit-backdrop-filter: blur(30px) saturate(180%);
          padding: 30px 50px;
          border-radius: 25px;
          box-shadow: 
            0 10px 40px rgba(31, 38, 135, 0.15),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 0 rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: slideIn 0.6s cubic-bezier(0.23, 1, 0.320, 1);
          min-width: 180px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
        }
        
        .nickname-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 
            0 15px 60px rgba(31, 38, 135, 0.25),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 0 rgba(255, 255, 255, 0.3);
        }
        
        .nickname {
          font-size: 2.2em;
          font-weight: 700;
          color: #1d1d1f;
          margin: 0;
          letter-spacing: -0.5px;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

