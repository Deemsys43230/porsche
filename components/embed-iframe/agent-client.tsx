'use client';

import { useEffect, useMemo, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client';
import { motion } from 'motion/react';
import { RoomAudioRenderer, RoomContext, StartAudio } from '@livekit/components-react';
import { XIcon } from '@phosphor-icons/react';
import useConnectionDetails from '@/hooks/use-connection-details';
import type { AppConfig, EmbedErrorDetails } from '@/lib/types';
import { Button } from '../ui/button';
import { SessionView } from './session-view';
import { WelcomeView } from './welcome-view';

const MotionWelcomeView = motion.create(WelcomeView);
const MotionSessionView = motion.create(SessionView);

interface AppProps {
  appConfig: AppConfig;
}

function EmbedAgentClient({ appConfig }: AppProps) {
  const room = useMemo(() => new Room(), []);
  const [sessionStarted, setSessionStarted] = useState(false);
  const { connectionDetails, refreshConnectionDetails } = useConnectionDetails(appConfig);

  const [currentError, setCurrentError] = useState<EmbedErrorDetails | null>(null);

  useEffect(() => {
    const onDisconnected = () => {
      setSessionStarted(false);
      refreshConnectionDetails();
    };
    const onMediaDevicesError = (error: Error) => {
      setCurrentError({
        title: 'Encountered an error with your media devices',
        description: `${error.name}: ${error.message}`,
      });
    };
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);
    room.on(RoomEvent.Disconnected, onDisconnected);
    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
    };
  }, [room, refreshConnectionDetails]);

  useEffect(() => {
    if (!sessionStarted) {
      return;
    }
    if (room.state !== 'disconnected') {
      return;
    }
    if (!connectionDetails) {
      return;
    }

    const connect = async () => {
      try {
        await room.connect(connectionDetails.serverUrl, connectionDetails.participantToken);
        await room.localParticipant.setMicrophoneEnabled(true, undefined, {
          preConnectBuffer: appConfig.isPreConnectBufferEnabled,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Error connecting to agent:', error);
        setCurrentError({
          title: 'There was an error connecting to the agent',
          description: `${error.name}: ${error.message}`,
        });
      }
    };
    connect();

    return () => {
      room.disconnect();
    };
  }, [room, sessionStarted, connectionDetails, appConfig.isPreConnectBufferEnabled]);

  return (
    <div className={`relative h-14 rounded-full transition-all duration-300 ${sessionStarted || currentError !== null ? 'bg-background border px-2 shadow-sm' : ''}`}>
      <MotionWelcomeView
        key="welcome"
        appConfig={appConfig}
        onStartCall={() => setSessionStarted(true)}
        disabled={sessionStarted}
        initial={{ opacity: 1 }}
        animate={{
          opacity: !sessionStarted && currentError === null ? 1 : 0,
          pointerEvents: !sessionStarted && currentError === null ? 'auto' : 'none',
        }}
        transition={{
          duration: 0.25,
          ease: 'linear',
          delay: !sessionStarted && currentError === null ? 0.5 : 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, pointerEvents: 'none' }}
        animate={{
          opacity: currentError !== null ? 1 : 0,
          pointerEvents: currentError !== null ? 'auto' : 'none',
        }}
        className="h-full w-full"
      >
        <div className="flex h-full items-center justify-between gap-1 gap-4 pl-3">
          <div className="pl-3 shrink-0">
            {appConfig.logo ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={appConfig.logo} alt={`${appConfig.companyName || 'LiveKit'} Logo`} className="block size-6 dark:hidden object-contain" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={appConfig.logoDark || appConfig.logo} alt={`${appConfig.companyName || 'LiveKit'} Logo`} className="hidden size-6 dark:block object-contain" />
              </>
            ) : (
              <div className="bg-fgAccent flex size-6 items-center justify-center rounded-full">
                <div
                  className="bg-bg1"
                  style={{
                    width: '60%',
                    height: '60%',
                    maskImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Crect%20x%3D%2231.5%22%20y%3D%2225%22%20width%3D%224%22%20height%3D%2250%22%20rx%3D%222%22%20%2F%3E%0A%20%20%3Cpath%20d%3D%22M%2043.5%2025%20A%2025%2025%200%200%201%2043.5%2075%20L%2043.5%2071%20A%2021%2021%200%200%200%2043.5%2029%20Z%22%20%2F%3E%0A%3C%2Fsvg%3E")`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-sm font-medium">{currentError?.title}</span>
            <span className="text-xs">{currentError?.description}</span>
          </div>

          <Button size="icon" onClick={() => setCurrentError(null)}>
            <XIcon />
          </Button>
        </div>
      </motion.div>

      <RoomContext.Provider value={room}>
        <RoomAudioRenderer />
        <StartAudio label="Start Audio" />

        {/* --- */}

        <MotionSessionView
          key="session-view"
          appConfig={appConfig}
          disabled={!sessionStarted}
          sessionStarted={sessionStarted}
          onDisplayError={setCurrentError}
          initial={{ opacity: 0 }}
          animate={{
            opacity: sessionStarted && currentError === null ? 1 : 0,
            pointerEvents: sessionStarted && currentError === null ? 'auto' : 'none',
          }}
          transition={{
            duration: 0.5,
            ease: 'linear',
            delay: sessionStarted && currentError === null ? 0.25 : 0,
          }}
        />
      </RoomContext.Provider>
    </div>
  );
}
export default EmbedAgentClient;
