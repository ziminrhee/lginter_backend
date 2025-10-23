import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { EVENTS, createBasePayload } from "./socketEvents";
import { SOCKET_CONFIG } from "../constants";

export default function useSocketTV2() {
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

      console.log("TV2 Hook: Initializing socket connection...");

      const s = io(SOCKET_CONFIG.URL, {
        path: SOCKET_CONFIG.PATH,
        transports: SOCKET_CONFIG.TRANSPORTS,
      });

      socketRef.current = s;
      setSocket(s);

      s.on("connect", () => {
        console.log("✅ TV2 socket connected:", s.id);
        s.emit("tv2-init");
      });

      s.on("disconnect", () => {
        console.log("❌ TV2 socket disconnected");
      });
    })();
    
    return () => {
      mounted = false;
      console.log("TV2 Hook: Cleaning up socket");
      if (socketRef.current) { 
        socketRef.current.disconnect(); 
        socketRef.current = null; 
      }
    };
  }, []);

  const showAggregated = (aggregated, meta = {}) => {
    // payload: { uuid, ts, aggregated: {...} }
    const payload = createBasePayload("tv2", { aggregated, meta });
    socketRef.current?.emit(EVENTS.TV2_SHOW_AGGREGATED, payload);
  };

  return { 
    socket,
    showAggregated 
  };
}
