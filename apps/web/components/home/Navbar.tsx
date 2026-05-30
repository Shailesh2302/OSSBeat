"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import gsap from "gsap";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "demo", label: "Demo" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const scrolledState = window.scrollY > 16;
      setScrolled(scrolledState);

      const sections = NAV_LINKS.map((link) =>
        document.getElementById(link.id),
      ).filter(Boolean) as HTMLElement[];

      const current = sections
        .map((s) => ({
          id: s.id,
          top: s.getBoundingClientRect().top,
        }))
        .filter((s) => s.top <= 120)
        .sort((a, b) => b.top - a.top)[0];

      if (current?.id) setActiveId(current.id);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;

    if (scrolled) {
      gsap.to(navRef.current, {
        backdropFilter: "saturate(180%) blur(14px)",
        backgroundColor: "rgba(12, 13, 19, 0.72)",
        boxShadow: "0 10px 30px -12px rgba(0,0,0,0.35)",
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(navRef.current, {
        backdropFilter: "none",
        backgroundColor: "transparent",
        boxShadow: "0 0 transparent",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [scrolled]);

  useEffect(() => {
    if (!indicatorRef.current) return;
    gsap.fromTo(
      indicatorRef.current,
      { scale: 0.8, opacity: 0.5 },
      { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }
    );
  }, [activeId]);

  useEffect(() => {
    if (!isOpen) return;

    const onResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  const handleNavClick = useCallback((id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const linkItems = useMemo(
    () =>
      NAV_LINKS.map((link) => {
        const isActive = activeId === link.id;
        const baseText = scrolled ? "text-muted-foreground" : "text-background/80";
        const hoverText = scrolled ? "hover:text-foreground" : "hover:text-background";
        const bgActive = scrolled ? "bg-primary/10" : "bg-background/10";

        return (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`block rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 focus:ring-offset-background ${
              isActive
                ? `text-foreground ${bgActive}`
                : `${baseText} ${hoverText}`
            }`}
            onClick={() => handleNavClick(link.id)}
          >
            {link.label}
          </a>
        );
      }),
    [activeId, scrolled, handleNavClick],
  );

  return (
    <nav
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span
            ref={logoRef}
            className={`text-lg sm:text-xl font-bold tracking-tight transition-colors duration-200 ${
              scrolled ? "text-foreground" : "text-background"
            }`}
          >
            OSSBeat
          </span>
          <motion.span
            ref={indicatorRef}
            className="h-2 w-2 rounded-full bg-primary"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </Link>

        <div ref={linksRef} className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`relative text-sm font-medium transition-colors duration-200 ${
                  activeId === link.id
                    ? scrolled
                      ? "text-foreground"
                      : "text-background"
                    : scrolled
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-background/80 hover:text-background"
                }`}
                onClick={() => handleNavClick(link.id)}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 w-full rounded-full transition-all duration-200 ${
                    activeId === link.id
                      ? scrolled
                        ? "bg-primary"
                        : "bg-background"
                      : "bg-transparent"
                  }`}
                />
              </a>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          className={`inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/10 p-2 text-foreground hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-primary/60 md:hidden ${
            scrolled ? "text-foreground" : "text-background"
          }`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/70 backdrop-blur"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="relative flex h-full w-72 flex-col border-r border-white/10 bg-background/95 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">Menu</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="inline-flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-8 flex flex-1 flex-col gap-2">{linkItems}</nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
