import z from "zod"

export const editCategorySchema = z.object({
    name: z.string().min(1, "Category name is required").max(15, "Maximum 15 characters").optional(),
    count: z.number().optional(),
   status: z.enum(["active", "inactive"]).optional(),
})