import { useState } from "react";
import useSocketMobile from "@/utils/hooks/useSocketMobile";

export default function MobileControls() {
  const { emitNewName, emitNewVoice, socket } = useSocketMobile();
  const [name, setName] = useState("");
  const [mood, setMood] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const handleSubmit = async (e) => {
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
    setLoading(true);
    setSubmitted(true);
    
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `당신은 감정 분석 전문가입니다. 사용자의 감정 상태를 분석하여 최적의 환경 설정을 추천합니다.
응답은 반드시 다음 JSON 형식으로만 제공하세요:
{
  "temperature": 숫자(18-28 범위),
  "humidity": 숫자(40-60 범위),
  "lightColor": "#RRGGBB" 형식의 색상 코드,
  "song": "노래 제목 - 아티스트",
  "reason": "추천 이유를 한 문단으로 설명"
}`
            },
            {
              role: 'user',
              content: `사용자 ${name.trim()}님의 현재 기분: "${mood.trim()}"\n\n이 감정에 맞는 온도, 습도, 조명 색깔, 노래를 추천하고 이유를 설명해주세요.`
            }
          ]
        })
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (content) {
        // JSON 파싱
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          setRecommendations(result);
          
          // SW1으로 온도/습도 전송
          if (socket) {
            socket.emit('device-new-decision', {
              device: 'sw1',
              name: name.trim(),
              temperature: result.temperature,
              humidity: result.humidity,
              timestamp: Date.now()
            });
            
            // SW2로 조명/노래 전송
            socket.emit('device-new-decision', {
              device: 'sw2',
              name: name.trim(),
              lightColor: result.lightColor,
              song: result.song,
              timestamp: Date.now()
            });
          }
        }
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <p style={{
          color: '#9333EA',
          fontSize: '1rem',
          marginBottom: '2rem',
          opacity: 0.7,
          textAlign: 'center'
        }}>
          이름과 기분을 입력해주세요
        </p>
        
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
                이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                style={{
                  width: '100%',
                  padding: '1rem',
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
            </div>
            
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
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="예: 행복해요, 설레요, 편안해요"
                style={{
                  width: '100%',
                  padding: '1rem',
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
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            background: 'linear-gradient(135deg, #F3E8FF 0%, #FCEAFE 100%)',
            borderRadius: '15px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #F3E8FF',
              borderTop: '4px solid #9333EA',
              borderRadius: '50%',
              margin: '0 auto 1.5rem',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{
              color: '#9333EA',
              fontSize: '1.2rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              AI가 분석 중입니다...
            </p>
            <p style={{
              color: '#9333EA',
              fontSize: '0.9rem',
              opacity: 0.7
            }}>
              당신의 감정에 맞는 최적의 환경을 찾고 있어요
            </p>
          </div>
        ) : recommendations ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 추천 결과 */}
            <div style={{
              background: 'linear-gradient(135deg, #F3E8FF 0%, #FCEAFE 100%)',
              borderRadius: '15px',
              padding: '1.5rem'
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
            
            {/* 추천 이유 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '15px',
              padding: '1.5rem',
              border: '2px solid #F3E8FF'
            }}>
              <h4 style={{
                color: '#9333EA',
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                💭 추천 이유
              </h4>
              <p style={{
                color: '#9333EA',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                opacity: 0.85
              }}>
                {recommendations.reason}
              </p>
            </div>
            
            <button
              onClick={() => {
                setSubmitted(false);
                setRecommendations(null);
                setName("");
                setMood("");
              }}
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
        `}</style>
      </div>
    </div>
  );
}
