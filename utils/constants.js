// Socket configuration constants
// 자동으로 현재 호스트 감지 (핫스팟 환경에서도 안전하게 작동)
export const SOCKET_CONFIG = {
  URL: typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}` 
    : (process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'),
  PATH: process.env.NEXT_PUBLIC_SOCKET_PATH || '/api/socket',
  TRANSPORTS: ['websocket', 'polling']
};

// Device types
export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  SBM1: 'sbm1',
  MW1: 'mw1',
  MV2: 'mv2',
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
