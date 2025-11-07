import { useEffect, useState } from 'react'

export default function BackgroundCanvas({ cameraMode = 'default' }) {
  const [mounted, setMounted] = useState(false)
  const [isMobilePage, setIsMobilePage] = useState(false)
  const [pressProgress, setPressProgress] = useState(0)
  const [isListeningFlag, setIsListeningFlag] = useState(false)
  const [blobAlpha, setBlobAlpha] = useState(1)
  const [blobOpacityMs, setBlobOpacityMs] = useState(600)
  const [blobScale, setBlobScale] = useState(1)
  const [blobScaleMs, setBlobScaleMs] = useState(600)
  const [showOrbits, setShowOrbits] = useState(false)
  const [clusterSpin, setClusterSpin] = useState(false)
  const [orbitRadiusScale, setOrbitRadiusScale] = useState(1)
  const [mainBlobFade, setMainBlobFade] = useState(false)
  const [newOrbEnter, setNewOrbEnter] = useState(false)
  const [showFinalOrb, setShowFinalOrb] = useState(false)
  const [showCenterGlow, setShowCenterGlow] = useState(false)
  const [keywordLabels, setKeywordLabels] = useState([])
  const [showKeywords, setShowKeywords] = useState(false)
  const [blobSettings, setBlobSettings] = useState({
    centerX: 39,
    centerY: 33,
    start: 50,
    end: 99,
    blurPx: 52,
    rimTilt: 30,
    feather: 15,
    innerBlur: 20,
    // Five-stop palette from reference: 0,13,47,78,100
    color0: '#D1CEDF', // 0%
    color1: '#F2D4D2', // 13%
    color2: '#FFB8D3', // 47%
    color3: '#EBDDE1', // 78%
    color4: '#D8D9E6', // 100%
    tintAlpha: 0.85,
    boost: 1.9,
  })
  // Fixed background palette (per latest request)
  const BG_TOP = '#F4EBED'
  const BG_MID = '#FFFAFF'
  const BG_LOW = '#FFEBF8'
  const BG_BOTTOM = '#D3D0E2'
  const BG_MID_STOP = 30
  const BG_LOW_STOP = 60

  useEffect(() => {
    setMounted(true)
    console.log('🎨 BackgroundCanvas mounted!')
    
    // 모바일 페이지 감지
    if (typeof window !== 'undefined') {
      setIsMobilePage(window.location.pathname === '/mobile')
    }
    
    const check = () => {
      if (typeof window !== 'undefined') {
        if (window.pressProgress !== undefined) {
          setPressProgress(window.pressProgress)
        }
        if (window.blobSettings) {
          const bs = window.blobSettings
          setBlobSettings(prev => ({
            centerX: bs.centerX ?? prev.centerX,
            centerY: bs.centerY ?? prev.centerY,
            start: bs.start ?? prev.start,
            end: bs.end ?? prev.end,
            blurPx: bs.blurPx ?? prev.blurPx,
            rimTilt: bs.rimTilt ?? prev.rimTilt,
            feather: bs.feather ?? prev.feather,
            innerBlur: bs.innerBlur ?? prev.innerBlur,
            color0: bs.color0 ?? prev.color0,
            color1: bs.color1 ?? prev.color1,
            color2: bs.color2 ?? prev.color2,
            color3: bs.color3 ?? prev.color3,
            color4: bs.color4 ?? prev.color4,
            tintAlpha: bs.tintAlpha ?? prev.tintAlpha,
            boost: bs.boost ?? prev.boost,
          }))
        }
        if (window.isListening !== undefined) {
          setIsListeningFlag(Boolean(window.isListening))
        }
        if (window.blobOpacity !== undefined) {
          const a = Number(window.blobOpacity)
          if (!Number.isNaN(a)) setBlobAlpha(Math.max(0, Math.min(1, a)))
        }
        if (window.blobOpacityMs !== undefined) {
          const ms = Number(window.blobOpacityMs)
          if (!Number.isNaN(ms)) setBlobOpacityMs(ms)
        }
        if (window.blobScale !== undefined) {
          const s = Number(window.blobScale)
          if (!Number.isNaN(s)) setBlobScale(Math.max(0.1, Math.min(2, s)))
        }
        if (window.blobScaleMs !== undefined) {
          const ms2 = Number(window.blobScaleMs)
          if (!Number.isNaN(ms2)) setBlobScaleMs(ms2)
        }
        if (window.showOrbits !== undefined) setShowOrbits(Boolean(window.showOrbits))
        if (window.clusterSpin !== undefined) setClusterSpin(Boolean(window.clusterSpin))
        if (window.orbitRadiusScale !== undefined) {
          const rs = Number(window.orbitRadiusScale)
          if (!Number.isNaN(rs)) setOrbitRadiusScale(Math.max(0.5, Math.min(1.4, rs)))
        }
        if (window.mainBlobFade !== undefined) setMainBlobFade(Boolean(window.mainBlobFade))
        if (window.newOrbEnter !== undefined) setNewOrbEnter(Boolean(window.newOrbEnter))
        if (window.showFinalOrb !== undefined) setShowFinalOrb(Boolean(window.showFinalOrb))
        if (window.showCenterGlow !== undefined) setShowCenterGlow(Boolean(window.showCenterGlow))
        if (window.keywordLabels !== undefined) setKeywordLabels(Array.isArray(window.keywordLabels) ? window.keywordLabels : [])
        if (window.showKeywords !== undefined) setShowKeywords(Boolean(window.showKeywords))
        // Background is fixed now; ignore window.bgSettings
      }
      requestAnimationFrame(check)
    }
    check()
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

  // 꾹 누르기 이징 (사용하되 비주얼 변화는 제거)
  const pressEase = pressProgress * pressProgress * (3.0 - 2.0 * pressProgress)
  
  // 모바일 페이지에서 크기와 위치 조정
  const blobSize = isMobilePage ? 350 : 150
  const blobTop = isMobilePage ? '60%' : '50%'
  
  // 프레스 시 화이트아웃 제거: 블러/밝기 증가 사용하지 않음
  const blurIncrease = 0
  const brightnessIncrease = 1
  // Figma-provided orbit shapes scale helpers
  const designBase = 350
  const blurBase = 50
  const blurPx = Math.round(blurBase * (blobSize / designBase))
  const shape1W = blobSize * 0.534 // ≈ 187/350
  const shape1H = blobSize * 0.554 // ≈ 194/350
  const shape2W = blobSize * 0.735 // ≈ 257/350
  const shape2H = blobSize * 0.763 // ≈ 267/350

  const bgGradient = `linear-gradient(to bottom, ${BG_TOP} 0%, ${BG_MID} ${BG_MID_STOP}%, ${BG_LOW} ${BG_LOW_STOP}%, ${BG_BOTTOM} 100%)`

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -10,
      pointerEvents: 'none',
      background: bgGradient,
      overflow: 'hidden'
    }}>
      {isMobilePage ? (
        <div style={{
          position: 'absolute',
          top: blobTop,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${blobSize}px`,
          height: `${blobSize}px`,
          filter: `brightness(${brightnessIncrease})`,
          opacity: blobAlpha,
          transition: `opacity ${blobOpacityMs}ms ease`,
          pointerEvents: 'none'
        }}>
          <div className="bg-glow" />
          <div style={{ position: 'absolute', inset: 0, animation: clusterSpin ? 'clusterSpin 6s linear infinite' : 'none', pointerEvents: 'none' }}>
            {showOrbits && (
              <>
                {/* Orbit A - Figma spec: linear gradient #000 -> #0D3664 -> #E096E2 with 50px blur */}
                <div style={{
                  position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                  width: `${blobSize * 0.92}px`, height: `${blobSize * 0.92}px`, zIndex: 0,
                  animation: 'orbitCW 12s linear infinite'
                }}>
                  <div style={{
                    position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) rotate(-176.444deg)`,
                    width: `${shape1W}px`, height: `${shape1H}px`, borderRadius: '50% / 50%',
                    background: 'linear-gradient(180deg, #000000 0%, #0D3664 50%, #E096E2 98.08%)',
                    filter: `blur(${blurPx}px)`
                  }} />
                </div>
                {/* Orbit B - Figma spec: pink gradient with 50px blur */}
                <div style={{
                  position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                  width: `${blobSize * 0.84}px`, height: `${blobSize * 0.84}px`, zIndex: 0,
                  animation: 'orbitCCW 14s linear infinite'
                }}>
                  <div style={{
                    position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) rotate(-144.552deg)`,
                    width: `${shape2W}px`, height: `${shape2H}px`, borderRadius: '50% / 50%',
                    background: 'linear-gradient(180deg, #FC8AD6 0%, #FFD8E0 75.48%)',
                    filter: `blur(${blurPx}px)`
                  }} />
                </div>
                {/* keyword labels rendered outside orbit containers to avoid inheriting rotation */}
                {showKeywords ? (
                  <>
                    {/* Temp (CW) */}
                    {keywordLabels[0] ? (
                      <div style={{
                        position: 'absolute', left: '50%', top: '50%',
                        animation: 'labelCW 12s linear infinite',
                        color: '#111', fontWeight: 800, fontFamily: 'inherit',
                        fontSize: 'clamp(1rem, 3.4vw, 1.25rem)'
                      }}>{keywordLabels[0]}</div>
                    ) : null}
                    {/* Humidity (CCW) */}
                    {keywordLabels[1] ? (
                      <div style={{
                        position: 'absolute', left: '50%', top: '50%',
                        animation: 'labelCCW 14s linear infinite',
                        color: '#111', fontWeight: 800, fontFamily: 'inherit',
                        fontSize: 'clamp(1rem, 3.4vw, 1.25rem)'
                      }}>{keywordLabels[1]}</div>
                    ) : null}
                    {/* Light color name (CW, bottom offset) */}
                    {keywordLabels[2] ? (
                      <div style={{
                        position: 'absolute', left: '50%', top: '50%',
                        animation: 'labelCWBottom 12s linear infinite',
                        color: '#111', fontWeight: 800, fontFamily: 'inherit',
                        fontSize: 'clamp(1rem, 3.4vw, 1.25rem)'
                      }}>{keywordLabels[2]}</div>
                    ) : null}
                    {/* Music mood (CCW, bottom offset) */}
                    {keywordLabels[3] ? (
                      <div style={{
                        position: 'absolute', left: '50%', top: '50%',
                        animation: 'labelCCWBottom 14s linear infinite',
                        color: '#111', fontWeight: 800, fontFamily: 'inherit',
                        fontSize: 'clamp(1rem, 3.4vw, 1.25rem)'
                      }}>{keywordLabels[3]}</div>
                    ) : null}
                  </>
                ) : null}
                {/* New entering orb (from outside, then joins rotation) */}
                {newOrbEnter && (
                  <div style={{
                    position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                    width: `${blobSize * 0.92}px`, height: `${blobSize * 0.92}px`, zIndex: 0
                  }}>
                    <div style={{
                      position: 'absolute', left: '50%', top: '50%',
                      transform: `translate(-50%, -50%) rotate(85.988deg)`,
                      width: `${Math.round(blobSize * 0.834)}px`,
                      height: `${Math.round(blobSize * 0.866)}px`,
                      borderRadius: `${Math.round(blobSize * 0.866)}px`,
                      opacity: 0.7,
                      background: 'linear-gradient(167deg, #F8E3B7 9.32%, #FF85B1 61.8%, #E3FFF4 103.45%)',
                      filter: 'blur(10px)',
                      animation: `newOrbEnter ${Math.max(700, blobOpacityMs)}ms ease-out forwards`
                    }} />
                  </div>
                )}

                {/* Final phase: extra orb and center glow */}
                {showFinalOrb && (
                  <div style={{
                    position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                    width: `${blobSize * 1.02}px`, height: `${blobSize * 1.06}px`, zIndex: 0,
                    animation: 'orbitCW 16s linear infinite'
                  }}>
                    <div style={{
                      position: 'absolute', left: '50%', top: '50%',
                      transform: 'translate(-50%, -50%) rotate(-85.44deg)',
                      width: `${Math.round(blobSize * 1.01)}px`,
                      height: `${Math.round(blobSize * 1.05)}px`,
                      borderRadius: `${Math.round(blobSize * 1.05)}px`,
                      background: 'linear-gradient(180deg, #E291C7 0%, #FFD8E0 75.48%)',
                      filter: 'blur(50px)',
                      opacity: 0.95,
                      animation: 'finalOrbAppear 900ms ease-out forwards'
                    }} />
                  </div>
                )}
                {showCenterGlow && (
                  <div style={{
                    position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                    width: `${Math.round(blobSize * 1.10)}px`,
                    height: `${Math.round(blobSize * 1.10)}px`,
                    borderRadius: `${Math.round(blobSize * 1.10)}px`,
                    opacity: 0.7,
                    background: 'radial-gradient(50% 50% at 50% 50%, #FFF 39.42%, rgba(255, 255, 255, 0.00) 100%)',
                    mixBlendMode: 'overlay',
                    filter: 'blur(29.5px)',
                    animation: 'centerGlowPulse 3s ease-in-out infinite'
                  }} />
                )}
              </>
            )}
            <div
              className={`blob${isListeningFlag ? ' frozen' : ''}`}
              style={{
                '--center-x': `${blobSettings.centerX}%`,
                '--center-y': `${blobSettings.centerY}%`,
                '--start': `${blobSettings.start}%`,
                '--end': `${blobSettings.end}%`,
                '--blur': `${blobSettings.blurPx + blurIncrease}px`,
                '--feather': `${blobSettings.feather}%`,
                '--inner-blur': `${blobSettings.innerBlur}px`,
                '--rim-tilt': `${blobSettings.rimTilt}deg`,
                '--c0': `${blobSettings.color0}`,
                '--c1': `${blobSettings.color1}`,
                '--c2': `${blobSettings.color2}`,
                '--c3': `${blobSettings.color3}`,
                '--c4': `${blobSettings.color4}`,
                '--bg': `radial-gradient(circle at var(--center-x) var(--center-y), var(--c0) 0%, var(--c1) 13%, var(--c2) 47%, var(--c3) 78%, var(--c4) 100%)`,
                '--tint-alpha': blobSettings.tintAlpha,
                '--boost': blobSettings.boost,
                width: `${blobSize}px`,
                aspectRatio: '1 / 1',
                transform: `translateZ(0) scale(${blobScale})`,
                transition: `transform ${blobScaleMs}ms ease, opacity ${blobOpacityMs}ms ease, filter ${blobOpacityMs}ms ease`,
                opacity: mainBlobFade ? 0 : 1,
                filter: mainBlobFade ? 'blur(10px)' : 'none',
                ...(isListeningFlag ? {
                  animation: 'none',
                  '--start-wobble': 'calc(12% - var(--start))',
                  '--end-wobble': 'calc(86% - var(--end))',
                  '--feather-wobble': '3%',
                  '--blur-wobble': 'calc(8px - var(--blur))'
                } : {})
              }}
            >
              <div className="ring-boost" />
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          position: 'absolute',
          top: blobTop,
          left: '50%',
          width: `${blobSize}px`,
          height: `${blobSize}px`,
          transform: 'translate(-50%, -50%)',
          filter: `brightness(${brightnessIncrease})`
        }}>
          {/* 잔상 및 기존 데스크톱 블롭 유지 */}
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
      )}

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
      {/* T3 mobile blob styles */}
      <style jsx>{`
        @property --start-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --end-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --feather-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --blur-wobble { syntax: '<length>'; inherits: true; initial-value: 0px; }

        .blob {
          position: relative;
          border-radius: 50%;
          background: none;
          isolation: isolate;
          --start-anim: clamp(0%, calc(var(--start) + var(--start-wobble)), 90%);
          --end-anim: clamp(0%, calc(var(--end) + var(--end-wobble)), 100%);
          --feather-anim: clamp(0%, calc(var(--feather) + var(--feather-wobble)), 25%);
          animation: ringPulse 6s ease-in-out infinite;
        }

        .blob.frozen {
          animation: none !important;
          --start-wobble: calc(0% - var(--start));
          --end-wobble: 0%;
          --feather-wobble: 0%;
          --blur-wobble: calc(0px - var(--blur));
        }

        .ring-boost {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background:
            var(--bg),
            radial-gradient(circle at var(--center-x) var(--center-y),
              rgba(235, 201, 255, 0) 0 calc(var(--end) - (var(--feather) * 0.7)),
              rgba(235, 201, 255, calc(var(--tint-alpha) * 0.9)) calc(var(--end) + (var(--feather) * 0.3)));
          background-blend-mode: normal, screen;
          filter: blur(calc((var(--blur) + var(--blur-wobble)) * var(--boost))) drop-shadow(0 26px 40px rgba(186, 136, 255, 0.35));
          -webkit-mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--end) - var(--feather)), #000 calc(var(--end) - var(--feather)) calc(var(--end) + (var(--feather) * 1.6)), transparent calc(var(--end) + (var(--feather) * 1.8)));
                  mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--end) - var(--feather)), #000 calc(var(--end) - var(--feather)) calc(var(--end) + (var(--feather) * 1.6)), transparent calc(var(--end) + (var(--feather) * 1.8)));
        }

        .bg-glow {
          position: absolute;
          width: 80vmin;
          aspect-ratio: 1;
          border-radius: 50%;
          left: 64%;
          top: 66%;
          transform: translate(-50%, -50%);
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(circle at 50% 50%, rgba(235,201,255,0.42) 0%, rgba(235,201,255,0.26) 40%, rgba(235,201,255,0) 72%);
          filter: blur(70px);
        }

        .blob::before,
        .blob::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: var(--bg);
        }

        .blob::before {
          filter: blur(var(--inner-blur));
          -webkit-mask: radial-gradient(
            circle at var(--center-x) var(--center-y),
            #000 0 calc(var(--start-anim) - var(--feather-anim)),
            transparent calc(var(--start-anim) + var(--feather-anim))
          );
                  mask: radial-gradient(
            circle at var(--center-x) var(--center-y),
            #000 0 calc(var(--start-anim) - var(--feather-anim)),
            transparent calc(var(--start-anim) + var(--feather-anim))
          );
        }

        .blob::after {
          background:
            var(--bg),
            radial-gradient(circle at var(--center-x) var(--center-y),
              rgba(235, 201, 255, 0) 0 calc(var(--start-anim) - var(--feather-anim)),
              rgba(235, 201, 255, var(--tint-alpha)) var(--end-anim));
          background-blend-mode: normal, screen;
          filter: blur(calc(var(--blur) + var(--blur-wobble))) drop-shadow(0 24px 36px rgba(186, 136, 255, 0.4));
          opacity: 1;
          -webkit-mask: radial-gradient(
            circle at var(--center-x) var(--center-y),
            transparent 0 calc(var(--start-anim) - var(--feather-anim)),
            #000 var(--start-anim) var(--end-anim),
            transparent calc(var(--end-anim) + var(--feather-anim))
          );
                  mask: radial-gradient(
            circle at var(--center-x) var(--center-y),
            transparent 0 calc(var(--start-anim) - var(--feather-anim)),
            #000 var(--start-anim) var(--end-anim),
            transparent calc(var(--end-anim) + var(--feather-anim))
          );
        }

        @supports (mask-composite: intersect) {
          .blob::after {
            mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--start-anim) - var(--feather-anim)), #000 var(--start-anim) var(--end-anim), transparent calc(var(--end-anim) + var(--feather-anim))), linear-gradient(calc(180deg + var(--rim-tilt)), transparent 35%, #000 60%);
            mask-composite: intersect;
          }
        }

        @supports (-webkit-mask-composite: source-in) {
          .blob::after {
            -webkit-mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--start-anim) - var(--feather-anim)), #000 var(--start-anim) var(--end-anim), transparent calc(var(--end-anim) + var(--feather-anim))), linear-gradient(calc(180deg + var(--rim-tilt)), transparent 35%, #000 60%);
            -webkit-mask-composite: source-in;
          }
        }

        @keyframes ringPulse {
          0%, 100% {
            --start-wobble: calc(0% - var(--start));
            --end-wobble: 0%;
            --feather-wobble: 0%;
            --blur-wobble: calc(0px - var(--blur));
          }
          50% {
            --start-wobble: calc(90% - var(--start));
            --end-wobble: 0%;
            --feather-wobble: 5%;
            --blur-wobble: calc(120px - var(--blur));
          }
        }

        @keyframes orbitCW {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(${blobSize * 0.6}px); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(${blobSize * 0.6}px); }
        }
        @keyframes orbitCCW {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(${blobSize * 0.5}px); }
          100% { transform: translate(-50%, -50%) rotate(-360deg) translateX(${blobSize * 0.5}px); }
        }
        @keyframes clusterSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes counterCW {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes counterCCW {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes newOrbEnter {
          0% { transform: translate(-50%, -50%) rotate(85.988deg) translateX(${blobSize * 1.8}px); opacity: 0; }
          100% { transform: translate(-50%, -50%) rotate(85.988deg) translateX(${blobSize * 0.58 * orbitRadiusScale}px); opacity: 0.7; }
        }
        @keyframes finalOrbAppear {
          0% { opacity: 0; transform: translate(-50%, -50%) rotate(-85.44deg) scale(0.9); }
          100% { opacity: 0.95; transform: translate(-50%, -50%) rotate(-85.44deg) scale(1); }
        }
        @keyframes centerGlowPulse {
          0%, 100% { opacity: 0.6; filter: blur(29.5px); }
          50% { opacity: 0.85; filter: blur(22px); }
        }

        /* Label orbits that maintain upright text: rotate(theta) translateX(R) rotate(-theta) */
        @keyframes labelCW {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(${blobSize * 0.58}px) rotate(0deg) translateY(-18px); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(${blobSize * 0.58}px) rotate(-360deg) translateY(-18px); }
        }
        @keyframes labelCCW {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(${blobSize * 0.5}px) rotate(0deg) translateY(-18px); }
          100% { transform: translate(-50%, -50%) rotate(-360deg) translateX(${blobSize * 0.5}px) rotate(360deg) translateY(-18px); }
        }
        @keyframes labelCWBottom {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(${blobSize * 0.58}px) rotate(0deg) translateY(26px); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(${blobSize * 0.58}px) rotate(-360deg) translateY(26px); }
        }
        @keyframes labelCCWBottom {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(${blobSize * 0.5}px) rotate(0deg) translateY(26px); }
          100% { transform: translate(-50%, -50%) rotate(-360deg) translateX(${blobSize * 0.5}px) rotate(360deg) translateY(26px); }
        }
      `}</style>
    </div>
  )
}

