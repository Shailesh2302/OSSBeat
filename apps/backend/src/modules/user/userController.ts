import { Request, Response } from "express";
import { userInfo, updateUserPrivacy, signupUser, loginUser } from "./userService";
import { SignupSchema, LoginSchema } from "./userSchema";

export async function getUser(req: Request, res: Response) {
  const user = req.user;
  try {
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userData = await userInfo(user);
    if (!userData) {
      return res.status(500).json({ error: "Database error while fetching the user data" });
    }
    return res.status(200).json(userData);
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error" });
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

export async function signup(req: Request, res: Response) {
  try {
    const parsed = SignupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const result = await signupUser(parsed.data);

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return res.status(201).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error: any) {
    if (error.message === "Email already registered") {
      return res.status(409).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const result = await loginUser(parsed.data.email, parsed.data.password);

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return res.status(200).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error: any) {
    if (error.message === "Invalid email or password") {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}
