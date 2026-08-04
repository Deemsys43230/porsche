import type { AppConfig } from '@/lib/types';
import { EmbedErrorDetails } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  appConfig: AppConfig;
  error: EmbedErrorDetails | null;
}

export function ErrorMessage({ appConfig, error }: ErrorMessageProps) {
  const logo = appConfig.logo || "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20fill%3D%22currentColor%22%3E%0A%20%20%3Crect%20x%3D%2231.5%22%20y%3D%2225%22%20width%3D%224%22%20height%3D%2250%22%20rx%3D%222%22%20%2F%3E%0A%20%20%3Cpath%20d%3D%22M%2043.5%2025%20A%2025%2025%200%200%201%2043.5%2075%20L%2043.5%2071%20A%2021%2021%200%200%200%2043.5%2029%20Z%22%20%2F%3E%0A%3C%2Fsvg%3E";
  const logoDark = appConfig.logoDark || "data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Cg%20clip-path%3D%22url(%23clip0_646_420)%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M14.4004%209.59961H9.59962V14.4004H14.4004V9.59961Z%22%20fill%3D%22%231FD5F9%22%20%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M19.2011%204.80078H14.4004V9.60153H19.2011V4.80078Z%22%20fill%3D%22%231FD5F9%22%20%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M19.2011%2014.4004H14.4004V19.2011H19.2011V14.4004Z%22%20fill%3D%22%231FD5F9%22%20%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M24%200H19.1992V4.80075H24V0Z%22%20fill%3D%22%231FD5F9%22%20%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M24%2019.1992H19.1992V24H24V19.1992Z%22%20fill%3D%22%231FD5F9%22%20%2F%3E%0A%20%20%20%20%3Cpath%0A%20%20%20%20%20%20d%3D%22M4.80075%2019.1992V14.4004V9.59962V4.80075V0H0V4.80075V9.59962V14.4004V19.1992V24H4.80075H9.59963H14.4004V19.1992H9.59963H4.80075Z%22%0A%20%20%20%20%20%20fill%3D%22white%22%20%2F%3E%0A%20%20%3C%2Fg%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3CclipPath%20id%3D%22clip0_646_420%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22white%22%20%2F%3E%0A%20%20%20%20%3C%2FclipPath%3E%0A%20%20%3C%2Fdefs%3E%0A%3C%2Fsvg%3E%0A%20%20";
  const companyName = appConfig.companyName || 'LiveKit';

  return (
    <div
      inert={error === null}
      className={cn(
        'absolute inset-0 z-50 flex h-full w-full flex-col items-center justify-center gap-5 transition-opacity',
        error === null ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="pl-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt={`${companyName} Logo`} className="block size-6 dark:hidden" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoDark} alt={`${companyName} Logo`} className="hidden size-6 dark:block" />
      </div>

      <div className="flex w-full flex-col justify-center gap-4 overflow-auto px-8 text-center">
        <span className="leading-tight font-medium text-pretty">{error?.title}</span>
        <span className="text-sm text-balance">{error?.description}</span>
      </div>
    </div>
  );
}
