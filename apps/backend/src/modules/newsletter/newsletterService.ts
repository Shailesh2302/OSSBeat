import { subscribeEmail } from "./newsletterRepository";

export async function subscribe(email: string) {
  return subscribeEmail(email);
}
