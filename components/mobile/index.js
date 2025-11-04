import { useState, useEffect, useCallback, useMemo, memo } from "react";
import useSocketMobile from "@/utils/hooks/useSocketMobile";

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
  const { emitNewVoice, socket } = useSocketMobile();
  const [userId] = useState(() => `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [mood, setMood] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [weatherGreeting, setWeatherGreeting] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [typedReason, setTypedReason] = useState("");
  const [showHighlights, setShowHighlights] = useState(false);
  const [showResults, setShowResults] = useState(false);

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
        console.log('✅ 인식 성공:', transcript, '(정확도:', Math.round(confidence * 100) + '%)');
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

  // Join user-specific room on connect and listen for decisions
  useEffect(() => {
    if (!socket || !userId) return;
    
    const handleConnect = () => {
      console.log('📱 Mobile connected, joining user room:', userId);
      socket.emit('mobile-init', { userId });
    };
    
    const handleDecision = (data) => {
      console.log('📱 Mobile received decision:', data);
      if (data?.params) {
        setRecommendations({
          temperature: data.params.temp,
          humidity: data.params.humidity,
          lightColor: data.params.lightColor,
          song: data.params.music,
          reason: data.reason || 'AI generated'
        });
        setLoading(false);
      }
    };
    
    // If already connected, emit init
    if (socket.connected) {
      handleConnect();
    }
    
    socket.on('connect', handleConnect);
    socket.on('mobile-new-decision', handleDecision);
    
    return () => {
      socket.off('connect', handleConnect);
      socket.off('mobile-new-decision', handleDecision);
    };
  }, [socket, userId]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!mood.trim()) {
      console.log('❌ Mobile: Mood is empty');
      return;
    }
    
    console.log('📱 Mobile: Submitting data:', { userId, mood: mood.trim() });
    
    // 감정 전송 (Server가 OpenAI 호출)
    emitNewVoice(mood.trim(), mood.trim(), 0.8, { userId });
    
    console.log('✅ Mobile: Data emitted successfully with userId:', userId);
    
    // 로딩 시작 (AI 응답 대기)
    setSubmitted(true);
    setLoading(true);
  }, [userId, mood, emitNewVoice]);

  const handleReset = useCallback(() => {
    setSubmitted(false);
    setLoading(false);
    setRecommendations(null);
    setMood("");
    setShowReason(false);
    setTypedReason("");
    setShowHighlights(false);
    setShowResults(false);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #FCEAFE 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '25px',
        padding: '2.5rem',
        boxShadow: '0 20px 60px rgba(147, 51, 234, 0.15)',
        border: '1px solid rgba(147, 51, 234, 0.1)',
        width: '100%',
        maxWidth: '420px'
      }}>
        {!submitted && (
          <>
            <h1 style={{
              fontSize: '2rem',
              background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem',
              fontWeight: '700',
              textAlign: 'center'
            }}>
              환영합니다!
            </h1>
            
            {/* 날씨 기반 인사말 - 랜딩 페이지에만 */}
            {weatherGreeting && (
              <div style={{
                background: 'linear-gradient(135deg, #F3E8FF 0%, #FCEAFE 100%)',
                borderRadius: '15px',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                <p style={{
                  color: '#9333EA',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {weatherGreeting.fullGreeting}
                </p>
              </div>
            )}
            
            <p style={{
              color: '#9333EA',
              fontSize: '1rem',
              marginBottom: '2rem',
              opacity: 0.7,
              textAlign: 'center'
            }}>
              지금 기분을 말씀해주세요
            </p>
          </>
        )}
        
        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'block',
                color: '#9333EA',
                fontWeight: '600',
                marginBottom: '0.5rem',
                fontSize: '0.95rem'
              }}>
                지금 기분
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  placeholder="예: 행복해요, 설레요, 편안해요"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    paddingRight: '4rem',
                    border: '2px solid #F3E8FF',
                    borderRadius: '15px',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    outline: 'none',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#9333EA'}
                  onBlur={(e) => e.target.style.borderColor = '#F3E8FF'}
                />
                <button
                  type="button"
                  onClick={startVoiceRecognition}
                  disabled={isListening}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: isListening ? '#EC4899' : 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.5rem 0.75rem',
                    cursor: isListening ? 'not-allowed' : 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s',
                    animation: isListening ? 'pulse 1s infinite' : 'none'
                  }}
                  title="음성 입력"
                >
                  🎤
                </button>
              </div>
              {isListening && (
                <p style={{
                  color: '#EC4899',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem',
                  textAlign: 'center',
                  fontWeight: '500'
                }}>
                  🎤 듣고 있습니다...
                </p>
              )}
            </div>
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
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
                    🎯 AI 추천 결과
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
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(0.9); }
          }
          
          @keyframes fadeInOut {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          
          @keyframes blink {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0; }
          }
          
          @keyframes highlightFade {
            0% { 
              background: linear-gradient(135deg, #9333EA60 0%, #EC489960 100%);
              transform: scale(1.05);
            }
            100% { 
              background: linear-gradient(135deg, #9333EA20 0%, #EC489920 100%);
              transform: scale(1);
            }
          }
          
          @keyframes slideInUp {
            0% { 
              opacity: 0;
              transform: translateY(30px);
            }
            100% { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes blink {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}
