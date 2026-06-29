import type { ReactNode } from 'react';
import ReduxProvider from './providers';
import '../styles/globals.css';

export const metadata = {
  title: 'Portfolio',
  description: 'Next app with Redux',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}