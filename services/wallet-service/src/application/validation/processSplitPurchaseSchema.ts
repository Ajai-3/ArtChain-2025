import { z } from 'zod';

export const processSplitPurchaseSchema = z.object({
  buyerId: z.string().min(1, { message: "Buyer ID is required" }),
  sellerId: z.string().min(1, { message: "Seller ID is required" }),
  totalAmount: z.number().positive({ message: "Total amount must be greater than 0" }),
  commissionAmount: z.number().nonnegative({ message: "Commission amount cannot be negative" }),
  artId: z.string().min(1, { message: "Art ID is required" }),
}).refine(data => data.buyerId !== data.sellerId, {
  message: "Buyer and seller cannot be the same user",
  path: ["sellerId"]
});

export type ProcessSplitPurchaseSchema = z.infer<typeof processSplitPurchaseSchema>;
