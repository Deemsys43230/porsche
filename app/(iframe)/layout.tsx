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
  return <RootLayout className="bg-transparent">{children}</RootLayout>;
}
