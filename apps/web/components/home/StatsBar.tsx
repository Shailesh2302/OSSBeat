"use client";

import { useEffect, useState } from "react";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import { axiosPublicInstance } from "@/utils/axios-public";

interface Stats {
  repositories: number;
  contributors: number;
  open_issues: number;
  gsoc_projects: number;
  total_stars: number;
}

export default function StatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    axiosPublicInstance
      .get<Stats>("/stats/getStats")
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  const items = stats
    ? [
        { label: "Repositories Tracked", to: stats.repositories, suffix: "+" },
        { label: "Contributors Onboarded", to: stats.contributors, suffix: "+" },
        { label: "Open Issues Surfaced", to: stats.open_issues, suffix: "+" },
        { label: "GSoC Projects Listed", to: stats.gsoc_projects, suffix: "+" },
      ]
    : [];

  if (!stats) return null;

  return (
    <section className="section-padding bg-foreground text-background">
      <div className="content-max">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {items.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="newspaper-headline text-3xl sm:text-4xl md:text-5xl text-background">
                <AnimatedCounter to={stat.to} duration={2.5} />
                {stat.suffix}
              </p>
              <p className="text-xs uppercase tracking-widest text-background/70 mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
