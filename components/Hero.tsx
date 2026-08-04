"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Download, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import profile from "@/data/profile.json";
import { fadeUp } from "@/lib/motion";

export function Hero() {
  return (
    <section
      id="home"
      className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-6 py-20 md:flex-row md:justify-between md:py-28"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex max-w-xl flex-col items-center gap-5 text-center md:items-start md:text-left"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-dark-surface px-3 py-1.5 text-xs text-text-muted">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-accent opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-green-accent" />
          </span>
          Available for new opportunities
        </span>

        <h1 className="gradient-text font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {profile.tagline}
        </h1>
        <p className="text-lg text-text-muted">{profile.subtitle}</p>
        <div className="flex flex-wrap justify-center gap-4 md:justify-start">
          <Button asChild size="lg" variant="solid">
            <a href="#projects">
              <FolderKanban className="size-5" /> Lihat Project
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={profile.resumeUrl} download>
              <Download className="size-5" /> Download CV
            </a>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        className="relative size-40 shrink-0 sm:size-52 md:size-64"
      >
        <motion.div
          animate={{ opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-primary to-green-accent blur-md"
        />
        <div className="absolute inset-1 overflow-hidden rounded-full bg-dark-surface">
          <Image
            src={profile.avatarUrl}
            alt={`Foto profil ${profile.name}`}
            fill
            sizes="(max-width: 640px) 160px, (max-width: 768px) 208px, 256px"
            priority
            className="object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
