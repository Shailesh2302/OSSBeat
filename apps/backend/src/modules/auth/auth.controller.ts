import { Request, Response } from "express";
import { handleFailedLogin } from "../../handler/loginErrorHandler";
import {
  exchangeGithubCodeForToken,
  fetchGithubUser,
  generateGithubAuthUrl,
  getUserFromAccessToken,
  issueTokensForUser,
  refreshTokens,
  upsertUser,
} from "./auth.service";

type Query = {
  code: string;
  state: string;
};

/* --------------------------
 * GET /auth/github
 -------------------------- */
export function githubLogin(req: Request, res: Response) {
  const { url, state } = generateGithubAuthUrl();

  res.cookie("github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  res.redirect(url.toString());
}

/* --------------------------
 * GET /auth/github/callback
 -------------------------- */
export async function githubCallback(req: Request, res: Response) {
  const { code, state } = req.query as Query;
  const { github_oauth_state: storedState } = req.cookies;

  // console.log(state);
  // console.log(storedState);

  if (!state || !storedState || state !== storedState) {
    return handleFailedLogin(req, res);
  }
  let githubAccessToken;
  try {
    res.clearCookie("github_oauth_state");

    githubAccessToken = await exchangeGithubCodeForToken(code);

    if (!githubAccessToken || githubAccessToken.length == 0) {
      return handleFailedLogin(req, res);
    }

    const ghUser = await fetchGithubUser(githubAccessToken);
    const user = await upsertUser(ghUser);

    const { refreshToken } = await issueTokensForUser(user.id);

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    return res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "OAuth Failed" });
  }
}

/* --------------------------
 * POST /auth/refresh
 -------------------------- */
export async function refresh(req: Request, res: Response) {
  const token = req.cookies.refresh_token;
  if (!token) return res.status(401).json({ error: "Missing refresh token" });

  try {
    const { accessToken, refreshToken } = await refreshTokens(token);

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
}

/* --------------------------
 * GET /auth/me
 -------------------------- */
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

/* --------------------------
 * POST /auth/logout
 -------------------------- */
export async function logout(req: Request, res: Response) {
  res.clearCookie("refresh_token", {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({ ok: true });
}
