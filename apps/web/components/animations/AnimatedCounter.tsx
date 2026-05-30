"use client";

import { useRef, useEffect, useState } from "react";
import { useInView, animate } from "framer-motion";

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
  duration = 2,
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayVal, setDisplayVal] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(from, to, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayVal(Math.round(latest)),
    });

    return () => controls.stop();
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {displayVal.toLocaleString()}{suffix}
    </span>
  );
}
