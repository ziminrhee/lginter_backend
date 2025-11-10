import { useEffect, useMemo, useRef, useState } from 'react';
import * as S from './styles';

// Phases
// hidden -> greet1(만나서/반가워요!) -> greet2(오늘도/수고하셨어요.) -> final(오늘의 하루는/어땠나요?)
export default function HeroText({ isModal = false, onFinalPhase }) {
  const [phase, setPhase] = useState('hidden');
  const [opacity, setOpacity] = useState(0);

  const fadeMs = 450; // fade duration
  const visibleMs = 2000; // time to wait before next change

  const timersRef = useRef([]);
  const clearTimers = () => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    // Start timeline after mount
    const t1 = setTimeout(() => {
      setPhase('greet1');
      setOpacity(1);
    }, 2000); // first appearance within 2 seconds after entering
    timersRef.current.push(t1);
    return clearTimers;
  }, []);

  useEffect(() => {
    if (phase === 'greet1') {
      // After showing greet1 for 2s, fade to greet2
      const t = setTimeout(() => {
        setOpacity(0);
        const tInner = setTimeout(() => {
          setPhase('greet2');
          setOpacity(1);
          
        }, fadeMs);
        timersRef.current.push(tInner);
      }, visibleMs);
      timersRef.current.push(t);
    } else if (phase === 'greet2') {
      // After showing greet2 for 2s, fade to final and notify parent
      const t = setTimeout(() => {
        setOpacity(0);
        const tInner = setTimeout(() => {
          setPhase('final');
          setOpacity(1);
          if (typeof onFinalPhase === 'function') onFinalPhase();
        }, fadeMs);
        timersRef.current.push(tInner);
      }, visibleMs);
      timersRef.current.push(t);
    }
  }, [phase]);

  const { line1, line2, subText } = useMemo(() => {
    if (phase === 'greet1') {
      return { line1: '만나서', line2: '반가워요!', subText: '저는 퓨론이라고 합니다.' };
    }
    if (phase === 'greet2') {
      return { line1: '오늘도', line2: '수고하셨어요.', subText: null };
    }
    if (phase === 'final') {
      return { line1: '오늘 하루는', line2: '어땠나요?', subText: '아래 퓨론을 3초 간 길게 눌러 말해주세요.' };
    }
    // hidden
    return { line1: '', line2: '', subText: null };
  }, [phase]);

  if (phase === 'hidden') {
    return <div style={S.root} />;
  }

  return (
    <S.Container>
      <S.Title $isModal={isModal} $opacity={opacity} $fadeMs={fadeMs}>
        {line1}<br/>{line2}
      </S.Title>
      {subText && (
        <S.Sub $isModal={isModal} $opacity={opacity} $fadeMs={fadeMs}>
          {subText}
        </S.Sub>
      )}
    </S.Container>
  );
}



