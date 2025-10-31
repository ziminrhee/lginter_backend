import { matchFeelingKeyword } from "@/src/controller/selectors.js";

const state = {
  aggregate: {
    env: {
      temp: 22,
      humidity: 50,
      lightColor: "#FFD700",
      music: "Relax",
    },
  },
  lastDecision: null,
  lastReason: "",
  lastFeeling: null,
  flags: {
    emergencyStop: false,
  },
};

export const getState = () => state;

export function applyControllerDecision(decision = {}) {
  const params = decision.params || {};
  state.aggregate.env = {
    ...state.aggregate.env,
    ...params,
  };
  state.lastDecision = {
    ...decision,
    ts: Date.now(),
  };
  state.lastReason = decision.reason || "";
  state.aggregate.lastUserId = decision.userId || null;
  return state;
}

export function recordMobileFeeling(payload = {}) {
  const text = payload.text || payload.message || "";
  const match = matchFeelingKeyword(text);
  state.lastFeeling = {
    userId: payload.userId || null,
    text,
    emotion: payload.emotion || null,
    keyword: match?.keyword || null,
    ts: Date.now(),
  };
  return state;
}

export const getFlags = () => state.flags;

export function setEmergencyStop(value) {
  state.flags.emergencyStop = Boolean(value);
  return state.flags;
}


