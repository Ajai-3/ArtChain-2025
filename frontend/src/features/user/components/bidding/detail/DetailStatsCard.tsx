import { Clock, AlertCircle, Trophy } from 'lucide-react';
import { CountdownTimer } from '../CountdownTimer';
import { formatNumber } from '../../../../../libs/formatNumber';
import type { Auction } from '../../../../../types/auction';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../redux/store';

interface DetailStatsCardProps {
  auction: Auction;
  isLive: boolean;
  isEnded: boolean;
  isScheduled: boolean;
  isUnsold: boolean;
  onPlaceBid: () => void;
  refetch: () => void;
}

export const DetailStatsCard = ({
  auction,
  isLive,
  isEnded,
  isScheduled,
  isUnsold,
  onPlaceBid,
  refetch,
}: DetailStatsCardProps) => {
  const currentUserId = useSelector((state: RootState) => state.user.user?.id);
  const isCurrentUserIsHost = auction?.host?.id === currentUserId;

  const getTheme = () => {
    if (isLive)
      return {
        border: 'border-emerald-500 shadow-emerald-500/10',
        blob: 'bg-emerald-500',
        badge: 'bg-emerald-500/10 text-emerald-500',
        text: 'text-emerald-600 dark:text-emerald-400',
        priceBg: 'bg-emerald-500/5 border-emerald-500/20',
        btn: 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-700',
      };

    if (isScheduled)
      return {
        border: 'border-indigo-500 shadow-indigo-500/10',
        blob: 'bg-indigo-500',
        badge: 'bg-indigo-500/10 text-indigo-500',
        text: 'text-indigo-600 dark:text-indigo-400',
        priceBg: 'bg-indigo-500/5 border-indigo-500/20',
        btn: 'bg-indigo-600 text-white border-indigo-700',
      };

    if (isUnsold)
      return {
        border: 'border-neutral-400 shadow-neutral-500/5',
        blob: 'bg-neutral-400',
        badge: 'bg-neutral-500/10 text-neutral-500',
        text: 'text-neutral-500 dark:text-neutral-400',
        priceBg: 'bg-neutral-500/5 border-neutral-500/20',
        btn: 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700',
      };

    if (isEnded)
      return {
        border: 'border-amber-500 shadow-amber-500/10',
        blob: 'bg-amber-500',
        badge: 'bg-amber-500/10 text-amber-600',
        text: 'text-amber-600 dark:text-amber-400',
        priceBg: 'bg-amber-500/5 border-amber-500/20',
        btn: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-400 border-amber-300 dark:border-amber-800',
      };

    return {
      border: 'border-border',
      blob: 'bg-muted',
      badge: 'bg-muted',
      text: 'text-muted-foreground',
      priceBg: 'bg-muted/5',
      btn: 'bg-muted text-muted-foreground',
    };
  };

  const theme = getTheme();

  const getButtonClass = () => {
    if (isLive && isCurrentUserIsHost) {
      return 'bg-muted text-muted-foreground border-muted-foreground/20 cursor-not-allowed';
    }
    return theme.btn;
  };

  const handleClick = () => {
    if (!isLive || isCurrentUserIsHost) return;
    onPlaceBid();
  };

  return (
    <div
      className={`relative rounded-2xl p-4 shadow-xl h-[32%] shrink-0 flex flex-col gap-4 overflow-hidden border-2 bg-card transition-all duration-300 ${theme.border}`}
    >
      <div
        className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[50px] opacity-20 pointer-events-none ${theme.blob}`}
      />

      <div className="min-h-0 flex-1 flex flex-col gap-2 relative z-10">
        <div className="flex justify-between items-start gap-4 shrink-0">
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight line-clamp-2">
            {auction.title}
          </h1>
          <div className={`shrink-0 p-2 rounded-lg ${theme.badge}`}>
            {isLive && <Clock className="animate-pulse h-5 w-5" />}
            {isScheduled && <Clock className="h-5 w-5" />}
            {isUnsold && <AlertCircle className="h-5 w-5" />}
            {isEnded && !isUnsold && <Trophy className="h-5 w-5" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div
          className={`p-4 rounded-xl border backdrop-blur-sm ${theme.priceBg}`}
        >
          <span
            className={`text-[10px] uppercase font-bold tracking-wider mb-1 block ${theme.text}`}
          >
            {isLive
              ? 'Current Bid'
              : isUnsold
                ? 'Starting Price'
                : isEnded
                  ? 'Sold Price'
                  : 'Starting Price'}
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-3xl font-black tabular-nums tracking-tighter ${theme.text}`}
            >
              {formatNumber(auction.currentBid || auction.startPrice || 0)}
            </span>
            <span className="text-xs font-bold text-muted-foreground">AC</span>
          </div>
        </div>

        <div className="px-4 py-2 bg-muted/30 rounded-xl border border-border/50 backdrop-blur-sm flex flex-col justify-center">
          {isUnsold ? (
            <>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-0.5">
                Status
              </span>
              <span className="font-bold text-sm text-neutral-500">Unsold</span>
              <span className="text-[9px] text-muted-foreground">
                Ended {new Date(auction.endTime).toLocaleDateString()}
              </span>
            </>
          ) : isEnded ? (
            <>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-0.5">
                Status
              </span>
              <span className="font-bold text-sm text-amber-600">Sold</span>
              <span className="text-[9px] text-muted-foreground">
                Ended {new Date(auction.endTime).toLocaleDateString()}
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3" /> {isLive ? 'Ends In' : 'Starts In'}
              </span>
              <div className="scale-105 origin-left">
                <CountdownTimer
                  targetDate={isLive ? auction.endTime : auction.startTime}
                  status={auction.status}
                  onTimerEnd={refetch}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        className={`w-full h-10 text-lg font-bold shadow-lg transition-all active:scale-[0.98] uppercase tracking-wide border-b-4 rounded-md flex items-center justify-center ${getButtonClass()} ${!isLive || isCurrentUserIsHost ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleClick}
      >
        {isLive && !isCurrentUserIsHost && (
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Place Bid
          </span>
        )}
        {isLive && isCurrentUserIsHost && (
          <span className="opacity-70">Host Only</span>
        )}
        {isScheduled && (
          <span className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Coming Soon
          </span>
        )}
        {isUnsold && (
          <span className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" /> No Winner
          </span>
        )}
        {isEnded && !isUnsold && (
          <span className="flex items-center gap-2">
            <Trophy className="h-5 w-5" /> Auction Sold
          </span>
        )}
      </button>
    </div>
  );
};
