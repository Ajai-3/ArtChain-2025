import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, 'Name too short')
    .max(20, 'Name too long')
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces allowed')
    .optional(),
  username: z
    .string()
    .min(3, 'Username too short')
    .max(20, 'Username too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores allowed')
    .transform((val) => val.toLowerCase())
    .optional(),
  profileImage: z.string().url().optional(),
  bannerImage: z.string().url().optional(),
  backgroundImage: z.string().url().optional(),
  bio: z.string().max(160, 'Bio too long').optional(),
  country: z.string().optional(),
});
