import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function ControllerPage() {
  const socketRef = useRef(null);
  const [status, setStatus] = useState("disconnected");
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [voice, setVoice] = useState("");
  const [temp, setTemp] = useState(22);
  const [humidity, setHumidity] = useState(50);
  const [lightColor, setLightColor] = useState("#FFD700");
  const [music, setMusic] = useState("Relax");
  const [reason, setReason] = useState("");
  const [lastDecision, setLastDecision] = useState(null);

  useEffect(() => {
    (async () => {
      try { await fetch("/api/socket"); } catch {}
      const s = io({ path: "/api/socket" });
      socketRef.current = s;
      s.on("connect", () => {
        setStatus("connected");
        s.emit("controller-init");
      });
      s.on("disconnect", () => setStatus("disconnected"));
      s.on("device-new-decision", (p) => setLastDecision(p));
      return () => { s.close(); };
    })();
    return () => { if (socketRef.current) socketRef.current.close(); };
  }, []);

  const emitName = () => {
    socketRef.current?.emit("controller-new-name", { userId, name });
  };
  const emitVoice = () => {
    socketRef.current?.emit("controller-new-voice", { userId, text: voice });
  };
  const emitDecision = () => {
    socketRef.current?.emit("controller-new-decision", {
      userId,
      params: { temp: Number(temp), humidity: Number(humidity), lightColor, music },
      reason,
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Controller</h1>
      <p>Status: <span style={{ color: status === 'connected' ? 'green' : 'gray' }}>{status}</span></p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
          <h3>User</h3>
          <input value={userId} onChange={e=>setUserId(e.target.value)} placeholder="userId" style={{ width:'100%', marginBottom: 8 }}/>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="name" style={{ width:'100%', marginBottom: 8 }}/>
          <button onClick={emitName}>Send controller-new-name</button>
        </div>
        <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
          <h3>Voice</h3>
          <input value={voice} onChange={e=>setVoice(e.target.value)} placeholder="voice text" style={{ width:'100%', marginBottom: 8 }}/>
          <button onClick={emitVoice}>Send controller-new-voice</button>
        </div>
        <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
          <h3>Decision</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap: 8 }}>
            <label>Temp <input type="number" value={temp} onChange={e=>setTemp(e.target.value)} /></label>
            <label>Humidity <input type="number" value={humidity} onChange={e=>setHumidity(e.target.value)} /></label>
            <label>LightColor <input type="text" value={lightColor} onChange={e=>setLightColor(e.target.value)} /></label>
            <label>Music <input type="text" value={music} onChange={e=>setMusic(e.target.value)} /></label>
          </div>
          <textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="reason" style={{ width:'100%', marginTop:8 }}/>
          <button onClick={emitDecision} style={{ marginTop: 8 }}>Send controller-new-decision</button>
        </div>
        <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
          <h3>Last decision (from server)</h3>
          <pre style={{ whiteSpace:'pre-wrap' }}>{JSON.stringify(lastDecision, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}


