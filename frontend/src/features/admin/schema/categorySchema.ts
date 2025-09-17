import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim() 
    .min(1, "Category name is required")
    .max(15, "Category name must be at most 15 characters"),
});
