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

  const hue1 = 320 + Math.sin(time) * 15
  const hue2 = 280 + Math.cos(time * 0.7) * 15
  const hue3 = 340 + Math.sin(time * 0.5) * 10

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -10,
      pointerEvents: 'none',
      background: `linear-gradient(135deg, hsl(${hue1}, 35%, 92%) 0%, hsl(${hue2}, 30%, 94%) 50%, hsl(${hue3}, 40%, 93%) 100%)`,
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
          hsla(${hue1}, 60%, 85%, 0.4) 30%,
          hsla(${hue2}, 50%, 88%, 0.3) 60%,
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
          hsla(${hue3}, 70%, 90%, 0.5) 0%,
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
          hsla(${hue1}, 60%, 88%, 0.3) 45%,
          transparent 80%
        )`,
        filter: `blur(${55 + Math.sin(time * 1.7) * 28}px)`,
        opacity: 0.8,
        transition: 'all 0.5s ease'
      }} />
    </div>
  )
}

