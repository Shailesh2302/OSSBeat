"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAPI } from "../../../../lib/api";
import { Repo } from "../../../../types/repoTypes";

const MAJOR_TOPIC_LIMIT = 12;

export default function DiscoverPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    language: "all",
    minStars: 0,
    minForks: 0,
    minIssues: 0,
  });

  const [draft, setDraft] = useState(filters);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  /* ---------------- LOAD REPOS ---------------- */
  async function loadRepos(next = false) {
    setLoading(true);

    const res = await fetchAPI(
      `/repo/discover${next && cursor ? `?cursor=${cursor}` : ""}`
    );
    const data = await res.json();

    setRepos(next ? [...repos, ...data.repos] : data.repos);
    setCursor(data.nextCursor ?? null);
    setHasNextPage(data.hasNextPage);
    setLoading(false);
  }

  useEffect(() => {
    loadRepos(false);
  }, []);

  /* ---------------- MAJOR TOPICS ---------------- */
  const majorTopics = useMemo(() => {
    const counts: Record<string, number> = {};

    repos.forEach((repo) => {
      repo.topics?.forEach((topic) => {
        counts[topic] = (counts[topic] ?? 0) + 1;
      });
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // most used first
      .slice(0, MAJOR_TOPIC_LIMIT)
      .map(([topic]) => topic);
  }, [repos]);

  /* ---------------- LANGUAGES ---------------- */
  const languages = useMemo(() => {
    return Array.from(
      new Set(
        repos
          .map((r) => r.primary_language)
          .filter((l): l is string => Boolean(l))
      )
    ).sort();
  }, [repos]);

  /* ---------------- FILTERED REPOS ---------------- */
  const filteredRepos = useMemo(() => {
    return repos.filter((r) => {
      if (filters.language !== "all" && r.primary_language !== filters.language)
        return false;

      if (r.stars_count < filters.minStars) return false;
      if (r.forks_count < filters.minForks) return false;
      if (r.open_issues_count < filters.minIssues) return false;

      if (
        selectedTopics.length > 0 &&
        !selectedTopics.every((t) => r.topics?.includes(t))
      ) {
        return false;
      }

      return true;
    });
  }, [repos, filters, selectedTopics]);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Discover repositories</h1>
          <p className="text-sm text-white/50">
            Popular open source projects by topic
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="mb-6 space-y-3 bg-white/5 border border-white/10 rounded-lg px-3 py-3">
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={draft.language}
              onChange={(e) => setDraft({ ...draft, language: e.target.value })}
              className="h-9 rounded-md px-2 text-sm bg-black/40 border border-white/10"
            >
              <option value="all">All languages</option>
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Stars"
              value={draft.minStars || ""}
              onChange={(e) =>
                setDraft({ ...draft, minStars: Number(e.target.value || 0) })
              }
              className="h-9 w-24 rounded-md px-2 text-sm bg-black/40 border border-white/10"
            />

            <input
              type="number"
              placeholder="Forks"
              value={draft.minForks || ""}
              onChange={(e) =>
                setDraft({ ...draft, minForks: Number(e.target.value || 0) })
              }
              className="h-9 w-24 rounded-md px-2 text-sm bg-black/40 border border-white/10"
            />

            <input
              type="number"
              placeholder="Issues"
              value={draft.minIssues || ""}
              onChange={(e) =>
                setDraft({ ...draft, minIssues: Number(e.target.value || 0) })
              }
              className="h-9 w-24 rounded-md px-2 text-sm bg-black/40 border border-white/10"
            />

            <button
              onClick={() => setFilters(draft)}
              className="ml-auto h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-sm"
            >
              Apply
            </button>
          </div>

          {/* MAJOR TOPICS */}
          <div className="flex flex-wrap gap-2">
            {majorTopics.map((topic) => {
              const active = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() =>
                    setSelectedTopics((prev) =>
                      active
                        ? prev.filter((t) => t !== topic)
                        : [...prev, topic]
                    )
                  }
                  className={`px-2 py-1 text-xs rounded-md border transition ${
                    active
                      ? "bg-blue-600 border-blue-500"
                      : "bg-black/40 border-white/10 text-white/70 hover:bg-white/10"
                  }`}
                >
                  #{topic}
                </button>
              );
            })}
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-12 gap-3 text-xs text-white/50 border-b border-white/10 pb-2">
          <div className="col-span-5">Repository</div>
          <div className="col-span-2">Language</div>
          <div className="col-span-1">Stars</div>
          <div className="col-span-1">Forks</div>
          <div className="col-span-1">Issues</div>
          <div className="col-span-2">Updated</div>
        </div>

        {/* ROWS */}
        <div className="divide-y divide-white/5">
          {filteredRepos.map((r) => (
            <a
              key={r.github_repo_id}
              href={r.html_url}
              target="_blank"
              rel="noreferrer"
              className="grid grid-cols-12 gap-3 py-3 hover:bg-white/5 transition"
            >
              <div className="col-span-5">
                <div className="text-sm font-medium text-blue-400 truncate">
                  {r.full_name}
                </div>
                <div className="text-xs text-white/50 truncate">
                  {r.description ?? "No description"}
                </div>

                {/* TOPICS */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {r.topics?.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60"
                    >
                      #{t}
                    </span>
                  ))}
                  {r.topics && r.topics.length > 4 && (
                    <span className="text-[10px] text-white/40">
                      +{r.topics.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div className="col-span-2 text-sm">
                {r.primary_language ?? "—"}
              </div>

              <div className="col-span-1 text-sm">
                {r.stars_count.toLocaleString()}
              </div>

              <div className="col-span-1 text-sm">
                {r.forks_count.toLocaleString()}
              </div>

              <div className="col-span-1 text-sm">{r.open_issues_count}</div>

              <div className="col-span-2 text-xs text-white/50">
                {new Date(r.last_pushed_at).toLocaleDateString()}
              </div>
            </a>
          ))}
        </div>

        {/* LOAD MORE */}
        {hasNextPage && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => loadRepos(true)}
              disabled={loading}
              className="px-6 py-2 rounded-md bg-white/10 hover:bg-white/20 text-sm"
            >
              {loading ? "Loading…" : "Load more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
