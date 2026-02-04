import "dotenv/config";
import { createClient, RedisClientType } from "redis";

let redis: RedisClientType;

if (!globalThis._redis) {
  redis = createClient({
    url: process.env.REDIS_URL,
  });

  redis.on("connect", () => {
    console.log("Redis TCP connection established");
  });
  
  redis.on("ready", () => {
    console.log("Redis is ready to accept commands");
  });

  redis.on("error", (err) => {
    console.error("Redis Client Error", err);
  });

  globalThis._redis = redis;
} else {
  redis = globalThis._redis;
}

export async function getRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
  return redis;
}
