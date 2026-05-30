import { prisma } from "@repo/db";

export interface RepoFilter {
  language?: string;
  minStars?: number;
  minForks?: number;
  topic?: string;
  cursor?: string;
  perPage?: number;
}

export async function findRepos(filter: RepoFilter) {
  const where: any = {};

  if (filter.language && filter.language !== "all") {
    where.primary_language = filter.language;
  }

  if (filter.minStars && filter.minStars > 0) {
    where.stars_count = { gte: filter.minStars };
  }

  if (filter.minForks && filter.minForks > 0) {
    where.forks_count = { gte: filter.minForks };
  }

  if (filter.topic) {
    where.topics = { has: filter.topic };
  }

  return prisma.repository.findMany({
    where,
    orderBy: { stars_count: "desc" },
    take: filter.perPage ?? 50,
    skip: filter.cursor ? 1 : 0,
    ...(filter.cursor ? { cursor: { id: filter.cursor } } : {}),
  });
}

export async function findRepoByGithubId(githubRepoId: string) {
  return prisma.repository.findUnique({
    where: { github_repo_id: githubRepoId },
  });
}

export async function findReposByUserId(userId: string) {
  return prisma.repository.findMany({
    where: { userId },
    orderBy: { last_pushed_at: "desc" },
  });
}
