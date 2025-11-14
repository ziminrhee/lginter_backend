const DEFAULT_DURATION_MS = 8000;

export function createSocketHandlers({ setMessage, activateMessage, duration = DEFAULT_DURATION_MS }) {
  const onEntranceNewVoice = (payload = {}) => {
    const emotion = payload.emotion?.trim();
    const text = payload.text?.trim();
    const keyword = emotion || text || "따뜻한";
    const message = `${keyword}의 감정을 기반으로 조율을 시작합니다`;

    setMessage({ message, timestamp: Date.now() });
    activateMessage(true);

    setTimeout(() => {
      activateMessage(false);
    }, duration);
  };

  return { onEntranceNewVoice };
}


