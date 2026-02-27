import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import Onboarding from "@/components/Onboarding";
import SessionTimer from "@/components/SessionTimer";
import Prayer from "@/components/Prayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meta Tutor — Metaphysics Study Assistant",
  description: "AI-powered study assistant for Thomistic Metaphysics",
  icons: {
    icon: "/favicon.svg",
  },
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
        <div className="flex flex-col h-dvh overflow-hidden">
          <Nav />
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
        <KeyboardShortcuts />
        <Onboarding />
        <SessionTimer />
        <Prayer />
      </body>
    </html>
  );
}
