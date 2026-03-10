"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Twitter, Github, Linkedin } from "lucide-react";

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

export default function Contact() {
  return (
    <motion.section
      id="contact"
      className="relative py-20 bg-background scroll-mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={container}
    >
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" variants={item}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Get in touch
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Questions, feedback, or feature suggestions? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid gap-12 md:grid-cols-2">
          <motion.div
            className="rounded-3xl border border-border bg-card p-10 shadow-sm"
            variants={item}
            whileHover={{ y: -4 }}
          >
            <h3 className="text-xl font-semibold text-foreground mb-4">Reach us</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Email</p>
                  <p className="text-sm">hello@ossbeat.dev</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Location</p>
                  <p className="text-sm">Remote — Worldwide</p>
                </div>
              </li>
            </ul>

            <div className="mt-8">
              <h4 className="text-sm font-semibold text-foreground mb-3">Stay connected</h4>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background text-muted-foreground hover:bg-card hover:text-foreground transition"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background text-muted-foreground hover:bg-card hover:text-foreground transition"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background text-muted-foreground hover:bg-card hover:text-foreground transition"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-border bg-card p-10 shadow-sm"
            variants={item}
            whileHover={{ y: -4 }}
          >
            <h3 className="text-xl font-semibold text-foreground mb-4">Send a message</h3>
            <form className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-2 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-background shadow-sm hover:bg-primary/90 transition"
              >
                Send message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
