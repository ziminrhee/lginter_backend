import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import useSocketMobile from "@/utils/hooks/useSocketMobile";
import useOpenAIAnalysis from "@/utils/hooks/useOpenAIAnalysis";
import LoadingScreen from "./sections/LoadingScreen";
import HeroText from "./sections/HeroText";
import PressOverlay from "./sections/PressOverlay";
import HiddenForm from "./sections/HiddenForm";
import BlobControls from "./sections/BlobControls";
import useLongPressProgress from "./hooks/useLongPressProgress";
import useSpeechRecognition from "./hooks/useSpeechRecognition";
import useWeatherGreeting from "./hooks/useWeatherGreeting";
import useTypewriter from "./hooks/useTypewriter";
import { fonts, spacing } from "./styles/tokens";

export default function MobileControls() {
  const router = useRouter();
  const isModal = router?.query?.variant === 'modal';
  const { emitNewName, emitNewVoice, socket } = useSocketMobile();
  const { loading, recommendations, analyze, reset } = useOpenAIAnalysis(socket);
  const [name, setName] = useState("");
  const [mood, setMood] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPress, setShowPress] = useState(false);
  const weatherGreeting = useWeatherGreeting();

  const { isListening, startVoiceRecognition } = useSpeechRecognition({
    onResult: ({ transcript }) => {
      setMood(transcript);
      if (!name.trim()) setName('사용자');
    }
  });

  const { pressProgress, handlePressStart, handlePressEnd } = useLongPressProgress({
    onCompleted: () => startVoiceRecognition()
  });

  const { typedReason, showReason, showHighlights, showResults } = useTypewriter(
    recommendations && recommendations.reason ? recommendations.reason : null
  );

  // (Typewriter, weather, press handlers moved to hooks above)

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
        {!submitted && (
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
            
            {showPress && (
              <PressOverlay
                pressProgress={pressProgress}
                onPressStart={handlePressStart}
                onPressEnd={handlePressEnd}
              />
            )}
            {isListening && (
              <p style={{
                position: 'fixed',
                bottom: '130px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#EC4899',
                fontSize: '0.9rem',
                textAlign: 'center',
                fontWeight: '500',
                zIndex: 1000,
                margin: 0
              }}>
                🎤 듣고 있습니다...
              </p>
            )}
          </form>
        ) : loading ? (
          <LoadingScreen />
        ) : recommendations && !showReason ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem'
          }}>
            <p style={{ color: '#9333EA', fontSize: '1rem' }}>결과 준비 중...</p>
          </div>
        ) : recommendations && showReason && !showResults ? (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            boxSizing: 'border-box',
            overflow: 'auto'
          }}>
            <p style={{
              color: '#9333EA',
              fontSize: '1.1rem',
              lineHeight: '1.9',
              fontFamily: 'monospace',
              margin: 0,
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
              textAlign: 'left',
              width: '100%'
            }}>
              {typedReason.split(/(\d+°C|\d+%|#[A-F0-9]{6}|[가-힣]+해요|[가-힣]+함|온도|습도|조명|음악|색상)/).map((part, index) => {
                const isKeyword = /\d+°C|\d+%|#[A-F0-9]{6}|[가-힣]+해요|[가-힣]+함|온도|습도|조명|음악|색상/.test(part);
                if (showHighlights && isKeyword) {
                  return (
                    <span
                      key={index}
                      style={{
                        background: 'linear-gradient(135deg, #9333EA50 0%, #EC489950 100%)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        fontWeight: '900',
                        color: '#9333EA',
                        boxShadow: '0 2px 12px rgba(147, 51, 234, 0.4)',
                        display: 'inline-block'
                      }}
                    >
                      {part}
                    </span>
                  );
                }
                return <span key={index}>{part}</span>;
              })}
              <span style={{
                display: 'inline-block',
                width: '2px',
                height: '1.2rem',
                background: '#9333EA',
                marginLeft: '3px',
                animation: typedReason.length < recommendations.reason.length ? 'blink 1s infinite' : 'none',
                verticalAlign: 'middle'
              }} />
            </p>
          </div>
        ) : recommendations && showResults ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 추천 결과 표시 */}
            {showResults && (
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
                    🎯 {name}님을 위한 추천
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
