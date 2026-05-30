import { prisma } from "@repo/db";

export const fetchUserData = async (userId: string) => {
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      avatar_url: true,
      created_at: true,
      display_name: true,
      last_login_at: true,
      profile_url: true,
      username: true,
      show_profile: true,
    },
  });

  return userData;
};

export const updateUserData = async (
  userId: string,
  data: { show_profile?: boolean },
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      show_profile: true,
    },
  });
};

export const createUser = async (data: {
  email: string;
  username: string;
  password_hash: string;
  display_name?: string;
}) => {
  return prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      display_name: data.display_name ?? data.username,
      password_hash: data.password_hash,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      display_name: true,
      password_hash: true,
      show_profile: true,
    },
  });
};
