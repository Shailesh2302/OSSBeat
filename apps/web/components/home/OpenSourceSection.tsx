"use client";

import { useScrollReveal } from "@/hooks/useReveal";
import { Github, GitFork, Star, Users } from "lucide-react";

export default function OpenSourceSection() {
  const { ref, style } = useScrollReveal();

  return (
    <section
      className="section-padding bg-background"
      ref={ref}
      style={style}
    >
      <div className="content-max">
        <div className="max-w-3xl mx-auto text-center">
          <div className="newspaper-section-title mb-6">
            <span>Community</span>
          </div>
          <h2 className="newspaper-headline text-3xl sm:text-4xl text-center">
            Built in the open
          </h2>
          <p className="newspaper-body text-muted-foreground mt-4">
            OSSBeat itself is an open source project. We believe in the same
            principles we promote — transparency, collaboration, and community
            contribution. Every feature, fix, and improvement is developed in
            public on GitHub.
          </p>
        </div>

        <hr className="newspaper-rule-thin my-10" />

        <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            {
              icon: Star,
              label: "Star on GitHub",
              desc: "Show your support and help others discover OSSBeat.",
            },
            {
              icon: GitFork,
              label: "Fork & Contribute",
              desc: "Submit a PR, report an issue, or suggest a feature.",
            },
            {
              icon: Users,
              label: "Join the Community",
              desc: "Connect with contributors and maintainers.",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="text-center border border-border p-8 bg-card"
              >
                <span className="flex h-12 w-12 items-center justify-center bg-foreground text-background mx-auto mb-4">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-semibold text-sm mb-2">{card.label}</h3>
                <p className="newspaper-body text-xs text-muted-foreground">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://github.com/Shailesh2302/OSSBeat"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 text-sm uppercase tracking-widest font-semibold hover:bg-foreground/90 transition"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
