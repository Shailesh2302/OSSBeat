import { z } from "zod";

export const FeatureQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(10).optional(),
});

export type FeatureQueryDto = z.infer<typeof FeatureQuerySchema>;
