import { z } from "zod";

export const createArtPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(35, "Title is too long.")
    .transform((val) =>
      val
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    ),
  description: z.string().min(1, "Description is required"),
  artType: z.string().min(1, "Art type is required"),
  hashtags: z.array(z.string()).default([]),
  previewUrl: z.string().url("Invalid preview url"),
  watermarkedUrl: z.string().url("Invalid watermarked image URL"),
  aspectRatio: z.string().min(1, "Aspect ratio is required"),
  commentingDisabled: z.boolean(),
  downloadingDisabled: z.boolean(),
  isPrivate: z.boolean(),
  isSensitive: z.boolean().optional(),
  isForSale: z.boolean().optional(),
  priceType: z.enum(["artcoin", "fiat"]).optional(),
  artcoins: z.number().optional(),
  fiatPrice: z.number().nullable().optional(),
  postType: z.enum(["original", "repost"]).optional(),
  originalPostId: z.string().nullable().optional(),
  status: z.enum(["active", "archived", "deleted"]).optional(),
});
