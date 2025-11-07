import { useCallback, useState } from 'react';

export default function useSpeechRecognition({ onResult, onInterim, onStart, onError, onEnd } = {}) {
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
      recognition.continuous = true; // allow interim updates
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        if (typeof window !== 'undefined') window.isListening = true;
        if (typeof onInterim === 'function') onInterim('');
        if (typeof onStart === 'function') onStart();
        console.log('🎤 음성 인식 시작됨');
      };

      recognition.onresult = (event) => {
        // Display text: concat every hypothesis so far (super-fast feedback)
        const displayText = Array.from(event.results)
          .map(r => r[0]?.transcript ?? '')
          .join('')
          .trim();
        if (displayText && typeof onInterim === 'function') onInterim(displayText);

        // Collect final segments (if any appeared in this event)
        let finalText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) finalText += res[0].transcript;
        }
        if (finalText) {
          const last = event.results[event.results.length - 1][0];
          const confidence = last?.confidence ?? 1;
          if (typeof onResult === 'function') onResult({ transcript: finalText.trim(), confidence });
          try { recognition.stop(); } catch (_) {}
          setTimeout(() => {
            const submitBtn = document.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.click();
          }, 300);
        }
      };

      recognition.onerror = (event) => {
        console.error('❌ 음성 인식 오류:', event.error);
        console.log(event);
        setIsListening(false);
        if (typeof window !== 'undefined') window.isListening = false;
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
        if (typeof window !== 'undefined') window.isListening = false;
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


