/* ================= REPO SKELETON ================= */

export function RepoSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <RepoSkeletonCard key={i} />
      ))}
    </div>
  );
}

/* ================= SINGLE CARD ================= */

function RepoSkeletonCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 animate-pulse">
      <div className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="h-10 w-10 rounded-lg bg-white/10" />

          {/* Title + Owner */}
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 rounded bg-white/10" />
            <div className="h-3 w-1/3 rounded bg-white/10" />
          </div>
        </div>

        {/* Description */}
        <div className="mt-3 space-y-2">
          <div className="h-3 w-full rounded bg-white/10" />
          <div className="h-3 w-5/6 rounded bg-white/10" />
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          {/* Stars / Forks */}
          <div className="flex gap-3">
            <div className="h-3 w-10 rounded bg-white/10" />
            <div className="h-3 w-10 rounded bg-white/10" />
          </div>

          {/* Language pill */}
          <div className="h-4 w-16 rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}
