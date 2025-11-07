import { useEffect, useMemo, useState } from 'react';

const URL = 'https://www.naver.com'

const DEFAULT_TOP_MESSAGE = 'QR코드 스캔을 통해\n전시 관람을 시작하세요!';
const DEFAULT_FURON_PATH = '/image.png';




function getViewportVars() {
  if (typeof window === 'undefined') return { '--kiss': '12vmin' };
  const w = window.innerWidth || 1080;
  const h = window.innerHeight || 1920;
  const qrPx = Math.min(Math.round(w * 0.25), Math.round(h * 0.28));
  return { '--kiss': '12vmin', '--qr-size': `${qrPx}px` };
}

export function useSbm1() {
  const [vars, setVars] = useState(getViewportVars());
  const [qrUrl, setQrUrl] = useState(URL);
  const topMessage = DEFAULT_TOP_MESSAGE;
  const furonPath = DEFAULT_FURON_PATH;

  useEffect(() => {
    const onResize = () => setVars(getViewportVars());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return useMemo(() => ({ vars, qrUrl, topMessage, furonPath }), [vars, qrUrl]);
}


