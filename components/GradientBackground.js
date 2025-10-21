export default function GradientBackground() {
  return (
    <div className="gradient-bg">
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>
      <div className="blob blob4"></div>
      <div className="blob blob5"></div>
      
      <style jsx>{`
        .gradient-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
        }
        
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.7;
          animation: float 20s infinite ease-in-out;
        }
        
        .blob1 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%);
          top: -150px;
          left: -100px;
          animation-delay: 0s;
        }
        
        .blob2 {
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #ff6b9d 0%, #ffc3e1 100%);
          top: -200px;
          right: -150px;
          animation-delay: 3s;
        }
        
        .blob3 {
          width: 450px;
          height: 450px;
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          bottom: -100px;
          left: 20%;
          animation-delay: 5s;
        }
        
        .blob4 {
          width: 550px;
          height: 550px;
          background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
          bottom: -150px;
          right: -100px;
          animation-delay: 7s;
        }
        
        .blob5 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          top: 50%;
          left: -150px;
          animation-delay: 2s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
      `}</style>
    </div>
  );
}

