"use client";

import { useEffect, useState } from "react";
import { axiosAuthInstance } from "@/utils/axios-auth";

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

const LEVEL_COLORS = [
  "bg-muted",
  "bg-gray-300 dark:bg-gray-600",
  "bg-gray-400 dark:bg-gray-500",
  "bg-gray-600 dark:bg-gray-400",
  "bg-foreground",
];

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 7) return 2;
  if (count <= 15) return 3;
  return 4;
}

const DAY_LABELS: (string | null)[] = [
  null,
  "Mon",
  null,
  "Wed",
  null,
  "Fri",
  null,
];

export default function ContributionGraph() {
  const [data, setData] = useState<ContributionCalendar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res =
          await axiosAuthInstance.get<ContributionCalendar>(
            "/contributions/getContributions",
          );
        if (mounted) setData(res.data);
      } catch {
        // silent
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="border border-border bg-card p-8">
        <h3 className="newspaper-headline text-lg mb-4">Contribution Graph</h3>
        <div className="animate-pulse">
          <div className="h-[140px] bg-muted" />
        </div>
      </div>
    );
  }

  if (!data || !data.weeks || data.weeks.length === 0) {
    return null;
  }

  const { weeks, totalContributions } = data;

  const monthLabels: { name: string; startCol: number; span: number }[] = [];
  let currentMonth = "";
  weeks.forEach((week, i) => {
    const firstDay = week.contributionDays[0];
    if (!firstDay) return;
    const m = new Date(firstDay.date + "T00:00:00").toLocaleString("en-US", {
      month: "short",
    });
    if (m !== currentMonth) {
      monthLabels.push({ name: m, startCol: i, span: 1 });
      currentMonth = m;
    } else if (monthLabels.length > 0) {
      const last = monthLabels[monthLabels.length - 1];
      if (last) last.span++;
    }
  });

  const numWeeks = weeks.length;

  return (
    <div className="border border-border bg-card p-8">
      <h3 className="newspaper-headline text-lg mb-4">Contribution Graph</h3>

      {totalContributions > 0 && (
        <p className="text-xs text-muted-foreground mb-4">
          {totalContributions.toLocaleString()} contributions in the last year
        </p>
      )}

      <div className="overflow-x-auto pb-2">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `28px repeat(${numWeeks}, minmax(10px, 12px))`,
            gridTemplateRows: `20px repeat(7, minmax(10px, 12px))`,
            gap: "2px",
          }}
        >
          {/* Empty top-left */}
          <div style={{ gridColumn: 1, gridRow: 1 }} />

          {/* Month labels */}
          {monthLabels.map((m) => (
            <div
              key={m.name}
              className="text-[8px] text-muted-foreground font-semibold leading-none"
              style={{
                gridColumn: `${2 + m.startCol} / span ${m.span}`,
                gridRow: 1,
                alignSelf: "end",
              }}
            >
              {m.name}
            </div>
          ))}

          {/* Day labels */}
          {DAY_LABELS.map((label, i) => {
            const row = i + 2;
            return label ? (
              <div
                key={label}
                className="text-[8px] text-muted-foreground leading-none text-right pr-1.5"
                style={{
                  gridColumn: 1,
                  gridRow: row,
                  alignSelf: "center",
                }}
              >
                {label}
              </div>
            ) : (
              <div key={`empty-${i}`} style={{ gridColumn: 1, gridRow: row }} />
            );
          })}

          {/* Contribution cells */}
          {weeks.map((week, wi) =>
            week.contributionDays.map((day, di) => (
              <div
                key={`${wi}-${di}`}
                className={`rounded-none ${LEVEL_COLORS[getLevel(day.contributionCount)]}`}
                style={{ gridColumn: wi + 2, gridRow: di + 2 }}
                title={`${day.date}: ${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"}`}
              />
            )),
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-4">
        <span className="text-[10px] text-muted-foreground">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-[10px] h-[10px] rounded-none ${LEVEL_COLORS[level]}`}
          />
        ))}
        <span className="text-[10px] text-muted-foreground">More</span>
      </div>
    </div>
  );
}
