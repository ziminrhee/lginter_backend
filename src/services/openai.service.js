// Single entrypoint for OpenAI decisions. JS-only.

const DEFAULT_TIMEOUT_MS = 6000; // faster failover to avoid UX stalls

function withTimeout(promise, ms = DEFAULT_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('OpenAI timeout')), ms);
    promise.then((v) => { clearTimeout(t); resolve(v); }).catch((e) => { clearTimeout(t); reject(e); });
  });
}

export async function decideEnv({ systemPrompt, latestConversation, currentProgram, currentUser }) {
  // Build chat messages and call through Next.js API proxy to keep API key server-side
  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt || 'You are an environment decision engine.' },
      ...(latestConversation || []),
      { role: 'user', content: `Current program: ${JSON.stringify(currentProgram || {})}; Current user: ${JSON.stringify(currentUser || {})}` },
    ],
  };

  const req = fetch('/api/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(async (r) => {
    const data = await r.json();
    if (!r.ok) throw new Error(data?.error?.message || `OpenAI HTTP ${r.status}`);
    const content = data?.choices?.[0]?.message?.content || '';
    // naive extraction of JSON block
    const m = content.match(/\{[\s\S]*\}/);
    let parsed = null;
    try { parsed = m ? JSON.parse(m[0]) : null; } catch {}
    const params = parsed?.params || parsed || { temp: 24, humidity: 50, lightColor: '#FFFFFF', music: 'ambient' };
    const reason = parsed?.reason || 'ai-generated';
    return { updatedProgram: { text: content, version: (currentProgram?.version || 0) + 1, reason }, params, reason };
  });

  try {
    return await withTimeout(req, DEFAULT_TIMEOUT_MS);
  } catch (e) {
    // fallback on timeout/error
    return {
      updatedProgram: { text: currentProgram?.text || 'timeout', version: (currentProgram?.version || 0) + 1, reason: 'degraded mode' },
      params: { temp: currentProgram?.temp || 24, humidity: currentProgram?.humidity || 50, lightColor: '#FFFFFF', music: 'ambient' },
      reason: 'degraded mode',
    };
  }
}


