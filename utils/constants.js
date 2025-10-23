// Socket configuration constants
export const SOCKET_CONFIG = {
  URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://192.168.45.33:3000',
  PATH: process.env.NEXT_PUBLIC_SOCKET_PATH || '/api/socketio',
  TRANSPORTS: ['websocket', 'polling']
};

// Device types
export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  SBM1: 'sbm1',
  MW1: 'mw1',
  TV1: 'tv1',
  TV2: 'tv2',
  SW1: 'sw1',
  SW2: 'sw2'
};

// Default payload schemas
export const DEFAULT_PAYLOADS = {
  MOBILE_USER: {
    userId: null,
    meta: { device: 'M1' }
  },
  MOBILE_NAME: {
    name: '',
    meta: { language: 'ko' }
  },
  MOBILE_VOICE: {
    text: '',
    emotion: 'neutral',
    score: 0.5
  },
  QR_DATA: {
    qrData: '',
    meta: { expiry: 60000 }
  },
  DEVICE_DECISION: {
    type: 'climate', // or 'ambience'
    assignedUser: null
  }
};
