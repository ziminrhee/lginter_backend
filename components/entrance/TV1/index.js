import { useState, useEffect } from "react";
import Head from "next/head";
import useSocketTV1 from "@/utils/hooks/useSocketTV1";

export default function TV1Controls() {
  const { socket } = useSocketTV1();
  const [keywords, setKeywords] = useState([]);
  const [tv2Color, setTv2Color] = useState('#FFD166');
  const [draft, setDraft] = useState('');
  const unifiedFont = '\'Pretendard\', \'Pretendard Variable\', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif';
  const tv2GradientPalette = ['#FF78AA', '#FFD6A8', '#CEE8E8', '#CAAFFF'];

  // --- helpers: color math for pill gradients ---
  const clamp01 = (n) => Math.max(0, Math.min(1, n));
  const hexToRgb = (hex) => {
    const m = (hex || '').replace('#', '').match(/^([0-9a-fA-F]{6})$/);
    if (!m) return { r: 255, g: 221, b: 170 };
    const num = parseInt(m[1], 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  };
  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
  const mix = (c1, c2, t) => ({ r: Math.round(c1.r*(1-t)+c2.r*t), g: Math.round(c1.g*(1-t)+c2.g*t), b: Math.round(c1.b*(1-t)+c2.b*t) });
  const lighten = (hex, t=0.3) => { const c = hexToRgb(hex); return rgbToHex(...Object.values(mix(c, {r:255,g:255,b:255}, clamp01(t)))); };
  const saturateWarm = (hex) => { const c = hexToRgb(hex); return rgbToHex(Math.min(255, Math.round(c.r*1.05+10)), Math.min(255, Math.round(c.g*0.95+5)), Math.min(255, Math.round(c.b*1.05+10))); };
  const buildPillGradient = () => {
    const [c1, c2, c3, c4] = tv2GradientPalette;
    const whiteHi = lighten('#ffffff', 0.0);
    return `
      radial-gradient(140% 160% at var(--x1,85%) var(--y1,20%), ${c1}cc 0%, ${c1}55 38%, transparent 66%),
      radial-gradient(140% 160% at var(--x2,18%) var(--y2,82%), ${c2}cc 0%, ${c2}55 44%, transparent 72%),
      radial-gradient(180% 220% at 0% 120%, ${c3}99 0%, transparent 50%),
      linear-gradient(135deg, ${whiteHi} 0%, ${c4}66 100%)
    `;
  };
  const addLocalKeyword = (text) => {
    if (!text || !text.trim()) return;
    const fontSize = (Math.random() * 0.35 + 0.95).toFixed(2);
    const fontFamily = unifiedFont;
    const fontStyle = 'normal';
    const fontWeight = 800;
    setKeywords(prev => [{
      id: Date.now() + Math.random(),
      text: text.trim(),
      fontSize: `${fontSize}rem`,
      fontFamily,
      fontStyle,
      fontWeight,
      timestamp: Date.now()
    }, ...prev].slice(0, 24));
  };

  useEffect(() => {
    if (!socket) {
      console.log('TV1 Component: Waiting for socket connection...');
      return;
    }

    console.log('TV1 Component: Socket ready, registering event listener');

    const handleDisplayVoice = (data) => {
      console.log('📺 TV1 Component received entrance-new-voice:', data);
      const text = data.text || data.emotion || '알 수 없음';
      // 더 작은 타이포 (0.95rem ~ 1.30rem) + 단일 폰트/굵기
      const fontSize = (Math.random() * 0.35 + 0.95).toFixed(2);
      const fontFamily = unifiedFont;
      const fontStyle = 'normal';
      const fontWeight = 800;
      setKeywords(prev => [{
        id: Date.now() + Math.random(),
        text: text,
        fontSize: `${fontSize}rem`,
        fontFamily,
        fontStyle,
        fontWeight,
        timestamp: Date.now()
      }, ...prev].slice(0, 18)); // 최신이 위쪽/왼쪽부터, 최대 18개 유지
    };

    socket.on('entrance-new-voice', handleDisplayVoice);

    // Track tv2 (or sw2) color from decisions
    const handleDeviceDecision = (data) => {
      if (data?.device === 'sw2' && data.lightColor) setTv2Color(data.lightColor);
    };
    const handleNewDecision = (msg) => {
      const env = msg?.env;
      if (!env) return;
      if ((msg?.target === 'tv2' || msg?.target === 'sw2') && env.lightColor) setTv2Color(env.lightColor);
    };
    socket.on('device-decision', handleDeviceDecision); // legacy (if enabled)
    socket.on('device-new-decision', handleNewDecision);

    return () => {
      console.log('TV1 Component: Removing event listener');
      socket.off('entrance-new-voice', handleDisplayVoice);
      socket.off('device-decision', handleDeviceDecision);
      socket.off('device-new-decision', handleNewDecision);
    };
  }, [socket]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F9FBFF 0%, #EFF2FF 35%, #E9E9FF 100%)',
      fontFamily: unifiedFont,
      padding: '3.2rem 2.4rem 2.4rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;700;800&display=swap" rel="stylesheet" />
      </Head>

      <h2 className="title">오늘의 감정들은…</h2>
      <form className="quick-input" onSubmit={(e) => { e.preventDefault(); addLocalKeyword(draft); setDraft(''); }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="텍스트를 입력하고 Enter (TV1 즉시 테스트)"
        />
        <button type="submit">ADD</button>
      </form>

      <div className="pill-wrap">
        {keywords.map((kw) => (
          <div
            key={kw.id}
            className="pill"
            style={{
              fontSize: '1rem',
              fontFamily: kw.fontFamily,
              fontStyle: kw.fontStyle,
              fontWeight: 300,
              background: buildPillGradient()
            }}
          >
            <span className="pill-text">{kw.text}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @property --x1 { syntax: '<percentage>'; inherits: false; initial-value: 85%; }
        @property --y1 { syntax: '<percentage>'; inherits: false; initial-value: 20%; }
        @property --x2 { syntax: '<percentage>'; inherits: false; initial-value: 18%; }
        @property --y2 { syntax: '<percentage>'; inherits: false; initial-value: 82%; }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pillWobble { 0% { transform: translateY(0) rotate(0deg) scale(1); } 50% { transform: translateY(-1px) rotate(-0.4deg) scale(1.02, 0.98); } 100% { transform: translateY(0.5px) rotate(0.5deg) scale(0.99, 1.01); } }
        @keyframes pillFlow {
          0%   { --x1: 85%; --y1: 20%; --x2: 18%; --y2: 82%; }
          50%  { --x1: 70%; --y1: 30%; --x2: 28%; --y2: 70%; }
          100% { --x1: 82%; --y1: 36%; --x2: 22%; --y2: 86%; }
        }

        .quick-input { position: sticky; top: 0; z-index: 10; display: flex; gap: 0.5rem; padding-bottom: 0.8rem; margin-bottom: 1rem; opacity: 0.15; transform: scale(0.98); }
        .quick-input input { flex: 1; min-width: 0; padding: 0.6rem 0.9rem; border-radius: 10px; border: 1px solid rgba(0,0,0,0.06); background: rgba(255,255,255,0.5); color: #222; outline: none; }
        .quick-input input::placeholder { color: #667; opacity: 0.7; }
        .quick-input button { padding: 0.55rem 0.9rem; border-radius: 10px; border: 1px solid rgba(0,0,0,0.08); background: linear-gradient(135deg, #ffffff 0%, #f7faff 100%); color: #222; font-weight: 700; }

        .title { margin: 0 0 1.2rem 0.3rem; font-size: clamp(18px, 2.6vw, 28px); font-weight: 300; color: #111; letter-spacing: -0.2px; }

        .pill-wrap {
          display: flex; flex-wrap: wrap; gap: 0.7rem 0.8rem;
          align-content: flex-start; align-items: flex-start;
        }
        .pill {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          min-height: 2.0rem;
          padding: 0.28rem 0.86rem;
          border-radius: 999px;
          color: #0b0b0b;
          font-weight: 300;
          font-family: ${'${unifiedFont}'};
          letter-spacing: 0.1px;
          box-shadow: 0 6px 18px rgba(60, 70, 130, 0.20), inset 0 0 0 1px rgba(255,255,255,0.45);
          animation: fadeIn 0.5s ease-out, pillWobble 6s ease-in-out infinite, pillFlow 7s ease-in-out infinite;
          backdrop-filter: blur(10px) saturate(140%);
          -webkit-backdrop-filter: blur(10px) saturate(140%);
          position: relative;
        }
        .pill:nth-child(odd) { animation-duration: 0.5s, 7.5s, 8.5s; }
        .pill:nth-child(3n) { animation-duration: 0.5s, 5.8s, 6.4s; }
        .pill::before {
          content: '';
          position: absolute; inset: 0; border-radius: inherit;
          background: linear-gradient(180deg, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0.00) 60%);
          mix-blend-mode: screen; opacity: 0.7; pointer-events: none;
        }
        .pill-text { mix-blend-mode: multiply; white-space: nowrap; }
      `}</style>
    </div>
  );
}
