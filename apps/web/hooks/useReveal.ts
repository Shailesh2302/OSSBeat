"use client";

import { useEffect, useRef, useState, useCallback, type RefObject } from "react";

export function useInView(
  ref: RefObject<Element | null>,
  options?: { once?: boolean; margin?: string },
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (options?.once !== false) observer.unobserve(el);
        } else if (options?.once !== true) {
          setInView(false);
        }
      },
      { rootMargin: options?.margin ?? "0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options?.once, options?.margin]);

  return inView;
}

export function useAnimateValue(from: number, to: number, play: boolean, duration = 2000) {
  const [value, setValue] = useState(from);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!play) return;

    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress); // easeOutQuad
      setValue(Math.round(from + (to - from) * eased));

      if (progress < 1) {
        raf.current = requestAnimationFrame(tick);
      }
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [play, from, to, duration]);

  return value;
}

export function useScrollReveal(options?: { once?: boolean; margin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, options);

  const style: React.CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
  };

  return { ref, inView, style };
}
