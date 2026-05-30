"use client";

import React from "react";
import { GithubIcon, Star, GitCommit, Users } from "lucide-react";
import OpenSourceJourneyChart from "./OpenSourceJourneyChart";
import RunningDog from "./RunningDog";
import { Button } from "@/components/ui/button";
import Navbar from "./Navbar";
import Link from "next/link";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import { axiosPublicInstance } from "@/utils/axios-public";

interface Stats {
  repositories: number;
  contributors: number;
  total_stars: number;
}

export const HeroSection = () => {
  const [stats, setStats] = React.useState<Stats | null>(null);

  React.useEffect(() => {
    axiosPublicInstance
      .get<Stats>("/stats/getStats")
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  const socialStats = stats
    ? [
        { icon: Star, value: stats.total_stars, label: "GitHub Stars" },
        { icon: Users, value: stats.contributors, label: "Contributors" },
        { icon: GitCommit, value: stats.repositories, label: "Repos Tracked" },
      ]
    : [];

  return (
    <section id="home" className="relative bg-background">
      <Navbar />

      <div className="content-max section-padding !pt-44 md:!pt-52">
        {/* — Breaking Bar — */}
        <div className="flex items-center gap-3 justify-center mb-8 text-[0.625rem] uppercase tracking-widest">
          <span className="bg-foreground text-background px-3 py-1 font-bold">
            Latest
          </span>
          <span className="text-muted-foreground">
            GSoC 2025 organizations announced — 24 new projects added to OSSBeat
          </span>
        </div>

        {/* — Main headline — */}
        <div>
          <h1
            style={{ animation: "pageFadeIn 0.6s ease-out" }}
            className="newspaper-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center leading-[1.05]"
          >
            <span className="block">One Platform.</span>
            <span className="block">Every Open Source&nbsp;Opportunity.</span>
          </h1>

          <p
            style={{ animation: "pageFadeIn 0.6s ease-out 0.15s both" }}
            className="newspaper-subhead text-center text-lg sm:text-xl md:text-2xl mt-6 max-w-3xl mx-auto"
          >
            Discover suitable OSS repositories instantly, build strong
            fundamentals, get expert mentorship for GSoC, and make meaningful
            contributions today.
          </p>

          <div
            style={{ animation: "pageFadeIn 0.6s ease-out 0.3s both" }}
            className="flex justify-center mt-8"
          >
            <Button
              asChild
              className="rounded-none bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-sm uppercase tracking-widest font-semibold"
            >
              <Link
                href="/dashboard/home"
                className="flex items-center gap-3"
              >
                <GithubIcon className="h-4 w-4" />
                Get Started
              </Link>
            </Button>
          </div>
        </div>

        {/* — Social proof — */}
        <div className="flex items-center justify-center gap-8 mt-8 text-xs text-muted-foreground">
          {socialStats.length > 0
            ? socialStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <stat.icon className="h-3 w-3" />
                  <span className="font-semibold text-foreground">
                    <AnimatedCounter to={stat.value} />
                  </span>
                  <span>{stat.label}</span>
                </div>
              ))
            : null}
        </div>

        {/* — Rule + secondary content — */}
        <hr className="newspaper-rule-thick my-12" />

        <div className="grid md:grid-cols-5 gap-8">
          {/* — Main story body — */}
          <div className="md:col-span-3 space-y-6">
            <div className="newspaper-body newspaper-dropcap text-foreground/90">
              <p>
                OSSBeat is an open source discovery platform built for
                contributors at every level. Whether you are preparing for
                Google Summer of Code, looking for your first pull request, or
                searching for Hacktoberfest projects — OSSBeat brings together
                the tools you need in one unified dashboard.
              </p>
              <p className="mt-4">
                The platform surfaces repositories by language, popularity, and
                topic. Contributors can track issues across multiple projects,
                monitor their progress with visual timelines, and find mentorship
                opportunities across GSoC, Hacktoberfest, and beyond. Every tool
                is designed to reduce friction so you can focus on what matters
                — writing code and building community.
              </p>
            </div>

            {/* — Secondary story — */}
            <div className="border-l-2 border-foreground pl-4">
              <p className="newspaper-byline text-[0.625rem] mb-1">News in Brief</p>
              <h3 className="font-semibold text-sm">
                Hacktoberfest 2025 kicks off with 200+ participating repos
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                OSSBeat has curated a list of beginner-friendly issues across
                participating projects. Filter by difficulty, language, and topic
                to find your first contribution.
              </p>
            </div>

            <div className="border-l-2 border-foreground pl-4">
              <h3 className="font-semibold text-sm">
                New feature: Personalized repo recommendations
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Our recommendation engine now suggests repositories based on your
                contribution history, starred languages, and skill level.
              </p>
            </div>

            <RunningDog />
          </div>

          {/* — Sidebar — */}
          <div className="md:col-span-2 md:border-l border-border md:pl-8 space-y-6">
            <div>
              <div className="newspaper-section-title mb-4">
                <span>Chart</span>
              </div>
              <OpenSourceJourneyChart />
              <p className="text-[0.625rem] uppercase tracking-widest text-muted-foreground text-center mt-3">
                Contribution activity across tracked projects
              </p>
            </div>

            <div className="border border-border p-4 bg-card">
              <p className="newspaper-byline text-[0.5rem] mb-2">Events Calendar</p>
              <p className="text-xs text-muted-foreground italic">
                Upcoming events will appear here as they are announced. Check back soon.
              </p>
            </div>
          </div>
        </div>

        <hr className="newspaper-rule-double mt-12" />
      </div>
    </section>
  );
};
