import { Request, Response, NextFunction } from "express";
import { submitContact } from "./contactService";
import { asyncHandler } from "../../middleware/asyncHandler";

export const sendMessage = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: "name, email, and message are required" });
      return;
    }
    await submitContact({ name, email, message });
    res.json({ success: true });
  },
);
