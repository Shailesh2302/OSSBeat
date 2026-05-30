"use client";

import { motion } from "framer-motion";

export function RepoSkeleton({ count = 9 }: { count?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.03 } },
      }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {Array.from({ length: count }).map((_, i) => (
        <RepoSkeletonCard key={i} index={i} />
      ))}
    </motion.div>
  );
}

function RepoSkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
      }}
      className="rounded-xl border border-white/10 bg-black/40 animate-pulse"
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/10" />

          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 rounded bg-white/10" />
            <div className="h-3 w-1/3 rounded bg-white/10" />
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="h-3 w-full rounded bg-white/10" />
          <div className="h-3 w-5/6 rounded bg-white/10" />
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex gap-3">
            <div className="h-3 w-10 rounded bg-white/10" />
            <div className="h-3 w-10 rounded bg-white/10" />
          </div>

          <div className="h-4 w-16 rounded bg-white/10" />
        </div>
      </div>
    </motion.div>
  );
}
