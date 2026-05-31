import { prisma } from "@repo/db";
import { decrypt } from "../../utils/crypto";
import axios from "axios";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

const CONTRIBUTIONS_QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export async function getContributions(
  userId: string,
  year: number,
): Promise<ContributionCalendar> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      providers: {
        where: { provider: "GITHUB" },
        select: { accessTokenEnc: true },
      },
    },
  });

  if (!user) {
    console.error("[contributions] User not found:", userId);
    return { totalContributions: 0, weeks: [] };
  }

  const githubLogin = user.display_name || user.username;
  if (!githubLogin) {
    console.error("[contributions] No GitHub login for user:", userId);
    return { totalContributions: 0, weeks: [] };
  }

  const provider = user.providers[0];
  if (!provider?.accessTokenEnc) {
    console.error("[contributions] No GitHub token for user:", userId);
    return { totalContributions: 0, weeks: [] };
  }

  let githubToken: string;
  try {
    githubToken = decrypt(provider.accessTokenEnc);
  } catch (err) {
    console.error("[contributions] Token decryption failed:", err);
    return { totalContributions: 0, weeks: [] };
  }

  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  try {
    const res = await axios.post<{ data: any; errors?: any }>(
      GITHUB_GRAPHQL_URL,
      {
        query: CONTRIBUTIONS_QUERY,
        variables: { login: githubLogin, from, to },
      },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    if (res.data.errors) {
      console.error("[contributions] GraphQL errors:", res.data.errors);
      return { totalContributions: 0, weeks: [] };
    }

    const graphqlUser = res.data.data?.user;
    if (!graphqlUser) {
      console.error("[contributions] GitHub user not found:", githubLogin);
      return { totalContributions: 0, weeks: [] };
    }

    return graphqlUser.contributionsCollection.contributionCalendar;
  } catch (err) {
    console.error("[contributions] GitHub API call failed:", err);
    return { totalContributions: 0, weeks: [] };
  }
}
