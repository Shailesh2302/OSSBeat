import { Request, Response } from "express";
import { userInfo, updateUserPrivacy } from "./userService";

export async function getUser(req: Request, res: Response) {
  const user = req.user;
  try {
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userData = await userInfo(user);
    return res.status(200).json(userData);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

export async function updateUser(req: Request, res: Response) {
  const user = req.user;
  try {
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { show_profile } = req.body;

    if (typeof show_profile !== "boolean") {
      return res.status(400).json({ error: "show_profile must be a boolean" });
    }

    const updated = await updateUserPrivacy(user.id, show_profile);
    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
