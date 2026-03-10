export interface GitHubRepoTopic {
  topic: {
    name: string;
  };
}

export interface GitHubRepoOwner {
  login: string;
  avatarUrl: string;
}

export interface GitHubRepo {
  id: string;
  name: string;
  nameWithOwner: string;
  url: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  isFork: boolean;
  pushedAt: string;
  primaryLanguage: { name: string } | null;
  owner: GitHubRepoOwner;
  repositoryTopics: {
    nodes: GitHubRepoTopic[];
  };
}

export interface GitHubIssue {
  title: string;
  url: string;
  createdAt: string;
  author: {
    login: string;
  };
}

export interface GitHubRepoWithIssues {
  nameWithOwner: string;
  stargazerCount: number;
  issues: {
    nodes: GitHubIssue[];
  };
}
