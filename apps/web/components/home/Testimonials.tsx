"use client";

import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Aditi",
    role: "Open Source Contributor",
    quote:
      "OSSBeat helped me find the perfect first issue and mentored me through my first PR. The dashboard makes tracking progress easy.",
  },
  {
    name: "Marcus",
    role: "GSoC Applicant",
    quote:
      "I used OSSBeat to discover active GSoC projects and the graph made it simple to see what was trending.",
  },
  {
    name: "Lea",
    role: "Mentor",
    quote:
      "The community features make it easy to mentor new contributors, and the roadmap keeps everyone aligned.",
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

const cardMotion = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

export default function Testimonials() {
  return (
    <motion.section
      id="testimonials"
      className="relative overflow-hidden py-24 scroll-mt-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={container}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div className="text-center mb-16" variants={cardMotion}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What our users say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from developers who used OSSBeat to kickstart their open source journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.55)] backdrop-blur transition hover:shadow-[0_25px_65px_-20px_rgba(0,0,0,0.6)]"
              variants={cardMotion}
              whileHover={{ y: -8 }}
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10" />
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {testimonial.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="mt-6 text-neutral-300 leading-relaxed">“{testimonial.quote}”</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
