// src/modules/auth/auth.service.ts
import "dotenv/config";

import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "@repo/db";
import { generateState } from "arctic";
import { github } from "../../lib/oauth/github";
import { assertEnv } from "../../config/env";
import { GithubProfile } from "../../types/githubType";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";

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
  accessToken: string
): Promise<GithubProfile> {
  const userResp = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const emailsResp = await axios.get("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${accessToken}` },
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

/* ----------------------------------------
 * Step 4: Upsert user
 ---------------------------------------- */
export async function upsertUser(data: GithubProfile) {
  return prisma.user.upsert({
    where: { github_id: data.github_id },
    update: {
      email: data.email,
      username: data.username,
      avatar_url: data.avatar_url ?? undefined,
      last_login_at: new Date(),
    },
    create: {
      github_id: data.github_id,
      email: data.email,
      username: data.username,
      avatar_url: data.avatar_url ?? undefined,
      last_login_at: new Date(),
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
