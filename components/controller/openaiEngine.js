import { decideEnv } from '@/src/services/openai.service';
import { DEFAULT_ENV } from './stateStore';
import { normalizeEnv } from './logic/controllerMerge';
import { CONTROLLER_SYSTEM_PROMPT } from '@/utils/prompts/controller.prompt';

export async function requestControllerDecision({ userId, userContext, lastDecision }) {
  const result = await decideEnv({
    systemPrompt: CONTROLLER_SYSTEM_PROMPT,
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
    env: normalizeEnv(
      result?.params,
      userContext?.lastVoice?.emotion || '',
      { season: 'winter' }
    ),
    reason: result?.reason || 'AI generated',
    flags: result?.flags || { offTopic: false, abusive: false },
    emotionKeyword: result?.emotionKeyword || '',
  };
}

