"use client";

import Image from "next/image";
import React from "react";
import type { GitHubRepo } from "@/types/featureTypes";

interface RepoCardProps {
  repo: GitHubRepo;
}

export function RepoCard({ repo }: RepoCardProps) {
  const topics = repo.repositoryTopics?.nodes?.map((n) => n.topic.name) ?? [];

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      className="block border border-border bg-card hover:bg-muted transition-colors"
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex gap-3 items-start">
          <Image
            src={repo.owner.avatarUrl}
            alt={repo.owner.login}
            width={40}
            height={40}
            className="object-cover"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold truncate">
              {repo.nameWithOwner}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {repo.owner.login}
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {repo.description ?? "No description provided."}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between text-xs border-t border-border">
          <div className="flex gap-3 text-muted-foreground">
            <span>★ {repo.stargazerCount.toLocaleString()}</span>
            <span>⑂ {repo.forkCount.toLocaleString()}</span>
          </div>
          {repo.primaryLanguage?.name && (
            <span className="text-[0.625rem] uppercase tracking-wider font-semibold">
              {repo.primaryLanguage.name}
            </span>
          )}
        </div>

        {topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="text-[0.5rem] uppercase tracking-widest border border-border px-1.5 py-0.5 text-muted-foreground"
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
