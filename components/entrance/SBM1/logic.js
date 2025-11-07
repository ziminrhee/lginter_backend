import { useEffect, useMemo, useState } from 'react';

import useResize from '@/utils/hooks/useResize';
const URL = 'https://www.naver.com'

const DEFAULT_TOP_MESSAGE = 'QR코드 스캔을 통해\n전시 관람을 시작하세요!';
const DEFAULT_FURON_PATH = '/image.png';


function getViewportVars(width, height) {
  if (typeof window === 'undefined') return { '--kiss': '12vmin' };
  const qrPx = Math.min(Math.round(width * 0.25), Math.round(height * 0.28));
  return { '--kiss': '12vmin', '--qr-size': `${qrPx}px` };
}

export function useSbm1() {
  const { width, height } = useResize();
  const vars = useMemo(() => getViewportVars(width, height), [width, height]);
  const [qrUrl, setQrUrl] = useState(URL);
  const topMessage = DEFAULT_TOP_MESSAGE;
  const furonPath = DEFAULT_FURON_PATH;


  return useMemo(() => ({ vars, qrUrl, topMessage, furonPath }), [vars, qrUrl]);
}


