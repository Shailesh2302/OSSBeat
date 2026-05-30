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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0 },
      }}
      className="border border-border bg-card animate-pulse"
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex gap-3">
          <div className="h-10 w-10 bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted w-3/4" />
            <div className="h-3 bg-muted w-1/3" />
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="h-3 bg-muted w-full" />
          <div className="h-3 bg-muted w-5/6" />
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
          <div className="flex gap-3">
            <div className="h-3 bg-muted w-10" />
            <div className="h-3 bg-muted w-10" />
          </div>
          <div className="h-4 bg-muted w-16" />
        </div>
      </div>
    </motion.div>
  );
}
