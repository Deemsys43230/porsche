import { Public_Sans } from 'next/font/google';

import { cn } from '@/lib/utils';
import '@/styles/globals.css';

export const metadata = {
  title: 'Deemsys AI Voice Agent',
  description: 'Deemsys AI Voice Agent',
};

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
});



interface RootLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export async function RootLayout({ children, className }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className={cn('scroll-smooth', className)}>
      <body
        className={cn(publicSans.variable, 'overflow-x-hidden antialiased')}
      >
        {children}
      </body>
    </html>
  );
}
