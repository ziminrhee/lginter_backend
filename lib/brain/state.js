// In-memory brain: single source of truth for controller orchestration
// Schema follows plan: switch-adc6fe33

import { nanoid } from 'nanoid';

/**
 * @typedef {{temp:number, humidity:number, lightColor:string, music:string}} Env
 * @typedef {{id:string, userId:string, params:Env, reason:string, createdAt:number}} Decision
 * @typedef {{name?:string, voiceId?:string, joinedAt:number, lastSeenTs:number, lastInputs?:Partial<Env>, lastDecisionId?:string}} UserRecord
 */

const MAX_EVENTS = 50;

const state = {
  // Legacy structure (kept for backward compatibility)
  needs: new Map(),
  assignments: { temperature: null, humidity: null, light: null, music: null },
  metrics: { eventsPerSec: 0, totalEvents: 0, activeUsers: 0, activeDevices: 0 },
  events: [],
  
  // SSoT schema (plan-compliant)
  /** @type {Record<string, UserRecord>} */
  users: {},
  
  /** @type {Env} */
  currentEnv: { temp: 24, humidity: 50, lightColor: '#FFFFFF', music: 'neutral' },
  
  /** @type {{mergedFromUserIds:string[], decisionIds:string[], updatedAt:number}} */
  currentEnvMeta: { mergedFromUserIds: [], decisionIds: [], updatedAt: 0 },
  
  /** @type {Decision[]} */
  decisions: [],
  
  deviceState: {
    tv2: { lastEnv: null, lastDecisionId: null, lastHeartbeatTs: 0 },
    sw1: { lastEnv: null, lastDecisionId: null, lastHeartbeatTs: 0 },
    sw2: { lastEnv: null, lastDecisionId: null, lastHeartbeatTs: 0 },
    mw1: { lastHeartbeatTs: 0 },
    sbm1: { lastHeartbeatTs: 0 },
    tv1: { lastHeartbeatTs: 0 },
  },
  
  flags: { power: true, tv2: true, sw1: true, sw2: true, emergencyStop: false },
  
  /** idempotency: key = `${event}:${uuid}`, value = expireTs */
  seen: new Map(),
};

function logEvent(type, payload) {
  state.totalEvents = (state.totalEvents || 0) + 1;
  state.events.push({ ts: Date.now(), type, payload });
  if (state.events.length > MAX_EVENTS) state.events.shift();
}

export function upsertUser(userId, patch = {}) {
  const now = Date.now();
  const prev = state.users[userId] || {};
  state.users[userId] = {
    ...prev,
    ...patch,
    joinedAt: prev.joinedAt || now,
    lastSeenTs: now,
  };
  state.metrics.activeUsers = Object.keys(state.users).length;
  logEvent('user:upsert', { userId, patch });
}

// Store user's preference (from OpenAI decision)
// Each input gets a unique inputId to prevent overwriting
export function storeUserPreference(userId, params, inputId) {
  const now = Date.now();
  const uniqueId = inputId || `${userId}-${now}`; // Use inputId or generate one
  
  // Store as separate entry (not overwriting previous inputs from same user)
  state.users[uniqueId] = {
    originalUserId: userId,
    lastPreference: params,
    lastPreferenceTs: now,
    joinedAt: now,
    lastSeenTs: now
  };
  
  console.log(`💾 Stored preference for ${uniqueId} (user: ${userId}):`, params);
  state.metrics.activeUsers = Object.keys(state.users).length;
}

// Get active users (within last 5 minutes)
// Returns ALL recent inputs, even from the same person
export function getActiveUsers() {
  const now = Date.now();
  const ACTIVE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
  return Object.entries(state.users)
    .filter(([inputId, user]) => user.lastPreferenceTs && (now - user.lastPreferenceTs) < ACTIVE_WINDOW_MS)
    .map(([inputId, user]) => ({ inputId, userId: user.originalUserId || inputId, ...user }));
}

// Fair Average: merge multiple users' preferences
export function calculateFairAverage() {
  const activeUsers = getActiveUsers();
  
  if (activeUsers.length === 0) {
    console.log('⚠️ No active users, using defaults');
    return { temp: 24, humidity: 50, lightColor: '#FFFFFF', music: 'neutral' };
  }
  
  console.log(`🧮 Calculating fair average from ${activeUsers.length} active user(s)`);
  
  // 1. Temperature & Humidity: Simple average
  const temps = activeUsers.map(u => u.lastPreference?.temp || 24);
  const humidities = activeUsers.map(u => u.lastPreference?.humidity || 50);
  const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
  const avgHumidity = Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length);
  
  // 2. Light Color: HSV centroid (simplified to RGB average for now)
  const colors = activeUsers.map(u => u.lastPreference?.lightColor || '#FFFFFF');
  const avgColor = averageColors(colors);
  
  // 3. Music: Majority vote
  const musicVotes = activeUsers.map(u => u.lastPreference?.music || 'neutral');
  const musicResult = majorityVote(musicVotes);
  
  const result = {
    temp: avgTemp,
    humidity: avgHumidity,
    lightColor: avgColor,
    music: musicResult
  };
  
  console.log('✅ Fair average result:', result);
  console.log('   From users:', activeUsers.map(u => u.userId));
  
  return result;
}

// Helper: Average RGB colors (simplified HSV centroid)
function averageColors(colors) {
  if (colors.length === 0) return '#FFFFFF';
  
  const rgbs = colors.map(hexToRgb);
  const avgR = Math.round(rgbs.reduce((sum, c) => sum + c.r, 0) / rgbs.length);
  const avgG = Math.round(rgbs.reduce((sum, c) => sum + c.g, 0) / rgbs.length);
  const avgB = Math.round(rgbs.reduce((sum, c) => sum + c.b, 0) / rgbs.length);
  
  return rgbToHex(avgR, avgG, avgB);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 };
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Helper: Majority vote
function majorityVote(items) {
  if (items.length === 0) return 'neutral';
  
  const counts = {};
  items.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
  });
  
  let maxCount = 0;
  let winner = items[0];
  Object.entries(counts).forEach(([item, count]) => {
    if (count > maxCount) {
      maxCount = count;
      winner = item;
    }
  });
  
  return winner;
}

export function applyNeed(userId, need) {
  state.needs.set(userId, { ...need });
  logEvent('need:apply', { userId, need });
}

// Legacy heartbeat (backward compat) - now uses deviceState
export function heartbeat(deviceId, info) {
  const now = Date.now();
  // Delegate to updateDeviceHeartbeat
  updateDeviceHeartbeat(deviceId, now);
  logEvent('device:heartbeat-legacy', { deviceId, info });
}

export function setDeviceError(deviceId, errorMsg) {
  const now = Date.now();
  logEvent('device:error', { deviceId, errorMsg });
}

export function computeAssignments() {
  const params = ['temperature', 'humidity', 'light', 'music'];
  const users = Array.from(state.needs.entries());
  const result = { temperature: null, humidity: null, light: null, music: null };
  for (const param of params) {
    let best = null;
    for (const [userId, need] of users) {
      const pr = need?.priority?.[param] ?? 0;
      if (!best || pr > best.priority || (pr === best.priority && need.timestamp > best.timestamp)) {
        const value = param === 'temperature' ? need.temperature : param === 'humidity' ? need.humidity : param === 'light' ? need.lightColor : need.song;
        best = { userId, value, priority: pr, timestamp: need.timestamp };
      }
    }
    result[param] = best;
  }
  state.assignments = result;
  logEvent('assign:compute', { assignments: result });
  return result;
}

export function overrideAssignment(key, value, meta = {}) {
  if (!['temperature', 'humidity', 'light', 'music'].includes(key)) return state.assignments;
  state.assignments[key] = { userId: meta.userId || 'controller', value, priority: 999, timestamp: Date.now(), reason: meta.reason || 'override' };
  logEvent('assign:override', { key, value, meta });
  return state.assignments;
}

export function reset(kind = 'soft') {
  if (kind === 'soft') {
    // Clear SSoT users (now object, not Map)
    for (const key in state.users) delete state.users[key];
    state.needs.clear();
    state.assignments = { temperature: null, humidity: null, light: null, music: null };
    state.decisions = [];
    state.currentEnv = { temp: 24, humidity: 50, lightColor: '#FFFFFF', music: 'neutral' };
    state.currentEnvMeta = { mergedFromUserIds: [], decisionIds: [], updatedAt: 0 };
    logEvent('reset:soft');
  } else if (kind === 'recompute') {
    computeAssignments();
  }
}

export function snapshot() {
  return {
    users: Object.values(state.users),
    needs: Array.from(state.needs.entries()).map(([userId, need]) => ({ userId, ...need })),
    assignments: state.assignments,
    metrics: { ...state.metrics },
    events: [...state.events],
    currentEnv: { ...state.currentEnv },
    currentEnvMeta: { ...state.currentEnvMeta },
    decisions: [...state.decisions],
    deviceState: { ...state.deviceState },
    flags: { ...state.flags },
  };
}

export default state;


// SSoT helpers
export function recordDecision(userId, params, reason) {
  const decision = { id: nanoid(), userId, params, reason, createdAt: Date.now() };
  state.decisions.push(decision);
  state.currentEnv = { ...params };
  state.currentEnvMeta = { mergedFromUserIds: [userId], decisionIds: [decision.id], updatedAt: Date.now() };
  logEvent('decision:record', { decision });
  return decision;
}

export function markSeen(key, ttlMs = 10 * 60 * 1000) {
  state.seen.set(key, Date.now() + ttlMs);
}

export function isSeen(key) {
  const exp = state.seen.get(key);
  return typeof exp === 'number' && exp > Date.now();
}

export function gcSeen(now = Date.now()) {
  for (const [k, exp] of state.seen.entries()) {
    if (exp < now) state.seen.delete(k);
  }
}

// Device snapshot helpers
export function updateDeviceHeartbeat(deviceId, ts = Date.now()) {
  if (state.deviceState[deviceId]) {
    state.deviceState[deviceId].lastHeartbeatTs = ts;
  }
  logEvent('device:heartbeat', { deviceId, ts });
}

export function updateDeviceApplied(deviceId, env, decisionId) {
  if (state.deviceState[deviceId]) {
    state.deviceState[deviceId].lastEnv = env;
    state.deviceState[deviceId].lastDecisionId = decisionId;
    state.deviceState[deviceId].lastHeartbeatTs = Date.now();
  }
  logEvent('device:applied', { deviceId, decisionId });
}


