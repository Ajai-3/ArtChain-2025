import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim() 
    .min(1, "Category name is required")
    .max(20, "Category name must be at most 20 characters"),
});


export type AddCategory = z.infer<typeof categorySchema>;