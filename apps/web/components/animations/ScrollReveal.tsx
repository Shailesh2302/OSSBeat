"use client";

import { type ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useReveal";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollReveal({
  children,
  className = "",
}: ScrollRevealProps) {
  const { ref, style } = useScrollReveal();

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
