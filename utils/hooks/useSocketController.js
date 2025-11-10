import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_CONFIG } from '../constants';
import { EV } from '@/src/core/events';

export default function useSocketController(options = {}) {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('disconnected');
  const handlersRef = useRef({
    onNewUser: options.onNewUser,
    onNewName: options.onNewName,
    onNewVoice: options.onNewVoice,
    onDeviceHeartbeat: options.onDeviceHeartbeat,
  });

  // keep latest handlers without rebinding listeners
  useEffect(() => {
    handlersRef.current = {
      onNewUser: options.onNewUser,
      onNewName: options.onNewName,
      onNewVoice: options.onNewVoice,
      onDeviceHeartbeat: options.onDeviceHeartbeat,
    };
  }, [options.onNewUser, options.onNewName, options.onNewVoice, options.onDeviceHeartbeat]);

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

    // Optional controller event listeners
    const handleNewUser = (payload) => handlersRef.current.onNewUser?.(payload);
    const handleNewName = (payload) => handlersRef.current.onNewName?.(payload);
    const handleNewVoice = (payload) => handlersRef.current.onNewVoice?.(payload);
    const handleDeviceHeartbeat = (payload) => handlersRef.current.onDeviceHeartbeat?.(payload);

    s.on(EV.CONTROLLER_NEW_USER, handleNewUser);
    s.on(EV.CONTROLLER_NEW_NAME, handleNewName);
    s.on(EV.CONTROLLER_NEW_VOICE, handleNewVoice);
    s.on('device-heartbeat', handleDeviceHeartbeat);

    return () => {
      mounted = false;
      s.off('connect', handleConnect);
      s.off('disconnect', handleDisconnect);
      s.off(EV.CONTROLLER_NEW_USER, handleNewUser);
      s.off(EV.CONTROLLER_NEW_NAME, handleNewName);
      s.off(EV.CONTROLLER_NEW_VOICE, handleNewVoice);
      s.off('device-heartbeat', handleDeviceHeartbeat);
      s.close();
      socketRef.current = null;
      setSocket(null);
      setStatus('disconnected');
    };
  }, []);

  const emit = useCallback((event, payload) => {
    socketRef.current?.emit(event, payload);
  }, []);

  const updateHandlers = useMemo(() => (next) => {
    handlersRef.current = { ...handlersRef.current, ...next };
  }, []);

  return { socket, status, emit, updateHandlers };
}

