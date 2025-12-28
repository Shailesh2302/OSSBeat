import { Request, Response } from "express";
import { handleFailedLogin } from "../../handler/loginErrorHandler";
import {
  exchangeGithubCodeForToken,
  fetchGithubUser,
  generateGithubAuthUrl,
  getUserFromAccessToken,
  issueTokensForUser,
  refreshTokens,
  upsertUserAndRepoToDB,
} from "./authService";

type Query = {
  code: string;
  state: string;
};

export function githubLogin(req: Request, res: Response) {
  const { url, state } = generateGithubAuthUrl();

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("github_oauth_state", state, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  res.redirect(url.toString());
}


export async function githubCallback(req: Request, res: Response) {
  const { code, state } = req.query as Query;
  const { github_oauth_state: storedState } = req.cookies;

  if (!state || !storedState || state !== storedState) {
    return handleFailedLogin(req, res);
  }

  try {
    res.clearCookie("github_oauth_state");

    const githubAccessToken = await exchangeGithubCodeForToken(code);

    if (!githubAccessToken || githubAccessToken.length == 0) {
      return handleFailedLogin(req, res);
    }

    const ghUser = await fetchGithubUser(githubAccessToken);
    const { user, message } = await upsertUserAndRepoToDB(
      ghUser,
      githubAccessToken
    );

    if (message !== "success") {
      throw new Error("Failed to upsert user and repos to database");
    }

   
    const { accessToken, refreshToken } = await issueTokensForUser(user.id);

    // console.log("refreshToken: ", refreshToken);
    // console.log("accessToken: ", accessToken); // Add this log

    const isProd = process.env.NODE_ENV === "production";


    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });


    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/success?token=${accessToken}`
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "OAuth Failed" });
  }
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies.refresh_token;

  if (!token) return res.status(401).json({ error: "Missing refresh token" });

  try {
    const { accessToken, refreshToken } = await refreshTokens(token);

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
}

export async function me(req: Request, res: Response) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer "))
    return res.status(401).json({ error: "Missing token" });

  const token = auth.split(" ")[1];
  if (!token) {
    return res.json({ message: "token is undefined" });
  }

  try {
    const user = await getUserFromAccessToken(token);
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({ user });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("refresh_token", {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({ ok: true });
}

export async function getToken(req: Request, res: Response) {
  const token1 = req.cookies.refresh_token;
  const headerAccessToken = req.headers.accessToken;
  const cookieAccessToken = req.cookies.accessToken;
  const token2 = req.headers.authorization;
  // console.log("token 1 : ", token1);
  // console.log("cookieAccessToken : ", cookieAccessToken);
  // console.log("headerAccessToken : ", headerAccessToken);

  // console.log("token 2 : ", token2);
  const token3 = token2?.split(" ")[1];
  // console.log("token 3 : ", token3);
  return res.json({ token1: token1, token2: token2, token3: token3 });
}
