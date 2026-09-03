"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  const [open, setOpen] = useState(false);
  // Transparan di posisi paling atas, jadi solid begitu discroll. AMAN
  // dipakai lagi sekarang (tidak akan "berkedip" saat pindah halaman)
  // karena: 1) Navbar ini SATU instance tunggal di layout.tsx, tidak
  // di-mount ulang tiap pindah halaman lagi, dan 2) template.tsx sudah
  // memaksa scroll ke atas tiap pindah halaman, jadi transisi transparan
  // selalu konsisten mulai dari atas.
  const [scrolled, setScrolled] = useState(false);
  // Hash aktif di halaman utama ("home" atau "contact"), dipakai untuk
  // menentukan link mana yang di-highlight ketika pathname adalah "/".
  const [activeHash, setActiveHash] = useState("home");
  const { setOpen: setChatOpen } = useChatWidget();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll(); // set nilai awal yang benar begitu Navbar mount
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pantau perubahan hash (#home / #contact) di halaman utama, supaya link
  // yang di-highlight selalu sesuai section yang sedang dilihat/dituju.
  useEffect(() => {
    function syncHashFromUrl() {
      const hash = window.location.hash.replace("#", "");
      setActiveHash(hash || "home");
    }
    syncHashFromUrl();
    window.addEventListener("hashchange", syncHashFromUrl);
    return () => window.removeEventListener("hashchange", syncHashFromUrl);
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
      setActiveHash("home");
    }
    // Kalau di halaman lain (About/Skills/Projects/dst), biarkan <Link> jalan
    // normal navigasi ke "/#home".
  }

  // Tentukan apakah sebuah link nav sedang "aktif" (halaman yang sedang
  // dibuka user), untuk kasih highlight visual di navbar.
  function isLinkActive(href: string): boolean {
    if (href.includes("#")) {
      // Link berupa anchor ke section di halaman utama (Home/Contact) ->
      // aktif hanya kalau sedang di halaman utama DAN hash-nya cocok.
      const hash = href.split("#")[1];
      return isHome && activeHash === hash;
    }
    // Link ke halaman terpisah (About/Skills/Projects) -> aktif kalau
    // pathname persis sama.
    return pathname === href;
  }

  function handleNavLinkClick(href: string) {
    if (href.includes("#")) {
      setActiveHash(href.split("#")[1]);
    }
    setOpen(false);
  }

  return (
    // backdrop-blur-md SENGAJA selalu aktif (tidak di-toggle on/off) — efek
    // blur tidak bisa dianimasikan lewat CSS transition, jadi kalau blur
    // muncul/hilang mendadak bareng animasi warna, transisinya terasa
    // "patah/kasar". Yang dianimasikan cukup opacity warna background
    // (dark-base/0 -> dark-base/90) & warna border, keduanya properti yang
    // memang bisa di-transition dengan mulus oleh browser.
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-[background-color,border-color] duration-500 ease-out ${
        scrolled
          ? "border-border bg-dark-base/90"
          : "border-transparent bg-dark-base/0"
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
          {links.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => handleNavLinkClick(link.href)}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-1 text-sm transition-colors duration-300 ${
                    active
                      ? "text-teal-primary"
                      : "text-text-muted hover:text-teal-primary"
                  }`}
                >
                  {link.label}
                  {/* Garis bawah di link yang sedang aktif. Pakai layoutId
                      (bukan span statis biasa) supaya Framer Motion otomatis
                      menganimasikan PERGESERANNYA dari posisi lama ke posisi
                      baru (kiri<->kanan sesuai urutan menu yang dituju),
                      bukan cuma muncul/hilang mendadak di tempat baru. */}
                  {active && (
                    <motion.span
                      layoutId="desktop-nav-underline"
                      className="absolute -bottom-[1px] left-0 h-[2px] w-full rounded-full bg-teal-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
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
            {links.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => handleNavLinkClick(link.href)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2 py-2 text-sm transition-colors duration-300 ${
                      active
                        ? "font-medium text-teal-primary"
                        : "text-text-muted hover:text-teal-primary"
                    }`}
                  >
                    {/* Titik kecil penanda halaman aktif di menu mobile —
                        pakai layoutId juga supaya bergeser naik/turun mulus
                        antar menu, konsisten dengan underline di desktop. */}
                    {active && (
                      <motion.span
                        layoutId="mobile-nav-dot"
                        className="size-1.5 rounded-full bg-teal-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {link.label}
                  </Link>
                </li>
              );
            })}
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
