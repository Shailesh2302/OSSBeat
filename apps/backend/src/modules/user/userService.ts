import { fetchUserData, updateUserData } from "./userRepository";

export async function userInfo(user: any) {
  const userId: string = user?.id;
  if (!userId) throw new Error("User ID is required");
  const userData = await fetchUserData(userId);
  if (!userData) {
    throw new Error("User data not found");
  }
  return userData;
}

export async function updateUserPrivacy(userId: string, showProfile: boolean) {
  return updateUserData(userId, { show_profile: showProfile });
}
