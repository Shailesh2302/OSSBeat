import { Request, Response, NextFunction } from "express";
import { fetchStats } from "./statsService";
import { asyncHandler } from "../../middleware/asyncHandler";

export const getStats = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const stats = await fetchStats();
    res.json(stats);
  },
);
