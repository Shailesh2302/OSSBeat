export type GithubProfile = {
  github_id: string;
  email: string | null;
  username: string;
  avatar_url: string | null;
  display_name: string | null;
  profile_url : string | null;
};

export type UserRepo = {
  github_repo_id: string;

  owner_login: string;
  owner_id: number;
  owner_profile_url: string;

  name: string;
  full_name: string;
  html_url: string;

  description: string | null;
  primary_language: string | null;

  stars_count: number | null;
  forks_count: number | null;
  open_issues_count: number | null;

  is_fork: boolean;
  is_private: boolean;

  last_pushed_at: Date | null;

  userId: string;
};

export type UserRepos = UserRepo[];

