import { z } from "zod";

export const DiscoverQuerySchema = z.object({
  perPage: z.coerce.number().min(1).max(100).default(100).optional(),
  cursor: z.string().optional(),
  language: z.string().optional(),
  minStars: z.coerce.number().min(0).default(0).optional(),
  minForks: z.coerce.number().min(0).default(0).optional(),
  minIssues: z.coerce.number().min(0).default(0).optional(),
  topic: z.string().optional(),
});

export type DiscoverQueryDto = z.infer<typeof DiscoverQuerySchema>;
