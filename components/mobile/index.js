import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/router";
import useSocketMobile from "@/utils/hooks/useSocketMobile";
import useOpenAIAnalysis from "@/utils/hooks/useOpenAIAnalysis";

// LG 퓨론 AI 로딩 애니메이션 (간단한 버전) - 메모이제이션
const SimpleLGLoadingScreen = memo(function SimpleLGLoadingScreen() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3rem 2rem',
      background: 'linear-gradient(135deg, #F3E8FF 0%, #FCEAFE 100%)',
      borderRadius: '15px'
    }}>
      {/* LG ThinQ AI 로딩 애니메이션 (심플) */}
      <div style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        margin: '0 auto 1.5rem'
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '4px solid #F3E8FF',
          borderTop: '4px solid #9333EA',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '60px',
          height: '60px',
          top: '10px',
          left: '10px',
          border: '3px solid #F3E8FF',
          borderBottom: '3px solid #EC4899',
          borderRadius: '50%',
          animation: 'spin 1.5s linear infinite reverse'
        }} />
      </div>
      <p style={{
        color: '#9333EA',
        fontSize: '1.2rem',
        fontWeight: '700',
        marginBottom: '0.5rem',
        animation: 'fadeInOut 2s ease-in-out infinite'
      }}>
        LG ThinQ AI 분석 중...
      </p>
      <p style={{
        color: '#9333EA',
        fontSize: '0.9rem',
        opacity: 0.7
      }}>
        당신의 감정에 맞는 최적의 환경을 찾고 있어요 💭
      </p>
    </div>
  );
});


export default function MobileControls() {
  const router = useRouter();
  const isModal = router?.query?.variant === 'modal';
  const { emitNewName, emitNewVoice, socket } = useSocketMobile();
  const { loading, recommendations, analyze, reset } = useOpenAIAnalysis(socket);
  const [name, setName] = useState("");
  const [mood, setMood] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [weatherGreeting, setWeatherGreeting] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [typedReason, setTypedReason] = useState("");
  const [showHighlights, setShowHighlights] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const [pressTimer, setPressTimer] = useState(null);

  // 날씨 기반 인사말 가져오기 (타임아웃 설정)
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3초 타임아웃
    
    fetch('/api/weather', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        clearTimeout(timeoutId);
        console.log('🌤️ Weather greeting:', data);
        setWeatherGreeting(data);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          console.log('⏱️ Weather API timeout - continuing without weather');
        } else {
          console.error('Weather API error:', err);
        }
        // 에러 발생시에도 계속 진행 (날씨 없이)
      });
    
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  // 꾹 누르기 핸들러
  const handlePressStart = useCallback(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02; // 0.02씩 증가 (50ms * 50 = 2.5초)
      if (progress >= 1) {
        progress = 1;
        clearInterval(interval);
        // 1초 이상 누르면 음성 인식 시작
        startVoiceRecognition();
      }
      setPressProgress(progress);
      if (typeof window !== 'undefined') {
        window.pressProgress = progress;
      }
    }, 50);
    setPressTimer(interval);
  }, []);

  const handlePressEnd = useCallback(() => {
    if (pressTimer) {
      clearInterval(pressTimer);
      setPressTimer(null);
    }
    // 천천히 0으로 돌아가기
    setPressProgress(0);
    if (typeof window !== 'undefined') {
      window.pressProgress = 0;
    }
  }, [pressTimer]);

  // 음성 인식 기능 (메모이제이션)
  const startVoiceRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('❌ 음성 인식을 지원하지 않는 브라우저입니다.\n\n직접 입력해주세요. 🖊️');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        console.log('🎤 음성 인식 시작됨');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        setMood(transcript);
        // 음성 인식 완료 시 이름도 자동 설정 (퓨론 사용자로)
        if (!name.trim()) {
          setName('사용자');
        }
        console.log('✅ 인식 성공:', transcript, '(정확도:', Math.round(confidence * 100) + '%)');
        
        // 음성 인식 완료 후 자동 제출
        setTimeout(() => {
          const submitBtn = document.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.click();
          }
        }, 500);
      };

      recognition.onerror = (event) => {
        console.error('❌ 음성 인식 오류:', event.error);
        setIsListening(false);
        
        let errorMsg = '';
        if (event.error === 'no-speech') {
          errorMsg = '음성이 감지되지 않았습니다.\n\n직접 입력해주세요. 🖊️';
        } else if (event.error === 'not-allowed') {
          errorMsg = '⚠️ 마이크 권한이 필요합니다.\n\n직접 입력하거나, 브라우저 설정에서 마이크 권한을 허용해주세요.\n\n💡 팁: HTTP 연결에서는 보안상 마이크가 제한될 수 있습니다.';
        } else if (event.error === 'network') {
          errorMsg = '네트워크 오류가 발생했습니다.\n\n직접 입력해주세요. 🖊️';
        } else {
          errorMsg = '음성 인식이 불가능합니다.\n\n직접 입력해주세요. 🖊️';
        }
        
        // 에러 발생 시에도 입력창에 포커스
        if (errorMsg) {
          alert(errorMsg);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('🎤 음성 인식 종료');
      };

      console.log('🎤 음성 인식 시작 시도...');
      recognition.start();
    } catch (error) {
      console.error('음성 인식 초기화 실패:', error);
      alert('음성 인식을 시작할 수 없습니다.\n\n직접 입력해주세요. 🖊️');
      setIsListening(false);
    }
  }, []);

  // 타이핑 애니메이션 효과 (최적화)
  useEffect(() => {
    if (!recommendations || !recommendations.reason) return;
    
    setShowReason(true);
    const text = recommendations.reason;
    let index = 0;
    
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        // 2글자씩 업데이트하여 렌더링 횟수 절반으로 감소
        setTypedReason(text.slice(0, index + 2));
        index += 2;
      } else {
        clearInterval(typingInterval);
        // 타이핑 완료 후 0.5초 대기 후 하이라이트 표시
        setTimeout(() => {
          setShowHighlights(true);
          // 하이라이트 4초 후 결과 표시 (6초에서 4초로 단축)
          setTimeout(() => {
            setShowResults(true);
          }, 4000);
        }, 500);
      }
    }, 40); // 40ms마다 2글자씩 (전체 속도는 비슷하지만 렌더링 횟수 절반)

    return () => clearInterval(typingInterval);
  }, [recommendations]);

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
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    paddingTop: isModal ? '2rem' : 'calc(env(safe-area-inset-top, 0px) + clamp(96px, 14vh, 180px))',
    paddingRight: isModal ? '2rem' : 'clamp(28px,7vw,72px)',
    paddingBottom: isModal ? '2rem' : 'clamp(40px,8vh,96px)',
    paddingLeft: isModal ? '2rem' : 'clamp(28px,7vw,72px)',
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
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{
                fontSize: '2.5rem',
                color: '#000000',
                marginBottom: '0.25rem',
                fontWeight: '550',
                textAlign: isModal ? 'center' : 'left',
                lineHeight: 1.22,
                fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif'
              }}>
                만나서<br/>반가워요!
              </h1>
              <p style={{
                fontSize: '1.3rem',
                color: '#818181',
                marginTop: '0.6rem',
                fontWeight: '500',
                textAlign: isModal ? 'center' : 'left',
                fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif'
              }}>
                저는 퓨론이라고 합니다.
              </p>
            </div>
            
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
            {/* 입력 필드들 - 기능 유지하되 숨김 */}
            <div style={{ display: 'none' }}>
              <label>이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
              />
            </div>
            
            {/* 기분 입력 필드 - 기능 유지하되 숨김 */}
            <div style={{ display: 'none' }}>
              <label>지금 기분</label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="예: 행복해요, 설레요, 편안해요"
              />
            </div>
            
            {/* 꾹 누르기 텍스트 - 꾹 누르면 음성 입력 */}
            <div 
              style={{ 
                position: 'fixed',
                bottom: 'clamp(88px, 18vh, 144px)',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                textAlign: 'center'
              }}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
            >
              <div style={{
                fontSize: 'clamp(2.6rem, 8.5vw, 3.4rem)',
                fontWeight: '500',
                color: '#565656',
                fontFamily: 'Pretendard',
                animation: 'blink 1.5s ease-in-out infinite',
                cursor: 'pointer',
                userSelect: 'none',
                opacity: pressProgress > 0 ? 0.5 + pressProgress * 0.5 : 1
              }}>
                Press
              </div>
              {pressProgress > 0 && (
                <div style={{
                  marginTop: '1rem',
                  fontSize: 'clamp(1.6rem, 6.5vw, 2.8rem)',
                  color: '#9333EA',
                  fontWeight: '600'
                }}>
                  {Math.round(pressProgress * 100)}%
                </div>
              )}
            </div>
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
            
            {/* 제출 버튼 - 기능 유지하되 숨김 (음성으로 자동 제출됨) */}
            <button
              type="submit"
              style={{
                display: 'none'
              }}
            >
              입력 완료
            </button>
          </form>
        ) : loading ? (
          <SimpleLGLoadingScreen />
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
    </div>
  );
}
