import { Request, Response } from "express";
import { discoverRepos } from "./repoService";
import { decrypt } from "../../utils/crypto";
import { prisma } from "@repo/db";
import { getRedis } from "../../lib/redis/redisClient";

export async function getDiscoverRepos(req: Request, res: Response) {
  try {
    const redis = await getRedis();
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

    const data = await discoverRepos({
      perPage: Number(perPage),
      cursor,
      language: languageStr,
      minStars: Number(minStars),
      minForks: Number(minForks),
      minIssues: Number(minIssues),
      topic: typeof topic === "string" ? topic : undefined,
    });

    const cacheKey = cursor
      ? `discover:repos:cursor:${cursor}`
      : `discover:repos:first`;

    await redis.setEx(cacheKey, 60, JSON.stringify(data));
    console.log(data.repos[0],"cachedkey : ",cacheKey);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
}
