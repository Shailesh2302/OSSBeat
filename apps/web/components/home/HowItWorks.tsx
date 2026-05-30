"use client";

import { motion } from "framer-motion";
import { Github, Search, GitPullRequest, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Github,
    title: "Connect your GitHub",
    body: "Sign in with your GitHub account in one click. OSSBeat reads your public profile, repositories, and contribution history to build a personalized experience. We only access what you authorize, and you can revoke access anytime.",
    details: [
      "One-click OAuth sign in",
      "Read-only access by default",
      "Full data control and portability",
    ],
  },
  {
    number: "02",
    icon: Search,
    title: "Discover your next project",
    body: "Browse curated repositories filtered by language, topics, popularity, and program eligibility (GSoC, Hacktoberfest). Each project card shows key metrics, open issues, and contribution friendliness so you can pick the right fit.",
    details: [
      "Filter by language, stars, topics",
      "GSoC and Hacktoberfest tags",
      "Beginner-friendly issue markers",
    ],
  },
  {
    number: "03",
    icon: GitPullRequest,
    title: "Pick issues and contribute",
    body: "Find open issues that match your skill level and interests. Track your progress across projects, submit pull requests, and watch your contribution graph grow. OSSBeat keeps everything synced automatically.",
    details: [
      "Difficulty-labeled issues",
      "Cross-project progress tracking",
      "Automatic contribution sync",
    ],
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Track your growth",
    body: "Monitor your open source journey with visual dashboards, milestone badges, and contribution statistics. See how your skills develop over time and celebrate your achievements with the community.",
    details: [
      "Visual contribution timeline",
      "Milestone and achievement badges",
      "Community leaderboards",
    ],
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function HowItWorks() {
  return (
    <motion.section
      className="section-padding bg-muted"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={container}
    >
      <div className="content-max">
        <motion.div variants={item} className="mb-12">
          <div className="newspaper-section-title mb-6">
            <span>How It Works</span>
          </div>
          <h2 className="newspaper-headline text-3xl sm:text-4xl md:text-5xl text-center">
            From signup to contribution in four steps
          </h2>
          <p className="newspaper-subhead text-center text-base mt-3 max-w-2xl mx-auto">
            OSSBeat streamlines the open source contribution process so you can focus on what matters — writing great code and building community.
          </p>
        </motion.div>

        <hr className="newspaper-rule-thin mb-10" />

        <div className="relative">
          {/* — Vertical connecting line — */}
          <div className="absolute left-[1.375rem] top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={item}
                  className="relative md:flex gap-8 items-start"
                >
                  {/* — Number + icon — */}
                  <div className="flex md:flex-col items-center gap-4 md:w-20 shrink-0">
                    <span className="flex h-11 w-11 items-center justify-center bg-foreground text-background relative z-10">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="newspaper-headline text-2xl hidden md:block">
                      {step.number}
                    </span>
                  </div>

                  {/* — Content — */}
                  <div className="flex-1 border border-border bg-card p-8 md:ml-0 ml-16">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="newspaper-headline text-xl">{step.title}</h3>
                      {idx < steps.length - 1 && (
                        <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                      )}
                    </div>
                    <p className="newspaper-body text-muted-foreground text-sm mb-4">
                      {step.body}
                    </p>
                    <div className="grid sm:grid-cols-3 gap-2">
                      {step.details.map((detail) => (
                        <div
                          key={detail}
                          className="border border-border bg-background px-3 py-2 text-xs"
                        >
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
