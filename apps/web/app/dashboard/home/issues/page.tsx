"use client";

import { useEffect, useState } from "react";
import { axiosPublicInstance } from "@/utils/axios-public";
import { GitHubRepoWithIssues } from "@/types/featureTypes";
import { RepoSkeleton } from "@/components/skeleton/RepoSkeleton";
import Image from "next/image";

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
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Open Issues</h1>
          <p className="mt-2 text-neutral-400 max-w-2xl">
            Browse open issues from top repositories with 500+ stars. 
            Find issues that need contributions and start contributing today!
          </p>
        </div>

        {loading && <RepoSkeleton count={6} />}

        {error && (
          <div className="text-center text-red-200 bg-red-500/10 border border-red-500/20 p-6 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && repos.length === 0 && (
          <div className="text-center text-neutral-300">No issues found.</div>
        )}

        {!loading && !error && repos.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {repos.map((repo, index) => (
              <div
                key={`${repo.nameWithOwner}-${index}`}
                className="group relative rounded-2xl border border-neutral-800/50 bg-neutral-900/40 backdrop-blur-sm hover:bg-neutral-900/60 hover:border-neutral-700 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/0 via-neutral-100/0 to-neutral-100/0 group-hover:from-neutral-100/5 group-hover:via-neutral-100/3 group-hover:to-neutral-100/0 transition-all duration-500 pointer-events-none" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center">
                        <svg className="w-5 h-5 text-neutral-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-100 group-hover:text-white transition-colors">
                          {repo.nameWithOwner}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <span>⭐</span>
                            <span>{repo.stargazerCount.toLocaleString()}</span>
                          </span>
                          <span className="text-neutral-600">•</span>
                          <span className="flex items-center gap-1">
                            <span>📂</span>
                            <span>{repo.issues.nodes.length} open issues</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                      Latest Open Issues
                    </h4>
                    {repo.issues.nodes.length > 0 ? (
                      <div className="space-y-2">
                        {repo.issues.nodes.map((issue, idx) => (
                          <a
                            key={idx}
                            href={issue.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block p-3 rounded-xl bg-neutral-800/30 hover:bg-neutral-800/60 border border-neutral-800/50 hover:border-neutral-700 transition-all duration-200 group/issue"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <svg className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                                  <circle cx="12" cy="12" r="3"/>
                                </svg>
                                <span className="text-sm text-neutral-300 group-hover/issue:text-white transition-colors line-clamp-2">
                                  {issue.title}
                                </span>
                              </div>
                              <svg className="w-4 h-4 text-neutral-600 flex-shrink-0 group-hover/issue:text-neutral-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                            <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
                              <span className="flex items-center gap-1">
                                {/* <span>@{issue.author.login}</span> */}
                              </span>
                              <span className="text-neutral-600">•</span>
                              <span>{formatDate(issue.createdAt)}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-neutral-500 italic">
                        No open issues found.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

