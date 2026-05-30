"use client";

import { useEffect, useRef } from "react";
import { GithubIcon } from "lucide-react";
import gsap from "gsap";
import OpenSourceJourneyChart from "./OpenSourceJourneyChart";
import RunningDog from "./RunningDog";
import { Button } from "@/components/ui/button";
import Navbar from "./Navbar";
import Link from "next/link";
import ThreeBackground from "@/components/animations/ThreeBackground";

export const HeroSection = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      titleRef.current?.children ?? [],
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, delay: 0.3 }
    )
    .fromTo(
      subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.4"
    )
    .fromTo(
      ctaRef.current,
      { y: 20, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6 },
      "-=0.3"
    )
    .fromTo(
      chartRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.2"
    );
  }, []);

  return (
    <section
      id="home"
      className="relative flex items-start justify-center min-h-screen overflow-hidden"
    >
      <ThreeBackground count={800} />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/95 from-30% via-foreground/80 via-50% to-background/95 to-75% pointer-events-none" />

      <Navbar />
      <main className="w-full relative z-10">
        <div className="flex flex-col pt-40 gap-5 justify-center items-center">
          <h1
            ref={titleRef}
            className="text-background text-4xl md:text-6xl lg:text-7xl font-extrabold text-center"
          >
            <span className="block">One Platform.</span>
            <span className="block">Every Open Source Opportunity.</span>
          </h1>

          <div ref={subtitleRef} className="px-10">
            <h5 className="text-background text-xl md:text-2xl lg:text-[22px] font-medium text-center">
              Discover suitable OSS repositories instantly, build strong
              fundamentals,
              <br />
              get expert mentorship for GSoC, and make meaningful contributions
              today.
            </h5>
          </div>
        </div>
        <div ref={ctaRef} className="flex justify-center items-center">
          <Button className="flex flex-row bg-secondary-100 mt-6 px-5 py-5 shadow-accent-100 md:text-md lg:text-lg text-foreground hover:bg-foreground-950 items-center">
            <Link
              href="/dashboard/home"
              className="flex justify-center items-center gap-2"
            >
              <GithubIcon />
              Get Started
            </Link>
          </Button>
        </div>
        <div ref={chartRef} className="lg:pt-75">
          <RunningDog />
          <OpenSourceJourneyChart />
        </div>
      </main>
    </section>
  );
};
