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
          background: linear-gradient(135deg, #F7FAFC 0%, #FFEAF4 45%, #FFF1D6 100%);
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

        .blob.mono {
          width: 64vmin; height: 64vmin; left: 18vw; top: 28vh;
          border-radius: 50%;
          /* initial centers for moving lobes */
          --p1x: 72%; --p1y: 52%;
          --p2x: 46%; --p2y: 68%;
          --p3x: 32%; --p3y: 28%;
          /* inner disc with animated centers */
          background:
            radial-gradient(farthest-side at var(--p1x) var(--p1y), rgba(255,120,170,0.90) 0%, rgba(255,120,170,0.48) 30%, rgba(255,120,170,0.00) 60%),
            radial-gradient(farthest-side at var(--p2x) var(--p2y), rgba(255,214,168,0.92) 0%, rgba(255,214,168,0.55) 44%, rgba(255,214,168,0.00) 80%),
            radial-gradient(farthest-side at var(--p3x) var(--p3y), rgba(206,232,232,0.75) 0%, rgba(206,232,232,0.00) 56%),
            radial-gradient(closest-side at 50% 50%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.90) 62%, rgba(255,255,255,0.00) 76%);
          filter: blur(10px) saturate(118%);
          position: absolute;
          animation: l1 10s ease-in-out infinite alternate, l2 14s ease-in-out infinite alternate, l3 18s ease-in-out infinite alternate;
        }
        .blob.mono::before {
          /* bright inner rim */
          content: '';
          position: absolute; inset: -2vmin; border-radius: 50%;
          background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 58%, rgba(255,255,255,0.98) 61%, rgba(255,255,255,0) 66%);
           filter: blur(8px);
          opacity: 0.95;
          mix-blend-mode: screen;
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
          0%   { --p1x: 72%; --p1y: 52%; }
          50%  { --p1x: 60%; --p1y: 46%; }
          100% { --p1x: 66%; --p1y: 60%; }
        }
        @keyframes l2 {
          0%   { --p2x: 46%; --p2y: 68%; }
          50%  { --p2x: 54%; --p2y: 62%; }
          100% { --p2x: 42%; --p2y: 72%; }
        }
        @keyframes l3 {
          0%   { --p3x: 32%; --p3y: 28%; }
          50%  { --p3x: 38%; --p3y: 34%; }
          100% { --p3x: 28%; --p3y: 24%; }
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
