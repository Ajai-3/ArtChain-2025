import * as z from "zod";

export const changeEmailSchema = (currentEmail: string) =>
  z.object({
    newEmail: z
      .string()
      .email("Invalid email format") 
      .refine((val) => val !== currentEmail, "New email must not match current email"),
  });

export type ChangeEmailSchema = z.infer<ReturnType<typeof changeEmailSchema>>;
