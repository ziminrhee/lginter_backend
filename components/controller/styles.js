import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #E8E8E8;
  display: flex;
  flex-direction: column;
  padding: 2vh 2vw;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif;
  overflow: hidden;
`;

export const TopSection = styled.div`
  display: grid;
  grid-template-columns: 15vw 1fr 28vw;
  gap: 2vw;
  height: 45vh;
  margin-bottom: 2vh;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  gap: 2vw;
`;

export const BottomSection = styled.div`
  height: 42vh;
`;

// 왼쪽: 사용자 수 카드
export const UserCountCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3vh 2vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
`;

export const UserCountLabel = styled.div`
  font-size: 1.8vh;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2vh;
  line-height: 1.4;
  color: #333;
`;

export const UserCountValue = styled.div`
  font-size: 6vh;
  font-weight: 700;
  color: #333;
`;

// 재시작 버튼
export const ResetButton = styled.button`
  background: #FF5555;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 3vh 2vw;
  font-size: 2vh;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(255, 85, 85, 0.3);
  transition: all 0.2s ease;
  line-height: 1.4;
  height: 14vh;
  
  &:hover {
    background: #FF3333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 85, 85, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 중앙: 설정 스테이트 패널
export const SettingsPanel = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3vh 2vw;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const SettingsTitle = styled.h2`
  margin: 0 0 2vh 0;
  font-size: 2.2vh;
  font-weight: 700;
  color: #333;
`;

export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2vh 2vw;
`;

export const SettingCard = styled.div`
  background: #F5F5F5;
  border-radius: 12px;
  padding: 2.5vh 1.5vw;
  min-height: 12vh;
`;

export const SettingLabel = styled.div`
  font-size: 1.8vh;
  font-weight: 600;
  color: #666;
  margin-bottom: 1vh;
`;

export const SettingValue = styled.div`
  font-size: 2.2vh;
  font-weight: 500;
  color: #333;
  min-height: 3vh;
`;

// 오른쪽: 스크린 상태 패널
export const ScreenStatusPanel = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3vh 2vw;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 2vh;
`;

export const ScreenStatusTitle = styled.h2`
  margin: 0;
  font-size: 2.2vh;
  font-weight: 700;
  color: #333;
`;

export const ScreenGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vh;
`;

export const ScreenGroupLabel = styled.div`
  font-size: 1.8vh;
  font-weight: 600;
  color: #666;
`;

export const ScreenDeviceGrid = styled.div`
  display: flex;
  gap: 1vw;
`;

export const DeviceChip = styled.div`
  flex: 1;
  background: ${props => props.$status === 'ok' ? '#66DD99' : '#FF6B6B'};
  color: ${props => props.$status === 'ok' ? '#004d1a' : 'white'};
  border-radius: 8px;
  padding: 2vh 1vw;
  font-size: 2vh;
  font-weight: 700;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`;

// 하단: 사용자 선택 사항
export const UserSelectionSection = styled.div`
  margin-top: 2vh;
`;

export const UserSelectionTitle = styled.h2`
  margin: 0 0 2vh 0;
  font-size: 2.2vh;
  font-weight: 700;
  color: #333;
`;

export const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2vh 2vw;
  height: calc(42vh - 4vh);
`;

export const UserCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2vh 1.5vw;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

export const UserCardLabel = styled.div`
  font-size: 2vh;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5vh;
  padding-bottom: 1vh;
  border-bottom: 2px solid #E8E8E8;
`;

export const UserCardContent = styled.div`
  font-size: 1.6vh;
  color: #666;
  line-height: 1.6;
  
  div {
    margin-bottom: 0.5vh;
  }
`;

