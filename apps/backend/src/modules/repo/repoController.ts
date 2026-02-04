import { Request, Response } from "express";
import { discoverRepos } from "./repoService";
import { decrypt } from "../../utils/crypto";
import { prisma } from "@repo/db";
import { redis } from "../../lib/redis/redisClient";

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

    await redis.set(cacheKey, JSON.stringify(data), "EX", 60);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
}
