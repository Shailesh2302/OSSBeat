export interface UserProvider {
  provider: string;
  createdAt: string;
}

export interface UserRepo {
  id: string;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  primary_language: string | null;
  stars_count: number;
  forks_count: number;
  open_issues_count: number;
}

export interface UserRepoStat {
  id: string;
  total_commits: number;
  total_prs: number;
  total_issues: number;
  last_updated_at: string;
  repo_id: string;
}

export interface AggregatedStats {
  total_commits: number;
  total_prs: number;
  total_issues: number;
}

export interface UserProfile {
  id: string;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  display_name: string | null;
  last_login_at: string | null;
  profile_url: string | null;
  username: string;
  show_profile: boolean;
  providers: UserProvider[];
  repositories: UserRepo[];
  repo_count: number;
  contribution_count: number;
  user_repo_stats: UserRepoStat[];
  aggregated_stats: AggregatedStats;
}
