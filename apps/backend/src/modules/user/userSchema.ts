import { z } from "zod";

export const UserIdSchema = z.object({
  id: z.string().uuid(),
});

export const UpdateUserSchema = z.object({
  username: z.string().min(1).max(100).optional(),
  display_name: z.string().min(1).max(100).optional(),
  avatar_url: z.string().url().optional(),
  email: z.string().email().optional(),
  show_profile: z.boolean().optional(),
});

export type UserIdDto = z.infer<typeof UserIdSchema>;
export type UserUpdateDto = z.infer<typeof UpdateUserSchema>;
