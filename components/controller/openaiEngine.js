import { decideEnv } from '@/src/services/openai.service';
import { DEFAULT_ENV, normalizeEnv } from './stateStore';

const SYSTEM_PROMPT = 'Decide home environment based on latest user input.';

export async function requestControllerDecision({ userId, userContext, lastDecision }) {
  const result = await decideEnv({
    systemPrompt: SYSTEM_PROMPT,
    latestConversation: [],
    currentProgram: {
      version: lastDecision?.version || 0,
      text: lastDecision?.reason || '',
      env: lastDecision?.env || DEFAULT_ENV,
    },
    currentUser: {
      id: userId,
      name: userContext?.name || '',
      lastVoice: userContext?.lastVoice || null,
    },
  });

  return {
    env: normalizeEnv(result?.params),
    reason: result?.reason || 'AI generated',
  };
}

