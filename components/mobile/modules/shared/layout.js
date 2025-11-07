// Layout style helpers for mobile components.
// These helpers centralize common container and positioning patterns to keep
// component files focused on behavior.

import { spacing, fonts } from '../../styles/tokens';
import { z as zIndex } from './elevation';

export const fullscreenOverlay = (z = zIndex.modal) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: z,
  pointerEvents: 'none'
});

export const centeredCircleWrap = (
  size = 'clamp(380px, 76vw, 560px)',
  top = '60vh'
) => ({
  position: 'fixed',
  left: '50%',
  top,
  transform: 'translate(-50%, -50%)',
  width: size,
  height: size,
  borderRadius: '50%'
});

export const pressOverlayContainer = (
  bottom = spacing.press.bottom,
  z = zIndex.overlay
) => ({
  position: 'fixed',
  bottom,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: z,
  width: '220px',
  height: '220px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'auto'
});

export const circleHitArea = (size = '180px') => ({
  position: 'relative',
  width: size,
  height: size,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent'
});

export const fixedTopLabel = (
  top = 'clamp(calc(env(safe-area-inset-top, 0px) + 56px), 12vh, 96px)'
) => ({
  position: 'fixed',
  top,
  left: '50%',
  transform: 'translateX(-50%)'
});

// App container and content wrapper used in components/mobile/index.js
export const appContainer = (isModal = false) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  background: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  alignItems: isModal ? 'center' : 'flex-start',
  justifyContent: isModal ? 'center' : 'flex-start',
  fontFamily: fonts.system,
  paddingTop: isModal ? '2rem' : spacing.container.paddingTop,
  paddingRight: isModal ? '2rem' : spacing.container.paddingRight,
  paddingBottom: isModal ? '2rem' : spacing.container.paddingBottom,
  paddingLeft: isModal ? '2rem' : spacing.container.paddingLeft,
  overscrollBehavior: 'none'
});

export const contentWrapper = (isModal = false) => ({
  background: 'transparent',
  backdropFilter: 'none',
  borderRadius: 0,
  padding: 0,
  boxShadow: 'none',
  border: 'none',
  width: '100%',
  maxWidth: '640px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: isModal ? 'center' : 'flex-start'
});


