import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import { Header } from "@repo/ui/header";
import { Providers } from './components/provider'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Github Repo Search",
  description: "Generated by create turbo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className={styles.main}>
            <Header title="Github Repo Search" />
            <div className={styles.content}>
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
