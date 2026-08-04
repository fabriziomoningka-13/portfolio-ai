import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import profile from "@/data/profile.json";
import { ChatWidgetProvider } from "@/components/ChatWidgetContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.subtitle,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-dark-base text-text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-teal-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-dark-base"
        >
          Lewati ke konten utama
        </a>

        {/* Dekorasi background ambient — dot-grid + gradient orbs, di belakang semua konten */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="bg-dot-grid absolute inset-0" />
          <div className="absolute -top-32 left-1/4 size-[28rem] rounded-full bg-teal-primary/10 blur-[100px]" />
          <div className="absolute top-1/3 -right-32 size-[24rem] rounded-full bg-green-accent/10 blur-[100px]" />
        </div>

        <ChatWidgetProvider>{children}</ChatWidgetProvider>
      </body>
    </html>
  );
}
