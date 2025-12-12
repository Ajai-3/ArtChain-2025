import { z } from "zod";

export const createAuctionSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must not exceed 50 characters")
    .regex(/.*[a-zA-Z]+.*/, "Title must contain at least one letter"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters")
    .regex(/.*[a-zA-Z]+.*/, "Description must contain at least one letter"),
  startPrice: z.coerce
    .number()
    .min(0.1, "Start price must be at least 0.1")
    .positive("Price must be positive"),
  startTime: z.string().or(z.date()).transform((val) => new Date(val)),
  endTime: z.string().or(z.date()).transform((val) => new Date(val)),
  imageKey: z.string().min(1, "Image key is required"),
}).superRefine((data, ctx) => {
  const { startTime, endTime } = data;
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();
  
  // const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
  const thirtyMinutesFromNow = new Date(now.getTime() + 60000);

  if (start < thirtyMinutesFromNow) {
     ctx.addIssue({
       code: z.ZodIssueCode.custom,
       message: "Start time must be at least 30 minutes from now",
       path: ["startTime"],
     });
  }

  // const thirtyMinutesAfterStart = new Date(start.getTime() + 30 * 60 * 1000);
   const thirtyMinutesAfterStart = new Date(start.getTime() + 6000);
  if (end < thirtyMinutesAfterStart) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom, 
      message: "End time must be at least 30 minutes after start time",
      path: ["endTime"],
    });
  }
});

export type CreateAuctionSchema = z.infer<typeof createAuctionSchema>;
