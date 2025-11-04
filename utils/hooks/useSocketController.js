import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_CONFIG } from '../constants';

export default function useSocketController() {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('disconnected');

  useEffect(() => {
    let mounted = true;

    // Warm up API route so the Socket.IO server is ready when we connect.
    fetch('/api/socket').catch(() => {});

    const s = io({ path: SOCKET_CONFIG.PATH, transports: SOCKET_CONFIG.TRANSPORTS });
    socketRef.current = s;
    setSocket(s);

    const handleConnect = () => {
      if (!mounted) return;
      setStatus('connected');
      s.emit('controller-init');
    };

    const handleDisconnect = () => {
      if (!mounted) return;
      setStatus('disconnected');
    };

    s.on('connect', handleConnect);
    s.on('disconnect', handleDisconnect);

    return () => {
      mounted = false;
      s.off('connect', handleConnect);
      s.off('disconnect', handleDisconnect);
      s.close();
      socketRef.current = null;
      setSocket(null);
      setStatus('disconnected');
    };
  }, []);

  const emit = useCallback((event, payload) => {
    socketRef.current?.emit(event, payload);
  }, []);

  return { socket, status, emit };
}

