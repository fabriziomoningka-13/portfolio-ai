"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import profile from "@/data/profile.json";

type Status = "idle" | "sending" | "success" | "error";

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus("sending");

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setStatus("success");
      formRef.current.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <h2 className="mb-8 font-heading text-2xl font-bold sm:text-3xl">Contact Me</h2>
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
          <a
            href={profile.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border bg-dark-surface p-4 text-sm text-text-primary transition-colors hover:border-teal-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-primary"
          >
            <InstagramIcon className="size-5 text-teal-primary" aria-hidden="true" />
            Instagram
          </a>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-dark-surface p-4 text-sm text-text-muted">
            <MapPin className="size-5 text-teal-primary" aria-hidden="true" />
            {profile.contact.location}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <form ref={formRef} className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

            <Button type="submit" variant="solid" className="self-start" disabled={status === "sending"}>
              <Send className="size-4" />
              {status === "sending" ? "Mengirim..." : "Kirim Pesan"}
            </Button>

            {status === "success" && (
              <p className="text-sm text-teal-primary">
                Pesan terkirim! Terima kasih sudah menghubungi, aku akan balas secepatnya.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-400">
                Gagal mengirim pesan. Coba lagi, atau hubungi lewat email langsung ya.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
