import { useState, useEffect } from "react";
import useSocketTV1 from "@/utils/hooks/useSocketTV1";

export default function TV1Controls() {
  const { socket } = useSocketTV1();
  const [keywords, setKeywords] = useState([]);
  const [tv2Color, setTv2Color] = useState('#FFD166');

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
  const buildPillGradient = (baseHex) => {
    const a = saturateWarm(baseHex);
    const b = lighten(baseHex, 0.55);
    const c = lighten('#ffffff', 0.0);
    const d = lighten(baseHex, 0.25);
    return `
      radial-gradient(120% 120% at 85% 20%, ${a}cc 0%, ${a}66 35%, transparent 65%),
      radial-gradient(120% 120% at 18% 85%, ${d}cc 0%, ${d}55 40%, transparent 68%),
      linear-gradient(135deg, ${c} 0%, ${b} 100%)
    `;
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
      // 랜덤 폰트 크기 (1.2rem ~ 2.2rem) → 캡슐 형태에 맞게 축소
      const fontSize = (Math.random() * 1 + 1.2).toFixed(2);
      const families = [
        'system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial',
        'Georgia, Times New Roman, serif',
        'Tahoma, Verdana, sans-serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Courier New, monospace',
        'Brush Script MT, cursive'
      ];
      const fontFamily = families[Math.floor(Math.random() * families.length)];
      const fontStyle = Math.random() < 0.3 ? 'italic' : 'normal';
      const fontWeight = Math.random() < 0.5 ? 800 : 700;
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
      background: 'radial-gradient(120% 120% at 20% 10%, #0e1016 0%, #0b0c11 45%, #0a0a0a 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="pill-wrap">
        {keywords.map((kw) => (
          <div
            key={kw.id}
            className="pill"
            style={{
              fontSize: kw.fontSize,
              fontFamily: kw.fontFamily,
              fontStyle: kw.fontStyle,
              fontWeight: kw.fontWeight,
              background: buildPillGradient(tv2Color)
            }}
          >
            <span className="pill-text">{kw.text}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
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

        .pill-wrap {
          display: flex; flex-wrap: wrap; gap: 0.7rem 0.8rem;
          align-content: flex-start; align-items: flex-start;
        }
        .pill {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 1rem;
          border-radius: 999px;
          color: #0b0b0b;
          font-weight: 800;
          letter-spacing: 0.2px;
          box-shadow: 0 10px 24px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.35);
          animation: fadeIn 0.5s ease-out;
          backdrop-filter: blur(8px) saturate(130%);
          -webkit-backdrop-filter: blur(8px) saturate(130%);
          position: relative;
        }
        .pill::before {
          content: '';
          position: absolute; inset: 0; border-radius: inherit;
          background: linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.0) 55%);
          mix-blend-mode: screen; opacity: 0.6; pointer-events: none;
        }
        .pill-text { mix-blend-mode: multiply; white-space: nowrap; }
      `}</style>
    </div>
  );
}
