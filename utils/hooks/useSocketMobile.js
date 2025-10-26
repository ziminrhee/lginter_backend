import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { EVENTS, createMobileUserPayload, createMobileNamePayload, createMobileVoicePayload } from "./socketEvents";
import { SOCKET_CONFIG } from "../constants";

// mobile-side socket: init and emit actions
export default function useSocketMobile() {
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
      timeout: 10000
    });

    socketRef.current = s;
    setSocket(s);

    s.on("connect", () => {
      console.log("✅ Mobile socket connected:", s.id);
      s.emit("mobile-init");
    });

    s.on("disconnect", () => {
      console.log("❌ Mobile socket disconnected");
    });

    s.on("connect_error", (error) => {
      console.error("❌ Mobile socket connection error:", error.message);
    });

    return () => {
      mounted = false;
      console.log("Mobile Hook: Cleaning up socket");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // emits: mobile-new-user, mobile-new-name, mobile-new-voice, mobile-user-needs
  const emitNewUser = (payload = {}) => {
    const finalPayload = payload.uuid ? payload : createMobileUserPayload(payload.userId, payload.meta);
    console.log("📱 Mobile Hook: Emitting mobile-new-user:", finalPayload);
    socketRef.current?.emit(EVENTS.MOBILE_NEW_USER, finalPayload);
  };

  const emitNewName = (name, meta = {}) => {
    const payload = createMobileNamePayload(name, meta);
    console.log("📱 Mobile Hook: Emitting mobile-new-name:", payload);
    socketRef.current?.emit(EVENTS.MOBILE_NEW_NAME, payload);
  };

  const emitNewVoice = (text, emotion, score = 0.5, meta = {}) => {
    const payload = createMobileVoicePayload(text, emotion, score, meta);
    console.log("📱 Mobile Hook: Emitting mobile-new-voice:", payload);
    socketRef.current?.emit(EVENTS.MOBILE_NEW_VOICE, payload);
  };

  const emitUserNeeds = (needs) => {
    // expects { userId, temperature, humidity, lightColor, song, priority, timestamp }
    socketRef.current?.emit(EVENTS.MOBILE_USER_NEEDS, needs);
  };

  return { 
    socket,
    emitNewUser, 
    emitNewName, 
    emitNewVoice,
    emitUserNeeds
  };
}
