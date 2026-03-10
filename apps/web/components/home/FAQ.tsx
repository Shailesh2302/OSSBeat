"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I get started with OSSBeat?",
    answer:
      "Click the ‘Get Started’ button and sign in with your GitHub account. Once logged in, you can explore curated repos, issues, and track your contribution progress.",
  },
  {
    question: "What is the best way to find beginner-friendly issues?",
    answer:
      "Use the Issues dashboard to filter by keywords or browse curated project cards. We also highlight projects with open issues that are well-suited for first-time contributors.",
  },
  {
    question: "Can I use OSSBeat for Google Summer of Code?",
    answer:
      "Yes! The GSoC dashboard surfaces repositories that are tagged for GSoC and are actively seeking new contributors.",
  },
  {
    question: "Is my GitHub data stored securely?",
    answer:
      "We only store the information necessary to connect your account and track progress. You can log out anytime to revoke access.",
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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.section
      id="faq"
      className="relative overflow-hidden py-24 scroll-mt-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={container}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div className="text-center mb-16" variants={item}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Need help? Browse through the most common questions about OSSBeat.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, idx) => {
            const isOpen = idx === openIndex;
            return (
              <motion.div
                key={faq.question}
                variants={item}
                className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.65)] backdrop-blur"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-start justify-between gap-4 text-left"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {faq.answer.substring(0, 120)}...
                    </p>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-muted-foreground"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.span>
                </button>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 text-sm text-muted-foreground overflow-hidden"
                >
                  {faq.answer}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
