import { z } from "zod";

export const reviewSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  text: z.string().min(3),
  rating: z.number().min(1).max(5),
  approved: z.boolean().optional(),
});
