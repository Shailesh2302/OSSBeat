import axios from "axios";
import { getGithubAppToken } from "./getGithubAppToken";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export async function githubGraphqlRequest<T>(
  query: string,
  variables: Record<string, any>
  // accessToken: string
): Promise<T> {
  const token = await getGithubAppToken();
  const res = await axios.post(
    GITHUB_GRAPHQL_URL,
    { query, variables },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  console.log("response : ", res.data.data.search.nodes[0]);

  if (res.data.errors) {
    throw new Error(JSON.stringify(res.data.errors));
  }

  return res.data.data;
}
