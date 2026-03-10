"use client";

import { useEffect, useState } from "react";
import { axiosPublicInstance } from "@/utils/axios-public";
import { GitHubRepo } from "@/types/featureTypes";
import { RepoSkeleton } from "@/components/skeleton/RepoSkeleton";
import { RepoCard } from "@/components/dashboard/RepoCard";

export default function HacktoberfestPage() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await axiosPublicInstance.get("/feature/gethack");
        setRepos(res.data ?? []);
      } catch (err) {
        console.error("Failed to load Hacktoberfest repos", err);
        setError("Unable to load Hacktoberfest repositories. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Hacktoberfest Repositories</h1>
          <p className="mt-2 text-neutral-400 max-w-2xl">
            Browse repositories participating in Hacktoberfest with open issues ready for contributions.
          </p>
        </div>

        {loading && <RepoSkeleton count={9} />}

        {error && (
          <div className="text-center text-red-200 bg-red-500/10 border border-red-500/20 p-6 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && repos.length === 0 && (
          <div className="text-center text-neutral-300">No repositories found.</div>
        )}

        {!loading && !error && repos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
