"use client";

import { motion } from "framer-motion";
import { GithubIcon, Star, GitCommit, Users } from "lucide-react";
import OpenSourceJourneyChart from "./OpenSourceJourneyChart";
import RunningDog from "./RunningDog";
import { Button } from "@/components/ui/button";
import Navbar from "./Navbar";
import Link from "next/link";
import AnimatedCounter from "@/components/animations/AnimatedCounter";

const fadeUp = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export const HeroSection = () => {
  return (
    <section id="home" className="relative bg-background">
      <Navbar />

      <div className="content-max section-padding !pt-44 md:!pt-52">
        {/* — Breaking Bar — */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center gap-3 justify-center mb-8 text-[0.625rem] uppercase tracking-widest"
        >
          <span className="bg-foreground text-background px-3 py-1 font-bold">
            Latest
          </span>
          <span className="text-muted-foreground">
            GSoC 2025 organizations announced — 24 new projects added to OSSBeat
          </span>
        </motion.div>

        {/* — Main headline — */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
          }}
        >
          <motion.h1
            variants={fadeUp}
            className="newspaper-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center leading-[1.05]"
          >
            <span className="block">One Platform.</span>
            <span className="block">Every Open Source&nbsp;Opportunity.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="newspaper-subhead text-center text-lg sm:text-xl md:text-2xl mt-6 max-w-3xl mx-auto"
          >
            Discover suitable OSS repositories instantly, build strong
            fundamentals, get expert mentorship for GSoC, and make meaningful
            contributions today.
          </motion.p>

          <motion.div variants={fadeUp} className="flex justify-center mt-8">
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
          </motion.div>
        </motion.div>

        {/* — Social proof — */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex items-center justify-center gap-8 mt-8 text-xs text-muted-foreground"
        >
          {[
            { icon: Star, value: 128, label: "GitHub Stars" },
            { icon: Users, value: 5800, label: "Contributors" },
            { icon: GitCommit, value: 12400, label: "Repos Tracked" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <stat.icon className="h-3 w-3" />
              <span className="font-semibold text-foreground">
                <AnimatedCounter to={stat.value} />
              </span>
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.div>

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
              <p className="newspaper-byline text-[0.5rem] mb-2">Upcoming Events</p>
              <ul className="space-y-2 text-xs">
                {[
                  { date: "Jun 15", event: "GSoC contributor proposals due" },
                  { date: "Jun 20", event: "OSSBeat community hangout" },
                  { date: "Jul 1", event: "Hacktoberfest prep workshop" },
                ].map((ev) => (
                  <li key={ev.event} className="flex gap-2">
                    <span className="font-semibold shrink-0 w-14">{ev.date}</span>
                    <span className="text-muted-foreground">{ev.event}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="newspaper-rule-double mt-12" />
      </div>
    </section>
  );
};
