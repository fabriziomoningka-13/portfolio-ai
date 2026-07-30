"use client";

import { Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import profile from "@/data/profile.json";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-8 font-heading text-2xl font-bold sm:text-3xl">Mari Terhubung</h2>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <a
            href={`mailto:${profile.contact.email}`}
            className="flex items-center gap-3 rounded-xl border border-border bg-dark-surface p-4 text-sm text-text-primary transition-colors hover:border-teal-primary"
          >
            <Mail className="size-5 text-teal-primary" /> {profile.contact.email}
          </a>
          <a
            href={profile.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border bg-dark-surface p-4 text-sm text-text-primary transition-colors hover:border-teal-primary"
          >
            <LinkedinIcon className="size-5 text-teal-primary" /> LinkedIn
          </a>
          <a
            href={profile.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border bg-dark-surface p-4 text-sm text-text-primary transition-colors hover:border-teal-primary"
          >
            <GithubIcon className="size-5 text-teal-primary" /> GitHub
          </a>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-dark-surface p-4 text-sm text-text-muted">
            <MapPin className="size-5 text-teal-primary" /> {profile.contact.location}
          </div>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Form ini belum terhubung ke backend — akan diaktifkan di fase berikutnya.");
          }}
        >
          <input
            required
            placeholder="Nama"
            className="rounded-xl border border-border bg-dark-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-teal-primary focus:outline-none"
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="rounded-xl border border-border bg-dark-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-teal-primary focus:outline-none"
          />
          <textarea
            required
            rows={4}
            placeholder="Pesan singkat..."
            className="resize-none rounded-xl border border-border bg-dark-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-teal-primary focus:outline-none"
          />
          <Button type="submit" variant="solid" className="self-start">
            <Send className="size-4" /> Kirim Pesan
          </Button>
        </form>
      </div>
    </section>
  );
}
