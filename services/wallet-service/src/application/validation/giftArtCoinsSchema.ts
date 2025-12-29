import { z } from 'zod';

export const giftArtCoinsSchema = z.object({
  senderId: z.string().min(1, { message: "Sender ID is required" }),
  receiverId: z.string().min(1, { message: "Receiver ID is required" }),
  amount: z.number().int({ message: "Amount must be an integer" }).positive({ message: "Amount must be greater than 0" }).max(10000, { message: "Maximum gift amount is 10,000 Art Coins" }),
  message: z.string().max(100, { message: "Message must be less than 100 characters" }).optional(),
  senderName: z.string().min(1, { message: "Sender name is required" }),
  senderImage: z.string().optional(),
}).refine(data => data.senderId !== data.receiverId, {
  message: "You cannot gift Art Coins to yourself",
  path: ["receiverId"]
});

export type GiftArtCoinsSchema = z.infer<typeof giftArtCoinsSchema>;