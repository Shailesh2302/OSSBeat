import { prisma } from "@repo/db";

export async function getStats() {
  const [repoCount, userCount, totalIssues, gsocCount, totalStars] =
    await Promise.all([
      prisma.repository.count(),
      prisma.user.count(),
      prisma.repository.aggregate({
        _sum: { open_issues_count: true },
      }),
      prisma.repository.count({
        where: { topics: { has: "gsoc" } },
      }),
      prisma.repository.aggregate({
        _sum: { stars_count: true },
      }),
    ]);

  return {
    repositories: repoCount,
    contributors: userCount,
    open_issues: totalIssues._sum.open_issues_count ?? 0,
    gsoc_projects: gsocCount,
    total_stars: totalStars._sum.stars_count ?? 0,
  };
}
