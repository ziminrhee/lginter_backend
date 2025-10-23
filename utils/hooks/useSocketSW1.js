import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { EVENTS, createDeviceDecisionPayload, createBasePayload } from "./socketEvents";
import { SOCKET_CONFIG } from "../constants";

// SW1 is climate (temperature/humidity)
export default function useSocketSW1() {
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

      console.log("SW1 Hook: Initializing socket connection...");

      const s = io({
        path: SOCKET_CONFIG.PATH,
        transports: SOCKET_CONFIG.TRANSPORTS,
      });

      socketRef.current = s;
      setSocket(s);

      s.on("connect", () => {
        console.log("✅ SW1 socket connected:", s.id);
        s.emit("sw1-init");
      });

      s.on("disconnect", () => {
        console.log("❌ SW1 socket disconnected");
      });
    })();
    
    return () => {
      mounted = false;
      console.log("SW1 Hook: Cleaning up socket");
      if (socketRef.current) { 
        socketRef.current.disconnect(); 
        socketRef.current = null; 
      }
    };
  }, []);

  const emitClimateDecision = (temp, humidity, assignedUser, meta = {}) => {
    // payload: { uuid, ts, type: 'climate', temp, humidity, assignedUser }
    const data = { temp, humidity };
    const payload = createDeviceDecisionPayload("climate", data, assignedUser, meta);
    socketRef.current?.emit(EVENTS.SW1_DEVICE_DECISION, payload);
  };

  const emitDeviceVoice = (text, emotion, meta = {}) => {
    const payload = createBasePayload("sw1", { text, emotion, meta });
    socketRef.current?.emit(EVENTS.SW1_DEVICE_VOICE, payload);
  };

  return { 
    socket,
    emitClimateDecision, 
    emitDeviceVoice 
  };
}
