import { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { getContributions } from "./contributionsService";

export const fetchContributions: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    if (!user || !user.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const year = req.query.year
      ? parseInt(req.query.year as string, 10)
      : new Date().getFullYear();

    const data = await getContributions(user.id, year);
    res.json(data);
  },
);
