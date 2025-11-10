const DEVICE_IDS = ['tv2', 'sw1', 'sw2', 'mw1', 'mv2', 'sbm1', 'tv1'];

export const DEFAULT_ENV = { temp: 24, humidity: 50, lightColor: '#FFFFFF', music: 'ambient' };
export const ACTIVE_INPUT_TTL = 5 * 60 * 1000; // 5 minutes

function createEmptyAssignments() {
  return {
    temperature: null,
    humidity: null,
    light: null,
    music: null,
  };
}

function createEmptyDeviceState() {
  return DEVICE_IDS.reduce((acc, id) => {
    acc[id] = { lastEnv: null, lastDecisionId: null, lastHeartbeatTs: 0, status: 'ok' };
    return acc;
  }, {});
}

export function createControllerState() {
  return {
    assignments: createEmptyAssignments(),
    deviceState: createEmptyDeviceState(),
    lastDecision: null,
  };
}

function cloneAssignments(assignments) {
  return {
    temperature: assignments.temperature ? { ...assignments.temperature } : null,
    humidity: assignments.humidity ? { ...assignments.humidity } : null,
    light: assignments.light ? { ...assignments.light } : null,
    music: assignments.music ? { ...assignments.music } : null,
  };
}

function cloneDeviceState(deviceState) {
  const clone = {};
  for (const [key, value] of Object.entries(deviceState)) {
    clone[key] = { ...value };
    if (value.lastEnv && typeof value.lastEnv === 'object') {
      clone[key].lastEnv = { ...value.lastEnv };
    }
    if (Array.isArray(value.mergedFrom)) {
      clone[key].mergedFrom = [...value.mergedFrom];
    }
  }
  return clone;
}

export function buildSnapshot(controllerState, usersMap) {
  const users = Array.from(usersMap.values())
    .sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0))
    .map((user) => ({
      userId: user.userId,
      name: user.name,
      lastVoice: user.lastVoice,
      lastDecision: user.lastDecision,
      needs: user.lastPreference
        ? {
            temperature: user.lastPreference.temp,
            humidity: user.lastPreference.humidity,
            light: user.lastPreference.lightColor,
            music: user.lastPreference.music,
          }
        : {},
    }));

  return {
    users,
    assignments: cloneAssignments(controllerState.assignments),
    deviceState: cloneDeviceState(controllerState.deviceState),
    lastDecision: controllerState.lastDecision
      ? {
          ...controllerState.lastDecision,
          env: { ...controllerState.lastDecision.env },
          mergedFrom: [...(controllerState.lastDecision.mergedFrom || [])],
        }
      : null,
  };
}

export function ensureUser(usersMap, userId, ts = Date.now()) {
  if (!userId) return null;
  const existing = usersMap.get(userId);
  if (existing) return existing;
  const created = {
    userId,
    name: '',
    joinedAt: ts,
    lastVoice: null,
    lastPreference: null,
    lastDecision: null,
  };
  usersMap.set(userId, created);
  return created;
}

export function updateUserName(usersMap, userId, name, ts = Date.now()) {
  const user = ensureUser(usersMap, userId, ts);
  if (!user) return null;
  const updated = { ...user, name: name ?? user.name, joinedAt: user.joinedAt || ts };
  usersMap.set(userId, updated);
  return updated;
}

export function updateUserVoice(usersMap, userId, voice, ts = Date.now()) {
  const user = ensureUser(usersMap, userId, ts);
  if (!user) return null;
  const updated = {
    ...user,
    lastVoice: voice ? { ...voice, ts } : user.lastVoice,
  };
  usersMap.set(userId, updated);
  return updated;
}

export function updateUserDecision(usersMap, userId, decision) {
  const user = ensureUser(usersMap, userId, decision?.ts || Date.now());
  if (!user) return null;
  const updated = {
    ...user,
    lastPreference: decision?.individual ? { ...decision.individual } : user.lastPreference,
    lastDecision: decision
      ? {
          applied: { ...decision.applied },
          individual: { ...decision.individual },
          mergedFrom: [...decision.mergedFrom],
          reason: decision.reason,
          ts: decision.ts,
        }
      : user.lastDecision,
  };
  usersMap.set(userId, updated);
  return updated;
}

export function normalizeEnv(params) {
  if (!params) return { ...DEFAULT_ENV };
  return {
    temp: Number.isFinite(params.temp) ? params.temp : DEFAULT_ENV.temp,
    humidity: Number.isFinite(params.humidity) ? params.humidity : DEFAULT_ENV.humidity,
    lightColor: typeof params.lightColor === 'string' ? params.lightColor : DEFAULT_ENV.lightColor,
    music: typeof params.music === 'string' ? params.music : DEFAULT_ENV.music,
  };
}

export function prunePreferences(preferencesMap, now) {
  for (const [key, entry] of preferencesMap.entries()) {
    if (now - entry.ts > ACTIVE_INPUT_TTL) {
      preferencesMap.delete(key);
    }
  }
}

export function persistPreference(preferencesMap, entry, now) {
  prunePreferences(preferencesMap, now);
  preferencesMap.set(entry.id, { ...entry, ts: now });
}

export function getActivePreferences(preferencesMap, now) {
  prunePreferences(preferencesMap, now);
  return Array.from(preferencesMap.values()).filter((entry) => now - entry.ts <= ACTIVE_INPUT_TTL);
}

export function computeFairAverage(entries) {
  if (!entries.length) return { ...DEFAULT_ENV };

  const temps = entries.map((entry) => entry.params.temp ?? DEFAULT_ENV.temp);
  const humidities = entries.map((entry) => entry.params.humidity ?? DEFAULT_ENV.humidity);
  const colors = entries.map((entry) => entry.params.lightColor || DEFAULT_ENV.lightColor);
  const musicVotes = entries.map((entry) => entry.params.music || DEFAULT_ENV.music);

  const avgTemp = Math.round(temps.reduce((acc, value) => acc + value, 0) / temps.length);
  const avgHumidity = Math.round(humidities.reduce((acc, value) => acc + value, 0) / humidities.length);
  const avgColor = averageColors(colors);
  const music = majorityVote(musicVotes, DEFAULT_ENV.music);

  return { temp: avgTemp, humidity: avgHumidity, lightColor: avgColor, music };
}

export function buildAssignments(env, mergedFrom, ts) {
  return {
    temperature: { value: env.temp, userId: 'aggregate', mergedFrom, updatedAt: ts },
    humidity: { value: env.humidity, userId: 'aggregate', mergedFrom, updatedAt: ts },
    light: { value: env.lightColor, userId: 'aggregate', mergedFrom, updatedAt: ts },
    music: { value: env.music, userId: 'aggregate', mergedFrom, updatedAt: ts },
  };
}

function applyEnvToDevices(deviceState, env, decisionId, ts, mergedFrom) {
  const next = { ...deviceState };
  next.tv2 = {
    ...(next.tv2 || {}),
    lastEnv: { ...env },
    lastDecisionId: decisionId,
    lastHeartbeatTs: ts,
    mergedFrom,
  };
  next.sw1 = {
    ...(next.sw1 || {}),
    lastEnv: { temp: env.temp, humidity: env.humidity },
    lastDecisionId: decisionId,
    lastHeartbeatTs: ts,
    mergedFrom,
  };
  next.sw2 = {
    ...(next.sw2 || {}),
    lastEnv: { lightColor: env.lightColor, music: env.music },
    lastDecisionId: decisionId,
    lastHeartbeatTs: ts,
    mergedFrom,
  };
  return next;
}

export function applyAggregatedEnv(state, env, mergedFrom, decisionId, ts, reason) {
  state.assignments = buildAssignments(env, mergedFrom, ts);
  state.deviceState = applyEnvToDevices(state.deviceState, env, decisionId, ts, mergedFrom);
  state.lastDecision = {
    env: { ...env },
    reason,
    mergedFrom: [...mergedFrom],
    ts,
    version: (state.lastDecision?.version || 0) + 1,
  };
}

export function updateDeviceHeartbeatState(state, payload) {
  const deviceId = payload?.deviceId?.toLowerCase();
  if (!deviceId) return;
  const existing = state.deviceState[deviceId] || {};
  state.deviceState = {
    ...state.deviceState,
    [deviceId]: {
      ...existing,
      lastHeartbeatTs: payload.ts || Date.now(),
      status: payload.status || existing.status || 'ok',
    },
  };
}

export function resetUsers(usersMap) {
  const refreshed = new Map();
  usersMap.forEach((user, key) => {
    refreshed.set(key, {
      ...user,
      lastPreference: null,
      lastDecision: null,
    });
  });
  return refreshed;
}

function averageColors(colors) {
  if (!colors.length) return DEFAULT_ENV.lightColor;
  const rgbs = colors.map(hexToRgb);
  const avgR = Math.round(rgbs.reduce((sum, c) => sum + c.r, 0) / rgbs.length);
  const avgG = Math.round(rgbs.reduce((sum, c) => sum + c.g, 0) / rgbs.length);
  const avgB = Math.round(rgbs.reduce((sum, c) => sum + c.b, 0) / rgbs.length);
  return rgbToHex(avgR, avgG, avgB);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function majorityVote(items, fallback) {
  if (!items.length) return fallback;
  const counts = {};
  items.forEach((item) => {
    counts[item] = (counts[item] || 0) + 1;
  });
  let winner = fallback;
  let maxCount = 0;
  Object.entries(counts).forEach(([key, count]) => {
    if (count > maxCount) {
      maxCount = count;
      winner = key;
    }
  });
  return winner;
}

