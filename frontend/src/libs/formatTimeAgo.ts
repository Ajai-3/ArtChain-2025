import { differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from "date-fns";

export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);

  const seconds = differenceInSeconds(now, past);
  if (seconds < 60) return `${seconds}s`;

  const minutes = differenceInMinutes(now, past);
  if (minutes < 60) return `${minutes}m`;

  const hours = differenceInHours(now, past);
  if (hours < 24) return `${hours}h`;

  const days = differenceInDays(now, past);
  if (days < 30) return `${days}d`;

  const months = differenceInMonths(now, past);
  if (months < 12) return `${months}mo`;

  const years = differenceInYears(now, past);
  return `${years}y`;
}
