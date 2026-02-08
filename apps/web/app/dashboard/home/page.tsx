"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Repo } from "@/types/repoTypes";
import { axiosPublicInstance } from "@/utils/axios-public";
import { RepoSkeleton } from "@/components/skeleton/RepoSkeleton";

const MAJOR_TOPIC_LIMIT = 12;
const SKELETON_COUNT = 6;

export default function DiscoverPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    language: "all",
    popularity: "all",
  });

  const [search, setSearch] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /* ================= DATA FETCH ================= */

  async function loadRepos(next = false) {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const url =
        next && cursor ? `/repo/discover?cursor=${cursor}` : `/repo/discover`;

      const res = await axiosPublicInstance.get(url);
      const data = res.data ?? {};

      const incomingRepos: Repo[] = Array.isArray(data.repos) ? data.repos : [];

      setRepos((prev) => (next ? [...prev, ...incomingRepos] : incomingRepos));
      setCursor(typeof data.nextCursor === "string" ? data.nextCursor : null);
      setHasNextPage(Boolean(data.hasNextPage));
    } catch (err) {
      console.error("Failed to load repos:", err);
      setError("Failed to load repositories.");
      if (!next) setRepos([]);
    } finally {
      setLoading(false);
    }
  }

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    loadRepos(false);
  }, []);

  /* ================= INFINITE SCROLL ================= */

  useEffect(() => {
    if (!hasNextPage) return;

    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          loadRepos(true);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, loading, cursor]);

  /* ================= DERIVED DATA ================= */

  const majorTopics = useMemo(() => {
    if (!repos.length) return [];

    const counts: Record<string, number> = {};
    repos.forEach((r) => {
      r.topics?.forEach((t) => {
        counts[t] = (counts[t] ?? 0) + 1;
      });
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAJOR_TOPIC_LIMIT)
      .map(([t]) => t);
  }, [repos]);

  const languages = useMemo(() => {
    return Array.from(
      new Set(
        repos
          .map((r) => r.primary_language)
          .filter((l): l is string => Boolean(l)),
      ),
    ).sort();
  }, [repos]);

  const filteredRepos = useMemo(() => {
    let list = repos.filter((r) => {
      if (search && !r.full_name.toLowerCase().includes(search.toLowerCase()))
        return false;

      if (filters.language !== "all" && r.primary_language !== filters.language)
        return false;

      if (
        selectedTopics.length > 0 &&
        !selectedTopics.every((t) => r.topics?.includes(t))
      )
        return false;

      return true;
    });

    if (filters.popularity === "stars") {
      list = [...list].sort((a, b) => b.stars_count - a.stars_count);
    }
    if (filters.popularity === "forks") {
      list = [...list].sort((a, b) => b.forks_count - a.forks_count);
    }
    if (filters.popularity === "updated") {
      list = [...list].sort(
        (a, b) =>
          new Date(b.last_pushed_at).getTime() -
          new Date(a.last_pushed_at).getTime(),
      );
    }

    return list;
  }, [repos, search, filters, selectedTopics]);

  /* ================= INITIAL LOADING ================= */

  if (loading && repos.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <RepoSkeleton count={27} />
        </div>
      </div>
    );
  }

  if (error && repos.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        {error}
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neutral-100 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neutral-100 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* HEADER */}
        <div className="mb-14">
          <div className="flex items-start justify-between gap-8 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              {/* Title with elegant styling */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-1 h-12 bg-gradient-to-b from-neutral-100 to-neutral-600 rounded-full" />
                  <h1 className="text-6xl font-bold tracking-tight text-neutral-50">
                    Top OSS
                  </h1>
                </div>
                <p className="text-neutral-400 text-lg max-w-2xl pl-7">
                  Discover the most popular open source projects from around the
                  world
                </p>
              </div>

              {/* Enhanced search bar with milky accent */}
              <div className="relative mt-6 max-w-2xl group pl-7">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-100/10 to-neutral-100/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                <div className="relative flex items-center">
                  <div className="absolute left-4 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-neutral-500 group-hover:text-neutral-300 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search repositories..."
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-100/30 focus:bg-neutral-900/80 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Filters with refined styling */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <div className="relative group">
                <div className="absolute inset-0 bg-neutral-100/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <select
                  value={filters.language}
                  onChange={(e) =>
                    setFilters({ ...filters, language: e.target.value })
                  }
                  className="relative h-12 px-5 rounded-xl bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 text-sm text-neutral-200 hover:border-neutral-700 hover:bg-neutral-900/80 transition-all cursor-pointer focus:outline-none focus:border-neutral-100/30"
                >
                  <option value="all">All Languages</option>
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-neutral-100/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <select
                  value={filters.popularity}
                  onChange={(e) =>
                    setFilters({ ...filters, popularity: e.target.value })
                  }
                  className="relative h-12 px-5 rounded-xl bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 text-sm text-neutral-200 hover:border-neutral-700 hover:bg-neutral-900/80 transition-all cursor-pointer focus:outline-none focus:border-neutral-100/30"
                >
                  <option value="all">All Popularity</option>
                  <option value="stars">Most Stars</option>
                  <option value="forks">Most Forks</option>
                  <option value="updated">Recently Updated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* TOPICS with refined styling */}
        {majorTopics.length > 0 && (
          <div className="mb-12 pl-7">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neutral-100/20" />
              Popular Topics
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {majorTopics.map((topic) => {
                const active = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() =>
                      setSelectedTopics((prev) =>
                        active
                          ? prev.filter((t) => t !== topic)
                          : [...prev, topic],
                      )
                    }
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-neutral-100 text-neutral-950 shadow-lg shadow-neutral-100/10"
                        : "bg-neutral-900/40 border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200 hover:bg-neutral-900/60"
                    }`}
                  >
                    #{topic}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* GRID with premium cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map((r, idx) => (
            <a
              key={r.github_repo_id}
              href={r.html_url}
              target="_blank"
              rel="noreferrer"
              className="group relative rounded-2xl border border-neutral-800/50 bg-neutral-900/40 backdrop-blur-sm hover:bg-neutral-900/60 hover:border-neutral-700 transition-all duration-300 overflow-hidden"
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/0 via-neutral-100/0 to-neutral-100/0 group-hover:from-neutral-100/5 group-hover:via-neutral-100/3 group-hover:to-neutral-100/0 transition-all duration-500 pointer-events-none" />

              {/* Top edge highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative p-6 flex flex-col h-full">
                <div className="flex gap-4">
                  <div className="relative">
                    {/* Avatar glow effect */}
                    <div className="absolute inset-0 bg-neutral-100/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Image
                      src={r.owner_avatar_url}
                      alt={r.owner_login}
                      width={48}
                      height={48}
                      className="relative rounded-xl object-cover ring-1 ring-neutral-800 group-hover:ring-neutral-700 transition-all"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold truncate text-neutral-100 group-hover:text-white transition-colors">
                      {r.full_name}
                    </h3>
                    <p className="text-sm text-neutral-500 truncate">
                      {r.owner_login}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-neutral-400 line-clamp-2 leading-relaxed group-hover:text-neutral-300 transition-colors">
                  {r.description ?? "No description provided."}
                </p>

                <div className="mt-auto pt-5 flex items-center justify-between text-sm border-t border-neutral-800/50 group-hover:border-neutral-700/50 transition-colors">
                  <div className="flex gap-5 text-neutral-500 group-hover:text-neutral-400 transition-colors">
                    <span className="flex items-center gap-2">
                      <span className="text-base">⭐</span>
                      <span className="font-medium text-xs">
                        {r.stars_count.toLocaleString()}
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-base">🍴</span>
                      <span className="font-medium text-xs">
                        {r.forks_count.toLocaleString()}
                      </span>
                    </span>
                  </div>
                  {r.primary_language && (
                    <span className="px-3 py-1.5 rounded-lg bg-neutral-800/60 text-xs font-medium text-neutral-300 border border-neutral-700/50 group-hover:bg-neutral-800 group-hover:border-neutral-600 group-hover:text-neutral-100 transition-all">
                      {r.primary_language}
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* LOADING INDICATOR */}
        {loading && hasNextPage && (
          <div className="mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-neutral-800/50 bg-neutral-900/40 backdrop-blur-sm p-6 animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-800/80" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-4 bg-neutral-800/80 rounded-lg w-3/4" />
                      <div className="h-3 bg-neutral-800/60 rounded-lg w-1/2" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 bg-neutral-800/80 rounded-lg w-full" />
                    <div className="h-3 bg-neutral-800/60 rounded-lg w-5/6" />
                  </div>
                  <div className="mt-5 pt-5 border-t border-neutral-800/50 flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="h-3 bg-neutral-800/80 rounded-lg w-14" />
                      <div className="h-3 bg-neutral-800/80 rounded-lg w-14" />
                    </div>
                    <div className="h-7 bg-neutral-800/80 rounded-lg w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SENTINEL */}
        {hasNextPage && <div ref={loadMoreRef} className="h-1" />}
      </div>
    </div>
  );
}
