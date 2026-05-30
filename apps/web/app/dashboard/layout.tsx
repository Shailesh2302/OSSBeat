"use client";

import Navbar from "@/components/dashboard/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header
        style={{ animation: "pageFadeIn 0.3s ease-out" }}
        className="border-b border-border bg-card"
      >
        <div className="content-max flex items-center justify-between h-12 px-4">
          <span className="newspaper-headline text-lg tracking-tight">OSSBeat</span>
          <span className="text-[0.625rem] uppercase tracking-widest text-muted-foreground">
            Dashboard
          </span>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          style={{ animation: "pageFadeIn 0.3s ease-out 0.1s both" }}
          className="w-56 shrink-0 border-r border-border bg-card p-4 hidden md:block"
        >
          <Navbar />
        </aside>

        <main
          style={{ animation: "pageFadeIn 0.3s ease-out 0.15s both" }}
          className="flex-1 overflow-y-auto"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
