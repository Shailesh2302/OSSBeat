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

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(1).max(100),
  display_name: z.string().min(1).max(100).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type UserIdDto = z.infer<typeof UserIdSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type SignupDto = z.infer<typeof SignupSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
