import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSocketController from '@/utils/hooks/useSocketController';
import {
  DEFAULT_ENV,
  createControllerState,
  buildSnapshot,
  ensureUser,
  updateUserName,
  updateUserVoice,
  updateUserDecision,
  persistPreference,
  getActivePreferences,
  computeFairAverage,
  applyAggregatedEnv,
  updateDeviceHeartbeatState,
  resetUsers,
} from './stateStore';
import { requestControllerDecision } from './openaiEngine';
import {
  Container,
  TopSection,
  BottomSection,
  UserCountCard,
  UserCountLabel,
  UserCountValue,
  ResetButton,
  SettingsPanel,
  SettingsTitle,
  SettingsGrid,
  SettingCard,
  SettingLabel,
  SettingValue,
  ScreenStatusPanel,
  ScreenStatusTitle,
  ScreenGroup,
  ScreenGroupLabel,
  ScreenDeviceGrid,
  DeviceChip,
  UserSelectionTitle,
  UserGrid,
  UserCard,
  UserCardLabel,
  UserCardContent,
} from './styles';

const HEARTBEAT_TIMEOUT = 30 * 1000;
const DECISION_DEBOUNCE_MS = 500;

function generateEventId(prefix = 'controller') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ControllerView() {
  const { socket, emit } = useSocketController();

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
      const entryId = payload.uuid || generateEventId('voice');

      const usersMap = usersRef.current;
      const state = controllerStateRef.current;

      try {
        const userRecord = ensureUser(usersMap, userId, payload.ts || now);
        const { env: individualEnv, reason } = await requestControllerDecision({
          userId,
          userContext: userRecord,
          lastDecision: state.lastDecision,
        });

        persistPreference(preferencesRef.current, { id: entryId, userId, params: individualEnv }, now);
        const activeEntries = getActivePreferences(preferencesRef.current, now);
        const mergedEnv = computeFairAverage(activeEntries);
        const mergedFrom = activeEntries.map((entry) => entry.id);

        const aggregatedReason = activeEntries.length > 1
          ? `Merged from ${activeEntries.length} inputs: ${reason}`
          : reason;

        const decisionId = generateEventId('decision');
        applyAggregatedEnv(state, mergedEnv, mergedFrom, decisionId, now, aggregatedReason);

        updateUserDecision(usersMap, userId, {
          individual: individualEnv,
          applied: mergedEnv,
          mergedFrom,
          reason: aggregatedReason,
          ts: now,
        });

        publishSnapshot();

        emit('controller-new-decision', {
          uuid: decisionId,
          ts: now,
          userId,
          params: mergedEnv,
          reason: aggregatedReason,
        });
      } catch (error) {
        console.warn('controller orchestrator error', error?.message || error);
        const fallbackEnv = controllerStateRef.current.lastDecision?.env || DEFAULT_ENV;
        const fallbackReason = 'Fallback (controller orchestration error)';
        const decisionId = generateEventId('fallback');

        applyAggregatedEnv(controllerStateRef.current, fallbackEnv, [userId], decisionId, now, fallbackReason);
        updateUserDecision(usersRef.current, userId, {
          individual: fallbackEnv,
          applied: fallbackEnv,
          mergedFrom: [userId],
          reason: fallbackReason,
          ts: now,
        });
        publishSnapshot();

        emit('controller-new-decision', {
          uuid: decisionId,
          ts: now,
          userId,
          params: { ...fallbackEnv },
          reason: fallbackReason,
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

  useEffect(() => {
    if (!socket) return undefined;

    const handleNewUser = (payload) => {
      if (!payload?.userId) return;
      updateUserName(usersRef.current, payload.userId, payload.name, payload.ts);
      publishSnapshot();
    };

    const handleNewName = (payload) => {
      if (!payload?.userId) return;
      updateUserName(usersRef.current, payload.userId, payload.name, payload.ts);
      publishSnapshot();
    };

    const handleNewVoice = (payload) => {
      if (!payload?.userId) return;
      updateUserVoice(
        usersRef.current,
        payload.userId,
        {
          text: payload.text || '',
          emotion: payload.emotion || '',
          score: typeof payload.score === 'number' ? payload.score : undefined,
        },
        payload.ts
      );
      publishSnapshot();
      scheduleDecision(payload);
    };

    const handleDeviceHeartbeat = (payload) => {
      updateDeviceHeartbeatState(controllerStateRef.current, payload);
      publishSnapshot();
    };

    socket.on('controller-new-user', handleNewUser);
    socket.on('controller-new-name', handleNewName);
    socket.on('controller-new-voice', handleNewVoice);
    socket.on('device-heartbeat', handleDeviceHeartbeat);

    return () => {
      socket.off('controller-new-user', handleNewUser);
      socket.off('controller-new-name', handleNewName);
      socket.off('controller-new-voice', handleNewVoice);
      socket.off('device-heartbeat', handleDeviceHeartbeat);
    };
  }, [socket, publishSnapshot, scheduleDecision]);

  useEffect(() => () => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current.clear();
  }, []);

  const handleReset = useCallback(() => {
    const now = Date.now();
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current.clear();
    preferencesRef.current.clear();
    controllerStateRef.current = createControllerState();
    usersRef.current = resetUsers(usersRef.current);
    publishSnapshot();

    const decisionId = generateEventId('reset');
    emit('controller-new-decision', {
      uuid: decisionId,
      ts: now,
      userId: 'controller',
      params: { ...DEFAULT_ENV },
      reason: 'Reset to default environment',
    });
  }, [emit, publishSnapshot]);

  const users = snapshot?.users || [];
  const deviceState = snapshot?.deviceState || {};
  const assignments = snapshot?.assignments || {};

  const now = useMemo(() => Date.now(), [snapshot]);

  const getDeviceStatus = useCallback(
    (deviceId) => {
      const dev = deviceState[deviceId?.toLowerCase()];
      if (!dev) return 'error';
      return dev.lastHeartbeatTs && now - dev.lastHeartbeatTs < HEARTBEAT_TIMEOUT ? 'ok' : 'error';
    },
    [deviceState, now]
  );

  return (
    <Container>
      <TopSection>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <UserCountCard>
            <UserCountLabel>서버에 입장한<br />사람의 수</UserCountLabel>
            <UserCountValue>{users.length}</UserCountValue>
          </UserCountCard>
          <ResetButton onClick={handleReset}>
            서버 타임바틀
            <br />
            (재시작)
          </ResetButton>
        </div>

        <SettingsPanel>
          <SettingsTitle>결정된 4가지 설정 스테이트</SettingsTitle>
          <SettingsGrid>
            <SettingCard>
              <SettingLabel>설정 온도:</SettingLabel>
              <SettingValue>{assignments.temperature?.value ?? ''}</SettingValue>
            </SettingCard>
            <SettingCard>
              <SettingLabel>설정 습도:</SettingLabel>
              <SettingValue>{assignments.humidity?.value ?? ''}</SettingValue>
            </SettingCard>
            <SettingCard>
              <SettingLabel>설정 조명 컬러:</SettingLabel>
              <SettingValue>{assignments.light?.value ?? ''}</SettingValue>
            </SettingCard>
            <SettingCard>
              <SettingLabel>설정 음악:</SettingLabel>
              <SettingValue>{assignments.music?.value ?? ''}</SettingValue>
            </SettingCard>
          </SettingsGrid>
        </SettingsPanel>

        <ScreenStatusPanel>
          <ScreenStatusTitle>스크린 상태 체크(오류 상황)</ScreenStatusTitle>

          <ScreenGroup>
            <ScreenGroupLabel>현관3</ScreenGroupLabel>
            <ScreenDeviceGrid>
              {['mw1', 'mv2', 'tv1', 'sbm1'].map((id) => {
                const status = getDeviceStatus(id);
                return (
                  <DeviceChip key={id} $status={status}>
                    {id.toUpperCase()}
                  </DeviceChip>
                );
              })}
            </ScreenDeviceGrid>
          </ScreenGroup>

          <ScreenGroup>
            <ScreenGroupLabel>거실3</ScreenGroupLabel>
            <ScreenDeviceGrid>
              {['sw1', 'sw2', 'tv2'].map((id) => {
                const status = getDeviceStatus(id);
                return (
                  <DeviceChip key={id} $status={status}>
                    {id.toUpperCase()}
                  </DeviceChip>
                );
              })}
            </ScreenDeviceGrid>
          </ScreenGroup>
        </ScreenStatusPanel>
      </TopSection>

      <BottomSection>
        <UserSelectionTitle>각 사용자 선택 사항</UserSelectionTitle>
        <UserGrid>
          {users.slice(0, 6).map((user, idx) => (
            <UserCard key={user.userId || idx}>
              <UserCardLabel>{user.name || `M${idx + 1}`}</UserCardLabel>
              <UserCardContent>
                {user.needs?.temperature && <div>온도: {user.needs.temperature}</div>}
                {user.needs?.humidity && <div>습도: {user.needs.humidity}</div>}
                {user.needs?.light && <div>조명: {user.needs.light}</div>}
                {user.needs?.music && <div>음악: {user.needs.music}</div>}
              </UserCardContent>
            </UserCard>
          ))}
          {Array.from({ length: Math.max(0, 6 - users.length) }).map((_, idx) => (
            <UserCard key={`empty-${idx}`}>
              <UserCardLabel>M{users.length + idx + 1}</UserCardLabel>
              <UserCardContent />
            </UserCard>
          ))}
        </UserGrid>
      </BottomSection>
    </Container>
  );
}
