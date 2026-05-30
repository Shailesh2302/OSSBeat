"use client";

import { type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <div
      style={{
        animation: "pageFadeIn 0.4s ease-out",
      }}
    >
      {children}
    </div>
  );
}
