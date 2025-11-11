import { useEffect, useState, useCallback, useRef } from 'react';

import { MUSIC_CATALOG } from '@/utils/data/musicCatalog';

export default function usePostTypingShowcase({ fullTypedText, typedReason, recommendations, setOrchestratingLock }) {
  const [fadeText, setFadeText] = useState(false);
  const [localShowResults, setLocalShowResults] = useState(false);
  const [orbShowcaseStarted, setOrbShowcaseStarted] = useState(false);
  const [labelsShown, setLabelsShown] = useState(false);
  const timersRef = useRef([]);

  const resetShowcase = useCallback(() => {
    setFadeText(false);
    setLocalShowResults(false);
    setOrbShowcaseStarted(false);
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    if (!fullTypedText) return;
    if (typedReason && typedReason.length >= fullTypedText.length && !orbShowcaseStarted) {
      console.log('[Showcase] Triggering orbit sequence', {
        typedLen: typedReason.length,
        fullLen: fullTypedText.length,
        orbShowcaseStarted
      });
      setOrbShowcaseStarted(true);
      timersRef.current.forEach((id) => clearTimeout(id));
      timersRef.current = [];

      const TEXT_HOLD_MS = 2000;
      const ORBIT_SOLO_MS = 3000;
      const LABEL_HOLD_MS = 2000;

      let colorHex = '';
      let musicFull = '';
      if (recommendations) {
        const hex = (recommendations.lightColor || '').replace('#','');
        if (hex.length === 6) {
          colorHex = `#${hex.toUpperCase()}`;
        } else if ((recommendations.lightColor || '').startsWith('#')) {
          colorHex = (recommendations.lightColor || '').toUpperCase();
        } else {
          colorHex = `#${(recommendations.lightColor || '').toString().toUpperCase()}`;
        }
        const songId = recommendations.song;
        const found = Array.isArray(MUSIC_CATALOG) ? MUSIC_CATALOG.find(t => t.id === songId) : null;
        musicFull = found ? `${found.title} - ${found.artist}` : (songId || '');
      }

      const t1 = setTimeout(() => {
        setFadeText(true);
        if (typeof window !== 'undefined') {
          window.showFinalOrb = true;
          window.showCenterGlow = true;
          window.clusterSpin = true;
          window.showOrbits = true;
          window.showKeywords = false;
        }

        const t2 = setTimeout(() => {
          if (typeof window !== 'undefined' && recommendations) {
            window.keywordLabels = [
              `${recommendations.temperature}°C`,
              `${recommendations.humidity}%`,
              colorHex,
              musicFull
            ];
            window.showKeywords = true;
          }
          setLabelsShown(true);

          const t3 = setTimeout(() => {
            setLocalShowResults(true);
            setLabelsShown(false);
            if (typeof setOrchestratingLock === 'function') setOrchestratingLock(false);
            timersRef.current = timersRef.current.filter((id) => id !== t3);
          }, LABEL_HOLD_MS);
          timersRef.current.push(t3);
          timersRef.current = timersRef.current.filter((id) => id !== t2);
        }, ORBIT_SOLO_MS);
        timersRef.current.push(t2);
        timersRef.current = timersRef.current.filter((id) => id !== t1);
      }, TEXT_HOLD_MS);
      timersRef.current.push(t1);
    }
    console.log('[Showcase] Waiting for typewriter completion', {
      typedLen: typedReason ? typedReason.length : 0,
      fullLen: fullTypedText.length,
      orbShowcaseStarted
    });
  }, [typedReason, fullTypedText, orbShowcaseStarted, recommendations, setOrchestratingLock]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  return { fadeText, localShowResults, labelsShown, resetShowcase };
}


