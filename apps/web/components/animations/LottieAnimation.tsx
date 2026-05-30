"use client";

import { useEffect, useRef } from "react";

interface LottieAnimationProps {
  src: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export default function LottieAnimation({
  src,
  className = "",
  loop = true,
  autoplay = true,
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animation: any;
    let lottie: any;

    async function loadLottie() {
      try {
        const lottieModule = await import("lottie-web");
        lottie = lottieModule.default;
        const response = await fetch(src);
        const animationData = await response.json();

        if (containerRef.current) {
          animation = lottie.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop,
            autoplay,
            animationData,
          });
        }
      } catch {
        // silently fail
      }
    }

    loadLottie();

    return () => {
      if (animation) {
        animation.destroy();
      }
    };
  }, [src, loop, autoplay]);

  return <div ref={containerRef} className={className} />;
}
