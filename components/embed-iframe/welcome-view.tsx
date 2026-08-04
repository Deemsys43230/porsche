import { Button } from '@/components/ui/button';
import type { AppConfig } from '@/lib/types';

type WelcomeViewProps = {
  appConfig: AppConfig;
  disabled: boolean;
  onStartCall: () => void;
};

export const WelcomeView = ({
  appConfig,
  disabled,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  const companyName = appConfig.companyName || 'LiveKit';

  return (
    <div ref={ref} inert={disabled} className="absolute inset-0">
      <Button
        variant="outline"
        onClick={onStartCall}
        className="group flex h-full w-full items-center justify-between gap-3 rounded-full border-2 border-primary/10 bg-primary/5 p-1.5 shadow-sm transition-all duration-500 hover:border-primary/30 hover:bg-primary/10 hover:shadow-md"
      >
        <div className="shrink-0 pl-0.5">
          {appConfig.logo ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={appConfig.logo} alt={`${companyName} Logo`} className="block size-7 dark:hidden object-contain" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={appConfig.logoDark || appConfig.logo} alt={`${companyName} Logo`} className="hidden size-7 dark:block object-contain" />
            </>
          ) : (
            <div className="bg-fgAccent flex size-9 items-center justify-center rounded-full shadow-sm transition-transform duration-500 group-hover:scale-105 group-hover:shadow-md">
              <div
                className="bg-bg1"
                style={{
                  width: '55%',
                  height: '55%',
                  maskImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Crect%20x%3D%2231.5%22%20y%3D%2225%22%20width%3D%224%22%20height%3D%2250%22%20rx%3D%222%22%20%2F%3E%0A%20%20%3Cpath%20d%3D%22M%2043.5%2025%20A%2025%2025%200%200%201%2043.5%2075%20L%2043.5%2071%20A%2021%2021%200%200%200%2043.5%2029%20Z%22%20%2F%3E%0A%3C%2Fsvg%3E")`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                }}
              />
            </div>
          )}
        </div>

        <span className="flex-1 truncate text-center font-bold tracking-widest uppercase text-primary pr-9 text-xs transition-all duration-500">
          {appConfig.startButtonText || 'Chat with Agent'}
        </span>
      </Button>
    </div>
  );
};
