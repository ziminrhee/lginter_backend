import { useCallback, useRef, useState } from 'react';

export default function useLongPressProgress({ onCompleted } = {}) {
  const [pressProgress, setPressProgress] = useState(0);
  const timerRef = useRef(null);

  const handlePressStart = useCallback(() => {
    let progress = 0;
    const interval = setInterval(() => {
      const step = 1 / (3000 / 50); // 3s total, 50ms interval => 60 steps
      progress += step;
      if (progress >= 1) {
        progress = 1;
        clearInterval(interval);
        if (typeof onCompleted === 'function') {
          onCompleted();
        }
      }
      setPressProgress(progress);
      if (typeof window !== 'undefined') {
        window.pressProgress = progress;
      }
    }, 50);
    timerRef.current = interval;
  }, [onCompleted]);

  const handlePressEnd = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setPressProgress(0);
    if (typeof window !== 'undefined') {
      window.pressProgress = 0;
    }
  }, []);

  return {
    pressProgress,
    handlePressStart,
    handlePressEnd
  };
}


