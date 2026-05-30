"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Terminal, CheckCircle2, Sparkles } from "lucide-react";
import OpenSourceJourneyChart from "./OpenSourceJourneyChart";
import ScrollReveal from "@/components/animations/ScrollReveal";
import AnimatedCounter from "@/components/animations/AnimatedCounter";

const steps = [
  {
    icon: LayoutGrid,
    title: "Browse repos",
    description:
      "Search and filter projects by language, tags, and contribution friendliness.",
  },
  {
    icon: Terminal,
    title: "Pick issues",
    description:
      "Find interesting issues, claim work, and track progress in one place.",
  },
  {
    icon: CheckCircle2,
    title: "Track growth",
    description:
      "See your contribution history and unlocked milestones over time.",
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
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export default function Demo() {
  return (
    <motion.section
      id="demo"
      className="relative overflow-hidden py-24 scroll-mt-24 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={container}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" variants={item}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            See it in action
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            OSSBeat combines discovery, issue tracking, and milestones into one dashboard.
          </p>
        </motion.div>

        <ScrollReveal stagger={0.1}>
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <motion.div
              className="relative rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.55)] backdrop-blur"
              variants={item}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Dashboard preview
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      A mockup showing how progress and contributions come together.
                    </p>
                  </div>
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>

                <div className="rounded-3xl bg-background/60 p-6 border border-white/10">
                  <OpenSourceJourneyChart />
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-white/10 p-4 text-center">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Contributions
                      </p>
                      <p className="mt-1 text-2xl font-bold text-primary">
                        <AnimatedCounter to={128} />
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 text-center">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Projects
                      </p>
                      <p className="mt-1 text-2xl font-bold text-primary">
                        <AnimatedCounter to={9} />
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 text-center">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Mentors
                      </p>
                      <p className="mt-1 text-2xl font-bold text-primary">
                        <AnimatedCounter to={3} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.55)] backdrop-blur"
              variants={item}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-secondary/10 blur-2xl" />
              <h3 className="text-xl font-semibold text-foreground mb-6">
                How the workflow feels
              </h3>
              <div className="space-y-6">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground">
                          {step.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </motion.section>
  );
}
