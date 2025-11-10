import { useEffect, useMemo } from 'react';
import useSocketController from '@/utils/hooks/useSocketController';
import useControllerFlow from './hooks/useControllerFlow';
import {
  Container,
  TopSection,
  BottomSection,
  UserCountCard,
  UserCountLabel,
  UserCountValue,
  ResetButton,
  SettingsPanel,
  SettingsTitle,
  SettingsGrid,
  SettingCard,
  SettingLabel,
  SettingValue,
  ScreenStatusPanel,
  ScreenStatusTitle,
  ScreenGroup,
  ScreenGroupLabel,
  ScreenDeviceGrid,
  DeviceChip,
  UserSelectionTitle,
  UserGrid,
  UserCard,
  UserCardLabel,
  UserCardContent,
} from './styles';

export default function ControllerView() {
  const sockets = useSocketController();
  const orchestrator = useControllerFlow({ emit: sockets.emit });
  useEffect(() => {
    sockets.updateHandlers?.({
      onNewUser: orchestrator.onNewUser,
      onNewName: orchestrator.onNewName,
      onNewVoice: orchestrator.onNewVoice,
      onDeviceHeartbeat: orchestrator.onDeviceHeartbeat,
    });
  }, [orchestrator.onNewUser, orchestrator.onNewName, orchestrator.onNewVoice, orchestrator.onDeviceHeartbeat]);

  const snapshot = orchestrator.snapshot || {};
  const users = snapshot.users || [];
  const assignments = snapshot.assignments || {};

  return (
    <Container>
      <TopSection>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <UserCountCard>
            <UserCountLabel>서버에 입장한<br />사람의 수</UserCountLabel>
            <UserCountValue>{users.length}</UserCountValue>
          </UserCountCard>
          <ResetButton onClick={orchestrator.handleReset}>
            서버 타임바틀
            <br />
            (재시작)
          </ResetButton>
        </div>

        <SettingsPanel>
          <SettingsTitle>결정된 4가지 설정 스테이트</SettingsTitle>
          <SettingsGrid>
            <SettingCard>
              <SettingLabel>설정 온도:</SettingLabel>
              <SettingValue>{assignments.temperature?.value ?? ''}</SettingValue>
            </SettingCard>
            <SettingCard>
              <SettingLabel>설정 습도:</SettingLabel>
              <SettingValue>{assignments.humidity?.value ?? ''}</SettingValue>
            </SettingCard>
            <SettingCard>
              <SettingLabel>설정 조명 컬러:</SettingLabel>
              <SettingValue>{assignments.light?.value ?? ''}</SettingValue>
            </SettingCard>
            <SettingCard>
              <SettingLabel>설정 음악:</SettingLabel>
              <SettingValue>{assignments.music?.value ?? ''}</SettingValue>
            </SettingCard>
          </SettingsGrid>
        </SettingsPanel>

        <ScreenStatusPanel>
          <ScreenStatusTitle>스크린 상태 체크(오류 상황)</ScreenStatusTitle>

          <ScreenGroup>
            <ScreenGroupLabel>현관3</ScreenGroupLabel>
            <ScreenDeviceGrid>
              {['mw1', 'mv2', 'tv1', 'sbm1'].map((id) => {
                const status = orchestrator.getDeviceStatus(id);
                return (
                  <DeviceChip key={id} $status={status}>
                    {id.toUpperCase()}
                  </DeviceChip>
                );
              })}
            </ScreenDeviceGrid>
          </ScreenGroup>

          <ScreenGroup>
            <ScreenGroupLabel>거실3</ScreenGroupLabel>
            <ScreenDeviceGrid>
              {['sw1', 'sw2', 'tv2'].map((id) => {
                const status = orchestrator.getDeviceStatus(id);
                return (
                  <DeviceChip key={id} $status={status}>
                    {id.toUpperCase()}
                  </DeviceChip>
                );
              })}
            </ScreenDeviceGrid>
          </ScreenGroup>
        </ScreenStatusPanel>
      </TopSection>

      <BottomSection>
        <UserSelectionTitle>각 사용자 선택 사항</UserSelectionTitle>
        <UserGrid>
          {users.slice(0, 6).map((user, idx) => (
            <UserCard key={user.userId || idx}>
              <UserCardLabel>{user.name || `M${idx + 1}`}</UserCardLabel>
              <UserCardContent>
                {user.needs?.temperature && <div>온도: {user.needs.temperature}</div>}
                {user.needs?.humidity && <div>습도: {user.needs.humidity}</div>}
                {user.needs?.light && <div>조명: {user.needs.light}</div>}
                {user.needs?.music && <div>음악: {user.needs.music}</div>}
              </UserCardContent>
            </UserCard>
          ))}
          {Array.from({ length: Math.max(0, 6 - users.length) }).map((_, idx) => (
            <UserCard key={`empty-${idx}`}>
              <UserCardLabel>M{users.length + idx + 1}</UserCardLabel>
              <UserCardContent />
            </UserCard>
          ))}
        </UserGrid>
      </BottomSection>
    </Container>
  );
}
