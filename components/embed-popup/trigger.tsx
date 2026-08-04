import { AnimatePresence, motion } from 'motion/react';
import { useVoiceAssistant } from '@livekit/components-react';
import { PhoneDisconnectIcon, XIcon } from '@phosphor-icons/react';
import type { AppConfig } from '@/lib/types';
import { EmbedErrorDetails } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const AnimatedButton = motion.create(Button);

interface TriggerProps {
  appConfig: AppConfig;
  error: EmbedErrorDetails | null;
  popupOpen: boolean;
  onToggle: () => void;
}

export function Trigger({ appConfig, error = null, popupOpen, onToggle }: TriggerProps) {
  const { state: agentState } = useVoiceAssistant();

  const isAgentConnecting =
    popupOpen && (agentState === 'connecting' || agentState === 'initializing');

  const isAgentConnected =
    popupOpen &&
    agentState !== 'disconnected' &&
    agentState !== 'connecting' &&
    agentState !== 'initializing';

  const triggerSize = appConfig.triggerSize ?? 56;
  const triggerLogoSize = appConfig.triggerLogoSize ?? 32;
  const innerSize = triggerSize - 4; // 2px border padding

  return (
    <AnimatePresence>
      <AnimatedButton
        key="trigger-button"
        size="lg"
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        exit={{ scale: 0 }}
        transition={{
          type: 'spring',
          duration: 1,
          bounce: 0.2,
        }}
        onClick={onToggle}
        style={{ width: triggerSize, height: triggerSize }}
        className={cn(
          'relative m-0 block p-0.5 drop-shadow-md rounded-full',
          'scale-100 transition-[scale] duration-300 hover:scale-105 focus:scale-105',
          'fixed right-4 bottom-4 z-50'
        )}
      >
        {/* ring */}
        <motion.div
          className={cn(
            'absolute inset-0 z-10 rounded-full transition-colors',
            !popupOpen && (appConfig.logo ? 'bg-transparent' : 'bg-fgAccent'),
            !error &&
            isAgentConnecting &&
            'bg-fgAccent/30 animate-spin [background-image:conic-gradient(from_0deg,transparent_0%,transparent_30%,var(--color-fgAccent)_50%,transparent_70%,transparent_100%)]',
            (isAgentConnected || (error && popupOpen)) && 'bg-destructive-foreground'
          )}
        />
        {/* icon */}
        <div
          style={{ width: innerSize, height: innerSize }}
          className={cn(
            'relative z-20 grid place-items-center rounded-full transition-colors overflow-hidden',
            !popupOpen && (appConfig.logo ? 'bg-transparent' : 'bg-fgAccent'),
            !error && isAgentConnecting && 'bg-bg1',
            (isAgentConnected || (error && popupOpen)) && 'bg-destructive'
          )}
        >
          <AnimatePresence>
            {!popupOpen && (
              <motion.div
                key="lk-logo"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: popupOpen ? 20 : -20 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full h-full"
              >
                {appConfig.logo ? (
                  // Custom logo: render as <img> to preserve original colors
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={appConfig.logo}
                    alt={`${appConfig.companyName || 'LiveKit'}`}
                    style={{ width: triggerLogoSize, height: triggerLogoSize }}
                    className="object-contain drop-shadow-xl rounded-full"
                  />
                ) : (
                  // Default LiveKit mark: use CSS mask for single-color treatment
                  <div
                    className="bg-bg1"
                    style={{
                      width: triggerLogoSize,
                      height: triggerLogoSize,
                      maskImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Crect%20x%3D%2231.5%22%20y%3D%2225%22%20width%3D%224%22%20height%3D%2250%22%20rx%3D%222%22%20%2F%3E%0A%20%20%3Cpath%20d%3D%22M%2043.5%2025%20A%2025%2025%200%200%201%2043.5%2075%20L%2043.5%2071%20A%2021%2021%200%200%200%2043.5%2029%20Z%22%20%2F%3E%0A%3C%2Fsvg%3E")`,
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                    }}
                  />
                )}
              </motion.div>
            )}
            {(isAgentConnecting || (error && popupOpen)) && (
              <motion.div
                key="dismiss"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: popupOpen ? -20 : 20 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <XIcon
                  size={20}
                  weight="bold"
                  className={cn('text-fg0 size-5', error && 'text-destructive-foreground')}
                />
              </motion.div>
            )}
            {!error && isAgentConnected && (
              <motion.div
                key="disconnect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: popupOpen ? -20 : 20 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <PhoneDisconnectIcon
                  size={20}
                  weight="bold"
                  className="text-destructive-foreground size-5"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AnimatedButton>
    </AnimatePresence>
  );
}
