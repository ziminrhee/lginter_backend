import { QRCodeSVG } from 'qrcode.react';
import { Container, Card, Title, Subtitle, QRWrap } from './styles';

export default function SBM1Controls() {
  const QR_BASE = 'http://localhost:3000';

  return (
    <Container>
      <Card>
        <Title>환영합니다!</Title>
        <Subtitle>QR코드를 스캔하여 참여하세요</Subtitle>
        <QRWrap>
          <QRCodeSVG value={`${QR_BASE}/mobile`} size={280} level="H" bgColor="#FAF5FF" fgColor="#9333EA"/>
        </QRWrap>
        <Subtitle style={{ marginTop: '2rem' }}>모바일로 스캔해주세요 :D</Subtitle>
      </Card>
    </Container>
  );
}
