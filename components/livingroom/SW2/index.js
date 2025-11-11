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
      <S.FrameBg $url="/sw2-frame.png" />
      <S.TopStatus>
        <span>가족 구성원 3 명을 위한 조율중</span>
        <S.Dots aria-hidden="true">
          <S.Dot $visible={dotCount >= 1}>.</S.Dot>
          <S.Dot $visible={dotCount >= 2}>.</S.Dot>
          <S.Dot $visible={dotCount >= 3}>.</S.Dot>
        </S.Dots>
      </S.TopStatus>

      <S.LabelsLayer>
        <S.LabelA>설렘</S.LabelA>
        <S.LabelB>찝찝함</S.LabelB>
        <S.LabelC>불쾌함</S.LabelC>
      </S.LabelsLayer>

      {/* Center album/image */}
      <S.CenterImage src="/sw2-cover.png" alt="cover" />
      <S.CaptionWrap>
        <S.HeadText>Borealis</S.HeadText>
        <S.SubText>Scott Burkely</S.SubText>
      </S.CaptionWrap>
    </S.Root>
  );
}
