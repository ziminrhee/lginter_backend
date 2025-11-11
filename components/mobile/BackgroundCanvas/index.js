import { useEffect, useMemo, useState } from 'react'
import * as S from './styles'

const MOOD_WORDS = ['즐거워', '상쾌해', '지루해', '찝찝해', '불쾌해']

export default function BackgroundCanvas({ cameraMode = 'default', showMoodWords = true }) {
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
  const [showMoodWordsDelayed, setShowMoodWordsDelayed] = useState(false)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const moodLoop = useMemo(() => [...MOOD_WORDS, MOOD_WORDS[0]], [])
  const [blobSettings, setBlobSettings] = useState({
    centerX: 38,
    centerY: 23,
    start: 50,
    end: 99,
    blurPx: 53,
    rimTilt: 30,
    feather: 12,
    innerBlur: 20,
    // Five-stop palette from reference: 0,13,47,78,100
    color0: '#F7F7E8', // 0%
    color1: '#F4E9D7', // 13%
    color2: '#F79CBF', // 47%
    color3: '#C5F7EA', // 78%
    color4: '#C8F4E9', // 100%
    tintAlpha: 0.85,
    boost: 1.9,
  })
  const [bgSettings, setBgSettings] = useState({
    top: '#ECF8FA',
    mid: '#FAFDFF',
    low: '#FFE0F8',
    bottom: '#FFF0FB',
    midStop: 23,
    lowStop: 64,
  })
  const [mirrorSettings, setMirrorSettings] = useState({
    centerX: 68,
    centerY: 84,
    start: 50,
    end: 63,
    blurPx: 88,
    rimTilt: 23,
    feather: 15,
    innerBlur: 23,
    color0: '#F7F7E8',
    color1: '#F4E9D7',
    color2: '#F79CBF',
    color3: '#C5F7EA',
    color4: '#C8F4E9',
    tintAlpha: 0.85,
    boost: 1.9,
  })
  const [maskSettings, setMaskSettings] = useState({
    enabled: true,
    color: '#FFFFFF',
    opacity: 0.6,
    blurPx: 20,
    radius: 120,
    centerX: 50,
    centerY: 50,
    blend: 'normal',
    showPanel: false,
  })

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
        if (window.isListening !== undefined) setIsVoiceActive(Boolean(window.isListening))
        if (window.bgSettings) {
          const bg = window.bgSettings
          setBgSettings(prev => ({
            top: typeof bg.top === 'string' ? bg.top : prev.top,
            mid: typeof bg.mid === 'string' ? bg.mid : prev.mid,
            low: typeof bg.low === 'string' ? bg.low : prev.low,
            bottom: typeof bg.bottom === 'string' ? bg.bottom : prev.bottom,
            ...(() => {
              const maybeMid = Number(bg.midStop)
              const maybeLow = Number(bg.lowStop)
              let newMid = Number.isFinite(maybeMid) ? maybeMid : prev.midStop
              let newLow = Number.isFinite(maybeLow) ? maybeLow : prev.lowStop
              newMid = Math.max(0, Math.min(newMid, 99))
              newLow = Math.max(1, Math.min(newLow, 100))
              if (newLow <= newMid) {
                newLow = Math.min(100, newMid + 1)
              }
              newMid = Math.min(newMid, newLow - 1)
              return { midStop: newMid, lowStop: newLow }
            })(),
          }))
        }
        if (window.mirrorSettings) {
          const ms = window.mirrorSettings
          setMirrorSettings(prev => ({
            centerX: ms.centerX ?? prev.centerX,
            centerY: ms.centerY ?? prev.centerY,
            start: ms.start ?? prev.start,
            end: ms.end ?? prev.end,
            blurPx: ms.blurPx ?? prev.blurPx,
            rimTilt: ms.rimTilt ?? prev.rimTilt,
            feather: ms.feather ?? prev.feather,
            innerBlur: ms.innerBlur ?? prev.innerBlur,
            color0: ms.color0 ?? prev.color0,
            color1: ms.color1 ?? prev.color1,
            color2: ms.color2 ?? prev.color2,
            color3: ms.color3 ?? prev.color3,
            color4: ms.color4 ?? prev.color4,
            tintAlpha: ms.tintAlpha ?? prev.tintAlpha,
            boost: ms.boost ?? prev.boost,
          }))
        }
        if (window.maskSettings) {
          const ms = window.maskSettings
          setMaskSettings(prev => ({
            enabled: ms.enabled ?? prev.enabled,
            color: typeof ms.color === 'string' ? ms.color : prev.color,
            opacity: Number.isFinite(Number(ms.opacity)) ? Math.max(0, Math.min(1, Number(ms.opacity))) : prev.opacity,
            blurPx: Number.isFinite(Number(ms.blurPx)) ? Math.max(0, Math.min(200, Number(ms.blurPx))) : prev.blurPx,
            radius: Number.isFinite(Number(ms.radius)) ? Math.max(10, Math.min(600, Number(ms.radius))) : prev.radius,
            centerX: Number.isFinite(Number(ms.centerX)) ? Math.max(0, Math.min(100, Number(ms.centerX))) : prev.centerX,
            centerY: Number.isFinite(Number(ms.centerY)) ? Math.max(0, Math.min(100, Number(ms.centerY))) : prev.centerY,
            blend: typeof ms.blend === 'string' ? ms.blend : prev.blend,
            showPanel: Boolean(ms.showPanel ?? prev.showPanel),
          }))
        }
      }
      requestAnimationFrame(check)
    }
    check()
  }, [])

  useEffect(() => {
    if (!mounted) return
    let timer
    if (showMoodWords) {
      timer = setTimeout(() => setShowMoodWordsDelayed(true), 2000)
    } else {
      setShowMoodWordsDelayed(false)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [showMoodWords, mounted])

  if (!mounted) {
    return (
      <S.PreMountCover $bg={'linear-gradient(to bottom, #FFF5F7 0%, #F5E6F5 30%, #E8D5E0 60%, rgb(125, 108, 118) 100%)'} />
    )
  }

  // 꾹 누르기 이징 (사용하되 비주얼 변화는 제거)
  const pressEase = pressProgress * pressProgress * (3.0 - 2.0 * pressProgress)
  
  // 모바일 페이지에서 크기와 위치 (fixed)
  const blobTop = '60%'
  
  const baseBlobSize = 350
  const idleScaleFactor = 320 / baseBlobSize
  const listeningScaleFactor = 1
  const uiScaleFactor = isVoiceActive ? listeningScaleFactor : idleScaleFactor
  // 프레스 시 화이트아웃 제거: 블러/밝기 증가 사용하지 않음
  const blurIncrease = 0
  const brightnessIncrease = 1
  const saturationValue = isVoiceActive ? 1.35 : 1
  const boostedTintAlpha = Math.min(1, blobSettings.tintAlpha * (isVoiceActive ? 1.05 : 1))
  const boostedOuterBoost = Math.min(2.2, blobSettings.boost * (isVoiceActive ? 1.08 : 1))
  const mirrorTintAlpha = Math.min(1, mirrorSettings.tintAlpha * (isVoiceActive ? 1.05 : 1))
  const mirrorOuterBoost = Math.min(2.2, mirrorSettings.boost * (isVoiceActive ? 1.08 : 1))
  const uiScaleTransitionMs = 240
  // Figma-provided orbit shapes scale helpers
  const designBase = 350
  const blurBase = 50
  const blurPx = Math.round(blurBase * (baseBlobSize / designBase))
  const shape1W = baseBlobSize * 0.534 // ≈ 187/350
  const shape1H = baseBlobSize * 0.554 // ≈ 194/350
  const shape2W = baseBlobSize * 0.735 // ≈ 257/350
  const shape2H = baseBlobSize * 0.763 // ≈ 267/350
  const blobSize = baseBlobSize

  const bgGradient = `linear-gradient(to bottom, ${bgSettings.top} 0%, ${bgSettings.mid} ${bgSettings.midStop}%, ${bgSettings.low} ${bgSettings.lowStop}%, ${bgSettings.bottom} 100%)`

  return (
    <>
      <S.Root $bg={bgGradient}>
        <S.KeyframesGlobal $blurIncrease={0} $blobSize={blobSize} $orbitRadiusScale={orbitRadiusScale} />
        <S.BlobCssGlobal />
        <S.BlobWrapper
          $top={blobTop}
          $size={blobSize}
          $opacity={blobAlpha}
          $opacityMs={blobOpacityMs}
          $brightness={brightnessIncrease}
        >
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
                '--tint-alpha': boostedTintAlpha,
                '--boost': boostedOuterBoost,
                width: `${blobSize}px`,
                aspectRatio: '1 / 1',
                transform: `translateZ(0) scale(${blobScale * uiScaleFactor})`,
                transition: `transform ${uiScaleTransitionMs}ms ease, opacity ${blobOpacityMs}ms ease, filter ${blobOpacityMs}ms ease`,
                opacity: mainBlobFade ? 0 : 1,
                filter: (() => {
                  const filters = []
                  if (mainBlobFade) filters.push('blur(10px)')
                  if (saturationValue !== 1) filters.push(`saturate(${saturationValue})`)
                  return filters.length ? filters.join(' ') : 'none'
                })(),
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
          {/* Mirrored mask blob: same size and levers as the main blob, opposite rim direction */}
          <div
            className={`blob mirror${isListeningFlag ? ' frozen' : ''}`}
            style={{
              '--center-x': `${mirrorSettings.centerX}%`,
              '--center-y': `${mirrorSettings.centerY}%`,
              '--start': `${mirrorSettings.start}%`,
              '--end': `${mirrorSettings.end}%`,
              '--blur': `${mirrorSettings.blurPx + blurIncrease}px`,
              '--feather': `${mirrorSettings.feather}%`,
              '--inner-blur': `${mirrorSettings.innerBlur}px`,
              '--rim-tilt': `${mirrorSettings.rimTilt}deg`,
              '--c0': `${mirrorSettings.color0}`,
              '--c1': `${mirrorSettings.color1}`,
              '--c2': `${mirrorSettings.color2}`,
              '--c3': `${mirrorSettings.color3}`,
              '--c4': `${mirrorSettings.color4}`,
              '--bg': `radial-gradient(circle at var(--center-x) var(--center-y), var(--c0) 0%, var(--c1) 13%, var(--c2) 47%, var(--c3) 78%, var(--c4) 100%)`,
              '--tint-alpha': mirrorTintAlpha,
              '--boost': mirrorOuterBoost,
              width: `${blobSize}px`,
              aspectRatio: '1 / 1',
              transform: `translateZ(0) scale(${blobScale * uiScaleFactor})`,
              transition: `transform ${uiScaleTransitionMs}ms ease, opacity ${blobOpacityMs}ms ease, filter ${blobOpacityMs}ms ease`,
              opacity: mainBlobFade ? 0 : 1,
              filter: (() => {
                const filters = []
                if (mainBlobFade) filters.push('blur(10px)')
                if (saturationValue !== 1) filters.push(`saturate(${saturationValue})`)
                return filters.length ? filters.join(' ') : 'none'
              })(),
              ...(isListeningFlag ? {
                animation: 'none',
                '--start-wobble': 'calc(12% - var(--start))',
                '--end-wobble': 'calc(86% - var(--end))',
                '--feather-wobble': '3%',
                '--blur-wobble': 'calc(8px - var(--blur))'
              } : {})
            }}
          />
        {showMoodWords && (
          <S.MoodWords $visible={showMoodWordsDelayed} style={{ '--loop-steps': moodLoop.length - 1, '--cycle-duration': '7.2s' }}>
            <S.MoodTrack>
              {moodLoop.map((word, idx) => (
                <S.MoodWord key={`${word}-${idx}`}>
                  {word}
                </S.MoodWord>
              ))}
            </S.MoodTrack>
          </S.MoodWords>
        )}
        {showKeywords && (
          <S.KeywordLayer $visible={showKeywords}>
            {keywordLabels[0] ? (
              <S.KeywordItem $pos="top" $visible={showKeywords}>
                {keywordLabels[0]}
              </S.KeywordItem>
            ) : null}
            {keywordLabels[1] ? (
              <S.KeywordItem $pos="left" $visible={showKeywords}>
                {keywordLabels[1]}
              </S.KeywordItem>
            ) : null}
            {keywordLabels[2] ? (
              <S.KeywordItem $pos="bottom" $visible={showKeywords}>
                {keywordLabels[2]}
              </S.KeywordItem>
            ) : null}
            {keywordLabels[3] ? (
              <S.KeywordItem $pos="right" $visible={showKeywords}>
                {keywordLabels[3]}
              </S.KeywordItem>
            ) : null}
          </S.KeywordLayer>
        )}
        </S.BlobWrapper>
      </S.Root>
      {/* Panel removed: mirrored blob follows main blob levers automatically */}
    </>
  )
}

