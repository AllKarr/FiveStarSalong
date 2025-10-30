import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),

  // ✅ Correct Zod enum usage (no errorMap)
  category: z.enum(
    ["extensions", "bundles", "hairproducts", "accessories", "misc"],
    { message: "Invalid category" }
  ),

  price: z.number().positive("Price must be positive"),
  stock: z.number().int().nonnegative("Stock must be non-negative"),

  // ✅ Allow either full URL or /uploads/... path
  image: z
    .string()
    .regex(/^https?:\/\/|^\/uploads\//, "Image must be a valid URL or local path")
    .optional(),
});
