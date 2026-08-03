import { RootLayout } from '@/components/root-layout';

export const metadata = {
  title: 'Deemsys AI Voice Agent',
  description: 'Deemsys AI Voice Agent',
  icons: {
    icon: '/deemsys-logo.svg',
  },
};
interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: RootLayoutProps) {
  return (
    <RootLayout className="bg-background">
      <header className="fixed top-0 left-0 z-50 hidden w-full flex-row justify-between p-6 md:flex">
        {/* <a

          className="scale-100 transition-transform duration-300 hover:scale-110 font-bold text-lg"
        >
          Deemsys AI
        </a> */}
        {/* <span className="text-foreground font-mono text-xs font-bold tracking-wider uppercase">
          Powered by{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.livekit.io/agents"
            className="underline underline-offset-4"
          >
            LiveKit Agents
          </a>
        </span> */}
      </header>
      {children}
    </RootLayout>
  );
}
