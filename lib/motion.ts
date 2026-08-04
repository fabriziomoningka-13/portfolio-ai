import type { Variants } from "framer-motion";

/** Fade + slide up — dipakai untuk hero, judul section, dsb saat pertama muncul. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/** Container untuk stagger children (dipakai di grid Skills/Projects). */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

/** Item di dalam stagger container — fade + sedikit scale saat reveal-on-scroll. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/** Preset viewport supaya animasi reveal-on-scroll cuma jalan sekali. */
export const viewportOnce = { once: true, margin: "-80px" };
