"use client";

import Navbar from "@/components/dashboard/Navbar";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerRef = useRef<HTMLHeadElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(
      headerRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4 }
    ).fromTo(
      sidebarRef.current,
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5 },
      "-=0.2"
    ).fromTo(
      contentRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      "-=0.3"
    );
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground-50">
      <header
        ref={headerRef}
        className="h-14 border-b border-white/10 flex items-center px-6 shrink-0 bg-background/80 backdrop-blur-sm sticky top-0 z-30"
      >
        <span className="text-lg font-bold tracking-tight text-foreground">OSSBeat</span>
        <span className="ml-auto text-sm text-muted-foreground">Dashboard</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          ref={sidebarRef}
          className="w-64 border-r border-foreground-950 p-4 shrink-0 bg-background/50"
        >
          <Navbar />
        </aside>

        <main
          ref={contentRef}
          className="flex-1 p-6 overflow-y-auto"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
