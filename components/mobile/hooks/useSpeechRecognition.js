import { useCallback, useState } from 'react';

export default function useSpeechRecognition({ onResult, onStart, onError, onEnd } = {}) {
  const [isListening, setIsListening] = useState(false);

  const startVoiceRecognition = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('❌ 음성 인식을 지원하지 않는 브라우저입니다.\n\n직접 입력해주세요. 🖊️');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        if (typeof onStart === 'function') onStart();
        console.log('🎤 음성 인식 시작됨');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        if (typeof onResult === 'function') onResult({ transcript, confidence });
        console.log('✅ 인식 성공:', transcript, '(정확도:', Math.round(confidence * 100) + '%)');
        setTimeout(() => {
          const submitBtn = document.querySelector('button[type="submit"]');
          if (submitBtn) submitBtn.click();
        }, 500);
      };

      recognition.onerror = (event) => {
        console.error('❌ 음성 인식 오류:', event.error);
        setIsListening(false);
        if (typeof onError === 'function') onError(event.error);

        let errorMsg = '';
        if (event.error === 'no-speech') {
          errorMsg = '음성이 감지되지 않았습니다.\n\n직접 입력해주세요. 🖊️';
        } else if (event.error === 'not-allowed') {
          errorMsg = '⚠️ 마이크 권한이 필요합니다.\n\n직접 입력하거나, 브라우저 설정에서 마이크 권한을 허용해주세요.\n\n💡 팁: HTTP 연결에서는 보안상 마이크가 제한될 수 있습니다.';
        } else if (event.error === 'network') {
          errorMsg = '네트워크 오류가 발생했습니다.\n\n직접 입력해주세요. 🖊️';
        } else {
          errorMsg = '음성 인식이 불가능합니다.\n\n직접 입력해주세요. 🖊️';
        }
        if (errorMsg) alert(errorMsg);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (typeof onEnd === 'function') onEnd();
        console.log('🎤 음성 인식 종료');
      };

      console.log('🎤 음성 인식 시작 시도...');
      recognition.start();
    } catch (error) {
      console.error('음성 인식 초기화 실패:', error);
      alert('음성 인식을 시작할 수 없습니다.\n\n직접 입력해주세요. 🖊️');
      setIsListening(false);
    }
  }, [onResult, onStart, onError, onEnd]);

  return { isListening, startVoiceRecognition };
}


