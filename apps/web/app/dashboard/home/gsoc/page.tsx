"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold">GSoC Repositories</h1>
          <p className="mt-2 text-neutral-400 max-w-2xl">
            Browse repositories participating in Google Summer of Code (GSoC). 
            Find projects that are looking for contributors and start your open source journey!
          </p>
        </motion.div>

        {loading && <RepoSkeleton count={9} />}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-red-200 bg-red-500/10 border border-red-500/20 p-6 rounded-xl"
          >
            {error}
          </motion.div>
        )}

        {!loading && !error && repos.length === 0 && (
          <div className="text-center text-neutral-300">No GSoC repositories found.</div>
        )}

        {!loading && !error && repos.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {repos.map((repo, idx) => (
              <RepoCard key={repo.id} repo={repo} index={idx} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
