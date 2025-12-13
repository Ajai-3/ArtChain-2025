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

 startPrice: z.coerce.number().refine(
  val => val > 0,
  { message: "Start price must be a positive number" }
).min(0.1, "Start price must be at least 0.1"),


  startDate: z.string().nonempty("Start date is required"),
  startTime: z.string().nonempty("Start time is required"),
  endDate: z.string().nonempty("End date is required"),
  endTime: z.string().nonempty("End time is required"),

  imageKey: z.string().min(1, "Image key is required"),
}).superRefine((data, ctx) => {
  const { startDate, startTime, endDate, endTime } = data;

  function parseDateTime(dateStr: string, timeStr: string) {
    const timeMatch = timeStr.match(/(\d+):(\d+)/);
    if (!timeMatch) return null;

    let [_, hoursStr, minutesStr] = timeMatch;
    let hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    const isPM = /PM/i.test(timeStr);
    const isAM = /AM/i.test(timeStr);
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    const date = new Date(dateStr);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  const start = parseDateTime(startDate, startTime);
  const end = parseDateTime(endDate, endTime);
  const now = new Date();

  if (!start || !end) return;

  const oneMinute = 1 * 60 * 1000;

  if (start.getTime() < now.getTime() + oneMinute) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Start time must be at least 1 minute from now",
      path: ["startTime"],
    });
  }

  if (end.getTime() < start.getTime() + oneMinute) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End time must be at least 1 minute after start time",
      path: ["endTime"],
    });
  }
});

export type CreateAuctionSchema = z.infer<typeof createAuctionSchema>;
