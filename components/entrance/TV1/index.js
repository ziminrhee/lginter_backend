import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import useSocketTV1 from "@/utils/hooks/useSocketTV1";

export default function TV1Controls() {
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

  const handleDisplayVoice = useCallback((data) => {
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
  }, [unifiedFont]);

  const handleDeviceDecision = useCallback((data) => {
    if (data?.device === 'sw2' && data.lightColor) setTv2Color(data.lightColor);
  }, []);

  const handleNewDecision = useCallback((msg) => {
    const env = msg?.env;
    if (!env) return;
    if ((msg?.target === 'tv2' || msg?.target === 'sw2') && env.lightColor) setTv2Color(env.lightColor);
  }, []);

  const { socket } = useSocketTV1({
    onEntranceNewVoice: handleDisplayVoice,
    onDeviceDecision: handleDeviceDecision,
    onDeviceNewDecision: handleNewDecision,
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F9FBFF 0%, #EFF2FF 35%, #E9E9FF 100%)',
      fontFamily: unifiedFont,
      padding: '3.2rem 2.4rem 2.4rem',
      position: 'relative',
      overflow: 'hidden'
    }}>

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
          >
            <span className="pill-text">{kw.text}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
