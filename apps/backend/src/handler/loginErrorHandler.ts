import { Request, Response } from "express";

export function handleFailedLogin(req: Request, res: Response) {
  return res.redirect(
    `${process.env.FRONTEND_URL}/login?error=oauth_failed`
  );
}