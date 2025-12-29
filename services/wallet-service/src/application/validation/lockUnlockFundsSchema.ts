import { z } from 'zod';

export const lockUnlockFundsSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  amount: z.number().positive({ message: "Amount must be greater than 0" }),
  auctionId: z.string().min(1, { message: "Auction ID is required" }),
});

export type LockUnlockFundsSchema = z.infer<typeof lockUnlockFundsSchema>;
