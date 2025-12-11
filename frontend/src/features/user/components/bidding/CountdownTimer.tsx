import { useState, useEffect } from "react";
import { intervalToDuration, formatDuration, formatDistanceToNow, differenceInSeconds } from "date-fns";

interface CountdownTimerProps {
  targetDate: string | Date;
  status: string;
  onTimerEnd?: () => void;
}

export const CountdownTimer = ({ targetDate, status, onTimerEnd }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(differenceInSeconds(new Date(targetDate), new Date()));

  useEffect(() => {
    // If we're already past time, don't start
    if (timeLeft <= 0) {
         if (onTimerEnd) onTimerEnd();
         return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(targetDate);
      const seconds = differenceInSeconds(end, now);

      setTimeLeft(seconds);

      if (seconds <= 0) {
        clearInterval(timer);
        if (onTimerEnd) onTimerEnd();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onTimerEnd]);

  if (timeLeft <= 0) {
      if (status === 'SCHEDULED') return <span className="text-emerald-500 font-bold">Starting Now...</span>;
      return <span className="text-destructive font-bold">Ended</span>;
  }

  const duration = intervalToDuration({ start: 0, end: timeLeft * 1000 });
  
  // Format consistent 00h 00m 00s
  const zeroPad = (num?: number) => String(num || 0).padStart(2, '0');

  return (
    <div className="flex gap-2 items-center text-sm font-mono bg-muted/50 px-3 py-1.5 rounded-md border border-border/50">
        <div className="flex flex-col items-center">
             <span className="text-xl font-bold tabular-nums">{zeroPad(duration.days)}</span>
             <span className="text-[10px] uppercase text-muted-foreground">Days</span>
        </div>
        <span className="text-xl font-bold -mt-3">:</span>
        <div className="flex flex-col items-center">
             <span className="text-xl font-bold tabular-nums">{zeroPad(duration.hours)}</span>
             <span className="text-[10px] uppercase text-muted-foreground">Hrs</span>
        </div>
        <span className="text-xl font-bold -mt-3">:</span>
        <div className="flex flex-col items-center">
             <span className="text-xl font-bold tabular-nums">{zeroPad(duration.minutes)}</span>
             <span className="text-[10px] uppercase text-muted-foreground">Min</span>
        </div>
        <span className="text-xl font-bold -mt-3">:</span>
        <div className="flex flex-col items-center">
             <span className={`text-xl font-bold tabular-nums ${timeLeft < 60 ? 'text-destructive animate-pulse' : ''}`}>{zeroPad(duration.seconds)}</span>
             <span className="text-[10px] uppercase text-muted-foreground">Sec</span>
        </div>
    </div>
  );
};
