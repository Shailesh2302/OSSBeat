// import "dotenv/config";
import { Request, Response } from "express";
import { prisma } from "@repo/db"; // adjust import path

export async function getUser(req: Request, res: Response) {
  const user = req.user;
  try {
    if (!user) {
      throw new Error("User not found");
    }

    const userId = user?.id;

    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        avatar_url: true,
        created_at: true,
        display_name: true,
        last_login_at: true,
        profile_url: true,
        username: true,
      },
    });
    if (!userData) {
      throw new Error("User data not found");
    }

    return res.status(200).json(userData);
  } catch (error: any) {
    throw new Error("Internal server error", error);
  }
}
