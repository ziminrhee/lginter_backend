export function createSocketHandlers({ setWelcomeData, setIsVisible }) {
  const onEntranceNewVoice = (data) => {
    console.log('🎤 MW1 Component received entrance-new-voice:', data);
    setWelcomeData({
      name: data.userId || '손님',
      text: data.text,
      emotion: data.emotion
    });
    setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setWelcomeData(null), 500);
    }, 8000);
  };

  return { onEntranceNewVoice };
}


