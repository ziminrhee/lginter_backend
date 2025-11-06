import { useEffect, useMemo, useState } from 'react';

const DEFAULT_QR_BASE = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.host}`
  : 'http://localhost:3000';

const DEFAULT_TOP_MESSAGE = 'QR코드 스캔을 통해\n전시 관람을 시작하세요!';
const DEFAULT_FURON_PATH = '/image.png';

function getQrUrl(base = DEFAULT_QR_BASE) {
  try {
    const url = new URL(base);
    return `${url.origin}/mobile`;
  } catch {
    return `${DEFAULT_QR_BASE}/mobile`;
  }
}

function getViewportVars() {
  return { kiss: '9vmin' };
}

export function useSbm1() {
  const [vars, setVars] = useState(getViewportVars());
  const [qrUrl, setQrUrl] = useState(getQrUrl());
  const topMessage = DEFAULT_TOP_MESSAGE;
  const furonPath = DEFAULT_FURON_PATH;

  useEffect(() => {
    const onResize = () => setVars(getViewportVars());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => { setQrUrl(getQrUrl()); }, []);

  return useMemo(() => ({ vars, qrUrl, topMessage, furonPath }), [vars, qrUrl]);
}


