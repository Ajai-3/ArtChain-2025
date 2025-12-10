import { z } from "zod";

export const createAuctionSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must not exceed 50 characters"),
  description: z 
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  startPrice: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .min(0.1, "Start price must be at least 0.1")
    .positive("Price must be positive"),
  startDate: z.date({ required_error: "Start date is required" }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endDate: z.date({ required_error: "End date is required" }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
}).refine((data) => {
  const start = new Date(data.startDate);
  const [startHours, startMinutes] = data.startTime.split(":").map(Number);
  start.setHours(startHours, startMinutes);

  const end = new Date(data.endDate);
  const [endHours, endMinutes] = data.endTime.split(":").map(Number);
  end.setHours(endHours, endMinutes);

  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endDate"], // Show error on End Date
});

export type CreateAuctionFormValues = z.infer<typeof createAuctionSchema>;
