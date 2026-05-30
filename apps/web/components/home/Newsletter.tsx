"use client";

import { motion } from "framer-motion";

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function Newsletter() {
  return (
    <motion.section
      className="section-padding bg-muted"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
    >
      <div className="content-max">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div variants={item}>
            <div className="newspaper-section-title mb-6">
              <span>Stay Informed</span>
            </div>
            <h2 className="newspaper-headline text-3xl sm:text-4xl text-center">
              The Open Source Daily
            </h2>
            <p className="newspaper-body text-muted-foreground mt-4 max-w-lg mx-auto">
              Get weekly digests of trending repos, new GSoC opportunities, and
              tips for making your first contribution — delivered to your inbox.
            </p>
          </motion.div>

          <motion.form
            variants={item}
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              required
              className="flex-1 h-12 px-4 border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              type="submit"
              className="h-12 px-8 bg-foreground text-background text-sm uppercase tracking-widest font-semibold hover:bg-foreground/90 transition"
            >
              Subscribe
            </button>
          </motion.form>

          <motion.p
            variants={item}
            className="text-[0.625rem] text-muted-foreground mt-4"
          >
            No spam. Unsubscribe anytime.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}
