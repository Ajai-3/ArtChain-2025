import { z } from "zod";

export const commissionRequestSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  budget: z
    .coerce.number()
    .min(1, "Budget must be at least 1 Art Coin")
    .positive("Budget must be a positive number"),
  deadline: z.date({
    required_error: "A deadline is required.",
  }).refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, {
    message: "Deadline cannot be in the past",
  }),
  // files are handled separately but we can include a field if we want to bind it to the form
});

export type CommissionRequestFormValues = z.infer<typeof commissionRequestSchema>;
