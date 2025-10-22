import { useState } from "react";
import useSocketMobile from "@/utils/hooks/useSocketMobile";

export default function MobileControls() {
  const { emitNewName, emitNewVoice } = useSocketMobile();
  const [name, setName] = useState("");
  const [mood, setMood] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
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
    
    setSubmitted(true);
    setTimeout(() => {
      setName("");
      setMood("");
      setSubmitted(false);
    }, 3000);
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
            <p style={{
              color: '#9333EA',
              fontSize: '0.9rem',
              marginTop: '0.5rem',
              opacity: 0.7
            }}>
              감사합니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
