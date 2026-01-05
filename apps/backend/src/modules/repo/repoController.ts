import { Request, Response } from "express";
import { discoverRepos } from "./repoService";
import { decrypt } from "../../utils/crypto";
import { prisma } from "@repo/db";

export async function getDiscoverRepos(req: Request, res: Response) {
  try {
    const {
      perPage = 100,
      language,
      minStars = 0,
      minForks = 0,
      minIssues = 0,
      topic,
    } = req.query;
    const cursor = req.query.cursor as string | undefined;
    const languageStr = typeof language === "string" ? language : undefined;

    // const user = await req.user;

    // if (!user) {
    //   throw new Error("user not found");
    // }

    // // console.log("user :", user);
    // const userId = user.id;
    // // console.log("userTd : ", userId);

    // const provider = await prisma.provider.findFirst({
    //   where: { userId, provider: "GITHUB" },
    // });

    // const githubAccessToken = decrypt(provider?.accessTokenEnc as string);

    // const githubAccessToken = process.env.GITHUB_APP_TOKEN!;
    // if (!githubAccessToken) {
    //   return res.status(500).json({ error: "GitHub token missing" });
    // }

    const data = await discoverRepos(
      // githubAccessToken,
      {
        perPage: Number(perPage),
        cursor,
        language: languageStr,
        minStars: Number(minStars),
        minForks: Number(minForks),
        minIssues: Number(minIssues),
        topic: typeof topic === "string" ? topic : undefined,
      }
    );
    // console.log("---------------------------------------------------");
    // console.log("discover repos : ", data.repos[0]);
    // console.log("---------------------------------------------------");

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
}
