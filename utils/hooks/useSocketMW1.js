import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { EVENTS, createBasePayload } from "./socketEvents";
import { SOCKET_CONFIG } from "../constants";

export default function useSocketMW1() {
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

      console.log("MW1 Hook: Initializing socket connection...");

      const s = io(SOCKET_CONFIG.URL, {
        path: SOCKET_CONFIG.PATH,
        transports: SOCKET_CONFIG.TRANSPORTS,
      });

      socketRef.current = s;
      setSocket(s);

      s.on("connect", () => {
        console.log("✅ MW1 socket connected:", s.id);
        s.emit("mw1-init");
      });

      s.on("disconnect", () => {
        console.log("❌ MW1 socket disconnected");
      });

      // 중요: display-new-name 이벤트 리스닝
      s.on("display-new-name", (data) => {
        console.log("🎉 MW1 received display-new-name:", data);
      });

      s.on(EVENTS.MW1_DISPLAY_WELCOME, (data) => {
        console.log("MW1 DISPLAY WELCOME:", data);
      });
    })();
    
    return () => {
      mounted = false;
      console.log("MW1 Hook: Cleaning up socket");
      if (socketRef.current) { 
        socketRef.current.disconnect(); 
        socketRef.current = null; 
      }
    };
  }, []);

  const displayWelcome = (text, meta = {}) => {
    const payload = createBasePayload("mw1", { text, meta });
    socketRef.current?.emit(EVENTS.MW1_DISPLAY_WELCOME, payload);
  };

  return { 
    socket,
    displayWelcome 
  };
}
