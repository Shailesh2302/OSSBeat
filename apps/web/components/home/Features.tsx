"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Code, Sparkles, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart repository discovery",
    description:
      "Find active open-source projects filtered by language, stars, topics, and contribution friendliness.",
  },
  {
    icon: Code,
    title: "Issue & contribution tracking",
    description:
      "Track issues, monitor your progress, and stay organized with your open-source contributions.",
  },
  {
    icon: BarChart3,
    title: "GSoC & Hacktoberfest readiness",
    description:
      "Discover repositories prepared for GSoC or Hacktoberfest and surface the best paths to contribute.",
  },
  {
    icon: Sparkles,
    title: "One dashboard to rule them all",
    description:
      "A unified experience for browsing repos, issues, and managing contributions in one place.",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <motion.section
      id="features"
      className="relative overflow-hidden py-24 bg-background scroll-mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={container}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-36 h-80 w-80 rounded-full bg-gradient-to-br from-primary/40 via-transparent to-secondary/30 blur-3xl" />
        <div className="absolute -bottom-28 -right-40 h-96 w-96 rounded-full bg-gradient-to-r from-secondary/30 via-transparent to-primary/40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" variants={item}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Features built for contributors
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            OSSBeat combines repository discovery, issue tracking, and contribution insights into a single workflow.
          </p>
        </motion.div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.45)] backdrop-blur transition hover:shadow-[0_25px_55px_-20px_rgba(0,0,0,0.55)]"
                variants={item}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-primary/10" />
                <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-secondary/10" />
                <div className="relative">
                  <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 text-primary mb-6">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <motion.div
            className="relative rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.6)] backdrop-blur"
            variants={item}
            whileHover={{ y: -6 }}
          >
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Fast onboarding
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Start contributing in minutes—not hours. We guide you through setup, repository selection, and your first pull request.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-background/60 p-4 border border-white/10">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Step 1
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  Connect your GitHub
                </p>
              </div>
              <div className="rounded-2xl bg-background/60 p-4 border border-white/10">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Step 2
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  Pick your first issue
                </p>
              </div>
              <div className="rounded-2xl bg-background/60 p-4 border border-white/10">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Step 3
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  Track your contribution
                </p>
              </div>
              <div className="rounded-2xl bg-background/60 p-4 border border-white/10">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Step 4
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  Celebrate your wins
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 p-10 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.6)] backdrop-blur"
            variants={item}
            whileHover={{ y: -6 }}
          >
            <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <h3 className="text-xl font-semibold text-foreground mb-4">What you’ll see</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                Personalized repo recommendations tailored to your skill level
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                Issue tracking across projects with automatic updates
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                Progress timeline and milestone badges to show your growth
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
