import { z } from 'zod';

export const platformConfigSchema = z.object({
    auctionCommissionPercentage: z.coerce
        .number({ invalid_type_error: "Must be a number" })
        .min(0, "Must be at least 0")
        .max(50, "Must be at most 50%")
        .optional(),
    artSaleCommissionPercentage: z.coerce
        .number({ invalid_type_error: "Must be a number" })
        .min(0, "Must be at least 0")
        .max(50, "Must be at most 50%")
        .optional(),
    commissionArtPercentage: z.coerce
        .number({ invalid_type_error: "Must be a number" })
        .min(0, "Must be at least 0")
        .max(50, "Must be at most 50%")
        .optional(),
    welcomeBonus: z.coerce
        .number({ invalid_type_error: "Must be a number" })
        .min(0, "Must be at least 0")
         .max(100, "Must be at most 100")
        .optional(),
    referralBonus: z.coerce
        .number({ invalid_type_error: "Must be a number" })
        .min(0, "Must be at least 0")
         .max(100, "Must be at most 100")
        .optional(),
    artCoinRate: z.coerce
        .number({ invalid_type_error: "Must be a number" })
        .min(1, "Must be at least 1")
        .max(1000, "Must be at most 1000")
        .optional(),
});

export type PlatformConfigFormValues = z.infer<typeof platformConfigSchema>;
