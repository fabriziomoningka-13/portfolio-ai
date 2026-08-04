"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * template.tsx (bukan layout.tsx) SENGAJA dipakai di sini — beda dengan layout,
 * template di-remount setiap kali pindah halaman, jadi animasi entrance ini
 * otomatis jalan lagi tiap navigasi (Home -> About -> Projects, dst),
 * memberi efek transisi yang smooth ala website modern.
 */
export default function Template({ children }: { children: ReactNode }) {
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
