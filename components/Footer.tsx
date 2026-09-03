"use client";

import Link from "next/link";
import { Mail, ArrowUp } from "lucide-react";
import profile from "@/data/profile.json";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/icons";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
];

const socialLinks = [
  { href: `mailto:${profile.contact.email}`, label: "Email", icon: Mail },
  { href: profile.contact.linkedin, label: "LinkedIn", icon: LinkedinIcon },
  { href: profile.contact.github, label: "GitHub", icon: GithubIcon },
  { href: profile.contact.instagram, label: "Instagram", icon: InstagramIcon },
];

export function Footer() {
  // "Back to top" harus bekerja di SEMUA halaman (/, /about, /skills,
  // /projects), bukan cuma di halaman utama. Section id="home" cuma ada di
  // halaman utama, jadi href="#home" gagal di halaman lain (elemen dengan
  // id itu tidak ditemukan -> tidak terjadi apa-apa). Solusinya: scroll ke
  // paling atas halaman yang sedang aktif, apa pun halamannya.
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="border-t border-border bg-dark-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/#home" className="font-heading text-lg font-bold text-text-primary">
              {profile.name}
            </Link>
            <p className="max-w-xs text-sm text-text-muted">{profile.subtitle}</p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Navigation
            </span>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-text-muted transition-colors hover:text-teal-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Connect
            </span>
            <div className="flex gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-teal-primary hover:text-teal-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
            <span className="text-sm text-text-muted">{profile.contact.location}</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <span className="text-xs text-text-muted">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </span>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-teal-primary"
          >
            Back to top <ArrowUp className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
