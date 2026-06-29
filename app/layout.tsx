import type { ReactNode } from 'react';
import '../styles/globals.css';
import ReduxProvider from '@/components/providers/ReduxProviders';

export const metadata = {
  title: 'Portfolio',
  description: 'Next app with Redux',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}