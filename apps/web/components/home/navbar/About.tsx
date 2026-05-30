"use client";

import React from "react";
import { Github } from "lucide-react";

const About = () => {
  return (
    <section
      id="about"
      className="section-padding bg-background scroll-mt-24"
    >
      <div className="content-max">
        <div className="mb-12">
          <div className="newspaper-section-title mb-6">
            <span>About</span>
          </div>
          <h2 className="newspaper-headline text-3xl sm:text-4xl md:text-5xl text-center">
            Built for contributors, by contributors
          </h2>
        </div>

        <hr className="newspaper-rule-thin mb-10" />

        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="newspaper-body newspaper-dropcap text-foreground/90">
              <p>
                OSSBeat is a lightweight platform that helps you discover open
                source projects, find issues that match your skill set, and track
                your progress over time. It brings together the most useful tools
                in one place so you can focus on building.
              </p>
              <p className="mt-4">
                Our mission is to lower the barrier to entry for open source
                contributions. Whether you are a student preparing for GSoC, a
                developer looking to give back, or a maintainer seeking
                contributors — OSSBeat is designed for you.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://github.com/Shailesh2302/OSSBeat"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-none bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-foreground/90 transition"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
              <a
                href="#demo"
                className="inline-flex items-center rounded-none border border-border bg-transparent px-6 py-3 text-sm font-semibold text-foreground hover:bg-card transition"
              >
                See a preview
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 border border-border p-8 bg-card">
            <h3 className="newspaper-headline text-xl mb-6">
              What you&apos;ll get
            </h3>
            <ul className="space-y-4">
              {[
                "Curated repository recommendations based on your interests.",
                "Issue filtering and tracking for smoother contributions.",
                "GSoC & Hacktoberfest support with project discovery tools.",
                "Progress insights so you can see your growth over time.",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3 newspaper-body text-muted-foreground">
                  <span className="mt-1.5 inline-flex h-1.5 w-1.5 bg-foreground shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
