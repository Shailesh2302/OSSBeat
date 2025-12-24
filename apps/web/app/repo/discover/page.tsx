"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAPI } from "../../../lib/api";

interface Repository {
  id: string;
  name: string;
  nameWithOwner: string;
  url: string;
  description: string | null;
  pushedAt: string;
  stargazerCount: number;
  forkCount: number;
  issues: { totalCount: number };
  primaryLanguage: { name: string } | null;
  owner: { login: string };
}

const PER_PAGE = 100;

export default function DiscoverPage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  // Filters
  const [language, setLanguage] = useState("all");
  const [minStars, setMinStars] = useState(0);
  const [minForks, setMinForks] = useState(0);
  const [minIssues, setMinIssues] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        perPage: PER_PAGE.toString(),
      });

      const res = await fetchAPI(`/repo/discover?${params}`);
      const data = await res.json();

      setRepos(Array.isArray(data) ? data : (data.repos ?? []));
      setLoading(false);
    };

    load();
  }, [page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [language, minStars, minForks, minIssues]);

  // Extract languages
  const languages = useMemo(() => {
    const set = new Set<string>();
    repos.forEach(
      (r) => r.primaryLanguage?.name && set.add(r.primaryLanguage.name)
    );
    return Array.from(set).sort();
  }, [repos]);

  // Apply filters
  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      if (language !== "all" && repo.primaryLanguage?.name !== language)
        return false;
      if (repo.stargazerCount < minStars) return false;
      if (repo.forkCount < minForks) return false;
      if (repo.issues.totalCount < minIssues) return false;
      return true;
    });
  }, [repos, language, minStars, minForks, minIssues]);

  const hasNextPage = repos.length === PER_PAGE;

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Discover Repositories</h1>
          <p className="text-white/60">
            Page {page} · Showing {filteredRepos.length} repositories
          </p>
        </div>

        {/* Filters */}
        <div className="sticky top-0 z-10 bg-[#0b0f14] border border-white/10 rounded-lg p-4 mb-6 flex flex-wrap gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm"
          >
            <option value="all">All languages</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min stars"
            className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm w-32"
            value={minStars}
            onChange={(e) => setMinStars(Number(e.target.value))}
          />

          <input
            type="number"
            placeholder="Min forks"
            className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm w-32"
            value={minForks}
            onChange={(e) => setMinForks(Number(e.target.value))}
          />

          <input
            type="number"
            placeholder="Min issues"
            className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm w-32"
            value={minIssues}
            onChange={(e) => setMinIssues(Number(e.target.value))}
          />
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 text-xs text-white/50 border-b border-white/10 pb-2 mb-2">
          <div className="col-span-5">Repository</div>
          <div className="col-span-2">Language</div>
          <div className="col-span-1">Stars</div>
          <div className="col-span-1">Forks</div>
          <div className="col-span-1">Issues</div>
          <div className="col-span-2">Updated</div>
        </div>

        {/* Rows */}
        {loading ? (
          <p className="py-12 text-white/60">Loading…</p>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredRepos.map((repo) => (
              <a
                key={repo.id}
                href={repo.url}
                target="_blank"
                className="grid grid-cols-12 py-3 hover:bg-white/5 transition"
              >
                <div className="col-span-5">
                  <p className="font-medium truncate">{repo.nameWithOwner}</p>
                  <p className="text-xs text-white/50 truncate">
                    {repo.description ?? "No description"}
                  </p>
                </div>

                <div className="col-span-2">
                  {repo.primaryLanguage?.name ?? "—"}
                </div>

                <div className="col-span-1">{repo.stargazerCount}</div>
                <div className="col-span-1">{repo.forkCount}</div>
                <div className="col-span-1">{repo.issues.totalCount}</div>

                <div className="col-span-2 text-white/50 text-sm">
                  {new Date(repo.pushedAt).toLocaleDateString()}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 text-sm rounded border border-white/10 disabled:opacity-40"
          >
            ← Previous
          </button>

          <span className="text-sm text-white/60">Page {page}</span>

          <button
            disabled={!hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 text-sm rounded border border-white/10 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
