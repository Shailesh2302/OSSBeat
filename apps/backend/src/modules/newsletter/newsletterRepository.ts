import { prisma } from "@repo/db";

export async function subscribeEmail(email: string) {
  return prisma.newsletterSubscriber.create({
    data: { email },
  });
}
