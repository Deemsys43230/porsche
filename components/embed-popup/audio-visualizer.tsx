import { type AgentState, BarVisualizer, type TrackReference } from '@livekit/components-react';
import { AgentAudioVisualizerAura } from '@/components/agent-audio-visualizer-aura';
import type { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  agentState: AgentState;
  audioTrack?: TrackReference;
  appConfig?: AppConfig;
}

export function AudioVisualizer({ agentState, audioTrack, appConfig }: AudioVisualizerProps) {
  const visualizerType = appConfig?.visualizerType ?? 'aura';

  if (visualizerType === 'aura') {
    const rawColor =
      appConfig?.visualizerColor || appConfig?.accentDark || appConfig?.accent || '#D5001C';
    const colorHex: `#${string}` = (
      rawColor.startsWith('#') ? rawColor : `#${rawColor}`
    ) as `#${string}`;

    return (
      <AgentAudioVisualizerAura
        state={agentState}
        audioTrack={audioTrack}
        color={colorHex}
        colorShift={appConfig?.visualizerColorShift ?? 0.05}
        size={appConfig?.visualizerSize ?? 'lg'}
        className="w-full h-full"
      />
    );
  }

  return (
    <BarVisualizer
      barCount={5}
      state={agentState}
      trackRef={audioTrack}
      options={{ minHeight: 5 }}
      className="flex h-full w-auto items-center justify-center gap-3"
    >
      <span
        className={cn([
          'bg-muted min-h-6 w-6 rounded-full',
          'origin-center transition-colors duration-250 ease-linear',
          'data-[lk-highlighted=true]:bg-fgAccent data-[lk-muted=true]:bg-muted',
        ])}
      />
    </BarVisualizer>
  );
}

