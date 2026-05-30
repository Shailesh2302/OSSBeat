import { Router } from "express";
import { getDiscoverRepos } from "./repoController";
import { getCachedData, rateLimiting } from "../../middleware/redis";

const router: Router = Router();

router.get(
  "/discover",
  rateLimiting({ limit: 30, timer: 60, key: "ip" }),
  getCachedData((req) =>
    req.query.cursor
      ? `discover:repos:cursor:${req.query.cursor}`
      : "discover:repos:first",
  ),
  getDiscoverRepos,
);

export default router;
