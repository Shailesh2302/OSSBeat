import { prisma } from "@repo/db";

export const fetchUserData = async (userId: string) => {
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

  return userData;
};
