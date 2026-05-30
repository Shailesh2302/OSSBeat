"use client";

import { useRef, useEffect } from "react";
import { animate } from "animejs";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 2000,
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView || !ref.current) return;

    const obj = { val: from };
    animate(obj, {
      val: to,
      duration,
      easing: "easeOutQuart",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = Math.round(obj.val).toLocaleString() + suffix;
        }
      },
    });
  }, [isInView, from, to, duration, suffix]);

  return (
    <span ref={ref} className={className}>
      {from}
    </span>
  );
}
