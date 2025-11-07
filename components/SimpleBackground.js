import { useEffect, useState } from 'react'

export default function SimpleBackground() {
  const [isMobilePage, setIsMobilePage] = useState(false)
  const [pressProgress, setPressProgress] = useState(0)

  useEffect(() => {
    console.log('🎨 SimpleBackground mounted!')
    
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
        filter: `brightness(${brightnessIncrease})`,
        transition: 'filter 0.3s ease-out'
      }}>
        {/* 간단한 블롭 (폴백용) */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${blobSize}px`,
          height: `${blobSize}px`,
          transform: `translate(-50%, -50%)`,
          background: 'linear-gradient(180deg, #FFD0E8 0%, #FFA8D8 15%, #E88CD0 30%, #D078C8 45%, #B068C0 60%, #8858B8 75%, #6048B0 90%, rgba(72, 64, 168, 0.5) 95%, transparent 100%)',
          borderRadius: '50%',
          filter: `blur(${20 + blurIncrease}px)`,
          opacity: 0.8,
          transition: 'transform 0.3s ease-out, filter 0.3s ease-out'
        }} />
      </div>
    </div>
  )
}

