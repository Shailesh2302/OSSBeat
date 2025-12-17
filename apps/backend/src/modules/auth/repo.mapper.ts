import { UserRepo } from "../../types/githubType";

export function mapGithubRepo(repo: any, userId: string): UserRepo {
  return {
    github_repo_id: String(repo.id),

    owner_login: repo.owner.login,
    owner_id: repo.owner.id,
    owner_profile_url: repo.owner.html_url,

    name: repo.name,
    full_name: repo.full_name,
    html_url: repo.html_url,

    description: repo.description ?? null,
    primary_language: repo.language ?? null,

    stars_count: repo.stargazers_count ?? null,
    forks_count: repo.forks_count ?? null,
    open_issues_count: repo.open_issues_count ?? null,

    is_fork: repo.fork,
    is_private: repo.private,

    last_pushed_at: repo.pushed_at ? new Date(repo.pushed_at) : null,

    userId: userId,
  };
}
