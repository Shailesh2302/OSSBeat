import "dotenv/config";
import { prisma } from "@repo/db";
import { Request, Response } from "express";
import { decrypt } from "../utils/crypto";

export async function getToken(req: Request, res: Response) {
  const user = await req.user;

  if (!user) {
    throw new Error("user not found");
  }

  // console.log("user :", user);
  const userId = user.id;
  // console.log("userTd : ", userId);

  const provider = await prisma.provider.findFirst({
    where: { userId, provider: "GITHUB" },
  });

  const githubAccessToken = decrypt(provider?.accessTokenEnc as string);

  if (!githubAccessToken) {
    return res.status(500).json({ error: "GitHub token missing" });
  }

  return githubAccessToken;
}
