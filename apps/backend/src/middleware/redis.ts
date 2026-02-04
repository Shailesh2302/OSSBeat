import { NextFunction, Request, Response } from "express";
import { redis } from "../lib/redis/redisClient";
import { RedisKey } from "ioredis";

interface rateLimitType {
  limit: Number | String;
  timer: Number | String;
  key: RedisKey;
}

export const rateLimiting =
  ({ limit = 20, timer = 60, key }: rateLimitType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const clientIp =
      req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.ip;
    const finalKey = `${clientIp as string}:${key}:request_count`;

    const requestCount = await redis.incr(finalKey);

    if (requestCount === 1) {
      await redis.expire(finalKey, timer as number);
    }

    const timeRemaining = await redis.ttl(finalKey);

    if (requestCount > 10)
      return res.status(429).json({
        message: `Too many request, please try again after ${timeRemaining} seconds`,
      });

    console.log(clientIp, " ipCount : ", requestCount);

    next();
  };

  
export const getCachedData =
  (keyFn: (req: Request) => RedisKey) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const key = keyFn(req);
    const cachedData = await redis.get(key);
console.log("form the rediscached data function");
    if (cachedData) {
      return res.json({ products: JSON.parse(cachedData) });
    }

    next();
  };
