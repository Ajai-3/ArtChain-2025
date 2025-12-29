import { z } from 'zod';

export const giftArtCoinsSchema = z.object({
  receiverId: z.string().min(1, { message: "Receiver ID is required" }),
  amount: z.number().positive({ message: "Amount must be greater than 0" }).max(10000, { message: "Maximum gift amount is 10,000 Art Coins" }),
  message: z.string().max(200, { message: "Message must be less than 200 characters" }).optional(),
});
