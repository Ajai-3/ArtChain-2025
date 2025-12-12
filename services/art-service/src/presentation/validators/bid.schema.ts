import { z } from "zod";

export const placeBidSchema = z.object({
  auctionId: z.string().min(1, "Auction ID is required"),
  amount: z.number().positive("Bid amount must be positive"),
});

export type PlaceBidSchema = z.infer<typeof placeBidSchema>;
