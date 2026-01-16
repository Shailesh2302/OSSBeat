"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import OnButton from "../web/Button";
import OpenSourceJourneyChart from "./OpenSourceJourneyChart";
import RunningDog from "./RunningDog";

export const HeroSection = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
  };
  return (
    <section
      className="flex items-start justify-center min-h-screen
      bg-linear-to-b from-foreground from-30% via-gray-500 via-50% to-background to-75%"
    >
      <main className="w-full">
        <div className="flex flex-col pt-40 gap-6 justify-center items-center">
          <h1 className="text-background text-4xl  text-shadow-2xs md:text-5xl lg:text-6xl font-extrabold text-center">
            <span className="block">One Platform.</span>
            <span className="block">Every Open Source Opportunity.</span>
          </h1>

          <div className="px-10">
            <h5 className="text-background text-xl md:text-2xl lg:text-[22px] font-medium text-center">
              Discover suitable OSS repositories instantly, build strong
              fundamentals,
              <br />
              get expert mentorship for GSoC, and make meaningful contributions
              toda20
            </h5>
          </div>
        </div>
        <OnButton onSubmit={handleLogin} />
        <div className="pt-45">
        <RunningDog/>
      <OpenSourceJourneyChart />
      </div>
      </main>
    </section>
  );
};
