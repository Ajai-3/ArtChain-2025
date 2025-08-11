import { z } from 'zod';

export const loginUserSchema = z.object({
  identifier: z.string().min(3, 'Invalid email or username')
  .transform((val) => val.toLowerCase()),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginBody = z.infer<typeof loginUserSchema>;