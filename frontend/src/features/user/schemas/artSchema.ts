import z from "zod";
import ART_TYPES from "../../../constants/artTypesConstants";

export const postFormSchema = z.object({
  title: z.string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title can't exceed 100 characters"),
  
  description: z.string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description can't exceed 2000 characters"),
  
  artType: z.enum(ART_TYPES, {
    errorMap: () => ({ message: "Please select an art type" })
  }),
  
  hashtags: z.string()
    .max(100, "Hashtags can't exceed 100 characters")
    .optional()
    .transform(val => val?.trim() || undefined),
  
  commentingDisabled: z.boolean().default(false),
  downloadingDisabled: z.boolean().default(false),
  isPrivate: z.boolean().default(false),
  isForSale: z.boolean().default(false),
  
  priceType: z.enum(["artcoin", "fiat"]).optional(),
  artcoins: z.number()
    .min(1, "Amount must be at least 1 ArtCoin")
    .max(100000, "Amount can't exceed 100,000 ArtCoins")
    .optional(),
}).superRefine((data, ctx) => {
  if (data.isForSale) {
    if (!data.priceType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a price type",
        path: ["priceType"]
      });
    }
    
    if (data.priceType === "artcoin" && !data.artcoins) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter ArtCoin amount",
        path: ["artcoins"]
      });
    }
  }
});

export type PostFormValues = z.infer<typeof postFormSchema>;