"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Search,
  TrendingUp,
  ShieldCheck,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Curated open source paths",
    description:
      "Get personalized recommendations based on your interests, experience level, and preferred languages.",
  },
  {
    icon: Search,
    title: "Easy issue discovery",
    description:
      "Filter by labels, difficulty, and mentor availability so you land on issues you can ship today.",
  },
  {
    icon: TrendingUp,
    title: "Track your progress",
    description:
      "Visualize growth and milestones with a dashboard that shows your contributions and impact.",
  },
  {
    icon: Users,
    title: "Community & mentorship",
    description:
      "Find mentors, join cohorts, and collaborate with contributors across projects.",
  },
  {
    icon: ShieldCheck,
    title: "Security & privacy",
    description:
      "We only access what you explicitly authorize. Your data stays safe and under your control.",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function Feature() {
  return (
    <motion.section
      id="features"
      className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
    >
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div className="text-center mb-14" variants={item}>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Features
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Built to help you build in public
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow a guided path, discover the right issues, and see your open source
            progress come to life.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={item}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.55)] backdrop-blur transition hover:shadow-[0_25px_70px_-25px_rgba(0,0,0,0.6)]"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
