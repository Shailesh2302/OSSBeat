"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Navbar = () => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLSpanElement>(null);

  const items = [
    { href: "/dashboard/home", label: "Home" },
    { href: "/dashboard/home/hacktoberfest", label: "HacktoberFest" },
    { href: "/dashboard/home/issues", label: "Issues" },
    { href: "/dashboard/home/gsoc", label: "GSoC" },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const links = containerRef.current.children;
    gsap.fromTo(
      links,
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    if (!activeRef.current) return;
    gsap.fromTo(
      activeRef.current,
      { scale: 0.8 },
      { scale: 1, duration: 0.3, ease: "back.out(2)" }
    );
  }, [pathname]);

  return (
    <nav ref={containerRef} className="flex flex-col gap-3">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              group relative rounded-md p-[0.5px] transition-all duration-300
              ${
                isActive
                  ? "bg-[linear-gradient(90deg,rgba(255,255,255,0.6),rgba(255,255,255,0.9),rgba(255,255,255,0.6))]"
                  : "bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] hover:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)]"
              }
            `}
          >
            <span
              className={`
                flex items-center justify-center rounded-md px-3 py-2
                transition-all duration-300 text-center
                ${
                  isActive
                    ? "bg-background/95 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                    : "bg-background group-hover:bg-background/90 group-hover:shadow-[0_0_6px_rgba(255,255,255,0.15)]"
                }
              `}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
