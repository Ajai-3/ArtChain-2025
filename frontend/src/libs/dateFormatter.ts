import { format, isToday, isYesterday, differenceInDays, parseISO, differenceInMinutes } from 'date-fns';

export const formatChatTime = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return '';
  
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  const now = new Date();

  const diffMinutes = differenceInMinutes(now, date);

  if (diffMinutes < 1) {
    return 'Just now';
  }

  if (isToday(date)) {
    return format(date, 'h:mm a').toLowerCase(); // 11:24 pm
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  const diffDays = differenceInDays(now, date);

  if (diffDays < 7) {
    return format(date, 'EEEE'); // Monday, Tuesday...
  }

  if (diffDays >= 7 && diffDays < 14) {
      return "1 week ago";
  }

  return format(date, 'dd-MM-yyyy');
};

export const formatMessageTime = (dateInput: string | Date | undefined): string => {
    if (!dateInput) return '';
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    return format(date, 'h:mm a').toLowerCase();
}
