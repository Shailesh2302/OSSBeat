import { prisma } from "@repo/db";

export const fetchUserData = async (userId: string) => {
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      avatar_url: true,
      created_at: true,
      display_name: true,
      last_login_at: true,
      profile_url: true,
      username: true,
      show_profile: true,
      providers: {
        select: {
          provider: true,
          createdAt: true,
        },
      },
      repositories: {
        select: {
          id: true,
          name: true,
          full_name: true,
          html_url: true,
          description: true,
          primary_language: true,
          stars_count: true,
          forks_count: true,
          open_issues_count: true,
        },
        take: 10,
        orderBy: { last_pushed_at: "desc" },
      },
      userRepoStats: {
        select: {
          id: true,
          total_commits: true,
          total_prs: true,
          total_issues: true,
          last_updated_at: true,
          repo_id: true,
        },
      },
      _count: {
        select: {
          repositories: true,
          contributions: true,
          userRepoStats: true,
        },
      },
    },
  });

  if (!userData) return null;

  const { _count, userRepoStats, ...rest } = userData;
  const aggregatedStats = userRepoStats.reduce(
    (acc, s) => ({
      total_commits: acc.total_commits + s.total_commits,
      total_prs: acc.total_prs + s.total_prs,
      total_issues: acc.total_issues + s.total_issues,
    }),
    { total_commits: 0, total_prs: 0, total_issues: 0 },
  );
  return {
    ...rest,
    repo_count: _count.repositories,
    contribution_count: _count.contributions,
    user_repo_stats: userRepoStats,
    aggregated_stats: aggregatedStats,
  };
};

export const updateUserData = async (
  userId: string,
  data: { show_profile?: boolean },
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      show_profile: true,
    },
  });
};
