import { useEffect, useState } from 'react';

export default function useTypewriter(text) {
  const [typedReason, setTypedReason] = useState('');
  const [showReason, setShowReason] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!text) return;

    setShowReason(true);
    setTypedReason('');
    setShowHighlights(false);
    setShowResults(false);

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setTypedReason(text.slice(0, index + 1));
        index += 1;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setShowHighlights(true);
          setTimeout(() => {
            setShowResults(true);
          }, 4000);
        }, 500);
      }
    }, 40);

    return () => clearInterval(typingInterval);
  }, [text]);

  return { typedReason, showReason, showHighlights, showResults };
}


