"use client";

import { useEffect, useState } from "react";
import { axiosPublicInstance } from "@/utils/axios-public";
import { GitHubRepo } from "@/types/featureTypes";
import { RepoSkeleton } from "@/components/skeleton/RepoSkeleton";
import { RepoCard } from "@/components/dashboard/RepoCard";

export default function GsocPage() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await axiosPublicInstance.get("/feature/getgsoc");
        setRepos(res.data ?? []);
      } catch (err) {
        console.error("Failed to load GSoC repos", err);
        setError("Unable to load GSoC repositories. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="bg-background text-foreground">
      <div className="content-max px-6 py-10">
        <div
          style={{ animation: "pageFadeIn 0.4s ease-out" }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-2">
            <span className="w-1 h-10 bg-foreground" />
            <h1 className="newspaper-headline text-3xl sm:text-4xl">
              GSoC Repositories
            </h1>
          </div>
          <p className="text-sm text-muted-foreground pl-5 max-w-2xl">
            Browse repositories participating in Google Summer of Code (GSoC).
            Find projects that are looking for contributors and start your open
            source journey!
          </p>
        </div>

        <hr className="newspaper-rule-thin mb-8" />

        {loading && <RepoSkeleton count={9} />}

        {error && (
          <div className="border border-border bg-card p-6 text-center text-muted-foreground">
            {error}
          </div>
        )}

        {!loading && !error && repos.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No GSoC repositories found.
          </div>
        )}

        {!loading && !error && repos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
