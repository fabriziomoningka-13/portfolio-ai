import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import profile from "@/data/profile.json";
import { ChatWidgetProvider } from "@/components/ChatWidgetContext";
import { ChatWidget } from "@/components/ChatWidget";
import { SplashScreen } from "@/components/SplashScreen";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import VisitorCounter from "@/components/VisitorCounter";

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

        <ChatWidgetProvider>
          <SplashScreen />
          {/* Navbar & Footer SATU instance global di layout (sama seperti alasan
              ChatWidget ada di sini) — supaya keduanya TIDAK di-mount ulang setiap
              pindah halaman. Sebelumnya tiap page (About/Skills/Projects/dst)
              me-render <Navbar /> & <Footer /> sendiri-sendiri, sehingga Next.js
              menganggapnya elemen baru setiap navigasi -> ter-mount ulang dari nol
              -> terlihat seperti "berkedip/animasi ulang". Dengan diletakkan di
              layout, hanya {children} di tengah yang berganti saat pindah halaman;
              Navbar & Footer tetap sama (tidak remount), transisi jadi mulus.
              PENTING: setelah ini, <Navbar /> dan <Footer /> HARUS dihapus dari
              setiap file page (app/page.tsx, app/about/page.tsx, app/skills/page.tsx,
              app/projects/page.tsx) supaya tidak muncul dobel. */}
          <Navbar />
          {children}
          <Footer />
          {/* ChatWidget SATU instance global di layout — supaya riwayat chat & state
              (termasuk saat navigasi otomatis) tetap ada saat pindah halaman, tidak
              ke-reset seperti kalau di-render terpisah di tiap page. */}
          <ChatWidget />
        </ChatWidgetProvider>
        <VisitorCounter />
      </body>
    </html>
  );
}
