"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "How do I get started with OSSBeat?",
    answer:
      "Click the Get Started button and sign in with your GitHub account. Once logged in, you can explore curated repos, issues, and track your contribution progress.",
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
  {
    question: "Does OSSBeat support Hacktoberfest?",
    answer:
      "Yes. The Hacktoberfest section highlights participating repositories with open issues ready for contributions during the event.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="section-padding bg-muted scroll-mt-24"
    >
      <div className="content-max">
        <div className="mb-12">
          <div className="newspaper-section-title mb-6">
            <span>Q &amp; A</span>
          </div>
          <h2 className="newspaper-headline text-3xl sm:text-4xl md:text-5xl text-center">
            Frequently asked questions
          </h2>
          <p className="newspaper-subhead text-center text-base mt-3 max-w-2xl mx-auto">
            Need help? Browse through the most common questions about OSSBeat.
          </p>
        </div>

        <hr className="newspaper-rule-thin mb-10" />

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = idx === openIndex;
            return (
              <div
                key={faq.question}
                className="border border-border bg-card"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left"
                >
                  <h3 className="font-semibold text-foreground pr-4">
                    {faq.question}
                  </h3>
                  <span
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                    className="text-muted-foreground shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <div
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.3s ease",
                  }}
                  className="grid"
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6">
                      <hr className="newspaper-rule-thin mb-4" />
                      <p className="newspaper-body text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
