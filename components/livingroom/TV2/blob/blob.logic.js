import { useMemo } from 'react';

function clamp01(n){ return Math.max(0, Math.min(1, n)); }
function lerp(a,b,t){ return a*(1-t)+b*t; }
function hexToRgb(hex){ const m = /^#?([0-9a-f]{6})$/i.exec(hex||''); if(!m) return {r:255,g:209,b:102}; const n=parseInt(m[1],16); return {r:(n>>16)&255,g:(n>>8)&255,b:n&255}; }
function rgbToHex(r,g,b){ return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase(); }
function mixHex(a,b,t){ const A=hexToRgb(a),B=hexToRgb(b); return rgbToHex(Math.round(lerp(A.r,B.r,t)),Math.round(lerp(A.g,B.g,t)),Math.round(lerp(A.b,B.b,t))); }
function pastelize(hex, s=0.6, v=1.05){ const {r,g,b}=hexToRgb(hex); // simple lighten
  return rgbToHex(
    Math.min(255, Math.round(r*v)),
    Math.min(255, Math.round(g*v)),
    Math.min(255, Math.round(b*v))
  );
}

// Base anchors (main만 교체, 보조는 고정 유지)
const WARM = '#FBB2D3';
const COOL = '#C2BCA9';
const RAINBOW = ['#FFADAD','#FFD6A5','#FDFFB6','#CAFFBF','#A0C4FF','#BDB2FF','#FFC6FF'].map(pastelize);
// blob_origin 계열 고정 보조색 (변경되지 않음)
const FIXED_A = '#CEE8E8'; // mint-like soft
const FIXED_B = '#CAAFFF'; // soft purple

export function useBlobVars(env){
  return useMemo(()=>{
    // temp mapping (0..1 with 20..28°C nominal)
    const tNorm = clamp01(((env?.temp ?? 24)-20)/8);
    const tempMain = mixHex(COOL, WARM, tNorm);
    // music intensity proxy: strong if includes 'EDM' or 'Rock'
    const mStrong = /edm|rock|dance|club/i.test(env?.music||'') ? 1 : 0;
    const musicMain = mixHex(COOL, WARM, mStrong*0.9);
    // light: use given color or pick from rainbow
    const lightMain = env?.lightColor || RAINBOW[(env?.temp||0)%RAINBOW.length];
    // humidity: 40~60 comfort. Above → warmer, below → cooler bias
    const h = env?.humidity ?? 55;
    const hBias = clamp01((h-50)/20*0.5 + 0.5);
    const humMain = mixHex(WARM, COOL, 1-hBias);

    // main만 외부색 반영, 보조 a/b는 고정 유지
    const mkPalette = (mainHex)=>({
      // 주색은 그대로 사용해 패널별 컬러 차이를 명확히
      main: mainHex,
      a: FIXED_A,
      b: FIXED_B,
    });

    const p1 = mkPalette(musicMain);   // panel 1: music
    const p2 = mkPalette(humMain);     // panel 2: humidity
    const p3 = mkPalette(tempMain);    // panel 3: temp
    const p4 = mkPalette(lightMain);   // panel 4: light

    // CSS variables for styles
    const css = {
      '--p1-main': p1.main, '--p1-a': p1.a, '--p1-b': p1.b,
      '--p2-main': p2.main, '--p2-a': p2.a, '--p2-b': p2.b,
      '--p3-main': p3.main, '--p3-a': p3.a, '--p3-b': p3.b,
      '--p4-main': p4.main, '--p4-a': p4.a, '--p4-b': p4.b,
    };
    return css;
  }, [env?.temp, env?.humidity, env?.lightColor, env?.music]);
}


