import { useState, useEffect } from "react";
import useSocketTV2 from "@/utils/hooks/useSocketTV2";

export default function TV2Controls() {
  const { socket } = useSocketTV2();
  const [aggregatedData, setAggregatedData] = useState({
    temperature: null,
    humidity: null,
    lightColor: null,
    song: ''
  });

  const approximateColorName = (hex) => {
    if (!hex || typeof hex !== 'string') return 'Ambient';
    const m = hex.replace('#','').match(/^([0-9a-fA-F]{6})$/);
    if (!m) return 'Ambient';
    const num = parseInt(m[1], 16);
    const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
    const rf = r/255, gf = g/255, bf = b/255;
    const max = Math.max(rf,gf,bf), min = Math.min(rf,gf,bf);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
      switch(max){
        case rf: h = ((gf - bf) / d) % 6; break;
        case gf: h = (bf - rf) / d + 2; break;
        case bf: h = (rf - gf) / d + 4; break;
      }
      h *= 60; if (h < 0) h += 360;
    }
    if (h >= 45 && h < 75) return 'Yellow';
    if (h >= 25 && h < 45) return 'Orange';
    if (h >= 75 && h < 150) return 'Green';
    if (h >= 150 && h < 210) return 'Cyan';
    if (h >= 210 && h < 260) return 'Blue';
    if (h >= 260 && h < 320) return 'Purple';
    if ((h >= 320 && h <= 360) || (h >= 0 && h < 15)) return 'Pink';
    return 'Ambient';
  };

  const splitTwoLines = (text) => {
    if (!text) return ['',''];
    const parts = String(text).trim().split(/\s+/);
    if (parts.length === 1) return [parts[0], ''];
    const last = parts.pop();
    return [parts.join(' '), last];
  };

  useEffect(() => {
    if (!socket) return;

    const handleDeviceDecision = (data) => {
      if (data.device === 'sw1') {
        setAggregatedData(prev => ({
          ...prev,
          temperature: data.temperature,
          humidity: data.humidity
        }));
      } else if (data.device === 'sw2') {
        setAggregatedData(prev => ({
          ...prev,
          lightColor: data.lightColor,
          song: data.song
        }));
      }
    };

    const handleNewDecision = (msg) => {
      if (!msg || (msg.target && msg.target !== 'tv2')) return;
      const env = msg.env || {};
      setAggregatedData(prev => ({
        ...prev,
        temperature: env.temp ?? prev.temperature,
        humidity: env.humidity ?? prev.humidity,
        lightColor: env.lightColor ?? prev.lightColor,
        song: env.music ?? prev.song
      }));
    };

    socket.on('device-decision', handleDeviceDecision);
    socket.on('device-new-decision', handleNewDecision);
    return () => {
      socket.off('device-decision', handleDeviceDecision);
      socket.off('device-new-decision', handleNewDecision);
    };
  }, [socket]);

  return (
    <div className="tv2-root">
      <div className="bg-layer">
        <div className="blob mono" />
      </div>

      <div className="label temp">{aggregatedData.temperature != null ? `${aggregatedData.temperature}°C` : '—'}</div>
      <div className="label humidity">{aggregatedData.humidity != null ? `${aggregatedData.humidity}%` : '—'}</div>

      <div className="label light">
        <span>{approximateColorName(aggregatedData.lightColor)}</span>
        <span>Light</span>
      </div>

      {(() => { const [l1, l2] = splitTwoLines(aggregatedData.song); return (
        <div className="label music">
          <span>{l1}</span>
          <span>{l2}</span>
        </div>
      ); })()}

      <style jsx>{`
        .tv2-root {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #FFFFFF;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .bg-layer { position: absolute; inset: 0; pointer-events: none; }

        .blob { position: absolute; border-radius: 50%; }

        /* Single, high-fidelity blob constructed by layered radial-gradients + huge halo */
        /* CSS variable registration for smooth gradient center animation */
        @property --p1x { syntax: '<percentage>'; inherits: false; initial-value: 72%; }
        @property --p1y { syntax: '<percentage>'; inherits: false; initial-value: 52%; }
        @property --p2x { syntax: '<percentage>'; inherits: false; initial-value: 46%; }
        @property --p2y { syntax: '<percentage>'; inherits: false; initial-value: 68%; }
        @property --p3x { syntax: '<percentage>'; inherits: false; initial-value: 32%; }
        @property --p3y { syntax: '<percentage>'; inherits: false; initial-value: 28%; }
        @property --p4x { syntax: '<percentage>'; inherits: false; initial-value: 58%; }
        @property --p4y { syntax: '<percentage>'; inherits: false; initial-value: 28%; }
        /* animated stop sizes for undulation */
        @property --s1 { syntax: '<percentage>'; inherits: false; initial-value: 30%; }
        @property --s1o { syntax: '<percentage>'; inherits: false; initial-value: 60%; }
        @property --s2 { syntax: '<percentage>'; inherits: false; initial-value: 44%; }
        @property --s2o { syntax: '<percentage>'; inherits: false; initial-value: 80%; }
        @property --s3 { syntax: '<percentage>'; inherits: false; initial-value: 56%; }
        @property --s3o { syntax: '<percentage>'; inherits: false; initial-value: 72%; }
        @property --s4 { syntax: '<percentage>'; inherits: false; initial-value: 40%; }
        @property --s4o { syntax: '<percentage>'; inherits: false; initial-value: 70%; }

        .blob.mono {
          width: 82vmin; height: 82vmin; left: 14vw; top: 24vh;
          border-radius: 50%;
          clip-path: circle(50% at 50% 50%);
          /* initial centers for moving lobes */
          --p1x: 72%; --p1y: 52%;
          --p2x: 46%; --p2y: 68%;
          --p3x: 32%; --p3y: 28%;
          --p4x: 58%; --p4y: 28%;
          /* inner disc with animated centers + sizes */
          background:
            radial-gradient(farthest-side at var(--p1x) var(--p1y), rgba(255,120,170,0.90) 0%, rgba(255,120,170,0.48) var(--s1), rgba(255,120,170,0.00) var(--s1o)),
            radial-gradient(farthest-side at var(--p2x) var(--p2y), rgba(255,214,168,0.92) 0%, rgba(255,214,168,0.55) var(--s2), rgba(255,214,168,0.00) var(--s2o)),
            radial-gradient(farthest-side at var(--p3x) var(--p3y), rgba(206,232,232,0.70) 0%, rgba(206,232,232,0.00) var(--s3)),
            radial-gradient(farthest-side at var(--p4x) var(--p4y), rgba(200,170,255,0.65) 0%, rgba(200,170,255,0.00) var(--s4)),
            radial-gradient(closest-side at 50% 50%, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.86) 62%, rgba(255,255,255,0.00) 76%);
          filter: blur(6px) saturate(125%);
          position: absolute;
          animation:
            l1 4.5s ease-in-out infinite alternate,
            l2 5s ease-in-out infinite alternate,
            l3 5.5s ease-in-out infinite alternate,
            l4 6s ease-in-out infinite alternate,
            b1 5s ease-in-out infinite alternate,
            b2 5.5s ease-in-out infinite alternate,
            b3 6s ease-in-out infinite alternate,
            b4 6.5s ease-in-out infinite alternate;
        }
        .blob.mono::before {
          /* bright outer rim aligned to blob edge */
          content: '';
          position: absolute; inset: -1vmin; border-radius: 50%;
          background: radial-gradient(farthest-side at 50% 50%, rgba(255,255,255,0) 92%, rgba(255,255,255,0.75) 97%, rgba(255,255,255,0) 100%);
          filter: blur(10px);
          opacity: 0.65;
          mix-blend-mode: screen;
          pointer-events: none;
        }
        .blob.mono::after {
          /* crisp inner stroke for mask-like edge */
          content: '';
          position: absolute; inset: 0; border-radius: inherit;
          box-shadow: inset 0 0 0 2px rgba(255,255,255,0.85);
          pointer-events: none; mix-blend-mode: screen;
        }
        .blob.mono::after {
          /* huge soft halo to get blurry edge */
          content: '';
          position: absolute; inset: -12vmin; border-radius: 50%;
          background: radial-gradient(farthest-side, rgba(255,255,255,0.85), rgba(255,255,255,0.15) 55%, rgba(255,255,255,0.00) 80%);
           filter: blur(22px);
          opacity: 0.9;
        }

        @keyframes l1 {
          0%   { --p1x: 74%; --p1y: 50%; }
          50%  { --p1x: 56%; --p1y: 40%; }
          100% { --p1x: 68%; --p1y: 66%; }
        }
        @keyframes l2 {
          0%   { --p2x: 44%; --p2y: 70%; }
          50%  { --p2x: 60%; --p2y: 56%; }
          100% { --p2x: 38%; --p2y: 76%; }
        }
        @keyframes l3 {
          0%   { --p3x: 30%; --p3y: 26%; }
          50%  { --p3x: 46%; --p3y: 36%; }
          100% { --p3x: 24%; --p3y: 22%; }
        }
        @keyframes l4 {
          0%   { --p4x: 60%; --p4y: 26%; }
          50%  { --p4x: 74%; --p4y: 34%; }
          100% { --p4x: 52%; --p4y: 18%; }
        }
        /* breathing of lobe sizes */
        @keyframes b1 {
          0%   { --s1: 22%; --s1o: 52%; }
          50%  { --s1: 42%; --s1o: 72%; }
          100% { --s1: 24%; --s1o: 54%; }
        }
        @keyframes b2 {
          0%   { --s2: 38%; --s2o: 74%; }
          50%  { --s2: 58%; --s2o: 88%; }
          100% { --s2: 40%; --s2o: 76%; }
        }
        @keyframes b3 {
          0%   { --s3: 46%; --s3o: 66%; }
          50%  { --s3: 64%; --s3o: 78%; }
          100% { --s3: 48%; --s3o: 68%; }
        }
        @keyframes b4 {
          0%   { --s4: 36%; --s4o: 64%; }
          50%  { --s4: 56%; --s4o: 80%; }
          100% { --s4: 38%; --s4o: 66%; }
        }

        .blob.right-top {
          width: 36vmin; height: 36vmin; right: 14vw; top: 13vh;
          background: radial-gradient(closest-side, rgba(255,130,170,0.55), rgba(255,200,170,0.25) 70%, rgba(255,255,255,0) 80%);
          filter: blur(42px);
        }

        .blob.right-mid {
          width: 50vmin; height: 50vmin; right: 18vw; top: 50vh;
          background: radial-gradient(closest-side, rgba(255,120,170,0.55), rgba(255,200,170,0.25) 70%, rgba(255,255,255,0) 80%);
          filter: blur(44px);
        }

        .vignette {
          position: absolute; inset: -10vmin; pointer-events: none;
          background: radial-gradient(120vmin 120vmin at 10% 90%, rgba(255,255,255,0.0) 60%, rgba(255,255,255,0.7) 95%),
                      radial-gradient(120vmin 120vmin at 90% 10%, rgba(255,255,255,0.0) 60%, rgba(255,255,255,0.65) 95%);
          filter: blur(8px);
          opacity: 0.6;
        }

        .label {
          position: absolute;
          color: #ffffff;
          font-weight: 800;
          text-align: center;
          text-shadow: 0 12px 40px rgba(255, 105, 180, 0.35), 0 0 18px rgba(255,255,255,0.6);
          letter-spacing: 0.2px;
        }

        .label.temp { top: 28vh; left: 53vw; transform: translateX(-50%); font-size: clamp(20px, 2.6vw, 42px); }
        .label.humidity { top: 20vh; right: 16vw; font-size: clamp(18px, 2.2vw, 36px); }
        .label.light { top: 63vh; left: 48vw; transform: translateX(-50%); font-size: clamp(18px, 2.2vw, 34px); line-height: 1.12; }
        .label.music { top: 63vh; left: 67vw; transform: translateX(-50%); font-size: clamp(18px, 2.2vw, 34px); line-height: 1.12; }
        .label.light span, .label.music span { display: block; }
      `}</style>
    </div>
  );
}
