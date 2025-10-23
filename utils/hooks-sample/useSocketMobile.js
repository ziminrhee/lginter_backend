import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

// mobile-side socket: init and emit actions
export default function useSocketMobile() {
  const socketRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await fetch("/api/socket");
      } catch {}
      if (!mounted) return;
      const s = io({ path: "/api/socketio" });
      socketRef.current = s;
      s.on("connect", () => {
        s.emit("mobile-init");
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

  const emitButtonClick = () => {
    socketRef.current?.emit("mobile-button");
  };

  const emitTextInput = (text) => {
    socketRef.current?.emit("mobile-text", { text });
  };

  return { emitButtonClick, emitTextInput };
}


