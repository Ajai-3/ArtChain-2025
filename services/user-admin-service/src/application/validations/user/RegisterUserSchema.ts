import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Name too short')
    .max(20, 'Name too long')
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces allowed'),

  username: z
    .string()
    .min(3, 'Username too short')
    .max(20, 'Username too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores allowed')
    .transform((val) => val.toLowerCase()),

  email: z.string().email('Invalid email')
  .transform((val) => val.toLowerCase()),

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
    token: z.string().optional(),
});