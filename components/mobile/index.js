import { useState, useEffect, useCallback, useRef } from "react";
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
import { fonts, spacing } from "./sections/styles/tokens";
import { AppContainer, ContentWrapper } from "./sections/styles/shared/layout";
import ListeningOverlay from "./sections/ListeningOverlay";
import * as UI from "./styles";
import ResultsPanel from './views/ResultsPanel';
import ReasonPanel from './views/ReasonPanel';
import InputForm from './views/InputForm';
import SuccessPanel from './views/SuccessPanel';

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
    if (typeof window !== 'undefined') {
      window.showFinalOrb = false;
      window.showCenterGlow = false;
    }
  }, [reset]);

  

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
    <AppContainer $isModal={isModal}>
      <ContentWrapper $isModal={isModal}>
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
          <>
            <InputForm
              name={name}
              onNameChange={setName}
              mood={mood}
              onMoodChange={setMood}
              onSubmit={handleSubmit}
              showPress={showPress}
              isListening={isListening}
              pressProgress={pressProgress}
              onPressStart={handlePressStart}
              onPressEnd={handlePressEnd}
            />
            {(isListening || listeningStage === 'finalHold' || listeningStage === 'fadeOut') && (
              <ListeningOverlay
                topLabel="듣고 있어요"
                centerText={(listeningStage === 'finalHold' && mood) ? `“${mood}”` : (liveTranscript ? `“${liveTranscript}”` : undefined)}
                stage={listeningStage === 'fadeOut' ? 'fadeOut' : 'live'}
              />
            )}
          </>
        ) : (loading || orchestratingLock) ? (
          <>
            <OrchestratingScreen />
          </>
        ) : recommendations && localShowResults ? (
          <ResultsPanel name={name} recommendations={recommendations} onReset={handleReset} />
        ) : recommendations && showReason ? (
          <ReasonPanel
            typedReason={typedReason}
            fullTypedText={fullTypedText}
            paragraphs={paragraphs}
            showHighlights={showHighlights}
            fadeText={fadeText}
          />
        ) : recommendations && localShowResults ? (
          <ResultsPanel name={name} recommendations={recommendations} onReset={handleReset} />
        ) : (
          <SuccessPanel />
        )}
        {/* Note: moved keyframe animations to globals.css to avoid JSX parsing issues */}
      </ContentWrapper>
      <BlobControls />
    </AppContainer>
  );
}
