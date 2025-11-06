import React, { useEffect, useRef, useState } from 'react';
import { PanelRow, Panel, BlobLayer, BlobCircle } from './blob.styles';

export function BlobBackground({ cssVars }) {
  // Smooth color crossfade between previous and next palettes
  const [prevVars, setPrevVars] = useState(cssVars);
  const prevRef = useRef(cssVars);
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    if (prevRef.current !== cssVars) {
      setPrevVars(prevRef.current);
      prevRef.current = cssVars;
      setFlip(f => !f);
    }
  }, [cssVars]);

  return (
    <PanelRow style={cssVars}>
      <Panel>
        <BlobLayer style={{ opacity: flip ? 0 : 1 }}>
          <BlobCircle style={{ '--main': 'var(--p1-main)', '--a': 'var(--p1-a)', '--b': 'var(--p1-b)', ...prevVars }} />
        </BlobLayer>
        <BlobLayer style={{ opacity: flip ? 1 : 0 }}>
          <BlobCircle style={{ '--main': 'var(--p1-main)', '--a': 'var(--p1-a)', '--b': 'var(--p1-b)', ...cssVars }} />
        </BlobLayer>
      </Panel>
      <Panel>
        <BlobLayer style={{ opacity: flip ? 0 : 1 }}>
          <BlobCircle style={{ '--main': 'var(--p2-main)', '--a': 'var(--p2-a)', '--b': 'var(--p2-b)', ...prevVars }} />
        </BlobLayer>
        <BlobLayer style={{ opacity: flip ? 1 : 0 }}>
          <BlobCircle style={{ '--main': 'var(--p2-main)', '--a': 'var(--p2-a)', '--b': 'var(--p2-b)', ...cssVars }} />
        </BlobLayer>
      </Panel>
      <Panel>
        <BlobLayer style={{ opacity: flip ? 0 : 1 }}>
          <BlobCircle style={{ '--main': 'var(--p3-main)', '--a': 'var(--p3-a)', '--b': 'var(--p3-b)', ...prevVars }} />
        </BlobLayer>
        <BlobLayer style={{ opacity: flip ? 1 : 0 }}>
          <BlobCircle style={{ '--main': 'var(--p3-main)', '--a': 'var(--p3-a)', '--b': 'var(--p3-b)', ...cssVars }} />
        </BlobLayer>
      </Panel>
      <Panel>
        <BlobLayer style={{ opacity: flip ? 0 : 1 }}>
          <BlobCircle style={{ '--main': 'var(--p4-main)', '--a': 'var(--p4-a)', '--b': 'var(--p4-b)', ...prevVars }} />
        </BlobLayer>
        <BlobLayer style={{ opacity: flip ? 1 : 0 }}>
          <BlobCircle style={{ '--main': 'var(--p4-main)', '--a': 'var(--p4-a)', '--b': 'var(--p4-b)', ...cssVars }} />
        </BlobLayer>
      </Panel>
    </PanelRow>
  );
}


