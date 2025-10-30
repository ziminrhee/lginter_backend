import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import AgenticBubble from './AgenticBubble'

export default function BackgroundCanvas({ cameraMode = 'default' }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log('🎨 BackgroundCanvas mounted!')
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
        background: 'linear-gradient(135deg, #FFF5F7 0%, #F5E6F5 50%, #FFE8F5 100%)'
      }} />
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -10,
      pointerEvents: 'none',
      background: 'linear-gradient(135deg, #FFF5F7 0%, #F5E6F5 50%, #FFE8F5 100%)'
    }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance'
        }}
        onCreated={() => console.log('✅ Canvas created!')}
      >
        <AgenticBubble cameraMode={cameraMode} />
      </Canvas>
    </div>
  )
}

