"use client";

import React from "react";

const testimonials = [
  {
    name: "Aditi Sharma",
    role: "Open Source Contributor",
    quote:
      "OSSBeat helped me find the perfect first issue and mentored me through my first PR. The dashboard makes tracking progress easy.",
  },
  {
    name: "Marcus Chen",
    role: "GSoC Applicant",
    quote:
      "I used OSSBeat to discover active GSoC projects and the graph made it simple to see what was trending.",
  },
  {
    name: "Lea Müller",
    role: "Mentor",
    quote:
      "The community features make it easy to mentor new contributors, and the roadmap keeps everyone aligned.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="section-padding bg-background scroll-mt-24"
    >
      <div className="content-max">
        <div className="mb-12">
          <div className="newspaper-section-title mb-6">
            <span>Opinion</span>
          </div>
          <h2 className="newspaper-headline text-3xl sm:text-4xl md:text-5xl text-center">
            What our users say
          </h2>
          <p className="newspaper-subhead text-center text-base mt-3 max-w-2xl mx-auto">
            Real stories from developers who used OSSBeat to kickstart their open source journey.
          </p>
        </div>

        <p className="text-[0.625rem] uppercase tracking-widest text-center text-muted-foreground mb-4">
          The following are illustrative profiles based on typical OSSBeat user experiences.
        </p>
        <hr className="newspaper-rule-thin mb-10" />

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="border border-border p-8 bg-card flex flex-col"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-10 w-10 items-center justify-center bg-foreground text-background text-sm font-bold">
                  {t.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <div className="newspaper-pullquote !border-t-0 !pt-0 !mt-0 text-left text-base flex-1">
                &ldquo;{t.quote}&rdquo;
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
