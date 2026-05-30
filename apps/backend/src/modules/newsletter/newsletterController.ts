import { Request, Response, NextFunction } from "express";
import { subscribe } from "./newsletterService";
import { asyncHandler } from "../../middleware/asyncHandler";

export const subscribeNewsletter = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "email is required" });
      return;
    }
    await subscribe(email);
    res.json({ success: true });
  },
);
