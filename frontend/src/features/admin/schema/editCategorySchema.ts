import * as z from "zod";

export const editCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")       
    .max(20, "Maximum 20 characters") 
    .transform((val) => val.trim()),   
  count: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), "Count must be a number")
    .refine((val) => val >= 0, "Count must be at least 0"),
  status: z.enum(["active", "inactive"]),
});

export type EditCategory = z.infer<typeof editCategorySchema>;
