"use client";

import { useEffect, useState } from "react";
import { axiosPublicInstance } from "@/utils/axios-public";
import { GitHubRepoWithIssues } from "@/types/featureTypes";
import { RepoSkeleton } from "@/components/skeleton/RepoSkeleton";

export default function IssuesPage() {
  const [repos, setRepos] = useState<GitHubRepoWithIssues[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await axiosPublicInstance.get("/feature/getissues");
        setRepos(res.data ?? []);
      } catch (err) {
        console.error("Failed to load issues", err);
        setError("Unable to load issues. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

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
              Open Issues
            </h1>
          </div>
          <p className="text-sm text-muted-foreground pl-5 max-w-2xl">
            Browse open issues from top repositories with 500+ stars. Find
            issues that need contributions and start contributing today!
          </p>
        </div>

        <hr className="newspaper-rule-thin mb-8" />

        {loading && <RepoSkeleton count={6} />}

        {error && (
          <div className="border border-border bg-card p-6 text-center text-muted-foreground">
            {error}
          </div>
        )}

        {!loading && !error && repos.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No open issues found.
          </div>
        )}

        {!loading && !error && repos.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo, idx) => {
              const nodes = repo.issues?.nodes ?? [];
              return (
                <div
                  key={repo.nameWithOwner + idx}
                  className="border border-border bg-card p-6 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center bg-foreground text-background text-[0.5rem] font-bold shrink-0">
                      {repo.nameWithOwner?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold truncate">
                        {repo.nameWithOwner}
                      </h3>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    {nodes.slice(0, 5).map((issue) => (
                      <a
                        key={issue.url}
                        href={issue.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block border border-border p-3 hover:bg-muted transition-colors"
                      >
                        <p className="text-xs font-semibold line-clamp-2 leading-relaxed">
                          {issue.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[0.625rem] text-muted-foreground">
                          <span>{formatDate(issue.createdAt)}</span>
                        </div>
                      </a>
                    ))}
                  </div>

                  {nodes.length > 5 && (
                    <p className="text-[0.625rem] text-muted-foreground text-center mt-3">
                      +{nodes.length - 5} more issues
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
