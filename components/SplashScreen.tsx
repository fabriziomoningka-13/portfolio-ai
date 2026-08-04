"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import profile from "@/data/profile.json";

const MIN_DISPLAY_MS = 1100;

export function SplashScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kunci scroll selama splash tampil supaya tidak ada "lompatan" konten.
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => setLoading(false), MIN_DISPLAY_MS);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      document.body.style.overflow = "";
    }
  }, [loading]);

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-dark-base"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="gradient-text font-heading text-4xl font-bold tracking-wide"
            >
              {initials}
            </motion.div>

            <div className="h-1 w-36 overflow-hidden rounded-full bg-dark-surface">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-teal-primary to-green-accent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
