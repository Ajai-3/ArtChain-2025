import { z } from 'zod';

export const createArtistRequestSchema = z.object({
  bio: z
    .string()
    .min(20, 'Bio must be at least 20 characters')
    .max(300, 'Bio must not exceed 300 characters')
    .optional(),

  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\d+$/, 'Phone must contain only numbers')
    .optional(),

  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(56, 'Country name too long') 
    .optional(),
});
