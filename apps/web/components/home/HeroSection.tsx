"use client";

import { GithubIcon } from "lucide-react";
import OpenSourceJourneyChart from "./OpenSourceJourneyChart";
import RunningDog from "./RunningDog";
import { Button } from "@/components/ui/button";
import Navbar from "./Navbar";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="flex items-start justify-center min-h-screen bg-linear-to-b from-foreground from-30% via-gray-500 via-50% to-background to-75%"
    >
      <Navbar />
      <main className="w-full">
        <div className="flex flex-col pt-40 gap-5 justify-center items-center">
          <h1 className="text-background text-4xl text-shadow-2xs md:text-6xl lg:text-7xl font-extrabold text-center">
            <span className="block">One Platform.</span>
            <span className="block">Every Open Source Opportunity.</span>
          </h1>

          <div className="px-10">
            <h5 className="text-background text-xl md:text-2xl lg:text-[22px] font-medium text-center">
              Discover suitable OSS repositories instantly, build strong
              fundamentals,
              <br />
              get expert mentorship for GSoC, and make meaningful contributions
              today.
            </h5>
          </div>
        </div>
        <div className="flex justify-center items-center">
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
        <div className="lg:pt-75">
          <RunningDog />
          <OpenSourceJourneyChart />
        </div>
      </main>
    </section>
  );
};
