"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github } from "lucide-react";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const About = () => {
  return (
    <motion.section
      id="about"
      className="relative py-20 bg-background scroll-mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={container}
    >
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute -top-24 -left-24 h-80 w-80 opacity-20"
          viewBox="0 0 450 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="225" cy="225" r="225" fill="url(#gradient)" />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#5b21b6" stopOpacity="0.35" />
              <stop stopColor="#06b6d4" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <motion.div variants={item}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Built for contributors, by contributors
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              OSSBeat is a lightweight platform that helps you discover open source
              projects, find issues that match your skill set, and track your
              progress over time. It brings together the most useful tools in one
              place so you can focus on building.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href="https://github.com/Shailesh2302/OSSBeat"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background shadow-sm hover:bg-primary/90 transition"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
              <a
                href="#demo"
                className="inline-flex items-center justify-center rounded-full border border-border bg-transparent px-6 py-3 text-sm font-semibold text-foreground shadow-sm hover:bg-card transition"
              >
                See a preview
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="relative rounded-3xl border border-border bg-card p-10 shadow-sm"
            whileHover={{ y: -6 }}
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <h3 className="text-xl font-semibold text-foreground mb-4">
              What you'll get
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                <span>Curated repository recommendations based on your interests.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                <span>Issue filtering and tracking for smoother contributions.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                <span>GSoC &amp; Hacktoberfest support with project discovery tools.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                <span>Progress insights so you can see your growth over time.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
