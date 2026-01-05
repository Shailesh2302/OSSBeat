import axios from "axios";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export async function githubGraphqlRequest<T>(
  query: string,
  variables: Record<string, any>
  // accessToken: string
): Promise<T> {
  const res = await axios.post(
    GITHUB_GRAPHQL_URL,
    { query, variables },
    {
      headers: {
        // Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  console.log("*****************************************************");
  console.log("response : ", res.data.data.search.nodes[0]);
  console.log("****************************************************");

  if (res.data.errors) {
    throw new Error(JSON.stringify(res.data.errors));
  }

  return res.data.data;
}
