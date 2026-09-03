"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import type { ReactNode } from "react";

/**
 * template.tsx (bukan layout.tsx) SENGAJA dipakai di sini — beda dengan layout,
 * template di-remount setiap kali pindah halaman, jadi animasi entrance ini
 * otomatis jalan lagi tiap navigasi (Home -> About -> Projects, dst),
 * memberi efek transisi yang smooth ala website modern.
 */
export default function Template({ children }: { children: ReactNode }) {
  // Paksa scroll ke paling atas setiap kali halaman baru dimuat (template
  // remount = pindah halaman). Tanpa ini, kombinasi Navbar yang sticky +
  // animasi geser (y: 16 -> 0) di bawah kadang membuat browser salah
  // menghitung posisi scroll setelah navigasi, sehingga halaman "mendarat"
  // sedikit ter-scroll ke bawah -> bagian atas konten (foto, judul) jadi
  // sedikit ketutup Navbar sampai user scroll manual. Pakai "auto" (instan,
  // bukan "smooth") supaya tidak bentrok/terlihat aneh bareng animasi fade
  // milik framer-motion di bawah.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
