import { useEffect, useMemo, useState } from 'react';
import { fonts } from '../styles/tokens';

export default function BlobControls() {
  const [open, setOpen] = useState(false);

  const [centerX, setCenterX] = useState(41);
  const [centerY, setCenterY] = useState(23);
  const [start, setStart] = useState(50);
  const [end, setEnd] = useState(99);
  const [blurPx, setBlurPx] = useState(52);
  const [rimTilt, setRimTilt] = useState(30);
  const [feather, setFeather] = useState(15);
  const [innerBlur, setInnerBlur] = useState(20);
  const [color0, setColor0] = useState('#F7F7E8');
  const [color1, setColor1] = useState('#F4E9D7');
  const [color2, setColor2] = useState('#F79CBF');
  const [color3, setColor3] = useState('#C5F7EA');
  const [color4, setColor4] = useState('#C8F4E9');
  const [tintAlpha, setTintAlpha] = useState(0.85);
  const [boost, setBoost] = useState(1.9);
  const [bgTop, setBgTop] = useState('#ECF8FA');
  const [bgMid, setBgMid] = useState('#FAFDFF');
  const [bgLow, setBgLow] = useState('#FFE0F8');
  const [bgBottom, setBgBottom] = useState('#FFF0FB');
  const [bgMidStop, setBgMidStop] = useState(23);
  const [bgLowStop, setBgLowStop] = useState(64);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.blobSettings = {
      centerX, centerY, start, end, blurPx, rimTilt, feather, innerBlur,
      color0, color1, color2, color3, color4, tintAlpha, boost
    };
    window.bgSettings = {
      top: bgTop,
      mid: bgMid,
      low: bgLow,
      bottom: bgBottom,
      midStop: bgMidStop,
      lowStop: bgLowStop,
    };
  }, [centerX, centerY, start, end, blurPx, rimTilt, feather, innerBlur, color0, color1, color2, color3, color4, tintAlpha, boost, bgTop, bgMid, bgLow, bgBottom, bgMidStop, bgLowStop]);

  const row = useMemo(() => ({ display: 'flex', alignItems: 'center', gap: 8 }), []);
  const label = useMemo(() => ({ width: 84, fontWeight: 600, color: '#444', fontFamily: fonts.ui }), []);
  const number = useMemo(() => ({ width: 56, textAlign: 'right', color: '#666', fontFamily: fonts.ui }), []);

  return (
    <div style={{ position: 'fixed', right: 12, top: 12, zIndex: 2000 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          padding: '10px 12px', borderRadius: 12, border: '1px solid #ddd',
          background: '#fff', boxShadow: '0 6px 20px rgba(0,0,0,0.12)', cursor: 'pointer',
          fontFamily: fonts.ui, fontWeight: 600
        }}
      >
        {open ? '닫기' : '조절'}
      </button>
      {open && (
        <div style={{
          marginTop: 10,
          width: 310,
          maxHeight: '70vh',
          overflow: 'auto',
          padding: 12,
          background: 'rgba(255,255,255,0.96)',
          border: '1px solid #e8e8e8',
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
        }}>
          <div style={{ fontFamily: fonts.ui, fontWeight: 800, margin: '4px 0 8px' }}>Blob</div>
          <div style={row}><div style={label}>Center X</div><input type="range" min="0" max="100" value={centerX} onChange={(e) => setCenterX(Number(e.target.value))} /><div style={number}>{centerX}%</div></div>
          <div style={row}><div style={label}>Center Y</div><input type="range" min="0" max="100" value={centerY} onChange={(e) => setCenterY(Number(e.target.value))} /><div style={number}>{centerY}%</div></div>
          <div style={row}><div style={label}>Start</div><input type="range" min="0" max="95" value={start} onChange={(e) => setStart(Math.min(Number(e.target.value), end - 1))} /><div style={number}>{start}%</div></div>
          <div style={row}><div style={label}>End</div><input type="range" min={start + 1} max="100" value={end} onChange={(e) => setEnd(Math.max(Number(e.target.value), start + 1))} /><div style={number}>{end}%</div></div>
          <div style={row}><div style={label}>Blur</div><input type="range" min="0" max="100" value={blurPx} onChange={(e) => setBlurPx(Number(e.target.value))} /><div style={number}>{blurPx}px</div></div>
          <div style={row}><div style={label}>Feather</div><input type="range" min="0" max="15" value={feather} onChange={(e) => setFeather(Number(e.target.value))} /><div style={number}>{feather}%</div></div>
          <div style={row}><div style={label}>Inner Blur</div><input type="range" min="0" max="40" value={innerBlur} onChange={(e) => setInnerBlur(Number(e.target.value))} /><div style={number}>{innerBlur}px</div></div>
          <div style={row}><div style={label}>Rim Tilt</div><input type="range" min="-30" max="30" value={rimTilt} onChange={(e) => setRimTilt(Number(e.target.value))} /><div style={number}>{rimTilt}°</div></div>
          <div style={row}><div style={label}>Rim Tint</div><input type="range" min="0" max="1" step="0.01" value={tintAlpha} onChange={(e) => setTintAlpha(Number(e.target.value))} /><div style={number}>{tintAlpha.toFixed(2)}</div></div>
          <div style={row}><div style={label}>Outer Boost</div><input type="range" min="1" max="2.2" step="0.05" value={boost} onChange={(e) => setBoost(Number(e.target.value))} /><div style={number}>{boost.toFixed(2)}x</div></div>
          <div style={{ ...row, gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
            <div style={label}>Colors</div>
            <input type="color" value={color0} onChange={(e) => setColor0(e.target.value)} />
            <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} />
            <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} />
            <input type="color" value={color3} onChange={(e) => setColor3(e.target.value)} />
            <input type="color" value={color4} onChange={(e) => setColor4(e.target.value)} />
          </div>
          <div style={{ fontFamily: fonts.ui, fontWeight: 800, margin: '16px 0 8px' }}>Background</div>
          <div style={row}><div style={label}>Top</div><input type="color" value={bgTop} onChange={(e) => setBgTop(e.target.value)} /></div>
          <div style={row}><div style={label}>Mid</div><input type="color" value={bgMid} onChange={(e) => setBgMid(e.target.value)} /></div>
          <div style={row}><div style={label}>Low</div><input type="color" value={bgLow} onChange={(e) => setBgLow(e.target.value)} /></div>
          <div style={row}><div style={label}>Bottom</div><input type="color" value={bgBottom} onChange={(e) => setBgBottom(e.target.value)} /></div>
          <div style={row}><div style={label}>Mid Stop</div><input type="range" min="0" max={bgLowStop - 1} value={bgMidStop} onChange={(e) => setBgMidStop(Math.min(Number(e.target.value), bgLowStop - 1))} /><div style={number}>{bgMidStop}%</div></div>
          <div style={row}><div style={label}>Low Stop</div><input type="range" min={bgMidStop + 1} max="100" value={bgLowStop} onChange={(e) => setBgLowStop(Math.max(Number(e.target.value), bgMidStop + 1))} /><div style={number}>{bgLowStop}%</div></div>
        </div>
      )}
    </div>
  );
}



