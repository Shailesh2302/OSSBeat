// src/modules/auth/auth.service.ts
import "dotenv/config";

import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "@repo/db";
import { generateState } from "arctic";
import { github } from "../../lib/oauth/github";
import { assertEnv } from "../../config/env";
import { GithubProfile, UserRepos } from "../../types/githubType";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { mapGithubRepo } from "./repo.mapper";

/* ---------------------------
 * Validate required env vars
 * -------------------------- */
const { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } = process.env;

assertEnv("JWT_ACCESS_TOKEN_SECRET", JWT_ACCESS_TOKEN_SECRET);
assertEnv("JWT_REFRESH_TOKEN_SECRET", JWT_REFRESH_TOKEN_SECRET);

/* ----------------------------------------
 * Step 1: Redirect URL to GitHub
 ---------------------------------------- */
export function generateGithubAuthUrl() {
  const state = generateState();
  const scopes = ["read:user", "user:email"];
  const url = github.createAuthorizationURL(state, scopes);
  return { url, state };
}

/* ----------------------------------------
 * Step 2: GitHub Callback → Token exchange
 ---------------------------------------- */
export async function exchangeGithubCodeForToken(
  code: string
): Promise<string> {
  try {
    const tokens = await github.validateAuthorizationCode(code);
    return tokens.accessToken(); // your Arctic version
  } catch {
    throw new Error("GitHub OAuth token exchange failed");
  }
}

/* ----------------------------------------
 * Step 3: Get GitHub user profile
 ---------------------------------------- */
export async function fetchGithubUser(
  githubAccessToken: string
): Promise<GithubProfile> {
  const userResp = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${githubAccessToken}` },
  });

  const emailsResp = await axios.get("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${githubAccessToken}` },
  });

  const primaryEmail =
    (Array.isArray(emailsResp.data)
      ? emailsResp.data.find((e: any) => e.primary)?.email
      : null) ?? null;

  const user = userResp.data;

  return {
    github_id: String(user.id),
    email: primaryEmail,
    username: user.name ?? user.login,
    avatar_url: user.avatar_url ?? null,
  };
}

export async function fetchUserRepos(
  githubAccessToken: string
): Promise<UserRepos> {
  const userRepos = await axios.get("https://api.github.com/user/repos", {
    headers: {
      Authorization: `Bearer ${githubAccessToken}`,
      Accept: "application/vnd.github+json",
    },
    params: {
      per_page: 100,
      sort: "updated",
    },
  });

  return userRepos.data;
}

export async function upsertRepos(data: UserRepos) {
  for (const repo of data) {
    await prisma.repository.upsert({
      where: {
        github_repo_id: repo.github_repo_id,
      },
      update: {
        owner_login: repo.owner_login,
        owner_id: repo.owner_id,
        owner_profile_url: repo.owner_profile_url,

        name: repo.name,
        full_name: repo.full_name,
        html_url: repo.html_url,
        description: repo.description,
        primary_language: repo.primary_language,
        stars_count: repo.stars_count,
        forks_count: repo.forks_count,
        open_issues_count: repo.open_issues_count,
        is_fork: repo.is_fork,
        is_private: repo.is_private,
        last_pushed_at: repo.last_pushed_at,

        userId: repo.userId,
      },
      create: {
        github_repo_id: repo.github_repo_id,

        owner_login: repo.owner_login,
        owner_id: repo.owner_id,
        owner_profile_url: repo.owner_profile_url,

        name: repo.name,
        full_name: repo.full_name,
        html_url: repo.html_url,
        description: repo.description,
        primary_language: repo.primary_language,
        stars_count: repo.stars_count,
        forks_count: repo.forks_count,
        open_issues_count: repo.open_issues_count,
        is_fork: repo.is_fork,
        is_private: repo.is_private,
        last_pushed_at: repo.last_pushed_at,

        userId: repo.userId,
      },
    });
  }
}

/* ----------------------------------------
 * Step 4: Upsert user
 ---------------------------------------- */
export async function upsertUser(data: GithubProfile) {
  const provider = await prisma.provider.findUnique({
    where: {
      provider_providerUserId: {
        provider: "GITHUB",
        providerUserId: data.github_id,
      },
    },
    include: { user: true },
  });

  if (provider) {
    return prisma.user.update({
      where: { id: provider.userId },
      data: {
        email: data.email,
        username: data.username,
        avatar_url: data.avatar_url ?? undefined,
        last_login_at: new Date(),
      },
    });
  }

  return prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      avatar_url: data.avatar_url ?? undefined,
      last_login_at: new Date(),
      providers: {
        create: {
          provider: "GITHUB",
          providerUserId: data.github_id,
        },
      },
    },
  });
}

export async function issueTokensForUser(userId: string) {
  const accessToken = signAccessToken({ sub: userId });
  const refreshToken = signRefreshToken({ sub: userId });

  await storeRefreshToken(userId, refreshToken);

  return { accessToken, refreshToken };
}

/* ----------------------------------------
 * Refresh token storage (hashed)
 ---------------------------------------- */
export async function storeRefreshToken(userId: string, token: string) {
  const hashed = await bcrypt.hash(token, 10);

  return prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashed,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });
}

export async function validateRefreshToken(userId: string, token: string) {
  const list = await prisma.refreshToken.findMany({ where: { userId } });

  for (const entry of list) {
    const ok = await bcrypt.compare(token, entry.tokenHash);
    if (ok) return entry;
  }
  return null;
}

export async function deleteRefreshToken(id: string) {
  return prisma.refreshToken.delete({ where: { id } });
}

/* ----------------------------------------
 * Refresh endpoint logic
 ---------------------------------------- */
export async function refreshTokens(refreshToken: string) {
  const payload: any = jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET!);

  const entry = await validateRefreshToken(payload.sub, refreshToken);
  if (!entry) throw new Error("Invalid refresh token");

  await deleteRefreshToken(entry.id);

  const newAccess = signAccessToken({ sub: payload.sub });
  const newRefresh = signRefreshToken({ sub: payload.sub });

  await storeRefreshToken(payload.sub, newRefresh);

  return { accessToken: newAccess, refreshToken: newRefresh };
}

/* ----------------------------------------
 * Get user from access token
 ---------------------------------------- */
export async function getUserFromAccessToken(token: string) {
  const payload: any = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET!);

  return prisma.user.findUnique({
    where: { id: payload.sub },
  });
}



export async function upsertUserAndRepoToDB(
  ghUser: GithubProfile,
  githubAccessToken: string
) {
  try {
    const user = await upsertUser(ghUser);
    const githubRepos = await fetchUserRepos(githubAccessToken);
    const mappedRepos = githubRepos.map((repo) => mapGithubRepo(repo, user.id));
    const upsertRepoToDB = await upsertRepos(mappedRepos);

    return { user, message: "success" };
  } catch (error: any) {
    throw new Error(
      "error while upserting the user and repos to database",
      error
    );
  }
}
