import type { AppConfig } from './lib/types';

export const APP_CONFIG_DEFAULTS: AppConfig = {
  sandboxId: undefined,
  agentName: undefined,
  supportsChatInput: false,        // ← set false to hide chat
  supportsVideoInput: false,       // ← hide video for voice-only
  supportsScreenShare: false,      // ← hide screenshare
  isPreConnectBufferEnabled: true,
  startButtonText: 'Talk to Deemsys Assistant',
  companyName: 'Deemsys',
  accent: '#0284c7',              // Deemsys Blue (light mode)
  accentDark: '#38bdf8',          // Deemsys Blue (dark mode)
  logo: undefined,
  logoDark: undefined,

  // Trigger button
  triggerSize: 56,
  triggerLogoSize: 56,

  // Audio visualizer
  visualizerType: 'aura',
  visualizerColor: undefined,       // falls back to accentDark → accent
  visualizerColorShift: 0.05,
  visualizerSize: 'lg',
};
