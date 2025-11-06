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
import { fonts, spacing } from "./styles/tokens";
import ListeningOverlay from "./sections/ListeningOverlay";

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

  // When the typewriter finishes the whole message
  // 1) Keep text fully visible for 2s
  // 2) Then fade out and immediately show results
  useEffect(() => {
    if (!fullTypedText) return;
    if (typedReason && typedReason.length >= fullTypedText.length && !orbShowcaseStarted) {
      setOrbShowcaseStarted(true);
      const textHoldMs = 2000;
      // Immediately show keyword labels bound to orbits, and restore orb/glow during the hold
      if (typeof window !== 'undefined' && recommendations) {
        const colorName = (() => {
          const hex = (recommendations.lightColor || '').replace('#','');
          if (hex.length !== 6) return '조명';
          const r = parseInt(hex.slice(0,2), 16) / 255;
          const g = parseInt(hex.slice(2,4), 16) / 255;
          const b = parseInt(hex.slice(4,6), 16) / 255;
          const max = Math.max(r,g,b), min = Math.min(r,g,b);
          let h = 0; const d = max - min;
          if (d === 0) h = 0; else if (max === r) h = ((g-b)/d)%6; else if (max === g) h = (b-r)/d + 2; else h = (r-g)/d + 4;
          h = Math.round(h*60); if (h<0) h += 360;
          if (h < 20 || h >= 340) return '빨간 조명';
          if (h < 50) return '주황 조명';
          if (h < 70) return '노란 조명';
          if (h < 170) return '초록 조명';
          if (h < 260) return '파란 조명';
          if (h < 310) return '보라 조명';
          return '분홍 조명';
        })();
        const musicLabel = (() => {
          const s = (recommendations.song || '').toLowerCase();
          if (s.includes('jazz')) return '재즈';
          if (s.includes('rock')) return '록';
          if (s.includes('hip') || s.includes('rap')) return '힙합';
          if (s.includes('ballad')) return '발라드';
          if (s.includes('pop')) return '팝';
          return (recommendations.song || '').split('-')[0].trim();
        })();
        window.keywordLabels = [
          `${recommendations.temperature}°C`, // 1. 온도
          `${recommendations.humidity}%`,    // 2. 습도
          colorName,                          // 3. 조명 색상명
          musicLabel                          // 4. 음악 무드
        ];
        window.showKeywords = true;
        window.showFinalOrb = true;
        window.showCenterGlow = true;
        window.clusterSpin = true;
      }
      const t = setTimeout(() => {
        setFadeText(true);
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
      }, textHoldMs);
      return () => clearTimeout(t);
    }
  }, [typedReason, fullTypedText, orbShowcaseStarted]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!name.trim() || !mood.trim()) {
      console.log('❌ Mobile: Name or mood is empty');
      return;
    }
    
    console.log('📱 Mobile: Submitting data:', { name: name.trim(), mood: mood.trim() });
    
    // 이름과 기분 전송
    emitNewName(name.trim(), { mood: mood.trim() });
    emitNewVoice(mood.trim(), mood.trim(), 0.8, { name: name.trim() });
    
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

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: isModal ? 'center' : 'flex-start',
    justifyContent: isModal ? 'center' : 'flex-start',
    fontFamily: fonts.system,
    paddingTop: isModal ? '2rem' : spacing.container.paddingTop,
    paddingRight: isModal ? '2rem' : spacing.container.paddingRight,
    paddingBottom: isModal ? '2rem' : spacing.container.paddingBottom,
    paddingLeft: isModal ? '2rem' : spacing.container.paddingLeft,
    overscrollBehavior: 'none'
  };

  const wrapperStyle = {
    background: 'transparent',
    backdropFilter: 'none',
    borderRadius: 0,
    padding: 0,
    boxShadow: 'none',
    border: 'none',
    width: '100%',
    maxWidth: '640px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: isModal ? 'center' : 'flex-start'
  };

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
      <BlobControls />
    </div>
  );
}
