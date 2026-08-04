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
      </header>
      {children}
    </RootLayout>
  );
}
