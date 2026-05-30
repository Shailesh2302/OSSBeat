import { prisma } from "@repo/db";
import { githubGraphqlRequest } from "../../lib/github/githubGraphql";
import { mapGithubRepo } from "./mapGithubRepo";

const SEARCH_REPOS_QUERY = `
  query SearchRepos($query: String!, $first: Int!, $after: String) {
    search(query: $query, type: REPOSITORY, first: $first, after: $after) {
      repositoryCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ... on Repository {
          id
          name
          nameWithOwner
          url
          description
          pushedAt
          stargazerCount
          forkCount
          primaryLanguage { name }

          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }

          owner {
            login
            url
            avatarUrl 
          }

          issues(states: OPEN) {
            totalCount
          }
        }
      }
    }
  }
`;

function buildSearchQuery({
  language,
  minStars,
  minForks,
  minIssues,
  topic,
}: {
  language?: string;
  minStars?: number;
  minForks?: number;
  minIssues?: number;
  topic?: string;
}) {
  const parts: string[] = ["is:public", "archived:false"];

  if (minStars && minStars > 0) {
    parts.push(`stars:>=${minStars}`);
  } else {
    parts.push("stars:>=100");
  }

  if (language && language !== "all") {
    parts.push(`language:${language}`);
  }

  if (minForks && minForks > 0) {
    parts.push(`forks:>=${minForks}`);
  }

  if (minIssues && minIssues > 0) {
    parts.push(`issues:>=${minIssues}`);
  }

  if (topic && topic.trim().length > 0) {
    parts.push(`topic:${topic}`);
  }

  return parts.join(" ");
}

export async function discoverRepos(params: {
  perPage: number;
  cursor?: string | null;
  language?: string | undefined;
  minStars?: number;
  minForks?: number;
  minIssues?: number;
  topic?: string;
}) {
  const searchQuery = buildSearchQuery(params);

  const data = (await githubGraphqlRequest(SEARCH_REPOS_QUERY, {
    query: searchQuery,
    first: params.perPage,
    after: params.cursor ?? null,
  })) as {
    search: {
      nodes: any[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      repositoryCount: number;
    };
  };

  const repos = data.search.nodes.map(mapGithubRepo);

  return {
    repos,
    hasNextPage: data.search.pageInfo.hasNextPage,
    nextCursor: data.search.pageInfo.endCursor,
    totalCount: data.search.repositoryCount,
  };
}

async function upsertFromWebhookRepo(repo: any) {
  const topics: string[] = Array.isArray(repo.topics) ? repo.topics : [];

  await prisma.repository.upsert({
    where: { github_repo_id: String(repo.id) },
    update: {
      owner_login: repo.owner?.login ?? "",
      owner_id: repo.owner?.id ?? 0,
      owner_profile_url: repo.owner?.html_url ?? "",
      name: repo.name ?? "",
      full_name: repo.full_name ?? "",
      html_url: repo.html_url ?? "",
      description: repo.description ?? null,
      primary_language: repo.language ?? null,
      stars_count: repo.stargazers_count ?? 0,
      forks_count: repo.forks_count ?? 0,
      open_issues_count: repo.open_issues_count ?? 0,
      topics,
      is_fork: repo.fork ?? false,
      is_private: repo.private ?? false,
      last_pushed_at: repo.pushed_at ? new Date(repo.pushed_at) : null,
    },
    create: {
      github_repo_id: String(repo.id),
      owner_login: repo.owner?.login ?? "",
      owner_id: repo.owner?.id ?? 0,
      owner_profile_url: repo.owner?.html_url ?? "",
      name: repo.name ?? "",
      full_name: repo.full_name ?? "",
      html_url: repo.html_url ?? "",
      description: repo.description ?? null,
      primary_language: repo.language ?? null,
      stars_count: repo.stargazers_count ?? 0,
      forks_count: repo.forks_count ?? 0,
      open_issues_count: repo.open_issues_count ?? 0,
      topics,
      is_fork: repo.fork ?? false,
      is_private: repo.private ?? false,
      last_pushed_at: repo.pushed_at ? new Date(repo.pushed_at) : null,
    },
  });
}

export const repoService = {
  async upsertFromGithubWebhook(repo: any) {
    if (!repo || !repo.id) return;
    await upsertFromWebhookRepo(repo);
  },
  async updateLastPush(repoId: number, pushedAt: string) {
    await prisma.repository.updateMany({
      where: { github_repo_id: String(repoId) },
      data: { last_pushed_at: pushedAt ? new Date(pushedAt) : null },
    });
  },
};
