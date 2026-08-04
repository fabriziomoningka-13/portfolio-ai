"use client";

import { Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import profile from "@/data/profile.json";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <h2 className="mb-8 font-heading text-2xl font-bold sm:text-3xl">Mari Terhubung</h2>
      </Reveal>

      <div className="grid gap-10 md:grid-cols-2">
        <Reveal delay={0.1} className="flex flex-col gap-4">
          <a
            href={`mailto:${profile.contact.email}`}
            className="flex items-center gap-3 rounded-xl border border-border bg-dark-surface p-4 text-sm text-text-primary transition-colors hover:border-teal-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-primary"
          >
            <Mail className="size-5 text-teal-primary" aria-hidden="true" />
            {profile.contact.email}
          </a>
          <a
            href={profile.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border bg-dark-surface p-4 text-sm text-text-primary transition-colors hover:border-teal-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-primary"
          >
            <LinkedinIcon className="size-5 text-teal-primary" aria-hidden="true" />
            LinkedIn
          </a>
          <a
            href={profile.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border bg-dark-surface p-4 text-sm text-text-primary transition-colors hover:border-teal-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-primary"
          >
            <GithubIcon className="size-5 text-teal-primary" aria-hidden="true" />
            GitHub
          </a>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-dark-surface p-4 text-sm text-text-muted">
            <MapPin className="size-5 text-teal-primary" aria-hidden="true" />
            {profile.contact.location}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Form ini belum terhubung ke backend — akan diaktifkan di fase berikutnya.");
            }}
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className="text-xs font-medium text-text-muted">
                Nama
              </label>
              <input
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                placeholder="Nama kamu"
                className="rounded-xl border border-border bg-dark-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-teal-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className="text-xs font-medium text-text-muted">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                required
                type="email"
                autoComplete="email"
                placeholder="email@kamu.com"
                className="rounded-xl border border-border bg-dark-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-teal-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="text-xs font-medium text-text-muted">
                Pesan
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                placeholder="Tulis pesan singkat..."
                className="resize-none rounded-xl border border-border bg-dark-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-teal-primary focus:outline-none"
              />
            </div>

            <Button type="submit" variant="solid" className="self-start">
              <Send className="size-4" /> Kirim Pesan
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
