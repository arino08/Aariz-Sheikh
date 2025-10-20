import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import GlobalTerminalShortcut from "@/components/ui/GlobalTerminalShortcut";

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
                                <GlobalTerminalShortcut />
                                {children}
                        </body>
                </html>
        );
}
