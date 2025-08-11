import { z } from 'zod';

export const startRegisterSchema = z.object({
  name: z
    .string()
    .min(3, 'Name too short')
    .max(20, 'Name too long')
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces allowed')
     .transform((val) =>
      val
        .toLowerCase()
        .split(' ')
        .filter(Boolean)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ')
    ),

  username: z
    .string()
    .min(3, 'Username too short')
    .max(20, 'Username too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores allowed')
    .transform((val) => val.toLowerCase()),

  email: z.string().email('Invalid email')
  .transform((val) => val.toLowerCase()),
});