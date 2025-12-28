import "dotenv/config";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

export function verifyGithubSignature(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const signature = req.headers["x-hub-signature-256"];
  const secret = process.env.GITHUB_WEBHOOK_SECRET!;
  const rawBody = (req as any).rawBody;
  console.log(req.headers);
  if (typeof signature !== "string") {
    return res.status(400).send({
      message: "Missing signature",
      token: signature ?? "null",
      header:req.headers
    });
  }

  const expected =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return res.status(401).send("Invalid signature");
  }

  next();
}
