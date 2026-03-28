// This schema is used for validating the auction creation form on the frontend.
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
    .max(999999, "Start price cannot exceed 999,999 Art Coins (6 digits)")
    .positive("Price must be positive"),
  startDate: z.date({ required_error: "Start date is required" }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be HH:MM"),
  endDate: z.date({ required_error: "End date is required" }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be HH:MM"),
}).superRefine((data, ctx) => {
  const { startDate, startTime, endDate, endTime } = data;
  
  const now = new Date();
  const thirtyMinutesInMs = 30 * 60 * 1000;

  // 1. Start Time Validation (can be checked if startDate and startTime exist)
  if (startDate && startTime) {
    const start = new Date(startDate);
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    start.setHours(startHours, startMinutes, 0, 0);

    const thirtyMinutesFromNow = new Date(now.getTime() + thirtyMinutesInMs);

    if (start < thirtyMinutesFromNow) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start time must be at least 30 minutes from now",
        path: ["startTime"],
      });
    }
  }

  // 2. Cross-field Validation (Total Duration & Date Order)
  if (startDate && startTime && endDate && endTime) {
    const start = new Date(startDate);
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    start.setHours(startHours, startMinutes, 0, 0);

    const end = new Date(endDate);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    end.setHours(endHours, endMinutes, 0, 0);

    // End must be after start
    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date & time must be after start date & time",
        path: ["endTime"],
      });
      return; 
    }

    // End time must be at least 30 minutes after start time
    const thirtyMinutesAfterStart = new Date(start.getTime() + thirtyMinutesInMs);
    if (end < thirtyMinutesAfterStart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, 
        message: "End time must be at least 30 minutes after start time",
        path: ["endTime"],
      });
    }
  }
});

export type CreateAuctionFormValues = z.infer<typeof createAuctionSchema>;