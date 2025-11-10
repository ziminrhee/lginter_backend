const DEFAULT_DURATION_MS = 8000;

export function createSocketHandlers({ setMessage, activateMessage, duration = DEFAULT_DURATION_MS }) {
  const onEntranceNewVoice = (payload = {}) => {
    const emotion = payload.emotion?.trim();
    const text = payload.text?.trim();
    const keyword = emotion || text || "따뜻한";
    const message = `${keyword} 감정을 위한 공간 조성중입니다`;

    setMessage({ message, timestamp: Date.now() });
    activateMessage(true);

    setTimeout(() => {
      activateMessage(false);
    }, duration);
  };

  return { onEntranceNewVoice };
}


