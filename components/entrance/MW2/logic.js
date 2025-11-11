export function createSocketHandlers({ setMessage, activateMessage }) {
  const onEntranceNewVoice = (data) => {
    const text = data?.text || data?.emotion || '';
    if (!text) return;
    setMessage({ message: text, timestamp: Date.now() });
    activateMessage(true);
  };
  return { onEntranceNewVoice };
}


