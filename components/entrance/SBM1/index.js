import * as S from './styles';
import { BlobBackground, TopMessage as TopMsg, QrFloat, FuronMark } from './ui';
import { useSbm1 } from './logic';

export default function SBM1Controls() {
  const { qrUrl, topMessage, furonPath, vars } = useSbm1();

  return (
    <S.Container style={vars}>
      <BlobBackground />
      <TopMsg text={topMessage} />
      <QrFloat value={qrUrl} />
      <FuronMark src={furonPath} />
    </S.Container>
  );
}
