import { z } from "zod";

export const platformConfigSchema = z.object({
  auctionCommissionPercentage: z.number().min(0).max(50).optional(),
  artSaleCommissionPercentage: z.number().min(0).max(50).optional(),
  welcomeBonus: z.number().min(0).max(100).optional(),
  referralBonus: z.number().min(0).max(100).optional(),
  artCoinRate: z.number().min(1).max(1000).optional(),
});
