import { toJsonSchema } from '@/ai/schemas/decision';

const MODEL = process.env.NEXT_PUBLIC_AI_MODEL || 'gpt-4o-mini';
const USAGE_LOG = String(process.env.AI_USAGE_LOG || '').toLowerCase() === 'true';

// Function calling adapter (safe Stage 1). Later we can swap to Responses API.
export async function callControllerTool({ systemPrompt, conversation = [], userPayload = {} }) {
  const tool = {
    type: 'function',
    function: {
      name: 'decide_env',
      description: 'Generate environment decision within policy bounds',
      parameters: toJsonSchema(),
    },
  };

  const body = {
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversation,
      { role: 'user', content: JSON.stringify(userPayload) },
    ],
    tools: [tool],
    tool_choice: { type: 'function', function: { name: 'decide_env' } },
  };

  const r = await fetch('/api/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || `OpenAI HTTP ${r.status}`);

  if (USAGE_LOG && data?.usage) {
    // eslint-disable-next-line no-console
    console.log('[AI usage]', data.usage, 'model=', MODEL);
  }

  const message = data?.choices?.[0]?.message;
  const toolCall = message?.tool_calls?.[0];
  let parsed = null;
  try {
    parsed = toolCall?.function?.arguments ? JSON.parse(toolCall.function.arguments) : null;
  } catch {}
  return parsed;
}


