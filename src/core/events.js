// Core event names (spec-compliant)
// Keep a single source of truth for events across client and server

export const EV = {
  // Mobile → Server
  MOBILE_NEW_USER: "mobile-new-user",
  MOBILE_NEW_NAME: "mobile-new-name",
  MOBILE_NEW_VOICE: "mobile-new-voice",

  // Controller → Server
  CONTROLLER_NEW_DECISION: "controller-new-decision",
  CONTROLLER_NEW_NAME: "controller-new-name",
  CONTROLLER_NEW_VOICE: "controller-new-voice",

  // Server → LivingRoom (broadcast)
  DEVICE_NEW_DECISION: "device-new-decision",
  DEVICE_NEW_VOICE: "device-new-voice",

  // Server → Entrance (broadcast)
  ENTRANCE_NEW_USER: "entrance-new-user",
  ENTRANCE_NEW_NAME: "entrance-new-name",

  // Server → Mobile (targeted to user room)
  MOBILE_NEW_DECISION: "mobile-new-decision",

  // Init
  INIT_MOBILE: "mobile-init",
  INIT_ENTRANCE: "entrance-init",
  INIT_LIVINGROOM: "livingroom-init",
  INIT_CONTROLLER: "controller-init",
};


