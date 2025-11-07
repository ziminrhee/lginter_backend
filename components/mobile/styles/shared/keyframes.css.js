// Shared keyframes for mobile UI components.
// Note: Some keyframes (softRipple, outwardRipple, glowPulse, orchestrateLabel) already
// exist globally in styles/globals.css. We avoid redefining them here to prevent duplication.
// This module provides additional commonly used keyframes and exports names for convenience.

export const keyframesCss = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes fadeInOut {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
`;

export const keyframeNames = {
  glowPulse: 'glowPulse',
  softRipple: 'softRipple',
  outwardRipple: 'outwardRipple',
  orchestrateLabel: 'orchestrateLabel',
  spin: 'spin',
  fadeInOut: 'fadeInOut',
};


