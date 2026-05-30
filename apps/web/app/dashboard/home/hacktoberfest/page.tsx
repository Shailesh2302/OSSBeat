"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
              Hacktoberfest Repositories
            </h1>
          </div>
          <p className="text-sm text-muted-foreground pl-5 max-w-2xl">
            Browse repositories participating in Hacktoberfest with open issues
            ready for contributions.
          </p>
        </motion.div>

        <hr className="newspaper-rule-thin mb-8" />

        {loading && <RepoSkeleton count={9} />}

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
            No repositories found.
          </div>
        )}

        {!loading && !error && repos.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {repos.map((repo) => (
              <motion.div
                key={repo.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <RepoCard repo={repo} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
