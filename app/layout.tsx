import type { ReactNode } from "react";
import "../styles/globals.css";
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
      <body>
        <ReduxProvider>
          <Header />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
