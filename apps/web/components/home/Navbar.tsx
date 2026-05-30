"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "demo", label: "Demo" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

function getTodayDate() {
  const d = new Date();
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);

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
    if (!isOpen) return;
    const onResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  const handleNavClick = useCallback((id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const linkItems = useMemo(
    () =>
      NAV_LINKS.map((link) => {
        const isActive = activeId === link.id;
        return (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`block px-4 py-2 text-sm font-medium tracking-wider uppercase transition-colors ${
              isActive
                ? "text-foreground bg-foreground/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleNavClick(link.id)}
          >
            {link.label}
          </a>
        );
      }),
    [activeId],
  );

  return (
    <>
      {/* — Full masthead — */}
      <motion.header
        animate={{
          opacity: scrolled ? 0 : 1,
          height: scrolled ? 0 : "auto",
          pointerEvents: scrolled ? "none" : "auto",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-x-0 top-0 z-50 overflow-hidden bg-background"
      >
        <div className="content-max section-padding !py-4">
          <div className="flex items-center justify-between text-[0.625rem] uppercase tracking-widest text-muted-foreground">
            <span>Volume I, No. 1</span>
            <span>{getTodayDate()}</span>
            <span className="hidden sm:block">Open Source Daily</span>
          </div>
          <hr className="newspaper-rule-thick my-2" />
          <h1 className="newspaper-headline text-5xl sm:text-6xl md:text-7xl text-center tracking-tight">
            <Link href="/">OSSBeat</Link>
          </h1>
          <hr className="newspaper-rule-thin my-2" />
          <nav className="hidden md:flex items-center justify-center gap-1">
            {linkItems}
          </nav>
          <hr className="newspaper-rule-thin mt-2" />
        </div>
      </motion.header>

      {/* — Compact scrolled bar — */}
      <motion.nav
        animate={{
          opacity: scrolled ? 1 : 0,
          y: scrolled ? 0 : -80,
          pointerEvents: scrolled ? "auto" : "none",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-x-0 top-0 z-50 bg-background border-b border-border"
      >
        <div className="content-max flex items-center justify-between px-4 h-12">
          <Link
            href="/"
            className="newspaper-headline text-xl tracking-tight text-foreground"
          >
            OSSBeat
          </Link>
          <div className="hidden md:flex items-center gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`text-[0.625rem] uppercase tracking-widest font-medium transition-colors ${
                  activeId === link.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => handleNavClick(link.id)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
            className="inline-flex items-center justify-center p-2 md:hidden text-foreground"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </motion.nav>

      {/* — Mobile drawer — */}
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
              className="absolute inset-0 bg-background/90 backdrop-blur"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="relative flex h-full w-64 flex-col border-r border-border bg-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="newspaper-headline text-lg">OSSBeat</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="p-1 text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <hr className="newspaper-rule-thin mb-4" />
              <nav className="flex flex-col gap-1">{linkItems}</nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
