import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import Onboarding from "@/components/Onboarding";
import SessionTimer from "@/components/SessionTimer";
import Prayer from "@/components/Prayer";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  title: "Meta Tutor",
  description: "Personal multi-subject learning hub",
  // No explicit icons override — src/app/icon.png, apple-icon.png, and
  // favicon.ico (Next's file-convention icons) are the single source of
  // truth. An explicit override here previously pointed at /chi-rho.png
  // while icon.png silently won in the actual browser tab, so the two
  // never matched what layout.tsx claimed was the icon.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <div className="flex flex-col h-dvh overflow-hidden">
            <Nav />
            <div className="flex-1 overflow-hidden">{children}</div>
          </div>
        </ErrorBoundary>
        <KeyboardShortcuts />
        <Onboarding />
        <SessionTimer />
        <Prayer />
      </body>
    </html>
  );
}
