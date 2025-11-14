export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const name = url.searchParams.get('name') || '';
    if (!name) {
      res.status(400).json({ error: 'name is required' });
      return;
    }

    const { createReadStream, promises: fsp } = await import('fs');
    const path = await import('path');

    const root = process.cwd();
    const musicDir = path.join(root, 'utils', 'data', 'music');
    let files = [];
    try { files = await fsp.readdir(musicDir); } catch {}

    const simplify = (s) => String(s).toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
    const want = simplify(name);

    let chosen = null;
    for (const f of files) {
      if (!f.toLowerCase().endsWith('.mp3')) continue;
      const base = f.slice(0, -4);
      const simple = simplify(base);
      if (simple === want) { chosen = path.join(musicDir, f); break; }
    }
    if (!chosen) {
      for (const f of files) {
        if (!f.toLowerCase().endsWith('.mp3')) continue;
        const base = f.slice(0, -4);
        const simple = simplify(base);
        if (simple.includes(want) || want.includes(simple)) { chosen = path.join(musicDir, f); break; }
      }
    }

    if (!chosen) {
      // 마지막 폴백: 아무 mp3나 스트리밍 (없으면 404)
      const first = files.find(f => f.toLowerCase().endsWith('.mp3'));
      if (first) chosen = path.join(musicDir, first);
    }

    if (!chosen) {
      res.status(404).json({ error: 'music not found' });
      return;
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    createReadStream(chosen).pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'music serve error', detail: String(err) });
  }
}


