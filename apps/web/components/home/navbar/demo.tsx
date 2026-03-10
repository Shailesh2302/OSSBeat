"use client";

import { motion } from "framer-motion";
import { BarChart2, Code2, Layers } from "lucide-react";
import OpenSourceJourneyChart from "../OpenSourceJourneyChart";

const steps = [
  {
    icon: Code2,
    title: "Browse curated repos",
    description:
      "See repositories handpicked for learning, GSoC, and friendly first issues.",
  },
  {
    icon: BarChart2,
    title: "Measure progress",
    description:
      "Track commits, PRs, and contributions over time with a clear dashboard.",
  },
  {
    icon: Layers,
    title: "Learn by doing",
    description:
      "Follow bite-sized guidance and code examples that help you ship faster.",
  },
];

export default function Demo() {
  return (
    <motion.section
      id="demo"
      className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5 }}
    >
      <div className="pointer-events-none absolute -top-24 left-1/3 h-64 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Interactive walkthrough
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Preview the dashboard experience
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              A clean dashboard gives you a clear path: find work, ship it, and
              measure how far you've come.
            </p>
          </div>

          <div className="mt-10 grid gap-5">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  className="group flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_30px_-18px_rgba(0,0,0,0.55)] backdrop-blur transition hover:shadow-[0_22px_50px_-22px_rgba(0,0,0,0.6)]"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-secondary/15" />
          <div className="relative rounded-3xl border border-white/10 bg-background/70 p-6 shadow-[0_35px_70px_-30px_rgba(0,0,0,0.65)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Dashboard preview
                </p>
                <h3 className="mt-1 text-xl font-semibold text-foreground">
                  Your open source overview
                </h3>
              </div>
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Beta
              </span>
            </div>

            <div className="mt-6">
              <OpenSourceJourneyChart />
            </div>

            <div className="mt-7 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white/5 p-4 text-center">
                <p className="text-sm font-semibold text-foreground">Contributions</p>
                <p className="mt-1 text-2xl font-bold text-primary">128</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 text-center">
                <p className="text-sm font-semibold text-foreground">Projects</p>
                <p className="mt-1 text-2xl font-bold text-primary">9</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 text-center">
                <p className="text-sm font-semibold text-foreground">Mentors</p>
                <p className="mt-1 text-2xl font-bold text-primary">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
