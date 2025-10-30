export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not set' });
    return;
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const form = new FormData();
    form.append('file', new Blob([buffer]), 'audio.webm');
    form.append('model', 'whisper-1');
    form.append('response_format', 'json');

    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json(data);
    }
    res.status(200).json({ text: data.text || '' });
  } catch (err) {
    res.status(500).json({ error: 'Whisper proxy error', detail: String(err) });
  }
}


