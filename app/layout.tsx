import type { ReactNode } from "react";
import "../styles/globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ReduxProvider from "@/components/providers/ReduxProviders";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Portfolio",
  description: "Next app with Redux",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <AntdRegistry>
          <ReduxProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </ReduxProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
