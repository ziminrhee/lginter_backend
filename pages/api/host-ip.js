import os from 'os';

export default function handler(req, res) {
  try {
    const nets = os.networkInterfaces();
    const candidates = [];
    for (const name of Object.keys(nets)) {
      for (const net of nets[name] || []) {
        if (!net || net.internal) continue;
        if (net.family === 'IPv4' || net.family === 4) candidates.push({ name, address: net.address });
      }
    }
    const preferred = candidates.find(c => /wi|wlan|wireless|wifi/i.test(c.name)) || candidates[0];
    if (!preferred) return res.status(404).json({ ok: false, error: 'No LAN IPv4 found' });
    return res.status(200).json({ ok: true, ip: preferred.address, iface: preferred.name });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'host-ip error' });
  }
}

