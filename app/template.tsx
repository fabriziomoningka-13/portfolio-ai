"use client";

import { motion } from "framer-motion";
import { useLayoutEffect } from "react";
import type { ReactNode } from "react";

/**
 * template.tsx (bukan layout.tsx) SENGAJA dipakai di sini — beda dengan layout,
 * template di-remount setiap kali pindah halaman, jadi animasi entrance ini
 * otomatis jalan lagi tiap navigasi (Home -> About -> Projects, dst),
 * memberi efek transisi yang smooth ala website modern.
 */
export default function Template({ children }: { children: ReactNode }) {
  // Kalau URL punya hash (#home / #contact), scroll ke SECTION itu, bukan
  // paksa ke atas. PENTING: pakai useLayoutEffect (bukan useEffect biasa) —
  // useLayoutEffect jalan SEBELUM browser sempat menggambar (paint) tampilan
  // baru, sedangkan useEffect jalan SESUDAHNYA. Kalau pakai useEffect biasa,
  // ada jeda waktu di mana Navbar (termasuk animasi underline layoutId di
  // menu aktif) sempat terukur/teranimasi dulu pada posisi scroll LAMA,
  // baru kemudian halaman "melompat" ke posisi scroll baru — dua gerakan
  // (animasi underline horizontal + lompatan scroll vertikal) jadi
  // tercampur, sehingga underline terlihat seperti bergerak dari
  // bawah-ke-atas alih-alih murni ke kiri/kanan. Dengan useLayoutEffect,
  // posisi scroll sudah "beres" duluan sebelum Navbar/Framer Motion sempat
  // mengukur posisi elemen, jadi animasi underline murni horizontal.
  useLayoutEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
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