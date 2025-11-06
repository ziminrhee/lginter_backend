import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import * as S from './styles';

export function BlobBackground() {
  return (
    <S.BlobLayer>
      <S.BlobTR />
      <S.BlobBL />
    </S.BlobLayer>
  );
}

export function TopMessage({ text }) {
  return <S.TopMessage>{text}</S.TopMessage>;
}

export function QrFloat({ value }) {
  return (
    <S.QRFloat>
      <QRCodeSVG value={value} size={0} level="H" bgColor="transparent" fgColor="#111827" />
    </S.QRFloat>
  );
}

export function FuronMark({ src }) {
  const style = src ? { backgroundImage: `url(${src})` } : undefined;
  return <S.FuronMark style={style} />;
}


