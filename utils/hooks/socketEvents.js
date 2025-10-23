export const EVENTS = {
  // Mobile
  MOBILE_NEW_USER: "mobile-new-user",
  MOBILE_NEW_NAME: "mobile-new-name",
  MOBILE_NEW_VOICE: "mobile-new-voice",

  // SBM1 (QR / entrance helper)
  SBM1_NEW_QR: "sbm1-new-qr",
  SBM1_NEW_USER: "sbm1-new-user",

  // Entrance / MW1 / TV1
  ENTRANCE_NEW_USER: "entrance-new-user",
  ENTRANCE_NEW_NAME: "entrance-new-name",
  

  // Living room devices
  SW1_DEVICE_DECISION: "device-new-decision", // climate
  SW1_DEVICE_VOICE: "device-new-voice",      // voice if needed
  SW2_DEVICE_DECISION: "device-new-decision", // ambience (music/color)
  SW2_DEVICE_VOICE: "device-new-voice",

  

  // Controller (for reference)
  CONTROLLER_NEW_DECISION: "controller-new-decision",
  CONTROLLER_NEW_VOICE: "controller-new-voice",
  CONTROLLER_NEW_NAME: "controller-new-name",

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

export const createQRPayload = (qrData, meta = {}) => 
  createBasePayload("sbm1", { qrData, meta });
