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
          opacity: 0.5;
          animation: float 4s infinite ease-in-out;
          will-change: transform;
        }
        
        .blob1 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #a78bfa 0%, #7c3aed 100%);
          top: -100px;
          left: -50px;
          animation-delay: 0s;
          animation-direction: normal;
        }
        
        .blob2 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, #ff6b9d 0%, #ffc3e1 100%);
          top: -120px;
          right: -80px;
          animation-delay: 2s;
          animation-direction: reverse;
        }
        
        .blob3 {
          width: 280px;
          height: 280px;
          background: radial-gradient(circle, #60a5fa 0%, #3b82f6 100%);
          bottom: -80px;
          left: 20%;
          animation-delay: 3s;
          animation-direction: normal;
        }
        
        .blob4 {
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, #ec4899 0%, #f472b6 100%);
          bottom: -100px;
          right: -60px;
          animation-delay: 1.5s;
          animation-direction: reverse;
        }
        
        .blob5 {
          width: 260px;
          height: 260px;
          background: radial-gradient(circle, #8b5cf6 0%, #6366f1 100%);
          top: 50%;
          left: -80px;
          animation-delay: 2.5s;
          animation-direction: normal;
        }
        
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(100px, -80px) rotate(90deg) scale(1.2);
          }
          50% {
            transform: translate(-80px, 80px) rotate(180deg) scale(0.9);
          }
          75% {
            transform: translate(80px, 100px) rotate(270deg) scale(1.1);
          }
          100% {
            transform: translate(0, 0) rotate(360deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

