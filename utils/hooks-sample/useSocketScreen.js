import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// screen-side socket: init and subscribe to updates
export default function useSocketScreen() {
  const [clicks, setClicks] = useState(0);
  const [text, setText] = useState("");
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
        s.emit("screen-init");
      });

      const onNewClicks = ({ count }) => {
        if (typeof count === "number") setClicks(count);
      };

      const onNewText = ({ text }) => {
        setText(text || "");
      };

      s.on("new-screen-clicks", onNewClicks);
      s.on("new-screen-text", onNewText);

      s.on("disconnect", () => {
        // optional: reset if needed
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

  return { clicks, text };
}


