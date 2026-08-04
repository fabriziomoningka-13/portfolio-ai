"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

/** Bungkus satu blok konten dengan animasi fade+slide-up saat masuk viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Bungkus grid/list supaya anak-anaknya reveal bergantian (stagger). Pakai bareng <RevealItem>. */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Satu item di dalam <RevealGroup>. Wajib dipakai di sini (bukan motion.div langsung
 *  di Server Component) karena motion.* cuma valid dirender dari Client Component. */
export function RevealItem({
  children,
  className,
  hoverLift = false,
}: {
  children: ReactNode;
  className?: string;
  hoverLift?: boolean;
}) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={hoverLift ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
