import { z } from 'zod';

export const passwordTokenSchema = z.object({
  token: z.string().min(10, 'Invalid token'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (val) =>
        /[A-Z]/.test(val) &&
        /[a-z]/.test(val) &&
        /[0-9]/.test(val) &&
        /[^A-Za-z0-9]/.test(val),
      'Password must include uppercase, lowercase, number, and symbol'
    ),
});