import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { createBasePayload } from "./socketEvents";
import { SOCKET_CONFIG } from "../constants";

export default function useSocketTV1(options = {}) {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await fetch("/api/socket");
      } catch (e) {
        console.log("API socket endpoint not available, using direct connection");
      }
      if (!mounted) return;

      console.log("TV1 Hook: Initializing socket connection...");

      const s = io({ path: SOCKET_CONFIG.PATH });

      socketRef.current = s;
      setSocket(s);

      s.on("connect", () => {
        console.log("✅ TV1 socket connected:", s.id);
        s.emit("tv1-init");
        s.emit('device:heartbeat', { deviceId: s.id, type: 'tv1', version: '1.0.0', ts: Date.now() });
      });

      s.on("disconnect", () => {
        console.log("❌ TV1 socket disconnected");
      });

      // 중요: new-name 이벤트 리스닝 (streamlined)
      s.on("new-name", (data) => {
        console.log("📺 TV1 received new-name:", data);
      });
      // ping/reload
      s.on('device:ping', () => { s.emit('device:heartbeat', { deviceId: s.id, type: 'tv1', version: '1.0.0', ts: Date.now() }); });
      if (typeof window !== 'undefined') s.on('client:reload', () => window.location.reload());

      const hb = setInterval(() => { if (s.connected) s.emit('device:heartbeat', { deviceId: s.id, type: 'tv1', version: '1.0.0', ts: Date.now() }); }, 15000);
      s.on('disconnect', () => clearInterval(hb));
    })();
    
    return () => {
      mounted = false;
      console.log("TV1 Hook: Cleaning up socket");
      if (socketRef.current) { 
        socketRef.current.disconnect(); 
        socketRef.current = null; 
      }
    };
  }, []);

  // Attach/detach external handlers
  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;
    const { onEntranceNewVoice, onDeviceDecision, onDeviceNewDecision } = options || {};

    if (onEntranceNewVoice) s.on('entrance-new-voice', onEntranceNewVoice);
    if (onDeviceDecision) s.on('device-decision', onDeviceDecision);
    if (onDeviceNewDecision) s.on('device-new-decision', onDeviceNewDecision);

    return () => {
      if (onEntranceNewVoice) s.off('entrance-new-voice', onEntranceNewVoice);
      if (onDeviceDecision) s.off('device-decision', onDeviceDecision);
      if (onDeviceNewDecision) s.off('device-new-decision', onDeviceNewDecision);
    };
  }, [socket, options?.onEntranceNewVoice, options?.onDeviceDecision, options?.onDeviceNewDecision]);

  return { 
    socket,
    
  };
}
