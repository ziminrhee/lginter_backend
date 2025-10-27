import os from 'os';

export default function handler(req, res) {
  try {
    const nets = os.networkInterfaces();
    let ip = null;

    const isPrivate = (addr) => {
      if (addr.startsWith('10.')) return true;
      if (addr.startsWith('192.168.')) return true;
      if (addr.startsWith('172.')) {
        const second = parseInt(addr.split('.')[1], 10);
        return second >= 16 && second <= 31;
      }
      return false;
    };

    for (const name of Object.keys(nets)) {
      for (const net of nets[name] || []) {
        if (net && net.family === 'IPv4' && !net.internal && isPrivate(net.address)) {
          ip = net.address;
          break;
        }
      }
      if (ip) break;
    }

    const hostHeader = req.headers.host || '';
    let port = 3000;
    const colon = hostHeader.indexOf(':');
    if (colon !== -1) {
      const parsed = parseInt(hostHeader.slice(colon + 1), 10);
      if (!Number.isNaN(parsed)) port = parsed;
    }
    const proto = (req.headers['x-forwarded-proto'] || 'http');
    const baseUrl = ip ? `${proto}://${ip}:${port}` : `${proto}://${hostHeader}`;

    res.status(200).json({ ip, port, baseUrl, hostFromRequest: hostHeader });
  } catch (error) {
    res.status(200).json({ ip: null, port: 3000, baseUrl: null, error: String(error) });
  }
}


