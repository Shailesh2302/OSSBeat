"use client";

import React from "react";
import { useScrollReveal } from "@/hooks/useReveal";
import { LayoutGrid, Terminal, CheckCircle2, Sparkles } from "lucide-react";
import OpenSourceJourneyChart from "./OpenSourceJourneyChart";
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

export default function Demo() {
  const { ref: sectionRef, style: sectionStyle } = useScrollReveal();

  return (
    <section
      id="demo"
      className="section-padding bg-muted scroll-mt-24"
      ref={sectionRef}
      style={sectionStyle}
    >
      <div className="content-max">
        <div className="mb-12">
          <div className="newspaper-section-title mb-6">
            <span>Demo</span>
          </div>
          <h2 className="newspaper-headline text-3xl sm:text-4xl md:text-5xl text-center">
            See it in action
          </h2>
          <p className="newspaper-subhead text-center text-base mt-3 max-w-2xl mx-auto">
            OSSBeat combines discovery, issue tracking, and milestones into one dashboard.
          </p>
        </div>

        <hr className="newspaper-rule-thin mb-10" />

        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <article className="border border-border p-8 bg-card">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="newspaper-headline text-xl">
                  Dashboard preview
                </h3>
                <p className="newspaper-body text-muted-foreground text-sm mt-1">
                  A mockup showing how progress and contributions come together.
                </p>
              </div>
              <Sparkles className="h-6 w-6 text-foreground" />
            </div>

            <div className="border border-border p-6 bg-background">
              <OpenSourceJourneyChart />
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { label: "Contributions", to: 128 },
                  { label: "Projects", to: 9 },
                  { label: "Mentors", to: 3 },
                ].map((stat) => (
                  <div key={stat.label} className="border border-border p-4 text-center bg-card">
                    <p className="newspaper-byline text-[0.625rem] mb-1">{stat.label}</p>
                    <p className="newspaper-headline text-2xl">
                      <AnimatedCounter to={stat.to} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="border border-border p-8 bg-card">
            <h3 className="newspaper-headline text-xl mb-6">
              How the workflow feels
            </h3>
            <div className="space-y-6">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex gap-4">
                    <span className="flex h-12 w-12 items-center justify-center bg-foreground text-background shrink-0">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="font-semibold text-foreground">{step.title}</h4>
                      <p className="newspaper-body text-muted-foreground text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
