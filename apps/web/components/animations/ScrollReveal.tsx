"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  from?: "bottom" | "left" | "right" | "top" | "fade";
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = "",
  from = "bottom",
  delay = 0,
  duration = 0.8,
  stagger = 0,
  once = true,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const children = el.children;
    const targets = children.length > 0 ? children : el;

    const vars: gsap.TweenVars = {
      opacity: 0,
      duration,
      delay,
      ease: "power3.out",
    };

    switch (from) {
      case "bottom":
        vars.y = 40;
        break;
      case "top":
        vars.y = -40;
        break;
      case "left":
        vars.x = -40;
        break;
      case "right":
        vars.x = 40;
        break;
      case "fade":
        break;
    }

    const animVars: gsap.TweenVars = {
      ...vars,
      opacity: 1,
      y: 0,
      x: 0,
      stagger,
    };

    if (children.length > 1 && stagger) {
      animVars.stagger = stagger;
    }

    const tl = gsap.from(targets as gsap.TweenTarget, {
      ...animVars,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once,
      },
    });

    return () => {
      tl.kill();
    };
  }, [delay, duration, from, stagger, once]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
