import type { AppConfig } from './lib/types';

export const APP_CONFIG_DEFAULTS: AppConfig = {
  sandboxId: undefined,
  agentName: undefined,
  supportsChatInput: true,        // ← set false to hide chat
  supportsVideoInput: false,       // ← hide video for voice-only
  supportsScreenShare: false,      // ← hide screenshare
  isPreConnectBufferEnabled: true,
  startButtonText: 'Talk to Porsche Assistant',
  companyName: 'Porsche',
  accent: '#D5001C',              // Porsche Red (light mode)
  accentDark: '#FF3B30',          // Porsche Red (dark mode)
  logo: 'https://cdn.brandfetch.io/idOSUjsXG-/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1726555586571',      // Place in /public
  logoDark: 'https://cdn.brandfetch.io/idOSUjsXG-/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1726555586571',

  // Trigger button
  triggerSize: 56,
  triggerLogoSize: 56,

  // Audio visualizer
  visualizerType: 'aura',
  visualizerColor: undefined,       // falls back to accentDark → accent
  visualizerColorShift: 0.05,
  visualizerSize: 'lg',
};
