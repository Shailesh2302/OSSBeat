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
    parts.push("stars:>=10");
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
  // console.log("parts : ", parts.join(" "));
  return parts.join(" ");
}

export async function discoverRepos(
  // githubAccessToken: string,
  params: {
    perPage: number;
    cursor?: string | null;
    language?: string | undefined;
    minStars?: number;
    minForks?: number;
    minIssues?: number;
    topic?: string;
  }
) {
  const searchQuery = buildSearchQuery(params);

  const data = (await githubGraphqlRequest(
    SEARCH_REPOS_QUERY,
    {
      query: searchQuery,
      first: params.perPage,
      after: params.cursor ?? null,
    },
    // githubAccessToken
  )) as {
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

export const repoService = {
  async upsertFromGithubWebhook(repo: any) {
    const owner = await prisma.repository.findUnique({
      where: { github_repo_id: repo.owner_id },
    });

    if (!owner) {
      // webhook for unknown user → ignore safely
      return;
    }

    const mapped = mapGithubRepo(owner.id);

    await prisma.repository.upsert({
      where: { github_repo_id: mapped.github_repo_id },
      update: mapped,
      create: mapped,
    });
  },
  async updateLastPush(repoId: number, pushedAt: string) {
    await prisma.repository.updateMany({
      where: { github_repo_id: repoId.toString() },
      data: { last_pushed_at: pushedAt ? new Date(pushedAt) : null },
    });
  },
};
