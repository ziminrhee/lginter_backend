import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { createBasePayload } from "./socketEvents";
import { SOCKET_CONFIG } from "../constants";

export default function useSocketTV1() {
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

      const s = io({
        path: SOCKET_CONFIG.PATH,
      });

      socketRef.current = s;
      setSocket(s);

      s.on("connect", () => {
        console.log("✅ TV1 socket connected:", s.id);
        s.emit("tv1-init");
      });

      s.on("disconnect", () => {
        console.log("❌ TV1 socket disconnected");
      });

      // 중요: new-name 이벤트 리스닝 (streamlined)
      s.on("new-name", (data) => {
        console.log("📺 TV1 received new-name:", data);
      });
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

  return { 
    socket,
    
  };
}
