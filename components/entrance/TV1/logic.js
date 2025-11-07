export function createSocketHandlers({ setKeywords, unifiedFont, setTv2Color }) {
  const onEntranceNewVoice = (data) => {
    console.log('📺 TV1 Component received entrance-new-voice:', data);
    const text = data.text || data.emotion || '알 수 없음';
    const fontSize = (Math.random() * 0.35 + 0.95).toFixed(2);
    const fontFamily = unifiedFont;
    const fontStyle = 'normal';
    const fontWeight = 800;
    setKeywords(prev => [{
      id: Date.now() + Math.random(),
      text: text,
      fontSize: `${fontSize}rem`,
      fontFamily,
      fontStyle,
      fontWeight,
      timestamp: Date.now()
    }, ...prev].slice(0, 18));
  };

  const onDeviceDecision = (data) => {
    if (data?.device === 'sw2' && data.lightColor) setTv2Color(data.lightColor);
  };

  const onDeviceNewDecision = (msg) => {
    const env = msg?.env;
    if (!env) return;
    if ((msg?.target === 'tv2' || msg?.target === 'sw2') && env.lightColor) setTv2Color(env.lightColor);
  };

  return { onEntranceNewVoice, onDeviceDecision, onDeviceNewDecision };
}


