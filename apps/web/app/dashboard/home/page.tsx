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

  useEffect(() => {
    loadRepos(false);
  }, []);

  useEffect(() => {
    if (!hasNextPage) return;
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && !loading) {
          loadRepos(true);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, loading, cursor]);

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

  if (loading && repos.length === 0) {
    return (
      <div className="bg-background text-foreground">
        <div className="content-max px-6 py-10">
          <RepoSkeleton count={27} />
        </div>
      </div>
    );
  }

  if (error && repos.length === 0) {
    return (
      <div className="bg-background flex items-center justify-center p-12 text-foreground">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      <div className="content-max px-6 py-10">
        {/* — Header — */}
        <div className="mb-10">
          <div className="flex items-start justify-between gap-8 flex-wrap">
            <div className="flex-1 min-w-[280px]">
              <div className="flex items-center gap-4 mb-2">
                <span className="w-1 h-10 bg-foreground" />
                <h1 className="newspaper-headline text-4xl sm:text-5xl">
                  Top OSS
                </h1>
              </div>
              <p className="text-sm text-muted-foreground pl-5">
                Discover the most popular open source projects from around the
                world
              </p>

              {/* — Search — */}
              <div className="mt-5 pl-5">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search repositories..."
                  className="w-full h-11 px-4 border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            {/* — Filters — */}
            <div className="flex items-center gap-3 flex-wrap pt-2">
              <select
                value={filters.language}
                onChange={(e) =>
                  setFilters({ ...filters, language: e.target.value })
                }
                className="h-10 px-4 border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="all">All Languages</option>
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>

              <select
                value={filters.popularity}
                onChange={(e) =>
                  setFilters({ ...filters, popularity: e.target.value })
                }
                className="h-10 px-4 border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="all">All Popularity</option>
                <option value="stars">Most Stars</option>
                <option value="forks">Most Forks</option>
                <option value="updated">Recently Updated</option>
              </select>
            </div>
          </div>

          {/* — Topics — */}
          {majorTopics.length > 0 && (
            <div className="mt-8 pl-5">
              <p className="newspaper-byline text-[0.625rem] mb-3">
                Popular Topics
              </p>
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
                            : [...prev, topic],
                        )
                      }
                      className={`text-[0.625rem] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                        active
                          ? "bg-foreground text-background border-foreground"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground bg-card"
                      }`}
                    >
                      #{topic}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <hr className="newspaper-rule-thin mb-8" />

        {/* — Repo grid — */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map((r) => (
            <a
              key={r.github_repo_id}
              href={r.html_url}
              target="_blank"
              rel="noreferrer"
              className="block border border-border bg-card hover:bg-muted transition-colors"
            >
              <div className="p-5 flex flex-col h-full">
                <div className="flex gap-3 items-start">
                  <Image
                    src={r.owner_avatar_url}
                    alt={r.owner_login}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold truncate">
                      {r.full_name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {r.owner_login}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {r.description ?? "No description provided."}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between text-xs border-t border-border">
                  <div className="flex gap-3 text-muted-foreground">
                    <span>★ {r.stars_count.toLocaleString()}</span>
                    <span>⑂ {r.forks_count.toLocaleString()}</span>
                  </div>
                  {r.primary_language && (
                    <span className="text-[0.625rem] uppercase tracking-wider font-semibold">
                      {r.primary_language}
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* — Loading skeleton — */}
        {loading && hasNextPage && (
          <div className="mt-8">
            <RepoSkeleton count={SKELETON_COUNT} />
          </div>
        )}

        {hasNextPage && <div ref={loadMoreRef} className="h-1" />}
      </div>
    </div>
  );
}
