"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Code, BarChart3, Sparkles, GitPullRequest, BookOpen } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart repository discovery",
    description: [
      "Browse thousands of active open-source projects filtered by programming language, star count, topics, and contribution friendliness. Our smart ranking surfaces projects that are actively welcoming new contributors, so you never waste time on stale repositories.",
      "Each project card shows key metrics at a glance — stars, fork count, open issues, and primary language — so you can make informed decisions about where to invest your time.",
      "Save your favorite repositories and get notified when new issues are posted that match your interests and skill level.",
    ],
  },
  {
    icon: Code,
    title: "Issue & contribution tracking",
    description: [
      "Track issues across all your projects from a single dashboard. Filter by difficulty label (good first issue, help wanted), language, and project to find work that matches your skills and goals.",
      "Mark issues you are interested in, track your progress through each contribution cycle, and maintain a complete history of your pull requests, commits, and merged work across every project you touch.",
      "Never lose track of where you left off — your dashboard automatically updates as you contribute, giving you a real-time view of your open source footprint.",
    ],
  },
  {
    icon: BarChart3,
    title: "GSoC & Hacktoberfest readiness",
    description: [
      "Discover repositories actively participating in Google Summer of Code and Hacktoberfest. Our dedicated sections surface projects that are actively seeking new contributors, with clear indicators of mentor availability and contribution guidelines.",
      "Each program has its own curated view. For GSoC, see project ideas, tech stacks, and past participant outcomes. For Hacktoberfest, filter by difficulty, topic, and prize eligibility.",
      "We track deadlines and milestones so you can plan your contribution journey around program timelines — from proposal writing to final submissions.",
    ],
  },
  {
    icon: Sparkles,
    title: "One dashboard to rule them all",
    description: [
      "A unified experience for browsing repositories, discovering issues, and managing your contributions — all from a single interface. No more juggling between GitHub tabs, project websites, and community forums.",
      "Your dashboard gives you a personalized feed of recommended projects based on your interests and contribution history. Track your growth with visual milestones, contribution counters, and an activity timeline.",
      "Whether you are managing five active pull requests or exploring your first open source project, the dashboard adapts to your workflow and keeps everything organized in one place.",
    ],
  },
];

const secondaryContent = [
  {
    icon: GitPullRequest,
    title: "From zero to first PR in under an hour",
    body: "Our guided onboarding walks you through every step: connecting your GitHub account, setting up your development environment, finding your first good-first-issue, and submitting your inaugural pull request. Most users go from signup to merged PR in less than 60 minutes.",
    steps: [
      "Connect your GitHub account",
      "Pick your first issue",
      "Track your contribution",
      "Celebrate your wins",
    ],
  },
  {
    icon: BookOpen,
    title: "Learn, contribute, grow",
    body: "Each project page includes curated learning resources, codebase walkthroughs, and community guidelines. We highlight repos with active mentorship programs and pair you with maintainers who are invested in helping new contributors succeed.",
    bullets: [
      "Personalized repo recommendations tailored to your skill level",
      "Issue tracking across projects with automatic updates",
      "Progress timeline and milestone badges to show your growth",
      "Community leaderboards and achievement system",
    ],
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <motion.section
      id="features"
      className="section-padding bg-background scroll-mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={container}
    >
      <div className="content-max">
        <motion.div variants={item} className="mb-12">
          <div className="newspaper-section-title mb-6">
            <span>Features</span>
          </div>
          <h2 className="newspaper-headline text-3xl sm:text-4xl md:text-5xl text-center">
            Built for contributors
          </h2>
          <p className="newspaper-subhead text-center text-base mt-3 max-w-2xl mx-auto">
            OSSBeat combines repository discovery, issue tracking, and contribution insights into a single workflow — so you can spend less time searching and more time contributing.
          </p>
        </motion.div>

        <hr className="newspaper-rule-thin mb-10" />

        {/* — Feature cards — */}
        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                variants={item}
                className="border border-border p-8 bg-card"
              >
                <div className="flex items-center gap-4 mb-5">
                  <span className="flex h-12 w-12 items-center justify-center bg-foreground text-background shrink-0">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="newspaper-headline text-xl">{feature.title}</h3>
                </div>
                <div className="space-y-3 newspaper-body text-muted-foreground text-sm">
                  {feature.description.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* — Secondary row — */}
        <hr className="newspaper-rule-double my-14" />

        <div className="grid gap-10 lg:grid-cols-2">
          {secondaryContent.map((section) => {
            const Icon = section.icon;
            return (
              <motion.article key={section.title} variants={item} className="border border-border p-8 bg-card">
                <div className="flex items-center gap-4 mb-5">
                  <span className="flex h-12 w-12 items-center justify-center bg-foreground text-background shrink-0">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="newspaper-headline text-xl">{section.title}</h3>
                </div>
                <p className="newspaper-body text-muted-foreground text-sm mb-6">
                  {section.body}
                </p>
                {"steps" in section ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {section.steps.map((step, i) => (
                      <div key={step} className="border border-border p-4 bg-background">
                        <p className="newspaper-byline text-[0.5rem] mb-1">Step {i + 1}</p>
                        <p className="text-sm font-semibold">{step}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {section.bullets.map((text) => (
                      <li key={text} className="flex items-start gap-3 newspaper-body text-muted-foreground text-sm">
                        <span className="mt-1.5 inline-flex h-1.5 w-1.5 bg-foreground shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
