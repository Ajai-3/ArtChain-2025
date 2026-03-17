import { z } from 'zod';

export const getSupportSchema = z.object({
  currentUserId: z.string().min(1, { message: 'Current User ID is required' }),
  userId: z.string().min(1, { message: 'User ID is required' }),

  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(10),
});

export type GetSupportInput = z.infer<typeof getSupportSchema>;
