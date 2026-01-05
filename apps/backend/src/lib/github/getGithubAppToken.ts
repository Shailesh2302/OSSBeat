import "dotenv/config";
import { createAppAuth } from "@octokit/auth-app";
// import fs from "fs";
// import path from "path";

// const privateKey = fs.readFileSync(
//   path.resolve(process.env.GITHUB_PRIVATE_KEY_PATH!),
//   "utf8"
// );

const privateKey = process.env.GITHUB_PRIVATE_KEY!.replace(/\\n/g, "\n");

console.log(
  process.env.GITHUB_APP_ID,
  process.env.GITHUB_INSTALLATION_ID,
  privateKey.startsWith("-----BEGIN RSA PRIVATE KEY-----")
);

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
