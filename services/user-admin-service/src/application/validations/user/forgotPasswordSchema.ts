import { z } from "zod";

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, "Identifier cannot be empty")
    .transform((val) => val.toLowerCase().trim()),
});

export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;
