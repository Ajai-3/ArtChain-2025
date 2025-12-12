import { z } from "zod";

export const generateAIImageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  negativePrompt: z.string().optional(),
  resolution: z.string().regex(/^\d+x\d+$/, "Resolution must be in format WxH (e.g. 1024x1024)"),
  seed: z.number().int().optional(),
  provider: z.string().optional(),
  model: z.string().optional(),
  useArtcoins: z.boolean().optional().default(false),
});
