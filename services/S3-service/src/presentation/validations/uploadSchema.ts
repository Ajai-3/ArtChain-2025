import { z } from 'zod';

export const uploadSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required' }),

  file: z
    .custom<Express.Multer.File>()
    .refine((file) => !!file, {
      message: 'File is required',
    })
    .refine(
      (file) =>
        ['image/webp', 'image/jpeg', 'image/jpg'].includes(file.mimetype),
      { message: 'Only WEBP, JPG, and JPEG formats are allowed' }
    )
    .refine((file) => file.size <= 20 * 1024 * 1024, {
      message: 'File size must be less than or equal to 20MB',
    }),
});
