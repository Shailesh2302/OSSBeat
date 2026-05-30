import { prisma } from "@repo/db";

export async function createContactMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  return prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      message: data.message,
    },
  });
}
