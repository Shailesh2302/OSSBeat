import { fetchUserData, updateUserData } from "./userRepository";

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
