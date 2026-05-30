"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "@/components/animations/AnimatedCounter";

const stats = [
  { label: "Repositories Tracked", to: 12400, suffix: "+" },
  { label: "Contributors Onboarded", to: 5800, suffix: "+" },
  { label: "Open Issues Surfaced", to: 32000, suffix: "+" },
  { label: "GSoC Projects Listed", to: 240, suffix: "+" },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function StatsBar() {
  return (
    <motion.section
      className="section-padding bg-foreground text-background"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={container}
    >
      <div className="content-max">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              className="text-center"
            >
              <p className="newspaper-headline text-3xl sm:text-4xl md:text-5xl text-background">
                <AnimatedCounter to={stat.to} duration={2.5} />
                {stat.suffix}
              </p>
              <p className="text-xs uppercase tracking-widest text-background/70 mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
