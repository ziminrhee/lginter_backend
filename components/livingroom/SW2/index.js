import { useState, useEffect, useCallback } from "react";
import useSocketSW2 from "@/utils/hooks/useSocketSW2";
import * as S from './styles';

export default function SW2Controls() {
  const [ambienceData, setAmbienceData] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState({ light: 'N/A', music: 'N/A' });
  const [youtubeData, setYoutubeData] = useState(null);
  const [loadingMusic, setLoadingMusic] = useState(false);
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

  const handleDeviceDecision = useCallback((data) => {
    console.log('💡 SW2 received device-decision:', data);
    if (data.device === 'sw2') {
      console.log('✅ SW2: Data matched, updating state');
      setAmbienceData(data);
      if (data.assignedUsers) {
        setAssignedUsers(data.assignedUsers);
        console.log('👥 SW2: Assigned users:', data.assignedUsers);
      }
      if (data.song) {
        searchYouTubeMusic(data.song);
      }
    } else {
      console.log('⏭️ SW2: Data not for this device, skipping');
    }
  }, [searchYouTubeMusic]);

  const handleNewDecision = useCallback((msg) => {
    if (!msg || (msg.target && msg.target !== 'sw2')) return;
    const env = msg.env || {};
    const data = { device: 'sw2', lightColor: env.lightColor, song: env.music };
    setAmbienceData(prev => ({ ...prev, ...data }));
  }, []);

  const { socket } = useSocketSW2({
    onDeviceDecision: handleDeviceDecision,
    onDeviceNewDecision: handleNewDecision,
  });

  return (
    <S.Root>
      <S.Container>
        <S.Panel>
          <S.Title>💡 조명 & 음악 제어</S.Title>
          <S.Subtitle>Smart Ambience Controller SW2</S.Subtitle>

          {ambienceData ? (
            <S.Column>

              <S.Tile>
                <S.Row>
                  <S.ColorBox $color={ambienceData.lightColor} />
                  <S.Flex1>
                    <S.LabelSmall>💡 조명 색상</S.LabelSmall>
                    <S.ValueLarge>{ambienceData.lightColor}</S.ValueLarge>
                    <S.AssignedTag>👤 {assignedUsers.light}</S.AssignedTag>
                  </S.Flex1>
                </S.Row>

                <S.Divider>
                  <S.LabelSmall>🎵 재생 중인 음악</S.LabelSmall>
                  <S.SongTitle>{ambienceData.song}</S.SongTitle>
                  <S.AssignedTag>👤 {assignedUsers.music}</S.AssignedTag>
                  
                  {loadingMusic ? (
                    <S.LoadingBlock>
                      <S.Spinner />
                      <S.LoadingNote>음악을 불러오는 중...</S.LoadingNote>
                    </S.LoadingBlock>
                  ) : youtubeData?.videoId ? (
                    <S.PlayerWrap>
                      <iframe
                        width="100%"
                        height="200"
                        src={`${youtubeData.embedUrl}&mute=0`}
                        title="YouTube Music Player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                        allowFullScreen
                        style={{ borderRadius: '12px' }}
                      />
                      <S.PlayerNote>🎵 음악이 자동 재생됩니다</S.PlayerNote>
                    </S.PlayerWrap>
                  ) : youtubeData?.searchUrl ? (
                    <S.SearchBlock>
                      <S.SearchTitle>YouTube에서 검색하기</S.SearchTitle>
                      <S.SearchLink href={youtubeData.searchUrl} target="_blank" rel="noopener noreferrer">
                        🎵 YouTube에서 듣기
                      </S.SearchLink>
                    </S.SearchBlock>
                  ) : null}
                </S.Divider>
              </S.Tile>

              <S.StatusCard>
                <S.StatusCaption>시스템 상태</S.StatusCaption>
                <S.StatusText>✅ 활성화됨</S.StatusText>
              </S.StatusCard>
            </S.Column>
          ) : (
            <S.EmptyState>
              <S.EmptyIcon>💡</S.EmptyIcon>
              <S.EmptyText>설정 대기 중...</S.EmptyText>
            </S.EmptyState>
          )}
        </S.Panel>
      </S.Container>
    </S.Root>
  );
}
