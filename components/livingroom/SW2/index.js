import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import useSocketSW2 from "@/utils/hooks/useSocketSW2";
import * as S from './styles';
import { createSocketHandlers } from './logic';

export default function SW2Controls() {
  const [ambienceData, setAmbienceData] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState({ light: 'N/A', music: 'N/A' });
  const [dotCount, setDotCount] = useState(0);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverSrc, setCoverSrc] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const audioRef = useRef(null);
  const [activeUsers, setActiveUsers] = useState(new Set());
  const [userKeyword, setUserKeyword] = useState('');
  const [labels, setLabels] = useState(['', '', '']);
  const switchTimerRef = useRef(null);
  const searchYouTubeMusic = useCallback(async () => {}, []); // no-op

  const handlers = useMemo(
    () => createSocketHandlers({ setAmbienceData, setAssignedUsers, searchYouTubeMusic }),
    [setAmbienceData, setAssignedUsers, searchYouTubeMusic]
  );

  const { socket } = useSocketSW2({
    onDeviceDecision: (data) => {
      handlers.onDeviceDecision(data);
      // assignedUsers 기반 참가자 추정
      if (data?.assignedUsers) {
        const vals = Object.values(data.assignedUsers).filter(v => v && v !== 'N/A');
        if (vals.length) {
          setActiveUsers(prev => {
            const next = new Set(prev);
            vals.forEach(v => next.add(String(v)));
            return next;
          });
        }
      }
    },
    onDeviceNewDecision: (msg) => {
      handlers.onDeviceNewDecision(msg);
      // 컨트롤러에서 emotionKeyword/mergedFrom 전달 시 반영(있으면)
      if (msg?.mergedFrom && Array.isArray(msg.mergedFrom)) {
        setActiveUsers(prev => {
          const next = new Set(prev);
          msg.mergedFrom.forEach(u => { if (u) next.add(String(u)); });
          return next;
        });
      }
      if (msg?.emotionKeyword) {
        setUserKeyword(String(msg.emotionKeyword));
      }
    },
    onDeviceNewVoice: (payload) => {
      const uid = payload?.userId ? String(payload.userId) : null;
      if (uid) {
        setActiveUsers(prev => { const next = new Set(prev); next.add(uid); return next; });
      }
      const kw = payload?.emotion || payload?.text;
      if (kw) setUserKeyword(String(kw));
    }
  });

  useEffect(() => {
    const id = setInterval(() => {
      setDotCount((c) => (c >= 3 ? 0 : c + 1));
    }, 500);
    return () => clearInterval(id);
  }, []);

  const parseSong = useCallback((song) => {
    if (!song) return { t: '', a: '' };
    const parts = String(song).split(' - ');
    if (parts.length >= 2) return { t: parts[0].trim(), a: parts.slice(1).join(' - ').trim() };
    return { t: String(song).trim(), a: '' };
  }, []);

  // 라벨에 사용자 키워드를 반영(한국어 그대로)
  useEffect(() => {
    const kw = String(userKeyword || '').trim();
    if (!kw) return;
    setLabels(prev => [kw, prev[1], prev[2]]);
  }, [userKeyword]);

  useEffect(() => {
    const songStr = ambienceData?.song;
    const { t, a } = parseSong(songStr);
    // 초기엔 즉시 적용
    if (!title && t) {
      setTitle(t); setArtist(a);
      setCoverSrc(`/api/album?name=${encodeURIComponent(t)}`);
      setAudioSrc(`/api/music?name=${encodeURIComponent(t)}`);
      return;
    }
    // 곡이 바뀌었고, 기존 곡이 재생 중이면 10초 후 전환
    if (t && title && t !== title) {
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
      switchTimerRef.current = setTimeout(() => {
        setTitle(t); setArtist(a);
        setCoverSrc(`/api/album?name=${encodeURIComponent(t)}`);
        setAudioSrc(`/api/music?name=${encodeURIComponent(t)}`);
        switchTimerRef.current = null;
      }, 10000);
      return;
    }
    // 곡이 비워지면 모두 비움
    if (!t) {
      setTitle(''); setArtist(''); setCoverSrc(''); setAudioSrc('');
    }
  }, [ambienceData?.song, parseSong, title]);

  useEffect(() => () => { if (switchTimerRef.current) clearTimeout(switchTimerRef.current); }, []);

  useEffect(() => {
    if (!audioSrc || !audioRef.current) return;
    try {
      audioRef.current.load();
      const p = audioRef.current.play();
      if (p && typeof p.then === 'function') {
        p.catch(() => {
          const resume = () => { try { audioRef.current?.play(); } catch {} };
          window.addEventListener('pointerdown', resume, { once: true });
          window.addEventListener('keydown', resume, { once: true });
          window.addEventListener('touchstart', resume, { once: true, passive: true });
        });
      }
    } catch {}
  }, [audioSrc]);

  const participantCount = useMemo(() => {
    const names = new Set(Object.values(assignedUsers || {}).filter(v => v && v !== 'N/A'));
    return Math.max(names.size, activeUsers.size || 0);
  }, [assignedUsers, activeUsers]);

  // 0명일 때 랜덤 3개 감각 라벨
  useEffect(() => {
    if (participantCount > 0) return;
    const pool = ['설렘','평온','따뜻함','잔잔함','집중','휴식','상쾌함','기대','고요','안정감','희망','여유'];
    const a = [...pool];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    setLabels([a[0], a[1], a[2]]);
  }, [participantCount]);

  return (
    <S.Root>
      <S.BlobMotionCss />
      {/* If background frame image is unavailable, pass empty to avoid 404 */}
      <S.FrameBg $url="" />
      <S.TopStatus>
        <span>사용자 {participantCount}명을 위한 조율중</span>
        <S.Dots aria-hidden="true">
          <S.Dot $visible={dotCount >= 1}>.</S.Dot>
          <S.Dot $visible={dotCount >= 2}>.</S.Dot>
          <S.Dot $visible={dotCount >= 3}>.</S.Dot>
        </S.Dots>
      </S.TopStatus>

      {/* Motion blobs overlay (positions/sizes/colors preserved) */}
      <S.MotionLayer>
        <S.MotionBlobWrap $top="20%" $left="28%" $size="min(48vmin, 52vw)">
          <S.MotionBlob
            className="blob"
            style={{
              '--center-x': '50%',
              '--center-y': '48%',
              '--start': '18%',
              '--end': '86%',
              '--feather': '9%',
              '--blur': '53.5px',
              '--inner-blur': '26.7px',
              '--tint-alpha': 0
            }}
          />
        </S.MotionBlobWrap>

        <S.MotionBlobWrap $top="74%" $left="21%" $size="min(44vmin, 46vw)">
          <S.MotionBlob
            className="blob"
            style={{
              '--center-x': '52%',
              '--center-y': '50%',
              '--start': '22%',
              '--end': '78%',
              '--feather': '8%',
              '--blur': '44.6px',
              '--inner-blur': '22.3px',
              '--tint-alpha': 0
            }}
          />
        </S.MotionBlobWrap>

        <S.MotionBlobWrap $top="70%" $left="80%" $size="min(66vmin, 72vw)">
          <S.MotionBlob
            className="blob"
            style={{
              '--center-x': '46%',
              '--center-y': '48%',
              '--start': '20%',
              '--end': '88%',
              '--feather': '10%',
              '--blur': '62.4px',
              '--inner-blur': '31.2px',
              '--tint-alpha': 0
            }}
          />
        </S.MotionBlobWrap>
      </S.MotionLayer>

      <S.LabelsLayer>
        <S.LabelA>{labels[0]}</S.LabelA>
        <S.LabelB>{labels[1]}</S.LabelB>
        <S.LabelC>{labels[2]}</S.LabelC>
      </S.LabelsLayer>

      {/* Compact album card */}
      <S.AlbumCard>
        {coverSrc ? (
          <S.AlbumImage
            src={coverSrc}
            alt={title || 'cover'}
            onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
            onLoad={(e) => { e.currentTarget.style.visibility = 'visible'; }}
            style={{ visibility: 'visible' }}
          />
        ) : (
          <S.AlbumPlaceholder />
        )}
      </S.AlbumCard>
      <S.CaptionWrap>
        <S.HeadText>{title || ' '}</S.HeadText>
        <S.SubText>{artist || ' '}</S.SubText>
      </S.CaptionWrap>

      {/* Hidden audio element */}
      {audioSrc ? <audio ref={audioRef} src={audioSrc} autoPlay loop playsInline preload="auto" /> : null}
    </S.Root>
  );
}
