import { useState, useCallback, useMemo, useEffect } from "react";
import useSocketSW2 from "@/utils/hooks/useSocketSW2";
import * as S from './styles';
import { createSocketHandlers } from './logic';

export default function SW2Controls() {
  const [ambienceData, setAmbienceData] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState({ light: 'N/A', music: 'N/A' });
  const [youtubeData, setYoutubeData] = useState(null);
  const [loadingMusic, setLoadingMusic] = useState(false);
  const [dotCount, setDotCount] = useState(0);
  const searchYouTubeMusic = useCallback(async (songTitle) => {
    setLoadingMusic(true);
    try {
      const [songName, artistName] = songTitle.split(' - ');
      const response = await fetch('/api/youtube-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song: songName, artist: artistName })
      });
      const data = await response.json();
      console.log('🎵 YouTube search result:', data);
      setYoutubeData(data);
    } catch (error) {
      console.error('YouTube search error:', error);
    } finally {
      setLoadingMusic(false);
    }
  }, []);

  const handlers = useMemo(
    () => createSocketHandlers({ setAmbienceData, setAssignedUsers, searchYouTubeMusic }),
    [setAmbienceData, setAssignedUsers, searchYouTubeMusic]
  );

  const { socket } = useSocketSW2({
    onDeviceDecision: handlers.onDeviceDecision,
    onDeviceNewDecision: handlers.onDeviceNewDecision,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setDotCount((c) => (c >= 3 ? 0 : c + 1));
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <S.Root>
      <S.BlobMotionCss />
      <S.FrameBg $url="/sw2-frame.png" />
      <S.TopStatus>
        <span>가족 구성원 3 명을 위한 조율중</span>
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
        <S.LabelA>설렘</S.LabelA>
        <S.LabelB>찝찝함</S.LabelB>
        <S.LabelC>불쾌함</S.LabelC>
      </S.LabelsLayer>

      {/* Center album/image */}
      <S.CenterImage src="/sw2_albumcover/borealis.png" alt="cover" />
      <S.CaptionWrap>
        <S.HeadText>Borealis</S.HeadText>
        <S.SubText>Scott Burkely</S.SubText>
      </S.CaptionWrap>
    </S.Root>
  );
}
