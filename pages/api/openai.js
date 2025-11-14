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
    // Pass through arbitrary fields so tools/function calling works
    const { model = 'gpt-4o-mini', ...rest } = req.body || {};
    const payload = { model, ...rest };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }

    if (String(process.env.AI_USAGE_LOG || '').toLowerCase() === 'true' && data?.usage) {
      console.log('[OpenAI usage]', data.usage);
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'OpenAI proxy error', detail: String(err) });
  }
}
