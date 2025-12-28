export function mapGithubRepo(repo: any) {
  return {
    github_repo_id: repo.id,
    owner_login: repo.owner.login,
    owner_id: Number(repo.owner.id),
    owner_profile_url: repo.owner.url,

    name: repo.name,
    full_name: repo.nameWithOwner,
    html_url: repo.url,

    description: repo.description,
    primary_language: repo.primaryLanguage?.name ?? null,

    stars_count: repo.stargazerCount,
    forks_count: repo.forkCount,
    open_issues_count: repo.issues.totalCount,

    is_fork: repo.isFork,
    is_private: repo.isPrivate,

    topics:
      repo.repositoryTopics?.nodes.map(
        (n: { topic: { name: string } }) => n.topic.name
      ) ?? [],

    last_pushed_at: repo.pushedAt,
  };
}

interface Topic {
  name: string | undefined;
}
