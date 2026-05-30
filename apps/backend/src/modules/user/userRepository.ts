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
