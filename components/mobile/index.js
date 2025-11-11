import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import useSocketMobile from "@/utils/hooks/useSocketMobile";
import OrchestratingScreen from "./sections/OrchestratingScreen";
import HeroText from "./sections/HeroText";
import BlobControls from "./sections/BlobControls";
import useLongPressProgress from "./hooks/useLongPressProgress";
import useSpeechRecognition from "./hooks/useSpeechRecognition";
import useTypewriter from "./hooks/useTypewriter";
import useOrchestratingTransitions from './hooks/useOrchestratingTransitions';
import usePostTypingShowcase from './hooks/usePostTypingShowcase';
import useScrollLock from './hooks/useScrollLock';
import { AppContainer, ContentWrapper } from "./sections/styles/shared/layout";
import ListeningOverlay from "./sections/ListeningOverlay";
import ReasonPanel from './views/ReasonPanel';
import InputForm from './views/InputForm';
import { fonts } from "./sections/styles/tokens";

import BackgroundCanvas from '@/components/mobile/BackgroundCanvas';
// public 자산 사용: 문자열 경로로 next/image에 전달

export default function MobileControls() {
  const router = useRouter();
  const isModal = router?.query?.variant === 'modal';
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [showResetButton, setShowResetButton] = useState(false);
  const { emitNewName, emitNewVoice, socket } = useSocketMobile({
    onMobileDecision: (payload) => {
      // payload: { userId, params: { temp, humidity, lightColor, music }, reason }
      const rec = {
        temperature: payload?.params?.temp,
        humidity: payload?.params?.humidity,
        lightColor: payload?.params?.lightColor,
        song: payload?.params?.music,
        reason: payload?.reason
      };
      setRecommendations(rec);
      setLoading(false);
    }
  });
  const [name, setName] = useState("");
  const [mood, setMood] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPress, setShowPress] = useState(false);
  const [listeningStage, setListeningStage] = useState('idle'); // idle | live | finalHold | fadeOut
  const [orchestratingLock, setOrchestratingLock] = useState(false);
  const orchestrateMinMs = 5500;

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

  const { typedReason, showReason, showHighlights } = useTypewriter(
    fullTypedText
  );

  const { fadeText, localShowResults, resetShowcase } = usePostTypingShowcase({ fullTypedText, typedReason, recommendations, setOrchestratingLock });

  // (Typewriter, weather, press handlers moved to hooks above)

  // applies scroll lock while mounted
  useScrollLock();

  // 결과가 준비되고 로딩/락이 해제된 후 2초 뒤 리셋 버튼 표시
  useEffect(() => {
    if (recommendations && !loading && !orchestratingLock) {
      setShowResetButton(false);
      const t = setTimeout(() => setShowResetButton(true), 2000);
      return () => clearTimeout(t);
    }
    setShowResetButton(false);
    return undefined;
  }, [recommendations, loading, orchestratingLock]);

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
    
    // Controller 경유 결정 대기
    setSubmitted(true);
    setLoading(true);
  }, [name, mood, emitNewName, emitNewVoice, socket]);

  const handleReset = useCallback(() => {
    // 전체 페이지 리로드로 초기 상태 복귀
    if (typeof window !== 'undefined') {
      try { window.location.reload(); } catch {}
    }
  }, []);

  

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

  const showBrandLogo = submitted && (loading || orchestratingLock || recommendations);

  return (
    <AppContainer $isModal={isModal}>
      {showBrandLogo && (
        <BrandLogoWrap>
          <Image src="/brand/furon_logo.png" alt="Furon" priority width={24} height={24} />
        </BrandLogoWrap>
      )}
      <BackgroundCanvas
        cameraMode="default"
        showMoodWords={!submitted && showPress}
      />
      <ContentWrapper $isModal={isModal}>
        {!submitted && !isListening && (
          <>
            <HeroText isModal={isModal} onFinalPhase={() => setShowPress(true)} />
            
            
            
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
        ) : recommendations && showReason ? (
          <ReasonPanel
            typedReason={typedReason}
            fullTypedText={fullTypedText}
            paragraphs={paragraphs}
            showHighlights={showHighlights}
            fadeText={fadeText}
          />
        ) : null}
        {/* Note: moved keyframe animations to globals.css to avoid JSX parsing issues */}
      </ContentWrapper>
      <BlobControls />
      {showResetButton && (
        <ResetButtonWrap>
          <ResetButton type="button" onClick={handleReset}>
            다시 입력하기
          </ResetButton>
        </ResetButtonWrap>
      )}
    </AppContainer>
  );
}

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
