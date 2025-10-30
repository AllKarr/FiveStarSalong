import { z } from "zod";

export const reviewSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  text: z.string().min(3, "Review must be at least 3 characters"),
  rating: z.number().min(1).max(5),
  approved: z.boolean().optional().default(false),
  createdAt: z.date().optional(),
});
