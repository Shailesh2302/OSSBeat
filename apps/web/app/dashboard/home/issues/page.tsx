"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
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
        </motion.div>

        <hr className="newspaper-rule-thin mb-8" />

        {loading && <RepoSkeleton count={6} />}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-border bg-card p-6 text-center text-muted-foreground"
          >
            {error}
          </motion.div>
        )}

        {!loading && !error && repos.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No issues found.
          </div>
        )}

        {!loading && !error && repos.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key="issues-grid"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {repos.map((repo, index) => (
                <motion.div
                  key={`${repo.nameWithOwner}-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="border border-border bg-card"
                >
                  <div className="p-6">
                    {/* — Repo header — */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-foreground flex items-center justify-center text-background text-xs font-bold">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {repo.nameWithOwner}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>★ {repo.stargazerCount.toLocaleString()}</span>
                          <span>·</span>
                          <span>{repo.issues.nodes.length} open issues</span>
                        </div>
                      </div>
                    </div>

                    {/* — Issues list — */}
                    {repo.issues.nodes.length > 0 ? (
                      <div className="space-y-2">
                        <p className="newspaper-byline text-[0.625rem] mb-3">
                          Latest Open Issues
                        </p>
                        {repo.issues.nodes.map((issue, idx) => (
                          <a
                            key={idx}
                            href={issue.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block p-3 border border-border bg-background hover:bg-muted transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs text-foreground line-clamp-2">
                                {issue.title}
                              </span>
                            </div>
                            <div className="mt-1.5 text-[0.625rem] text-muted-foreground uppercase tracking-wider">
                              {formatDate(issue.createdAt)}
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        No open issues found.
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
