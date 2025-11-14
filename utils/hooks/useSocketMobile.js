import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_CONFIG } from "../constants";

// Inline payload creators (moved from socketEvents)
const createBasePayload = (source, additionalData = {}) => ({
  uuid: `uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  ts: Date.now(),
  source,
  ...additionalData
});

const createMobileUserPayload = (userId, meta = {}) => createBasePayload("mobile", { userId, meta });
const createMobileNamePayload = (name, meta = {}) => createBasePayload("mobile", { name, userId: meta.userId, meta });
const createMobileVoicePayload = (text, emotion, score = 0.5, meta = {}) => createBasePayload("mobile", { text, emotion, score, userId: meta.userId, meta });

// mobile-side socket: init and emit actions
export default function useSocketMobile(options = {}) {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Socket 즉시 초기화 (fetch 제거로 지연 최소화)
    console.log("Mobile Hook: Initializing socket connection...");

    const s = io({
      path: SOCKET_CONFIG.PATH,
      transports: SOCKET_CONFIG.TRANSPORTS,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 12000,
      forceNew: true,
      withCredentials: false,
    });

    socketRef.current = s;
    setSocket(s);

    s.on("connect", () => {
      console.log("✅ Mobile socket connected:", s.id);
      // mobile-init is now emitted from MobileControls component with userId
    });

    s.on("disconnect", () => {
      console.log("❌ Mobile socket disconnected");
    });

    s.on("connect_error", (error) => {
      console.error("❌ Mobile socket connection error:", error.message);
    });

    // Attach dynamic listeners
    const { onMobileDecision } = options || {};
    if (onMobileDecision) s.on("mobile-new-decision", onMobileDecision);

    return () => {
      mounted = false;
      console.log("Mobile Hook: Cleaning up socket");
      if (socketRef.current) {
        if (onMobileDecision) socketRef.current.off("mobile-new-decision", onMobileDecision);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // emits: mobile-new-user, mobile-new-name, mobile-new-voice, mobile-user-needs
  const emitNewUser = (payload = {}) => {
    const finalPayload = payload.uuid ? payload : createMobileUserPayload(payload.userId, payload.meta);
    console.log("📱 Mobile Hook: Emitting mobile-new-user:", finalPayload);
    socketRef.current?.emit("mobile-new-user", finalPayload);
  };

  const emitNewName = (name, meta = {}) => {
    const payload = createMobileNamePayload(name, meta);
    console.log("📱 Mobile Hook: Emitting mobile-new-name:", payload);
    socketRef.current?.emit("mobile-new-name", payload);
  };

  const emitNewVoice = (text, emotion, score = 0.5, meta = {}) => {
    const payload = createMobileVoicePayload(text, emotion, score, meta);
    console.log("📱 Mobile Hook: Emitting mobile-new-voice:", payload);
    socketRef.current?.emit("mobile-new-voice", payload);
  };

  const emitUserNeeds = (needs) => {
    // expects { userId, temperature, humidity, lightColor, song, priority, timestamp }
    socketRef.current?.emit("mobile-user-needs", needs);
  };

  return { 
    socket,
    emitNewUser, 
    emitNewName, 
    emitNewVoice,
    emitUserNeeds
  };
}
