import { Request, Response } from "express";
import { discoverRepos } from "./repoService";
import { decrypt } from "../../utils/crypto";
import { prisma } from "@repo/db";

export async function getDiscoverRepos(req: Request, res: Response) {
  try {
    const cursor = req.query.cursor as string | undefined;

    const user = await req.user;
    // GitHub token should come from:
    // - provider table
    // - OR app-level token
    console.log("user :", user);
    const userId = user.id;
    console.log("userTd : ", userId);

    const provider = await prisma.provider.findFirst({
      where: { userId, provider: "GITHUB" },
    });

    const githubAccessToken = decrypt(provider?.accessTokenEnc as string);

    // const githubAccessToken = process.env.GITHUB_APP_TOKEN!;
    if (!githubAccessToken) {
      return res.status(500).json({ error: "GitHub token missing" });
    }

    const data = await discoverRepos({
      githubAccessToken,
      cursor,
      perPage: 100,
    });
    console.log(data.repos[0]);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
}
