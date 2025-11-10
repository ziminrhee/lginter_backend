import { useCallback, useRef, useState } from 'react';
import { DEFAULT_ENV, createControllerState, ensureUser, updateUserName, updateUserVoice, updateUserDecision, persistPreference, getActivePreferences, applyAggregatedEnv, updateDeviceHeartbeatState, resetUsers, buildSnapshot } from '../stateStore';
import { requestControllerDecision } from '../openaiEngine';
import { computeFairAverage } from '../logic/controllerMerge';

const DECISION_DEBOUNCE_MS = 500;
const HEARTBEAT_TIMEOUT = 30 * 1000;

export default function useControllerOrchestrator({ emit }) {
  const controllerStateRef = useRef(createControllerState());
  const usersRef = useRef(new Map());
  const preferencesRef = useRef(new Map());
  const timersRef = useRef(new Map());

  const [snapshot, setSnapshot] = useState(() => buildSnapshot(controllerStateRef.current, usersRef.current));

  const publishSnapshot = useCallback(() => {
    setSnapshot(buildSnapshot(controllerStateRef.current, usersRef.current));
  }, []);

  const clearUserTimer = useCallback((userId) => {
    const timers = timersRef.current;
    const existing = timers.get(userId);
    if (existing) {
      clearTimeout(existing);
      timers.delete(userId);
    }
  }, []);

  const processVoice = useCallback(
    async (payload) => {
      if (!payload?.userId) return;
      const userId = payload.userId;
      const now = Date.now();
      const entryId = payload.uuid || `voice-${now}`;

      const usersMap = usersRef.current;
      const state = controllerStateRef.current;

      try {
        const userRecord = ensureUser(usersMap, userId, payload.ts || now);
        const { env: individualEnv, reason, flags, emotionKeyword } = await requestControllerDecision({
          userId,
          userContext: userRecord,
          lastDecision: state.lastDecision,
        });

        persistPreference(preferencesRef.current, { id: entryId, userId, params: individualEnv }, now);
        const activeEntries = getActivePreferences(preferencesRef.current, now);
        const mergedEnv = computeFairAverage(activeEntries);
        const mergedFrom = activeEntries.map((entry) => entry.id);

        const aggregatedReason =
          activeEntries.length > 1 ? `Merged from ${activeEntries.length} inputs: ${reason}` : reason;

        const decisionId = `decision-${now}`;
        applyAggregatedEnv(state, mergedEnv, mergedFrom, decisionId, now, aggregatedReason);

        updateUserDecision(usersMap, userId, {
          individual: individualEnv,
          applied: mergedEnv,
          mergedFrom,
          reason: aggregatedReason,
          ts: now,
        });

        publishSnapshot();

        emit?.('controller-new-decision', {
          uuid: decisionId,
          ts: now,
          userId,
          params: mergedEnv,
          reason: aggregatedReason,
          flags,
          emotionKeyword,
        });
      } catch (error) {
        const fallbackEnv = controllerStateRef.current.lastDecision?.env || DEFAULT_ENV;
        const fallbackReason = 'Fallback (controller orchestration error)';
        const decisionId = `fallback-${now}`;

        applyAggregatedEnv(controllerStateRef.current, fallbackEnv, [userId], decisionId, now, fallbackReason);
        updateUserDecision(usersRef.current, userId, {
          individual: fallbackEnv,
          applied: fallbackEnv,
          mergedFrom: [userId],
          reason: fallbackReason,
          ts: now,
        });
        publishSnapshot();

        emit?.('controller-new-decision', {
          uuid: decisionId,
          ts: now,
          userId,
          params: { ...fallbackEnv },
          reason: fallbackReason,
          flags: { offTopic: false, abusive: false },
          emotionKeyword: '',
        });
      }
    },
    [emit, publishSnapshot]
  );

  const scheduleDecision = useCallback(
    (payload) => {
      const userId = payload?.userId;
      if (!userId) return;
      clearUserTimer(userId);
      const timerId = setTimeout(() => {
        timersRef.current.delete(userId);
        processVoice(payload);
      }, DECISION_DEBOUNCE_MS);
      timersRef.current.set(userId, timerId);
    },
    [clearUserTimer, processVoice]
  );

  // Public handlers for socket events
  const onNewUser = useCallback((payload) => {
    if (!payload?.userId) return;
    updateUserName(usersRef.current, payload.userId, payload.name, payload.ts);
    publishSnapshot();
  }, [publishSnapshot]);

  const onNewName = useCallback((payload) => {
    if (!payload?.userId) return;
    updateUserName(usersRef.current, payload.userId, payload.name, payload.ts);
    publishSnapshot();
  }, [publishSnapshot]);

  const onNewVoice = useCallback((payload) => {
    if (!payload?.userId) return;
    updateUserVoice(
      usersRef.current,
      payload.userId,
      { text: payload.text || '', emotion: payload.emotion || '', score: typeof payload.score === 'number' ? payload.score : undefined },
      payload.ts
    );
    publishSnapshot();
    scheduleDecision(payload);
  }, [publishSnapshot, scheduleDecision]);

  const onDeviceHeartbeat = useCallback((payload) => {
    updateDeviceHeartbeatState(controllerStateRef.current, payload);
    publishSnapshot();
  }, [publishSnapshot]);

  const handleReset = useCallback(() => {
    const now = Date.now();
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current.clear();
    preferencesRef.current.clear();
    controllerStateRef.current = createControllerState();
    usersRef.current = resetUsers(usersRef.current);
    publishSnapshot();

    const decisionId = `reset-${now}`;
    emit?.('controller-new-decision', {
      uuid: decisionId,
      ts: now,
      userId: 'controller',
      params: { ...DEFAULT_ENV },
      reason: 'Reset to default environment',
    });
  }, [emit, publishSnapshot]);

  const getDeviceStatus = useCallback((deviceId) => {
    const dev = (snapshot?.deviceState || {})[deviceId?.toLowerCase()];
    if (!dev) return 'error';
    const now = Date.now();
    return dev.lastHeartbeatTs && now - dev.lastHeartbeatTs < HEARTBEAT_TIMEOUT ? 'ok' : 'error';
  }, [snapshot?.deviceState]);

  return {
    snapshot,
    onNewUser,
    onNewName,
    onNewVoice,
    onDeviceHeartbeat,
    handleReset,
    getDeviceStatus,
  };
}


