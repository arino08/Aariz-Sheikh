import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import GlobalTerminalShortcut from "@/components/ui/GlobalTerminalShortcut";
import ClientWrapper from "@/components/ui/ClientWrapper";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { CircularProgress } from "@/components/ui/ScrollProgress";
import SmoothScroll from "@/components/ui/SmoothScroll";
import EasterEggs from "@/components/ui/EasterEggs";
import { PerformanceProvider } from "@/components/ui/PerformanceProvider";
import SettingsWrapper from "@/components/ui/SettingsWrapper";
import LivePresence from "@/components/ui/LivePresence";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aariz's Terminal | Portfolio",
  description:
    "A stunning portfolio showcasing development projects through an interactive terminal-themed experience",
  keywords: [
    "developer",
    "portfolio",
    "web development",
    "react",
    "next.js",
    "3d",
  ],
  authors: [{ name: "Aariz Sheikh" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#0D1117] text-white min-h-screen`}
      >
        <PerformanceProvider enableFPSMonitor={true} autoAdjust={true}>
          <GlobalTerminalShortcut />

          {/* Smooth scroll provider */}
          <SmoothScroll
            lerp={0.1}
            duration={1.2}
            smoothWheel={true}
            touchMultiplier={2}
          >
            <ClientWrapper>{children}</ClientWrapper>
          </SmoothScroll>

          {/* Premium visual effects - controlled by SettingsWrapper */}
          <SettingsWrapper />

          {/* Scroll progress indicators */}
          <ScrollProgress
            position="top"
            height={2}
            color="var(--terminal-green)"
            glowEffect={true}
          />

          {/* Circular scroll-to-top button */}
          <CircularProgress
            size={50}
            strokeWidth={3}
            color="var(--terminal-green)"
            showPercentage={false}
            position="bottom-right"
          />

          {/* Easter eggs - Konami code, secret words */}
          <EasterEggs enabled={true} />

          {/* Real-time visitor presence */}
          <LivePresence
            showCursors={true}
            showCounter={true}
            showNotifications={true}
            position="top-right"
            maxCursors={8}
          />
        </PerformanceProvider>
      </body>
    </html>
  );
}
