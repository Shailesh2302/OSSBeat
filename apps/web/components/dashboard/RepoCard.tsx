"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import type { GitHubRepo } from "@/types/featureTypes";
import { animate } from "animejs";

interface RepoCardProps {
  repo: GitHubRepo;
  index?: number;
}

export function RepoCard({ repo, index = 0 }: RepoCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const topics = repo.repositoryTopics?.nodes?.map((n) => n.topic.name) ?? [];

  useEffect(() => {
    if (!cardRef.current) return;
    animate(cardRef.current, {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: index * 60,
      duration: 500,
      easing: "easeOutQuart",
    });
  }, [index]);

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    animate(cardRef.current, {
      scale: 1.02,
      duration: 300,
      easing: "easeOutCubic",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    animate(cardRef.current, {
      scale: 1,
      duration: 300,
      easing: "easeOutCubic",
    });
  };

  return (
    <a
      ref={cardRef}
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl border border-neutral-800/50 bg-neutral-900/40 backdrop-blur-sm hover:bg-neutral-900/60 hover:border-neutral-700 transition-all duration-300 overflow-hidden"
      style={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-100/0 via-neutral-100/0 to-neutral-100/0 group-hover:from-neutral-100/5 group-hover:via-neutral-100/3 group-hover:to-neutral-100/0 transition-all duration-500 pointer-events-none" />
      <div className="p-6 flex flex-col h-full">
        <div className="flex gap-4 items-start">
          <div className="relative">
            <div className="absolute inset-0 bg-neutral-100/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image
              src={repo.owner.avatarUrl}
              alt={repo.owner.login}
              width={48}
              height={48}
              className="relative rounded-xl object-cover ring-1 ring-neutral-800 group-hover:ring-neutral-700 transition-all"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold truncate text-neutral-100 group-hover:text-white transition-colors">
              {repo.nameWithOwner}
            </h3>
            <p className="text-sm text-neutral-500 truncate">{repo.owner.login}</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-neutral-400 line-clamp-2 leading-relaxed group-hover:text-neutral-300 transition-colors">
          {repo.description ?? "No description provided."}
        </p>

        <div className="mt-auto pt-5 flex flex-wrap items-center justify-between text-sm border-t border-neutral-800/50 group-hover:border-neutral-700/50 transition-colors gap-2">
          <div className="flex gap-3 text-neutral-500 group-hover:text-neutral-400 transition-colors">
            <span className="flex items-center gap-2">
              <span className="text-base">⭐</span>
              <span className="font-medium text-xs">
                {repo.stargazerCount.toLocaleString()}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-base">🍴</span>
              <span className="font-medium text-xs">
                {repo.forkCount.toLocaleString()}
              </span>
            </span>
          </div>
          {repo.primaryLanguage?.name && (
            <span className="px-3 py-1.5 rounded-lg bg-neutral-800/60 text-xs font-medium text-neutral-300 border border-neutral-700/50 group-hover:bg-neutral-800 group-hover:border-neutral-600 group-hover:text-neutral-100 transition-all">
              {repo.primaryLanguage.name}
            </span>
          )}
        </div>

        {topics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {topics.slice(0, 6).map((topic) => (
              <span
                key={topic}
                className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 bg-neutral-800/50 px-2 py-1 rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
