import React from 'react';
import { TextRow, Cell, Value, Reason, Typing } from './text.styles';

export function TextOverlay({ panels }) {
  return (
    <TextRow>
      {panels.map((p, i) => (
        <Cell key={i}>
          <Value>{p.value}</Value>
          {p.reason ? <Reason>{p.reason}</Reason> : null}
          {p.typing ? <Typing>{p.typing}</Typing> : null}
        </Cell>
      ))}
    </TextRow>
  );
}


