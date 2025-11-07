import { useEffect, useState } from 'react'
import * as S from './styles'

export default function BackgroundCanvas({ cameraMode = 'default' }) {
  const [mounted, setMounted] = useState(false)
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
    
    // always mobile page
    
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
      <S.PreMountCover $bg={'linear-gradient(to bottom, #FFF5F7 0%, #F5E6F5 30%, #E8D5E0 60%, rgb(125, 108, 118) 100%)'} />
    )
  }

  // 꾹 누르기 이징 (사용하되 비주얼 변화는 제거)
  const pressEase = pressProgress * pressProgress * (3.0 - 2.0 * pressProgress)
  
  // 모바일 페이지에서 크기와 위치 (fixed)
  const blobSize = 350
  const blobTop = '60%'
  
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
    <S.Root $bg={bgGradient}>
      <S.KeyframesGlobal $blurIncrease={0} $blobSize={blobSize} $orbitRadiusScale={orbitRadiusScale} />
      <S.BlobCssGlobal />
      <S.BlobWrapper $top={blobTop} $size={blobSize} $opacity={blobAlpha} $opacityMs={blobOpacityMs} $brightness={brightnessIncrease}>
        <S.BGGlow />
        <S.Cluster $spin={clusterSpin}>
            {showOrbits && (
              <>
                {/* Orbit A - Figma spec: linear gradient #000 -> #0D3664 -> #E096E2 with 50px blur */}
                <S.OrbitWrap $d={blobSize * 0.92} $anim={'orbitCW 12s linear infinite'}>
                  <S.OrbitShape $rotate={-176.444} $w={shape1W} $h={shape1H} $blur={blurPx} $bg={'linear-gradient(180deg, #000000 0%, #0D3664 50%, #E096E2 98.08%)'} />
                </S.OrbitWrap>
                {/* Orbit B - Figma spec: pink gradient with 50px blur */}
                <S.OrbitWrap $d={blobSize * 0.84} $anim={'orbitCCW 14s linear infinite'}>
                  <S.OrbitShape $rotate={-144.552} $w={shape2W} $h={shape2H} $blur={blurPx} $bg={'linear-gradient(180deg, #FC8AD6 0%, #FFD8E0 75.48%)'} />
                </S.OrbitWrap>
                {/* keyword labels rendered outside orbit containers to avoid inheriting rotation */}
                {showKeywords ? (
                  <>
                    {/* Temp (CW) */}
                    {keywordLabels[0] ? (<S.Label $anim={'labelCW 12s linear infinite'}>{keywordLabels[0]}</S.Label>) : null}
                    {/* Humidity (CCW) */}
                    {keywordLabels[1] ? (<S.Label $anim={'labelCCW 14s linear infinite'}>{keywordLabels[1]}</S.Label>) : null}
                    {/* Light color name (CW, bottom offset) */}
                    {keywordLabels[2] ? (<S.Label $anim={'labelCWBottom 12s linear infinite'}>{keywordLabels[2]}</S.Label>) : null}
                    {/* Music mood (CCW, bottom offset) */}
                    {keywordLabels[3] ? (<S.Label $anim={'labelCCWBottom 14s linear infinite'}>{keywordLabels[3]}</S.Label>) : null}
                  </>
                ) : null}
                {/* New entering orb (from outside, then joins rotation) */}
                {newOrbEnter && (
                  <S.NewOrbWrap $d={blobSize * 0.92}>
                    <S.NewOrbShape $w={Math.round(blobSize * 0.834)} $h={Math.round(blobSize * 0.866)} $br={Math.round(blobSize * 0.866)} $enterMs={Math.max(700, blobOpacityMs)} />
                  </S.NewOrbWrap>
                )}

                {/* Final phase: extra orb and center glow */}
                {showFinalOrb && (
                  <S.FinalOrbWrap $w={blobSize * 1.02} $h={blobSize * 1.06}>
                    <S.FinalOrbShape $w={Math.round(blobSize * 1.01)} $h={Math.round(blobSize * 1.05)} $br={Math.round(blobSize * 1.05)} />
                  </S.FinalOrbWrap>
                )}
                {showCenterGlow && (
                  <S.CenterGlow $d={Math.round(blobSize * 1.10)} />
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
          </S.Cluster>
        </S.BlobWrapper>
    </S.Root>
  )
}

