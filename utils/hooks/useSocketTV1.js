import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { EVENTS, createBasePayload } from "./socketEvents";
import { SOCKET_CONFIG } from "../constants";

export default function useSocketTV1() {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    console.log("TV1 Hook: Initializing socket connection...");
    
    const s = io(SOCKET_CONFIG.URL, { 
      path: SOCKET_CONFIG.PATH,
      transports: SOCKET_CONFIG.TRANSPORTS
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

    // 중요: display-new-name 이벤트 리스닝
    s.on("display-new-name", (data) => {
      console.log("📺 TV1 received display-new-name:", data);
    });

    s.on(EVENTS.TV1_UPDATE_STATE, (payload) => {
      console.log("TV1 state update", payload);
    });
    
    return () => {
      mounted = false;
      console.log("TV1 Hook: Cleaning up socket");
      if (socketRef.current) { 
        socketRef.current.disconnect(); 
        socketRef.current = null; 
      }
    };
  }, []);

  const updateTv1State = (state, meta = {}) => {
    const payload = createBasePayload("tv1", { state, meta });
    socketRef.current?.emit(EVENTS.TV1_UPDATE_STATE, payload);
  };

  return { 
    socket,
    updateTv1State 
  };
}
