import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import useSocketMobile from "@/utils/hooks/useSocketMobile";
import useOpenAIAnalysis from "@/utils/hooks/useOpenAIAnalysis";
import OrchestratingScreen from "./sections/OrchestratingScreen";
import HeroText from "./sections/HeroText";
import PressOverlay from "./sections/PressOverlay";
import HiddenForm from "./sections/HiddenForm";
import ListeningOverlay from "./sections/ListeningOverlay";
import BlobControls from "./sections/BlobControls";
import useLongPressProgress from "./hooks/useLongPressProgress";
import useSpeechRecognition from "./hooks/useSpeechRecognition";
import useWeatherGreeting from "./hooks/useWeatherGreeting";
import { appContainer, contentWrapper } from "./modules/shared/layout";

export default function MobileControls() {
  const router = useRouter();
  const isModal = router?.query?.variant === 'modal';

  const { emitNewName, emitNewVoice, socket } = useSocketMobile();
  const { loading, recommendations, analyze, reset } = useOpenAIAnalysis(socket);

  const [name, setName] = useState("");
  const [mood, setMood] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPress, setShowPress] = useState(false);
  const [listeningStage, setListeningStage] = useState('idle'); // idle | live | finalHold | fadeOut
  const [showResetDelayed, setShowResetDelayed] = useState(false);

  const orchestratingStartAtRef = useRef(null);
  const [orchestratingLock, setOrchestratingLock] = useState(false);
  const orchestrateMinMs = 2000;
  const weatherGreeting = useWeatherGreeting();

  const { isListening, startVoiceRecognition } = useSpeechRecognition({
    onStart: () => {
      setListeningStage('live');
    },
    onInterim: (text) => {
      setLiveTranscript(text);
    },
    onResult: ({ transcript }) => {
      setMood(transcript);
      setLiveTranscript("");
      if (!name.trim()) setName('사용자');
      setListeningStage('finalHold');
      setTimeout(() => setListeningStage('fadeOut'), 600);
      setTimeout(() => setListeningStage('idle'), 1100);
    }
  });

  // orchestrating 락 유지 시간 보장
  useEffect(() => {
    if (loading) {
      orchestratingStartAtRef.current = Date.now();
      setOrchestratingLock(true);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && orchestratingStartAtRef.current && orchestratingLock) {
      const elapsed = Date.now() - orchestratingStartAtRef.current;
      const remaining = Math.max(0, orchestrateMinMs - elapsed);
      const t = setTimeout(() => setOrchestratingLock(false), remaining);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [loading, orchestratingLock]);

  // 결과 노출 후 3초 뒤 버튼 표시
  useEffect(() => {
    if (!loading && !orchestratingLock && submitted && recommendations) {
      setShowResetDelayed(false);
      const t = setTimeout(() => setShowResetDelayed(true), 3000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [submitted, recommendations, loading, orchestratingLock]);

  const { pressProgress, handlePressStart, handlePressEnd } = useLongPressProgress({
    onCompleted: () => startVoiceRecognition()
  });

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!name.trim() || !mood.trim()) {
      return;
    }
    const userId = name.trim();
    try {
      socket?.emit('mobile-init', { userId });
    } catch {}
    emitNewName(name.trim(), { userId, mood: mood.trim() });
    emitNewVoice(mood.trim(), mood.trim(), 0.8, { userId, name: userId });
    setSubmitted(true);
    await analyze(name.trim(), mood.trim());
  }, [name, mood, emitNewName, emitNewVoice, analyze, socket]);

  const handleReset = useCallback(() => {
    setSubmitted(false);
    reset();
    setName("");
    setMood("");
    setShowPress(false);
    setShowResetDelayed(false);
    // 전체 리로드로 초기 상태 복귀
    try { window.location.reload(); } catch {}
  }, [reset]);

  const containerStyle = appContainer(isModal);
  const wrapperStyle = contentWrapper(isModal);

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        {!submitted && !isListening && (
          <>
            <HeroText isModal={isModal} onFinalPhase={() => setShowPress(true)} />
            {weatherGreeting && (
              <div style={{ display: 'none' }}>
                <p>{weatherGreeting.fullGreeting}</p>
              </div>
            )}
            <p style={{ display: 'none' }}>
              이름과 기분을 입력해주세요
            </p>
          </>
        )}

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <HiddenForm
              name={name}
              onNameChange={setName}
              mood={mood}
              onMoodChange={setMood}
            />
            {showPress && !isListening && (
              <PressOverlay
                pressProgress={pressProgress}
                onPressStart={handlePressStart}
                onPressEnd={handlePressEnd}
              />
            )}
            {(isListening || listeningStage === 'finalHold' || listeningStage === 'fadeOut') && (
              <ListeningOverlay
                topLabel="듣고 있어요"
                centerText={(listeningStage === 'finalHold' && mood) ? `“${mood}”` : (liveTranscript ? `“${liveTranscript}”` : undefined)}
                stage={listeningStage === 'fadeOut' ? 'fadeOut' : 'live'}
              />
            )}
          </form>
        ) : (loading || orchestratingLock) ? (
          <>
            <OrchestratingScreen />
          </>
        ) : recommendations ? (
          <>
            <div style={{
              position: 'fixed',
              bottom: '22vh',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255,255,255,0.82)',
              color: '#222',
              padding: '16px 20px',
              borderRadius: '16px',
              boxShadow: '0 10px 28px rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              zIndex: 2000,
              minWidth: '240px',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 700 }}>온도: {recommendations.temperature}℃</div>
              <div style={{ fontWeight: 700 }}>습도: {recommendations.humidity}%</div>
              <div style={{ fontWeight: 700 }}>조명 색상: {recommendations.lightColor}</div>
              <div style={{ fontWeight: 700 }}>음악: {recommendations.song}</div>
            </div>
            {showResetDelayed && (
              <div style={{
                position: 'fixed',
                bottom: '12vh',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2600
              }}>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: '0.85rem 2.6rem',
                    borderRadius: 999,
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#fff',
                    background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                    boxShadow: '0 12px 30px rgba(147, 51, 234, 0.35)',
                    cursor: 'pointer'
                  }}
                >
                  다시 대화하기
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
      <BlobControls />
    </div>
  );
}
<<<<<<< HEAD
import { useState, useEffect, useCallback, useRef } from "react";
=======
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
>>>>>>> a602ee2 (Mobile results UX: pause blobs, delayed reset; reload on reset; policy+prompt integration fixes)
import { useRouter } from "next/router";
import useSocketMobile from "@/utils/hooks/useSocketMobile";
import useOpenAIAnalysis from "@/utils/hooks/useOpenAIAnalysis";
import LoadingScreen from "./sections/LoadingScreen";
import OrchestratingScreen from "./sections/OrchestratingScreen";
import HeroText from "./sections/HeroText";
import PressOverlay from "./sections/PressOverlay";
import HiddenForm from "./sections/HiddenForm";
import BlobControls from "./sections/BlobControls";
import useLongPressProgress from "./hooks/useLongPressProgress";
import useSpeechRecognition from "./hooks/useSpeechRecognition";
import useWeatherGreeting from "./hooks/useWeatherGreeting";
import useTypewriter from "./hooks/useTypewriter";
import { fonts, spacing } from "./styles/tokens";
import { appContainer, contentWrapper } from "./modules/shared/layout";
import ListeningOverlay from "./sections/ListeningOverlay";
<<<<<<< HEAD
=======
import ReasonPanel from './views/ReasonPanel';
import InputForm from './views/InputForm';
import { fonts } from "./sections/styles/tokens";

import BackgroundCanvas from '@/components/mobile/BackgroundCanvas';
import { MUSIC_CATALOG } from "@/utils/data/musicCatalog";
>>>>>>> a602ee2 (Mobile results UX: pause blobs, delayed reset; reload on reset; policy+prompt integration fixes)

export default function MobileControls() {
  const router = useRouter();
  const isModal = router?.query?.variant === 'modal';
<<<<<<< HEAD
  const { emitNewName, emitNewVoice, socket } = useSocketMobile();
  const { loading, recommendations, analyze, reset } = useOpenAIAnalysis(socket);
=======
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [showResetDelayed, setShowResetDelayed] = useState(false);
  const [notice, setNotice] = useState(null);
  const { emitNewName, emitNewVoice, socket } = useSocketMobile({
    onMobileDecision: (payload) => {
      // payload: { userId, params: { temp, humidity, lightColor, music }, reason }
      const rec = {
        temperature: payload?.params?.temp,
        humidity: payload?.params?.humidity,
        lightColor: payload?.params?.lightColor,
        song: payload?.params?.music,
        windLevel: payload?.params?.windLevel,
        purifierOn: payload?.params?.purifierOn,
        purifierMode: payload?.params?.purifierMode,
        reason: payload?.reason,
        emotionKeyword: payload?.emotionKeyword,
        flags: payload?.flags
      };
      setRecommendations(rec);
      if (payload?.flags?.abusive) {
        setNotice('정중한 표현으로 다시 말씀해 주세요.');
        setTimeout(() => setNotice(null), 2500);
      } else if (payload?.flags?.offTopic) {
        setNotice('새로운 대답이네요! 적절한 값을 추천했어요.');
        setTimeout(() => setNotice(null), 2000);
      }
      setLoading(false);
    }
  });
>>>>>>> a602ee2 (Mobile results UX: pause blobs, delayed reset; reload on reset; policy+prompt integration fixes)
  const [name, setName] = useState("");
  const [mood, setMood] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPress, setShowPress] = useState(false);
  const [listeningStage, setListeningStage] = useState('idle'); // idle | live | finalHold | fadeOut
  const orchestratingStartAtRef = useRef(null);
  const [orchestratingLock, setOrchestratingLock] = useState(false);
  const orchestrateMinMs = 5500;
  const weatherGreeting = useWeatherGreeting();

  const { isListening, startVoiceRecognition } = useSpeechRecognition({
    onStart: () => {
      setListeningStage('live');
      if (typeof window !== 'undefined') {
        window.blobOpacityMs = 200; // ensure visible when starting listen
        window.blobOpacity = 1;
      }
    },
    onInterim: (text) => {
      setLiveTranscript(text);
    },
    onResult: ({ transcript }) => {
      setMood(transcript);
      setLiveTranscript("");
      if (!name.trim()) setName('사용자');
      // hold final text for 1s then fade out
      setListeningStage('finalHold');
      setTimeout(() => setListeningStage('fadeOut'), 1000);
      // after fade out completes, remove overlay
      setTimeout(() => setListeningStage('idle'), 1600);
    }
  });

  // react to listening stage for blob opacity transitions
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (listeningStage === 'fadeOut' && !loading) {
      window.blobOpacityMs = 600;
      window.blobOpacity = 0; // fade to fully transparent so background만 노출
    }
  }, [listeningStage, loading]);

  // when loading (orchestrating) begins, fade blob back in over 2s
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (loading) {
      window.blobOpacityMs = 2000;
      window.blobOpacity = 1;
      window.showOrbits = true;
      window.blobScale = 1; window.blobScaleMs = 300;
      window.clusterSpin = false;
      window.mainBlobFade = false;
      window.newOrbEnter = false;
      window.orbitRadiusScale = 1;
      orchestratingStartAtRef.current = Date.now();
      setOrchestratingLock(true);
    }
  }, [loading]);

  // orchestrating hold and merge transition
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!loading && orchestratingStartAtRef.current && orchestratingLock) {
      const elapsed = Date.now() - orchestratingStartAtRef.current;
      const remaining = Math.max(0, orchestrateMinMs - elapsed);
      const runMerge = () => {
        // fade + blur out main blob, spawn entering orb, then start cluster spin
        window.blobOpacityMs = 900;
        window.mainBlobFade = true;
        window.newOrbEnter = true;
        window.clusterSpin = true;
        // allow next screen after short visual settle
        setTimeout(() => {
          setOrchestratingLock(false);
        }, 1000);
      };
      if (remaining > 0) {
        const t = setTimeout(runMerge, remaining);
        return () => clearTimeout(t);
      }
      runMerge();
    }
  }, [loading, orchestratingLock]);

  // (moved below state/typedReason declarations)

  const { pressProgress, handlePressStart, handlePressEnd } = useLongPressProgress({
    onCompleted: () => startVoiceRecognition()
  });

  // Build the 4-paragraph message for the typewriter effect
  const p1 = mood ? `“${mood}” 기분에 맞춰` : '기분에 맞춰';
  const p2 = recommendations ? `온도는 ${recommendations.temperature}°C로, 습도는 ${recommendations.humidity}%로 설정할게요.` : '';
  const p3 = recommendations ? `집 안의 조명은 #${String(recommendations?.lightColor || '').replace('#','')} 색감으로 바꿔 공간을 부드럽게 밝힐게요.` : '';
  const p4 = recommendations ? `무드에 맞춘 ${recommendations.song}을 재생할게요.` : '';
  const paragraphs = [p1, p2, p3, p4];
  const fullTypedText = recommendations ? paragraphs.join('\n\n') : null;

  const { typedReason, showReason, showHighlights, showResults: typewriterShowResults } = useTypewriter(
    fullTypedText
  );

  // After typing completes, fade out text and run orb showcase for 5s, then show results
  const [fadeText, setFadeText] = useState(false);
  const [localShowResults, setLocalShowResults] = useState(false);
  const [orbShowcaseStarted, setOrbShowcaseStarted] = useState(false);

  // (Typewriter, weather, press handlers moved to hooks above)

  // When the typewriter finishes: 2s hold -> fade text -> 3s blobs solo -> attach labels -> results
  useEffect(() => {
    if (!fullTypedText) return;
    if (typedReason && typedReason.length >= fullTypedText.length && !orbShowcaseStarted) {
      setOrbShowcaseStarted(true);

      const TEXT_HOLD_MS = 2000;
      const ORBIT_SOLO_MS = 3000;
      const LABEL_HOLD_MS = 2000;

      const timers = [];

      // Precompute labels (not shown yet)
      let colorName = '조명';
      let musicLabel = '';
      if (recommendations) {
        const hex = (recommendations.lightColor || '').replace('#','');
        if (hex.length === 6) {
          const r = parseInt(hex.slice(0,2), 16) / 255;
          const g = parseInt(hex.slice(2,4), 16) / 255;
          const b = parseInt(hex.slice(4,6), 16) / 255;
          const max = Math.max(r, g, b), min = Math.min(r, g, b);
          let h = 0; const d = max - min;
          if (d !== 0) {
            if (max === r) h = ((g - b) / d) * 60;
            else if (max === g) h = ((b - r) / d) * 60 + 120;
            else h = ((r - g) / d) * 60 + 240;
            if (h < 0) h += 360;
          }
          if (h < 20 || h >= 340) colorName = '빨간 조명';
          else if (h < 50) colorName = '주황 조명';
          else if (h < 70) colorName = '노란 조명';
          else if (h < 170) colorName = '초록 조명';
          else if (h < 260) colorName = '파란 조명';
          else if (h < 310) colorName = '보라 조명';
          else colorName = '분홍 조명';
        }
        const s = (recommendations.song || '').toLowerCase();
        if (s.includes('jazz')) musicLabel = '재즈';
        else if (s.includes('rock')) musicLabel = '록';
        else if (s.includes('hip') || s.includes('rap')) musicLabel = '힙합';
        else if (s.includes('ballad')) musicLabel = '발라드';
        else if (s.includes('pop')) musicLabel = '팝';
        else musicLabel = (recommendations.song || '').split('-')[0].trim();
      }

      const t1 = setTimeout(() => {
        // fade out text, start orbits (no labels)
        setFadeText(true);
        if (typeof window !== 'undefined') {
          window.showFinalOrb = true;
          window.showCenterGlow = true;
          window.clusterSpin = true;
          window.showOrbits = true;
          window.showKeywords = false;
        }

        const t2 = setTimeout(() => {
          // attach labels after solo spin
          if (typeof window !== 'undefined' && recommendations) {
            window.keywordLabels = [
              `${recommendations.temperature}°C`,
              `${recommendations.humidity}%`,
              colorName,
              musicLabel
            ];
            window.showKeywords = true;
          }

          const t3 = setTimeout(() => {
            setLocalShowResults(true);
            setOrchestratingLock(false);
            if (typeof window !== 'undefined') {
              window.showKeywords = false;
              window.showFinalOrb = false;
              window.showCenterGlow = false;
              window.clusterSpin = false;
              window.mainBlobFade = false;
              window.newOrbEnter = false;
            }
          }, LABEL_HOLD_MS);
          timers.push(t3);
        }, ORBIT_SOLO_MS);
        timers.push(t2);
      }, TEXT_HOLD_MS);
      timers.push(t1);

      return () => { timers.forEach((id) => clearTimeout(id)); };
    }
  }, [typedReason, fullTypedText, orbShowcaseStarted, recommendations]);

  // When the showcase flips to results stage, pause blobs and start delayed reset button
  useEffect(() => {
    if (localShowResults && recommendations && !loading && !orchestratingLock) {
      if (typeof window !== 'undefined') {
        window.orbitPaused = true;
        window.blobOpacityMs = 900;
      }
      setShowResetDelayed(false);
      const t = setTimeout(() => setShowResetDelayed(true), 3000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [localShowResults, recommendations, loading, orchestratingLock]);
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!name.trim() || !mood.trim()) {
      console.log('❌ Mobile: Name or mood is empty');
      return;
    }
    
    console.log('📱 Mobile: Submitting data:', { name: name.trim(), mood: mood.trim() });
    
    // 이름과 기분 전송 (서버 스키마에 맞춰 userId 포함)
    const userId = name.trim();
    try {
      // 방 참가 (타겟 전송을 위해)
      socket?.emit('mobile-init', { userId });
    } catch {}
    emitNewName(name.trim(), { userId, mood: mood.trim() });
    emitNewVoice(mood.trim(), mood.trim(), 0.8, { userId, name: userId });
    
    console.log('✅ Mobile: Data emitted successfully');
    
    // OpenAI 분석 시작
    setSubmitted(true);
    await analyze(name.trim(), mood.trim());
  }, [name, mood, emitNewName, emitNewVoice, analyze]);

  const handleReset = useCallback(() => {
    setSubmitted(false);
<<<<<<< HEAD
    reset();
    setName("");
    setMood("");
    setShowPress(false);
    setShowReason(false);
    setTypedReason("");
    setShowHighlights(false);
    setShowResults(false);
    setFadeText(false);
    setLocalShowResults(false);
    setOrbShowcaseStarted(false);
=======
    setRecommendations(null);
    setLoading(false);
    setShowResetDelayed(false);
    setName("");
    setMood("");
    setShowPress(false);
    resetShowcase();
>>>>>>> a602ee2 (Mobile results UX: pause blobs, delayed reset; reload on reset; policy+prompt integration fixes)
    if (typeof window !== 'undefined') {
      window.showFinalOrb = false;
      window.showCenterGlow = false;
      window.orbitPaused = false;
      // 완전 새로 시작: 화면 리로드
      setTimeout(() => {
        try { window.location.reload(); } catch {}
      }, 0);
    }
  }, [reset]);

  const containerStyle = appContainer(isModal);
  const wrapperStyle = contentWrapper(isModal);

  // 모바일 페이지에서 스크롤 락 (마운트/언마운트 시 적용/해제)
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevOverscroll = document.documentElement.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.style.overscrollBehavior = prevOverscroll;
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        {!submitted && !isListening && (
          <>
            <HeroText isModal={isModal} onFinalPhase={() => setShowPress(true)} />
            
            {/* 날씨 기반 인사말 - 기능 유지하되 숨김 */}
            {weatherGreeting && (
              <div style={{ display: 'none' }}>
                <p>{weatherGreeting.fullGreeting}</p>
              </div>
            )}
            
            {/* 설명 문구 - 기능 유지하되 숨김 */}
            <p style={{ display: 'none' }}>
              이름과 기분을 입력해주세요
            </p>
          </>
        )}
        
        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <HiddenForm
              name={name}
              onNameChange={setName}
              mood={mood}
              onMoodChange={setMood}
            />
            
            {showPress && !isListening && (
              <PressOverlay
                pressProgress={pressProgress}
                onPressStart={handlePressStart}
                onPressEnd={handlePressEnd}
              />
            )}
            {(isListening || listeningStage === 'finalHold' || listeningStage === 'fadeOut') && (
              <ListeningOverlay
                topLabel="듣고 있어요"
                centerText={(listeningStage === 'finalHold' && mood) ? `“${mood}”` : (liveTranscript ? `“${liveTranscript}”` : undefined)}
                stage={listeningStage === 'fadeOut' ? 'fadeOut' : 'live'}
              />
            )}
          </form>
        ) : (loading || orchestratingLock) ? (
          <>
            <OrchestratingScreen />
          </>
<<<<<<< HEAD
        ) : recommendations && localShowResults ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 추천 결과 표시 */}
            {(
              <>
                <div style={{
                  background: 'linear-gradient(135deg, #F3E8FF 0%, #FCEAFE 100%)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  animation: 'slideInUp 0.5s ease-out'
                }}>
                  <h3 style={{
                    color: '#9333EA',
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    🎯 {(name || '사용자')}님을 위한 추천
                  </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  padding: '1rem',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌡️</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#9333EA' }}>
                    {recommendations.temperature}°C
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#9333EA', opacity: 0.7, marginTop: '0.25rem' }}>
                    온도
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  padding: '1rem',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💧</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#9333EA' }}>
                    {recommendations.humidity}%
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#9333EA', opacity: 0.7, marginTop: '0.25rem' }}>
                    습도
                  </div>
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: recommendations.lightColor,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', color: '#9333EA', opacity: 0.7, marginBottom: '0.25rem' }}>
                      💡 조명 색상
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#9333EA' }}>
                      {recommendations.lightColor}
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#9333EA', opacity: 0.7, marginBottom: '0.5rem' }}>
                  🎵 추천 음악
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#9333EA' }}>
                  {recommendations.song}
                </div>
              </div>
            </div>
            
            
            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)'
              }}
            >
              다시 입력하기
            </button>
              </>
            )}
          </div>
        ) : recommendations && showReason ? (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
            padding: '2rem',
            boxSizing: 'border-box',
            overflow: 'auto'
          }}>
            <div style={{
              width: '86%',
              margin: '0 auto',
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
              textAlign: 'center',
              fontFamily: fonts.ui,
              color: '#111',
              opacity: fadeText ? 0 : 1,
              filter: fadeText ? 'blur(6px)' : 'none',
              transition: 'opacity 1200ms ease, filter 1200ms ease'
            }}>
              {(() => {
                const typed = typedReason || '';
                const total = fullTypedText ? fullTypedText.length : 0;
                const isTyping = Boolean(fullTypedText) && typed.length < total;
                const newlineLen = 2; // "\n\n"
                let remaining = typed.length;
                let activeIdx = 0;
                const displayBlocks = paragraphs.map((para, i) => {
                  if (remaining <= 0) return '';
                  const take = Math.min(para.length, remaining);
                  const out = para.slice(0, take);
                  remaining -= take;
                  if (remaining > 0 && i < paragraphs.length - 1) {
                    // consume the two newline characters between paragraphs
                    remaining = Math.max(0, remaining - newlineLen);
                  }
                  if (remaining > 0) activeIdx = i + 1; else activeIdx = i; // currently typing this index
                  return out;
                });
                const keywordRegex = /(\d+°C|\d+%|#[A-Fa-f0-9]{6}|온도|습도|조명|음악|색상)/g;
                return displayBlocks.map((block, idx) => (
                  <p key={idx} style={{
                    fontSize: '1.25rem',
                    lineHeight: 1.6,
                    fontWeight: idx === 0 ? 800 : 500,
                    marginTop: idx === 0 ? 0 : '1.5rem'
                  }}>
                    {showHighlights
                      ? block.split(keywordRegex).map((part, i) => (
                          keywordRegex.test(part)
                            ? <span key={i} style={{ fontWeight: 800 }}>{part}</span>
                            : <span key={i}>{part}</span>
                        ))
                      : block}
                    {isTyping && idx === activeIdx ? (
                      <span style={{
                        display: 'inline-block',
                        width: '2px',
                        height: '1.2rem',
                        background: '#000',
                        marginLeft: '3px',
                        animation: 'blink 1s infinite',
                        verticalAlign: 'middle'
                      }} />
                    ) : null}
                  </p>
                ));
              })()}
            </div>
          </div>
        ) : recommendations && localShowResults ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 추천 결과 표시 */}
            {(
              <>
                <div style={{
                  background: 'linear-gradient(135deg, #F3E8FF 0%, #FCEAFE 100%)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  animation: 'slideInUp 0.5s ease-out'
                }}>
                  <h3 style={{
                    color: '#9333EA',
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    🎯 {(name || '사용자')}님을 위한 추천
                  </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  padding: '1rem',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌡️</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#9333EA' }}>
                    {recommendations.temperature}°C
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#9333EA', opacity: 0.7, marginTop: '0.25rem' }}>
                    온도
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  padding: '1rem',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💧</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#9333EA' }}>
                    {recommendations.humidity}%
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#9333EA', opacity: 0.7, marginTop: '0.25rem' }}>
                    습도
                  </div>
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: recommendations.lightColor,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', color: '#9333EA', opacity: 0.7, marginBottom: '0.25rem' }}>
                      💡 조명 색상
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#9333EA' }}>
                      {recommendations.lightColor}
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#9333EA', opacity: 0.7, marginBottom: '0.5rem' }}>
                  🎵 추천 음악
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#9333EA' }}>
                  {recommendations.song}
                </div>
              </div>
            </div>
            
            
            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)'
              }}
            >
              다시 입력하기
            </button>
              </>
            )}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, #F3E8FF 0%, #FCEAFE 100%)',
            borderRadius: '15px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
            <p style={{
              color: '#9333EA',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              입력이 완료되었습니다!
            </p>
          </div>
        )}
        {/* Note: moved keyframe animations to globals.css to avoid JSX parsing issues */}
      </div>
=======
        ) : recommendations && showReason ? (
          <ReasonPanel
            typedReason={typedReason}
            fullTypedText={fullTypedText}
            paragraphs={paragraphs}
            showHighlights={showHighlights}
            fadeText={fadeText}
          />
        ) : (recommendations && localShowResults && !loading && !orchestratingLock) ? (
          <>
            <ResultsWrap>
              <ResultRow>온도: {recommendations.temperature}℃</ResultRow>
              <ResultRow>습도: {recommendations.humidity}%</ResultRow>
              <ResultRow>조명 색상: {recommendations.lightColor}</ResultRow>
              <ResultRow>
                음악: {useMemo(() => {
                  const found = MUSIC_CATALOG.find(t => t.id === recommendations.song);
                  return found ? `${found.title} - ${found.artist}` : recommendations.song;
                }, [recommendations?.song])}
              </ResultRow>
            </ResultsWrap>
            {showResetDelayed && (
              <ResetButtonWrap>
                <ResetButton type="button" onClick={handleReset}>
                  다시 대화하기
                </ResetButton>
              </ResetButtonWrap>
            )}
          </>
        ) : null}
        {/* Note: moved keyframe animations to globals.css to avoid JSX parsing issues */}
      </ContentWrapper>
      {showResetDelayed && (
        <ResetButtonWrap>
          <ResetButton type="button" onClick={handleReset}>
            다시 대화하기
          </ResetButton>
        </ResetButtonWrap>
      )}
>>>>>>> a602ee2 (Mobile results UX: pause blobs, delayed reset; reload on reset; policy+prompt integration fixes)
      <BlobControls />
    </div>
  );
}
<<<<<<< HEAD
=======

const ResetButtonWrap = styled.div`
  position: fixed;
  bottom: clamp(32px, 12vh, 80px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 2600;
  pointer-events: auto;
`;

const ResetButton = styled.button`
  padding: 0.85rem 2.6rem;
  border-radius: 999px;
  border: none;
  font-family: ${fonts.ui};
  font-weight: 700;
  font-size: 1rem;
  color: white;
  background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%);
  box-shadow: 0 12px 30px rgba(147, 51, 234, 0.35);
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:active {
    transform: translateY(2px);
    box-shadow: 0 6px 18px rgba(147, 51, 234, 0.25);
  }
`;

const BrandLogoWrap = styled.div`
  position: fixed;
  top: clamp(20px, 6vh, 44px);
  left: 50%;
  transform: translateX(-50%);
  width: clamp(16px, 5vw, 24px);
  height: clamp(16px, 5vw, 24px);
  z-index: 2200;
  pointer-events: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ResultsWrap = styled.div`
  position: fixed;
  bottom: clamp(120px, 22vh, 240px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255,255,255,0.82);
  color: #222;
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 2000;
`;

const ResultRow = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const Notice = styled.div`
  position: fixed;
  top: 10px;
  right: 12px;
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  z-index: 2300;
`;
>>>>>>> a602ee2 (Mobile results UX: pause blobs, delayed reset; reload on reset; policy+prompt integration fixes)
