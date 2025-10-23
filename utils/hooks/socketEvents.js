export const EVENTS = {
  // Mobile
  MOBILE_NEW_USER: "mobile-new-user",
  MOBILE_NEW_NAME: "mobile-new-name",
  MOBILE_NEW_VOICE: "mobile-new-voice",
  MOBILE_USER_NEEDS: "mobile-user-needs",

  // Devices (generic)
  DEVICE_NEW_DECISION: "device-new-decision",
  DEVICE_NEW_VOICE: "device-new-voice",

  // Server broadcasts
  DEVICE_DECISION: "device-decision",

  // Streamlined server broadcasts
  NEW_NAME: "new-name",
  NEW_USER: "new-user",
  NEW_VOICE_MOBILE: "new-voice-mobile",
  NEW_VOICE_DEVICE: "new-voice-device"
};

// Base payload schema for all events
export const createBasePayload = (source, additionalData = {}) => ({
  uuid: `uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  ts: Date.now(),
  source,
  ...additionalData
});

// Specific payload creators
export const createMobileUserPayload = (userId, meta = {}) => 
  createBasePayload("mobile", { userId, meta });

export const createMobileNamePayload = (name, meta = {}) => 
  createBasePayload("mobile", { name, meta });

export const createMobileVoicePayload = (text, emotion, score = 0.5, meta = {}) => 
  createBasePayload("mobile", { text, emotion, score, meta });

export const createDeviceDecisionPayload = (type, data, assignedUser, meta = {}) => 
  createBasePayload(type, { type, assignedUser, ...data, meta });

// (Removed) createQRPayload and SBM1 events are deprecated
