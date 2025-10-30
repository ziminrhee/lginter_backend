import useSocketController from "@/utils/hooks/useSocketController";
import {
  Container,
  TopSection,
  MainContent,
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
  UserSelectionSection,
  UserSelectionTitle,
  UserGrid,
  UserCard,
  UserCardLabel,
  UserCardContent
} from '@/components/controller/styles';

export default function ControllerPage() {
  const { status, snapshot, reset } = useSocketController();

  const users = snapshot?.users || [];
  const deviceState = snapshot?.deviceState || {};
  const a = snapshot?.assignments || {};
  
  // Device status check: heartbeat within 30 seconds = ok
  const now = Date.now();
  const HEARTBEAT_TIMEOUT = 30 * 1000; // 30 seconds
  const getDeviceStatus = (deviceId) => {
    const dev = deviceState[deviceId?.toLowerCase()];
    if (!dev) return 'error';
    return (dev.lastHeartbeatTs && (now - dev.lastHeartbeatTs) < HEARTBEAT_TIMEOUT) ? 'ok' : 'error';
  };

  return (
    <Container>
      <TopSection>
        {/* 왼쪽: 사용자 수 + 재시작 버튼 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <UserCountCard>
            <UserCountLabel>서버에 입장한<br/>사람의 수</UserCountLabel>
            <UserCountValue>{users.length}</UserCountValue>
          </UserCountCard>
          <ResetButton onClick={() => reset('soft')}>
            서버 타임바틀<br/>(재시작)
          </ResetButton>
        </div>

        {/* 중앙: 결정된 4가지 설정 스테이트 */}
        <SettingsPanel>
          <SettingsTitle>결정된 4가지 설정 스테이트</SettingsTitle>
          <SettingsGrid>
            <SettingCard>
              <SettingLabel>설정 온도:</SettingLabel>
              <SettingValue>{a.temperature?.value ?? ''}</SettingValue>
            </SettingCard>
            <SettingCard>
              <SettingLabel>설정 습도:</SettingLabel>
              <SettingValue>{a.humidity?.value ?? ''}</SettingValue>
            </SettingCard>
            <SettingCard>
              <SettingLabel>설정 조명 컬러:</SettingLabel>
              <SettingValue>{a.light?.value ?? ''}</SettingValue>
            </SettingCard>
            <SettingCard>
              <SettingLabel>설정 음악:</SettingLabel>
              <SettingValue>{a.music?.value ?? ''}</SettingValue>
            </SettingCard>
          </SettingsGrid>
        </SettingsPanel>

        {/* 오른쪽: 스크린 상태 체크 */}
        <ScreenStatusPanel>
          <ScreenStatusTitle>스크린 상태 체크(오류 상황)</ScreenStatusTitle>
          
          <ScreenGroup>
            <ScreenGroupLabel>현관3</ScreenGroupLabel>
            <ScreenDeviceGrid>
              {['mw1', 'tv1', 'sbm1'].map(id => {
                const status = getDeviceStatus(id);
                return <DeviceChip key={id} $status={status}>{id.toUpperCase()}</DeviceChip>;
              })}
            </ScreenDeviceGrid>
          </ScreenGroup>

          <ScreenGroup>
            <ScreenGroupLabel>거실3</ScreenGroupLabel>
            <ScreenDeviceGrid>
              {['sw1', 'sw2', 'tv2'].map(id => {
                const status = getDeviceStatus(id);
                return <DeviceChip key={id} $status={status}>{id.toUpperCase()}</DeviceChip>;
              })}
            </ScreenDeviceGrid>
          </ScreenGroup>
        </ScreenStatusPanel>
      </TopSection>

      {/* 하단: 각 사용자 선택 사항 */}
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
          {/* 6명 미만이면 빈 카드로 채움 */}
          {Array.from({ length: Math.max(0, 6 - users.length) }).map((_, idx) => (
            <UserCard key={`empty-${idx}`}>
              <UserCardLabel>M{users.length + idx + 1}</UserCardLabel>
              <UserCardContent></UserCardContent>
            </UserCard>
          ))}
        </UserGrid>
      </BottomSection>
    </Container>
  );
}
