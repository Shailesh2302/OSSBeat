// import "dotenv/config";
import { Request, Response } from "express";
import { userInfo } from "./userService";

export async function getUser(req: Request, res: Response) {
  const user = req.user;
  try {
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userInfo(user);

    if (!userData) {
      return res
        .status(500)
        .json({ error: "Database error while fetching the user data" });
    }

    return res.status(200).json(userData);
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
