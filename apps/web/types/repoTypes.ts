export interface Repo {
  github_repo_id: string;
  full_name: string;
  html_url: string;
  description: string | null;
  primary_language: string | null;
  stars_count: number;
  forks_count: number;
  open_issues_count: number;
  last_pushed_at: string;
  topics: string[];
}
