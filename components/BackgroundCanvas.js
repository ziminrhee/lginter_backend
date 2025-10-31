import { useEffect, useState } from 'react'

export default function BackgroundCanvas({ cameraMode = 'default' }) {
  const [mounted, setMounted] = useState(false)
  const [isMobilePage, setIsMobilePage] = useState(false)
  const [pressProgress, setPressProgress] = useState(0)

  useEffect(() => {
    setMounted(true)
    console.log('🎨 BackgroundCanvas mounted!')
    
    // 모바일 페이지 감지
    if (typeof window !== 'undefined') {
      setIsMobilePage(window.location.pathname === '/mobile')
    }
    
    // 꾹 누르기 진행도 감지
    const checkPress = () => {
      if (typeof window !== 'undefined' && window.pressProgress !== undefined) {
        setPressProgress(window.pressProgress)
      }
      requestAnimationFrame(checkPress)
    }
    checkPress()
  }, [])

  if (!mounted) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, #FFF5F7 0%, #F5E6F5 30%, #E8D5E0 60%, rgb(125, 108, 118) 100%)'
      }} />
    )
  }

  // 꾹 누르기 이징
  const pressEase = pressProgress * pressProgress * (3.0 - 2.0 * pressProgress)
  
  // 모바일 페이지에서 크기와 위치 조정
  const blobSize = isMobilePage ? 1000 : 559
  const blobTop = isMobilePage ? '58%' : '50%'
  
  // 꾹 누를 때 블러와 밝기 증가 (위로 이동 제거)
  const blurIncrease = pressEase * 50 // 블러 최대 50px 증가
  const brightnessIncrease = 1 + pressEase * 0.4 // 밝기 최대 1.4배 증가

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -10,
      pointerEvents: 'none',
      background: 'linear-gradient(to bottom, #FFF5F7 0%, #F5E6F5 30%, #E8D5E0 60%, rgb(125, 108, 118) 100%)',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: blobTop,
        left: '50%',
        width: `${blobSize}px`,
        height: `${blobSize}px`,
        transform: 'translate(-50%, -50%)',
        filter: `brightness(${brightnessIncrease})`
      }}>
        {/* 잔상 레이어들 - 뒤에서 앞으로 */}
        <div className="trail-blob trail-5" style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${blobSize}px`,
          height: `${blobSize}px`,
          transform: `translate(-50%, -50%) rotate(0deg)`,
          background: 'linear-gradient(180deg, #FFD0E8 0%, #FFA8D8 15%, #E88CD0 30%, #D078C8 45%, #B068C0 60%, #8858B8 75%, #6048B0 90%, rgba(72, 64, 168, 0.5) 95%, transparent 100%)',
          borderRadius: '50%',
          zIndex: 0,
          opacity: 0.06,
          filter: `blur(${25 + blurIncrease}px)`,
          boxShadow: '0 0 0 1px rgba(255, 184, 217, 0.03), 0 0 5px 1px rgba(255, 184, 217, 0.01)',
          animation: 'shaderWave 8s ease-in-out infinite -1.5s, trailBloom5 8s ease-in-out infinite',
          transition: 'transform 0.3s ease-out, filter 0.3s ease-out'
        }} />
        
        <div className="trail-blob trail-4" style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${blobSize}px`,
          height: `${blobSize}px`,
          transform: `translate(-50%, -50%) rotate(0deg)`,
          background: 'linear-gradient(180deg, #FFD0E8 0%, #FFA8D8 15%, #E88CD0 30%, #D078C8 45%, #B068C0 60%, #8858B8 75%, #6048B0 90%, rgba(72, 64, 168, 0.5) 95%, transparent 100%)',
          borderRadius: '50%',
          zIndex: 1,
          opacity: 0.12,
          filter: `blur(${23 + blurIncrease}px)`,
          boxShadow: '0 0 0 1px rgba(255, 184, 217, 0.05), 0 0 5px 1px rgba(255, 184, 217, 0.02)',
          animation: 'shaderWave 8s ease-in-out infinite -1.2s, trailBloom4 8s ease-in-out infinite',
          transition: 'transform 0.3s ease-out, filter 0.3s ease-out'
        }} />
        
        <div className="trail-blob trail-3" style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${blobSize}px`,
          height: `${blobSize}px`,
          transform: `translate(-50%, -50%) rotate(0deg)`,
          background: 'linear-gradient(180deg, #FFD0E8 0%, #FFA8D8 15%, #E88CD0 30%, #D078C8 45%, #B068C0 60%, #8858B8 75%, #6048B0 90%, rgba(72, 64, 168, 0.5) 95%, transparent 100%)',
          borderRadius: '50%',
          zIndex: 2,
          opacity: 0.2,
          filter: `blur(${21 + blurIncrease}px)`,
          boxShadow: '0 0 0 1px rgba(255, 184, 217, 0.08), 0 0 5px 1px rgba(255, 184, 217, 0.04)',
          animation: 'shaderWave 8s ease-in-out infinite -0.9s, trailBloom3 8s ease-in-out infinite',
          transition: 'transform 0.3s ease-out, filter 0.3s ease-out'
        }} />
        
        <div className="trail-blob trail-2" style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${blobSize}px`,
          height: `${blobSize}px`,
          transform: `translate(-50%, -50%) rotate(0deg)`,
          background: 'linear-gradient(180deg, #FFD0E8 0%, #FFA8D8 15%, #E88CD0 30%, #D078C8 45%, #B068C0 60%, #8858B8 75%, #6048B0 90%, rgba(72, 64, 168, 0.5) 95%, transparent 100%)',
          borderRadius: '50%',
          zIndex: 3,
          opacity: 0.3,
          filter: `blur(${19 + blurIncrease}px)`,
          boxShadow: '0 0 0 1px rgba(255, 184, 217, 0.12), 0 0 5px 1px rgba(255, 184, 217, 0.06)',
          animation: 'shaderWave 8s ease-in-out infinite -0.6s, trailBloom2 8s ease-in-out infinite',
          transition: 'transform 0.3s ease-out, filter 0.3s ease-out'
        }} />
        
        <div className="trail-blob trail-1" style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${blobSize}px`,
          height: `${blobSize}px`,
          transform: `translate(-50%, -50%) rotate(0deg)`,
          background: 'linear-gradient(180deg, #FFD0E8 0%, #FFA8D8 15%, #E88CD0 30%, #D078C8 45%, #B068C0 60%, #8858B8 75%, #6048B0 90%, rgba(72, 64, 168, 0.5) 95%, transparent 100%)',
          borderRadius: '50%',
          zIndex: 4,
          opacity: 0.4,
          filter: `blur(${17 + blurIncrease}px)`,
          boxShadow: '0 0 0 1px rgba(255, 184, 217, 0.15), 0 0 5px 1px rgba(255, 184, 217, 0.08)',
          animation: 'shaderWave 8s ease-in-out infinite -0.3s, trailBloom1 8s ease-in-out infinite',
          transition: 'transform 0.3s ease-out, filter 0.3s ease-out'
        }} />
        
        {/* 메인 블롭 - 그라디언트 블러 효과 */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${blobSize}px`,
          height: `${blobSize}px`,
          transform: `translate(-50%, -50%)`,
          zIndex: 5,
          animation: 'shaderWave 8s ease-in-out infinite',
          transition: 'transform 0.3s ease-out'
        }}>
          {/* 선명한 레이어 (위쪽) */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            transform: 'rotate(0deg)',
            background: 'linear-gradient(180deg, #FFD0E8 0%, #FFA8D8 15%, #E88CD0 30%, #D078C8 45%, #B068C0 60%, #8858B8 75%, #6048B0 90%, rgba(72, 64, 168, 0.5) 95%, transparent 100%)',
            borderRadius: '50%',
            boxShadow: '0 0 0 1px rgba(255, 168, 216, 0.3), 0 0 5px 1px rgba(255, 168, 216, 0.15)',
            filter: `blur(${blurIncrease}px)`,
            maskImage: `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 60%)`,
            WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 60%)`,
            zIndex: 2,
            animation: 'sharpBloomEffect 8s ease-in-out infinite',
            transition: 'filter 0.3s ease-out, mask-image 0.3s ease-out'
          }} />
          
          {/* 블러 레이어 (아래쪽) */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            transform: 'rotate(0deg)',
            background: 'linear-gradient(180deg, #FFD0E8 0%, #FFA8D8 15%, #E88CD0 30%, #D078C8 45%, #B068C0 60%, #8858B8 75%, #6048B0 90%, rgba(72, 64, 168, 0.5) 95%, transparent 100%)',
            borderRadius: '50%',
            filter: `blur(${25 + blurIncrease * 2}px)`,
            maskImage: `linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,1) 70%)`,
            WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,1) 70%)`,
            zIndex: 1,
            animation: 'bloomEffect 8s ease-in-out infinite',
            transition: 'filter 0.3s ease-out, mask-image 0.3s ease-out'
          }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes shaderWave {
          0%, 100% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          12.5% {
            transform: translate(-50.3%, -50.2%) scale(1.008) rotate(0.3deg);
          }
          25% {
            transform: translate(-50.5%, -49.8%) scale(1.012) rotate(0.5deg);
          }
          37.5% {
            transform: translate(-50.2%, -50.5%) scale(1.005) rotate(0.2deg);
          }
          50% {
            transform: translate(-49.8%, -50.3%) scale(0.998) rotate(-0.2deg);
          }
          62.5% {
            transform: translate(-50.2%, -49.7%) scale(1.002) rotate(0.1deg);
          }
          75% {
            transform: translate(-49.6%, -50.1%) scale(1.006) rotate(-0.3deg);
          }
          87.5% {
            transform: translate(-50.4%, -50.4%) scale(1.003) rotate(0.2deg);
          }
        }

        @keyframes sharpBloomEffect {
          0%, 100% {
            filter: blur(${blurIncrease}px) brightness(1);
          }
          25% {
            filter: blur(${20 + blurIncrease}px) brightness(1.3);
          }
          50% {
            filter: blur(${40 + blurIncrease}px) brightness(1.6);
          }
          75% {
            filter: blur(${20 + blurIncrease}px) brightness(1.3);
          }
        }

        @keyframes bloomEffect {
          0%, 100% {
            filter: blur(${25 + blurIncrease * 2}px) brightness(1);
          }
          25% {
            filter: blur(${60 + blurIncrease * 2}px) brightness(1.3);
          }
          50% {
            filter: blur(${100 + blurIncrease * 2}px) brightness(1.6);
          }
          75% {
            filter: blur(${60 + blurIncrease * 2}px) brightness(1.3);
          }
        }

        @keyframes trailBloom1 {
          0%, 100% {
            filter: blur(${17 + blurIncrease}px) brightness(1);
          }
          25% {
            filter: blur(${50 + blurIncrease}px) brightness(1.25);
          }
          50% {
            filter: blur(${85 + blurIncrease}px) brightness(1.5);
          }
          75% {
            filter: blur(${50 + blurIncrease}px) brightness(1.25);
          }
        }

        @keyframes trailBloom2 {
          0%, 100% {
            filter: blur(${19 + blurIncrease}px) brightness(1);
          }
          25% {
            filter: blur(${55 + blurIncrease}px) brightness(1.25);
          }
          50% {
            filter: blur(${90 + blurIncrease}px) brightness(1.5);
          }
          75% {
            filter: blur(${55 + blurIncrease}px) brightness(1.25);
          }
        }

        @keyframes trailBloom3 {
          0%, 100% {
            filter: blur(${21 + blurIncrease}px) brightness(1);
          }
          25% {
            filter: blur(${60 + blurIncrease}px) brightness(1.25);
          }
          50% {
            filter: blur(${95 + blurIncrease}px) brightness(1.5);
          }
          75% {
            filter: blur(${60 + blurIncrease}px) brightness(1.25);
          }
        }

        @keyframes trailBloom4 {
          0%, 100% {
            filter: blur(${23 + blurIncrease}px) brightness(1);
          }
          25% {
            filter: blur(${65 + blurIncrease}px) brightness(1.25);
          }
          50% {
            filter: blur(${100 + blurIncrease}px) brightness(1.5);
          }
          75% {
            filter: blur(${65 + blurIncrease}px) brightness(1.25);
          }
        }

        @keyframes trailBloom5 {
          0%, 100% {
            filter: blur(${25 + blurIncrease}px) brightness(1);
          }
          25% {
            filter: blur(${70 + blurIncrease}px) brightness(1.25);
          }
          50% {
            filter: blur(${105 + blurIncrease}px) brightness(1.5);
          }
          75% {
            filter: blur(${70 + blurIncrease}px) brightness(1.25);
          }
        }
      `}</style>
    </div>
  )
}

