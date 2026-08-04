"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import profile from "@/data/profile.json";
import { useChatWidget } from "@/components/ChatWidgetContext";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { setOpen: setChatOpen } = useChatWidget();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Kalau sudah di Home (di posisi scroll manapun), jangan navigasi ulang —
    // cukup smooth-scroll ke atas dengan animasi "ditarik" ala modern portfolio.
    if (isHome) {
      e.preventDefault();
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
    // Kalau di halaman lain (About/Skills/Projects/dst), biarkan <Link> jalan
    // normal navigasi ke "/#home".
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled
          ? "border-border bg-dark-base/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/#home"
          onClick={handleLogoClick}
          className="font-heading text-lg font-bold text-text-primary transition-opacity hover:opacity-80"
        >
          {profile.name}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-text-muted transition-colors hover:text-teal-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button size="sm" variant="solid" onClick={() => setChatOpen(true)}>
            <MessageCircle className="size-4" /> Chat with AI
          </Button>
        </div>

        <button
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="text-text-primary md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-dark-base md:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm text-text-muted hover:text-teal-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Button
                size="sm"
                variant="solid"
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  setChatOpen(true);
                }}
              >
                <MessageCircle className="size-4" /> Chat with AI
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
