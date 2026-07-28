import type { TranscriptionSegment } from 'livekit-client';

export interface CombinedTranscription extends TranscriptionSegment {
  role: 'assistant' | 'user';
  receivedAtMediaTimestamp: number;
  receivedAt: number;
}
export type ThemeMode = 'dark' | 'light' | 'system';

export interface AppConfig {
  sandboxId?: string;
  agentName?: string;

  supportsChatInput: boolean;
  supportsVideoInput: boolean;
  supportsScreenShare: boolean;
  isPreConnectBufferEnabled: boolean;

  startButtonText?: string;
  companyName?: string;
  accent?: string;
  accentDark?: string;
  logo?: string;
  logoDark?: string;

  // Trigger button customization
  triggerSize?: number;
  triggerLogoSize?: number;

  // Audio visualizer customization
  visualizerType?: 'bar' | 'aura';
  visualizerColor?: string;
  visualizerColorShift?: number;
  visualizerSize?: 'icon' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface SandboxConfig {
  [key: string]:
    | { type: 'string'; value: string }
    | { type: 'number'; value: number }
    | { type: 'boolean'; value: boolean }
    | null;
}

export type EmbedErrorDetails = { title: React.ReactNode; description: React.ReactNode };
