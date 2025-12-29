import { z } from 'zod';

export const settleAuctionSchema = z.object({
  winnerId: z.string().min(1, { message: "Winner ID is required" }),
  sellerId: z.string().min(1, { message: "Seller ID is required" }),
  totalAmount: z.number().positive({ message: "Total amount must be greater than 0" }),
  commissionAmount: z.number().nonnegative({ message: "Commission amount cannot be negative" }),
  auctionId: z.string().min(1, { message: "Auction ID is required" }),
}).refine(data => data.winnerId !== data.sellerId, {
  message: "Winner and seller cannot be the same user",
  path: ["sellerId"]
});

export type SettleAuctionSchema = z.infer<typeof settleAuctionSchema>;
