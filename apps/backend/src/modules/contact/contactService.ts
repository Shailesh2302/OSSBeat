import { createContactMessage } from "./contactRepository";

export async function submitContact(data: {
  name: string;
  email: string;
  message: string;
}) {
  return createContactMessage(data);
}
