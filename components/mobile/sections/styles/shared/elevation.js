// Elevation (z-index) helpers for mobile UI.
// Uses the base layers from the mobile tokens and adds a few semantic aliases.

import { layers } from '../tokens';

export const z = {
  overlay: layers.pressZIndex,
  // Modal overlays used by listening/orchestrating screens
  modal: Math.max(layers.pressZIndex + 100, 1100),
  content: 1,
  background: -10,
};

export { layers };


