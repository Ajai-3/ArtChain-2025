import { z } from "zod";

export const googleAuthSchema = z.object({
  token: z.string().min(7, "Invalid token"),
  email: z
    .string()
    .email("Invalid email")
    .transform((val) => val.toLowerCase()),
  name: z.string().min(3, "Name too short"),
});

export type GoogleAuthBody = z.infer<typeof googleAuthSchema>;
