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
    .number({ invalid_type_error: "Price must be a number" })
    .min(0.1, "Start price must be at least 0.1")
    .positive("Price must be positive"),
  startDate: z.date({ required_error: "Start date is required" }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be HH:MM"),
  endDate: z.date({ required_error: "End date is required" }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be HH:MM"),
}).superRefine((data, ctx) => {
  const { startDate, startTime, endDate, endTime } = data;
  
  if (!startDate || !startTime || !endDate || !endTime) return;

  const start = new Date(startDate);
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  start.setHours(startHours, startMinutes);

  const end = new Date(endDate);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  end.setHours(endHours, endMinutes);

  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

  // 1. Start time must be at least 1 hour in the future
  if (start < oneHourFromNow) {
     ctx.addIssue({
       code: z.ZodIssueCode.custom,
       message: "Start time must be at least 1 hour from now",
       path: ["startTime"],
     });
  }

  // 2. End time must be at least 1 hour after start time
  const oneHourAfterStart = new Date(start.getTime() + 60 * 60 * 1000);
  if (end < oneHourAfterStart) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom, 
      message: "End time must be at least 1 hour after start time",
      path: ["endTime"],
    });
  }
});

export type CreateAuctionFormValues = z.infer<typeof createAuctionSchema>;
