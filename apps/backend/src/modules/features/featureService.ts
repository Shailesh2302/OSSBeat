import { getGithubAppToken } from "../../lib/github/getGithubAppToken";
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

    // console.log("---------------------", res.data.data.search.nodes);
    return res.data.data.search.nodes;
  } catch (error) {}
};

getIssuesFromTopRepos().then(console.log);
