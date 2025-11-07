import { useEffect, useMemo, useState } from 'react';

const DEFAULT_QR_BASE = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.host}`
  : 'http://localhost:3000';

const DEFAULT_TOP_MESSAGE = 'QR코드 스캔을 통해\n전시 관람을 시작하세요!';
const DEFAULT_FURON_PATH = '/image.png';

function isLoopbackHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

async function getQrUrlAsync() {
  if (typeof window === 'undefined') return `${DEFAULT_QR_BASE}/mobile`;
  const { protocol, hostname, port } = window.location;
  const usePort = port || '3000';
  const params = new URLSearchParams(window.location.search);
  const ipOverride = params.get('ip');
  if (ipOverride) return `${protocol}//${ipOverride}${usePort ? `:${usePort}` : ''}/mobile`;
  // Prefer LAN IP from server if available (works for any host, including custom domains)
  try {
    const r = await fetch('/api/host-ip');
    const j = await r.json();
    if (j?.ok && j?.ip) return `${protocol}//${j.ip}${usePort ? `:${usePort}` : ''}/mobile`;
  } catch {}
  // Fallbacks
  if (!isLoopbackHost(hostname)) return `${protocol}//${hostname}${usePort ? `:${usePort}` : ''}/mobile`;
  return `${protocol}//${hostname}${usePort ? `:${usePort}` : ''}/mobile`;
}

function getViewportVars() {
  if (typeof window === 'undefined') return { '--kiss': '12vmin' };
  const w = window.innerWidth || 1080;
  const h = window.innerHeight || 1920;
  const qrPx = Math.min(Math.round(w * 0.25), Math.round(h * 0.28));
  return { '--kiss': '12vmin', '--qr-size': `${qrPx}px` };
}

export function useSbm1() {
  const [vars, setVars] = useState(getViewportVars());
  const [qrUrl, setQrUrl] = useState(`${DEFAULT_QR_BASE}/mobile`);
  const topMessage = DEFAULT_TOP_MESSAGE;
  const furonPath = DEFAULT_FURON_PATH;

  useEffect(() => {
    const onResize = () => setVars(getViewportVars());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const url = await getQrUrlAsync();
      if (mounted) setQrUrl(url);
    })();
    return () => { mounted = false; };
  }, []);

  return useMemo(() => ({ vars, qrUrl, topMessage, furonPath }), [vars, qrUrl]);
}


