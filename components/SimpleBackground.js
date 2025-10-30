import { useEffect, useState } from 'react'

export default function SimpleBackground() {
  const [time, setTime] = useState(0)

  useEffect(() => {
    console.log('🎨 SimpleBackground mounted!')
    const interval = setInterval(() => {
      setTime(t => t + 0.01)
    }, 50)
    return () => clearInterval(interval)
  }, [])

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
      transition: 'background 0.5s ease'
    }}>
      {/* 애니메이션 원형 블롭 */}
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '50%',
        transform: `translate(-50%, 0) scale(${1 + Math.sin(time * 2) * 0.1})`,
        width: '70vmin',
        height: '70vmin',
        borderRadius: '50%',
        background: `radial-gradient(circle, 
          hsla(45, 80%, 88%, 0.6) 0%,
          hsla(320, 60%, 85%, 0.4) 30%,
          hsla(280, 50%, 88%, 0.3) 60%,
          transparent 85%
        )`,
        filter: `blur(${60 + Math.sin(time) * 30}px)`,
        opacity: 0.9,
        transition: 'all 0.5s ease'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '30%',
        transform: `translate(-50%, 0) scale(${1 + Math.cos(time * 1.5) * 0.15})`,
        width: '50vmin',
        height: '50vmin',
        borderRadius: '50%',
        background: `radial-gradient(circle, 
          hsla(340, 70%, 90%, 0.5) 0%,
          hsla(320, 60%, 88%, 0.35) 40%,
          transparent 75%
        )`,
        filter: `blur(${50 + Math.cos(time * 1.3) * 25}px)`,
        opacity: 0.85,
        transition: 'all 0.5s ease'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '70%',
        transform: `translate(-50%, 0) scale(${1 + Math.sin(time * 1.8) * 0.12})`,
        width: '60vmin',
        height: '60vmin',
        borderRadius: '50%',
        background: `radial-gradient(circle, 
          hsla(280, 70%, 90%, 0.5) 0%,
          hsla(320, 60%, 88%, 0.3) 45%,
          transparent 80%
        )`,
        filter: `blur(${55 + Math.sin(time * 1.7) * 28}px)`,
        opacity: 0.8,
        transition: 'all 0.5s ease'
      }} />
    </div>
  )
}

