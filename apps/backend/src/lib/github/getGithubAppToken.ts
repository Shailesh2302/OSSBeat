import "dotenv/config";
import { createAppAuth } from "@octokit/auth-app";
import { config } from "dotenv";
config();



const rawKey = process.env.PRIVATE_KEY;
if (!rawKey) {
  throw new Error("PRIVATE_KEY is missing in environment variables");
}

const privateKey = rawKey.replace(/\\n/g, "\n");



let cachedToken: string | null = null;
let expiresAt = 0;

export async function getGithubAppToken() {
  if (cachedToken && Date.now() < expiresAt) {
    return cachedToken;
  }

  const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID!,
    privateKey,
    installationId: process.env.GITHUB_INSTALLATION_ID!,
  });

  const { token, expiresAt: exp } = await auth({ type: "installation" });

  cachedToken = token;
  expiresAt = new Date(exp).getTime();

  return token;
}
