"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current || !cardsRef.current) return;

    const cards = cardsRef.current.children;
    if (cards.length < 2) return;

    const totalWidth = cardsRef.current.scrollWidth;
    const viewWidth = scrollRef.current.offsetWidth;
    const maxScroll = -(totalWidth - viewWidth);

    const tl = gsap.to(cardsRef.current, {
      x: maxScroll,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 30%",
        end: "bottom 30%",
        scrub: 1.5,
      },
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <motion.section
      id="testimonials"
      ref={sectionRef}
      className="relative overflow-hidden py-24 scroll-mt-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={container}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" variants={cardMotion}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What our users say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from developers who used OSSBeat to kickstart their open source journey.
          </p>
        </motion.div>

        {/* Desktop horizontal scroll */}
        <div ref={scrollRef} className="hidden md:block overflow-hidden">
          <div
            ref={cardsRef}
            className="flex gap-8"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.55)] backdrop-blur transition hover:shadow-[0_25px_65px_-20px_rgba(0,0,0,0.6)] min-w-[380px] flex-1"
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
                <p className="mt-6 text-neutral-300 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile grid */}
        <div className="grid grid-cols-1 md:hidden gap-8">
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
              <p className="mt-6 text-neutral-300 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
