import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import useSocketMobile from "@/utils/hooks/useSocketMobile";
import useOpenAIAnalysis from "@/utils/hooks/useOpenAIAnalysis";
import OrchestratingScreen from "./sections/OrchestratingScreen";
import HeroText from "./sections/HeroText";
import BlobControls from "./sections/BlobControls";
import useLongPressProgress from "./hooks/useLongPressProgress";
import useSpeechRecognition from "./hooks/useSpeechRecognition";
import useWeatherGreeting from "./hooks/useWeatherGreeting";
import useTypewriter from "./hooks/useTypewriter";
import useOrchestratingTransitions from './hooks/useOrchestratingTransitions';
import usePostTypingShowcase from './hooks/usePostTypingShowcase';
import useScrollLock from './hooks/useScrollLock';
import { AppContainer, ContentWrapper } from "./sections/styles/shared/layout";
import ListeningOverlay from "./sections/ListeningOverlay";
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

  useOrchestratingTransitions({ loading, orchestratingLock, setOrchestratingLock, orchestrateMinMs });

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

  const { fadeText, localShowResults } = usePostTypingShowcase({ fullTypedText, typedReason, recommendations, setOrchestratingLock });

  // (Typewriter, weather, press handlers moved to hooks above)

  // applies scroll lock while mounted
  useScrollLock();

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
