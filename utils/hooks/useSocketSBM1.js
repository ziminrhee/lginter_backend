import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { EVENTS, createQRPayload, createBasePayload } from "./socketEvents";
import { SOCKET_CONFIG } from "../constants";

export default function useSocketSBM1() {
  const socketRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try { 
        await fetch("/api/socket"); 
      } catch (e) {
        console.log("API socket endpoint not available, using direct connection");
      }
      if (!mounted) return;
      
      const s = io(SOCKET_CONFIG.URL, { 
        path: SOCKET_CONFIG.PATH,
        transports: SOCKET_CONFIG.TRANSPORTS
      });
      socketRef.current = s;
      
      s.on("connect", () => {
        console.log("SBM1 socket connected:", s.id);
        s.emit("sbm1-init");
      });

      s.on("disconnect", () => {
        console.log("SBM1 socket disconnected");
      });
    })();
    
    return () => {
      mounted = false;
      if (socketRef.current) { 
        socketRef.current.disconnect(); 
        socketRef.current = null; 
      }
    };
  }, []);

  // Emits a QR generation event and a new user via SBM1 device
  const emitNewQr = (qrData, meta = {}) => {
    // qrPayload: { uuid, ts, qrData, meta }
    const payload = createQRPayload(qrData, meta);
    socketRef.current?.emit(EVENTS.SBM1_NEW_QR, payload);
  };

  const emitSbm1NewUser = (payload = {}) => {
    // payload: { uuid, ts, source: 'SBM1', meta }
    const finalPayload = payload.uuid ? payload : createBasePayload("sbm1", payload);
    socketRef.current?.emit(EVENTS.SBM1_NEW_USER, finalPayload);
  };

  return { 
    socket: socketRef.current,
    emitNewQr, 
    emitSbm1NewUser 
  };
}
