import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_CONFIG } from "../constants";

export default function useSocketMV2(options = {}) {
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

      console.log("MV2 Hook: Initializing socket connection...");

      const s = io({ path: SOCKET_CONFIG.PATH });

      socketRef.current = s;
      setSocket(s);

      s.on("connect", () => {
        console.log("✅ MV2 socket connected:", s.id);
        s.emit("mv2-init");
        s.emit("device:heartbeat", {
          deviceId: s.id,
          type: "mv2",
          version: "1.0.0",
          ts: Date.now(),
        });
      });

      s.on("disconnect", () => {
        console.log("❌ MV2 socket disconnected");
      });

      s.on("device:ping", () => {
        s.emit("device:heartbeat", {
          deviceId: s.id,
          type: "mv2",
          version: "1.0.0",
          ts: Date.now(),
        });
      });

      if (typeof window !== "undefined") {
        s.on("client:reload", () => window.location.reload());
      }

      const hb = setInterval(() => {
        if (s.connected) {
          s.emit("device:heartbeat", {
            deviceId: s.id,
            type: "mv2",
            version: "1.0.0",
            ts: Date.now(),
          });
        }
      }, 15000);
      s.on("disconnect", () => clearInterval(hb));
    })();

    return () => {
      mounted = false;
      console.log("MV2 Hook: Cleaning up socket");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;
    const { onEntranceNewVoice } = options || {};

    if (onEntranceNewVoice) s.on("entrance-new-voice", onEntranceNewVoice);

    return () => {
      if (onEntranceNewVoice) s.off("entrance-new-voice", onEntranceNewVoice);
    };
  }, [options?.onEntranceNewVoice]);

  return { socket };
}


