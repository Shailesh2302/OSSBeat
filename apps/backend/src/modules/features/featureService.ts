import axios from "axios";
import { getGithubAppToken } from "../../lib/github/getGithubAppToken";
import { AppError } from "../../utils/AppError";
import { findAllIssues } from "./featureRepository";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

const query = `
query TopReposWithLatestIssues {
  search(query: "stars:>5000", type: REPOSITORY, first: 1) {
   pageInfo {
        hasNextPage
        endCursor
      }
    nodes {
      ... on Repository {
        nameWithOwner
        stargazerCount
        issues(
          first: 5
          states: OPEN
          orderBy: { field: CREATED_AT, direction: DESC }
        ) {
          nodes {
            title
            url
            createdAt
            author {
              login
            }
          }
        }
      }
    }
  }
}
`;

export const getIssuesFromTopRepos = async () => {
  try {
    const GITHUB_TOKEN = await getGithubAppToken();

    const res = await findAllIssues(GITHUB_GRAPHQL_URL, query, GITHUB_TOKEN);

    if (res.data.errors) {
      throw new Error(JSON.stringify(res.data.errors));
    }

    return res.data.data.search.nodes;
  } catch (e) {
    console.log(e);
    throw new AppError("Internal Error", 401);
  }
};

export const getGsocReposGraphQL = async () => {
  try {
    const token = await getGithubAppToken();

    const query = `
      query GetGsocRepos($query: String!, $limit: Int!) {
        search(query: $query, type: REPOSITORY, first: $limit) {
          repositoryCount
          nodes {
            ... on Repository {
              id
              name
              nameWithOwner
              url
              description
              stargazerCount
              forkCount
              isFork
              pushedAt
              primaryLanguage {
                name
              }
              owner {
                login
                avatarUrl
              }
              repositoryTopics(first: 10) {
                nodes {
                  topic {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      query:
        "topic:gsoc OR topic:google-summer-of-code OR gsoc in:readme stars:>50 fork:false",
      limit: 50,
    };

    const res = await axios.post(
      "https://api.github.com/graphql",
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    if (res.data.errors) {
      console.error("GraphQL errors:", res.data.errors);
      throw new Error("GitHub GraphQL error");
    }

    return res.data.data.search.nodes;
  } catch (err: any) {
    console.error(err?.response?.data || err.message);
    throw new AppError("Failed to fetch GSoC repositories (GraphQL)", 500);
  }
};
