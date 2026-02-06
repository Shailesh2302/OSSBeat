import axios from "axios";

export const findAllIssues = async (
  GITHUB_GRAPHQL_URL: string,
  query: string,
  GITHUB_TOKEN: string,
) => {
  const res = await axios.post(
    GITHUB_GRAPHQL_URL,
    { query },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    },
  );
  return res;
};
