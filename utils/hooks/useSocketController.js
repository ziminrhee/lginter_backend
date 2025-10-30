import { useEffect, useRef, useState, useCallback } from 'react';
import { decideEnv } from '@/src/services/openai.service';
import { io } from 'socket.io-client';

export default function useSocketController() {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [status, setStatus] = useState('disconnected');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try { await fetch('/api/socket'); } catch {}
      const s = io({ path: '/api/socket' });
      socketRef.current = s;
      setSocket(s);
      s.on('connect', () => { setStatus('connected'); s.emit('controller-init'); s.emit('controller:sync'); });
      s.on('disconnect', () => setStatus('disconnected'));
      s.on('state:full', (snap) => { if (mounted) setSnapshot(snap); });

      // Controller orchestration: listen to mobile inputs
      const queueByUser = new Map(); // userId -> timeout id
      const debounceMs = 500;

      const schedule = (userId, meta) => {
        if (!userId) return;
        if (queueByUser.has(userId)) {
          clearTimeout(queueByUser.get(userId));
        }
        const id = setTimeout(async () => {
          try {
            // Build minimal inputs; could be extended with conversation/program from snapshot
            const result = await decideEnv({
              systemPrompt: 'Decide home environment based on latest user input.',
              latestConversation: [],
              currentProgram: snapshot?.currentProgram || { version: 0, text: '' },
              currentUser: { id: userId },
            });
            socketRef.current?.emit('controller-new-decision', { userId, params: result.params, reason: result.reason, uuid: `uuid-${Date.now()}` , ts: Date.now() });
          } catch (e) {
            // swallow to keep pipeline alive
            console.warn('controller orchestrator error', e?.message || e);
          }
        }, debounceMs);
        queueByUser.set(userId, id);
      };

      const onMobileName = (p) => schedule(p?.userId, { type: 'name' });
      const onMobileVoice = (p) => schedule(p?.userId, { type: 'voice' });
      s.on('mobile-new-name', onMobileName);
      s.on('mobile-new-voice', onMobileVoice);

      // Cleanup for debouncers
      s.on('disconnect', () => {
        for (const id of queueByUser.values()) clearTimeout(id);
        queueByUser.clear();
      });
    })();
    return () => { mounted = false; if (socketRef.current) { socketRef.current.close(); socketRef.current = null; } };
  }, []);

  const overrideDecision = useCallback((k, v, r = '') => {
    socketRef.current?.emit('controller:override', { key: k, value: v, reason: r });
  }, []);

  const recompute = useCallback(() => { socketRef.current?.emit('controller:recompute'); }, []);
  const reset = useCallback((kind='soft') => { socketRef.current?.emit('controller:reset', { kind }); }, []);
  const pingDevice = useCallback((deviceId) => { socketRef.current?.emit('controller:pingDevice', { deviceId }); }, []);
  const reloadDevices = useCallback((scope='all', room) => { socketRef.current?.emit('controller:reloadDevices', { scope, room }); }, []);

  return { socket, status, snapshot, overrideDecision, recompute, reset, pingDevice, reloadDevices };
}


