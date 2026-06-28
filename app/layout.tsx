import 'antd/dist/reset.css';
import '../styles/globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Portfolio CMS Auth',
  description: 'Login and register UI with Next.js App Router',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}