import bcrypt from "bcryptjs";
import { fetchUserData, updateUserData, createUser, findUserByEmail } from "./userRepository";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { storeRefreshToken } from "../auth/authService";

export async function userInfo(user: any) {
  try {
    const userId: string = user?.id;
    const userData = await fetchUserData(userId);
    if (!userData) {
      throw new Error("User data not found");
    }
    return userData;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUserPrivacy(userId: string, showProfile: boolean) {
  return updateUserData(userId, { show_profile: showProfile });
}

export async function signupUser(data: {
  email: string;
  password: string;
  username: string;
  display_name?: string;
}) {
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new Error("Email already registered");
  }

  const password_hash = await bcrypt.hash(data.password, 10);
  const user = await createUser({
    email: data.email,
    username: data.username,
    password_hash,
    display_name: data.display_name,
  });

  const accessToken = signAccessToken({ sub: user.id });
  const refreshToken = signRefreshToken({ sub: user.id });
  await storeRefreshToken(user.id, refreshToken);

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    accessToken,
    refreshToken,
  };
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user || !user.password_hash) {
    throw new Error("Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = signAccessToken({ sub: user.id });
  const refreshToken = signRefreshToken({ sub: user.id });
  await storeRefreshToken(user.id, refreshToken);

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    accessToken,
    refreshToken,
  };
}
