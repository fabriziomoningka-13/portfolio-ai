"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("home");
  const { setOpen: setChatOpen } = useChatWidget();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const desktopNavRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [underline, setUnderline] = useState<{ left: number; width: number } | null>(
    null
  );

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function syncHashFromUrl() {
      const hash = window.location.hash.replace("#", "");
      setActiveHash(hash || "home");
    }
    syncHashFromUrl();
    window.addEventListener("hashchange", syncHashFromUrl);
    return () => window.removeEventListener("hashchange", syncHashFromUrl);
  }, [pathname]);

  // Link non-hash (About/Skills/Projects) sekarang dianggap aktif kalau
  // pathname SAMA PERSIS ATAU DIAWALI oleh href-nya + "/". Ini supaya link
  // "Projects" tetap menyala saat user berada di halaman DETAIL salah satu
  // project (misal "/projects/nama-project"), bukan cuma di "/projects"
  // persis. Sebelumnya pakai pathname === href (kecocokan persis saja),
  // sehingga underline hilang total begitu masuk ke halaman detail.
  function isLinkActive(href: string): boolean {
    if (href.includes("#")) {
      const hash = href.split("#")[1];
      return isHome && activeHash === hash;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  useLayoutEffect(() => {
    function measure() {
      const activeLink = links.find((l) => isLinkActive(l.href));
      if (!activeLink || !desktopNavRef.current) {
        setUnderline(null);
        return;
      }
      const linkEl = linkRefs.current[activeLink.href];
      if (!linkEl) {
        setUnderline(null);
        return;
      }
      const containerRect = desktopNavRef.current.getBoundingClientRect();
      const linkRect = linkEl.getBoundingClientRect();
      setUnderline({
        left: linkRect.left - containerRect.left,
        width: linkRect.width,
      });
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, activeHash]);

  function handleHashNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const targetId = href.split("#")[1];

    if (isHome) {
      e.preventDefault();
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const el = document.getElementById(targetId);

      if (el) {
        el.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      } else {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      }

      window.history.replaceState(null, "", `/#${targetId}`);
      setActiveHash(targetId);
    }

    setOpen(false);
  }

  function handleNavLinkClick() {
    setOpen(false);
  }

  return (
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
          onClick={(e) => handleHashNavClick(e, "/#home")}
          className="font-heading text-lg font-bold text-text-primary transition-opacity hover:opacity-80"
        >
          {profile.name}
        </Link>

        <ul ref={desktopNavRef} className="relative hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = isLinkActive(link.href);
            const isHashLink = link.href.includes("#");
            return (
              <li key={link.href}>
                <Link
                  ref={(el) => {
                    linkRefs.current[link.href] = el;
                  }}
                  href={link.href}
                  onClick={(e) =>
                    isHashLink
                      ? handleHashNavClick(e, link.href)
                      : handleNavLinkClick()
                  }
                  aria-current={active ? "page" : undefined}
                  className={`relative py-1 text-sm transition-colors duration-300 ${
                    active
                      ? "text-teal-primary"
                      : "text-text-muted hover:text-teal-primary"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}

          {underline && (
            <motion.span
              className="pointer-events-none absolute -bottom-[1px] h-[2px] rounded-full bg-teal-primary"
              animate={{ left: underline.left, width: underline.width }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
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
              const isHashLink = link.href.includes("#");
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(e) =>
                      isHashLink
                        ? handleHashNavClick(e, link.href)
                        : handleNavLinkClick()
                    }
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2 py-2 text-sm transition-colors duration-300 ${
                      active
                        ? "font-medium text-teal-primary"
                        : "text-text-muted hover:text-teal-primary"
                    }`}
                  >
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