import { CardContent } from "../../../../components/ui/card";
import { Clock, TrendingUp } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { formatNumber } from "../../../../libs/formatNumber";
import type { Auction } from "../../../../types/auction";

interface AuctionCardDetailsProps {
    auction: Auction;
    isLive: boolean;
    isEnded: boolean;
    isScheduled: boolean;
    isUnsold: boolean;
    status: string;
}

export const AuctionCardDetails = ({ auction, isLive, isEnded, isScheduled, isUnsold, status }: AuctionCardDetailsProps) => {
    function formatDate(date: string) {
  const d = new Date(date);

  const month = d.toLocaleString("en-US", { month: "short" });
  const day = d.getDate();
  const year = d.getFullYear();

  const time = d.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  return `${month} ${day} ${year}, ${time}`;
}
    return (
        <CardContent className={`p-4 pt-0 space-y-2 flex-1`}>
            {isLive && (
                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-sm">
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold tracking-wider block">Current Highest Bid</span>
                    <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-2xl font-black tabular-nums text-emerald-700 dark:text-emerald-400">{formatNumber(auction.currentBid > 0 ? auction.currentBid : auction.startPrice)}</span>
                        <span className="text-xs font-bold text-emerald-600/80 dark:text-emerald-500/80 self-end mb-1.5">AC</span>
                    </div>
                </div>
            )}

            {isScheduled && (
                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-sm">
                    <span className="text-[10px] text-indigo-700 dark:text-indigo-400 uppercase font-bold tracking-wider mb-0.5 block">Starting Price</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-2xl font-black tabular-nums text-indigo-700 dark:text-indigo-400">{formatNumber(auction.startPrice)}</span>
                        <span className="text-xs font-bold text-indigo-600/80 dark:text-indigo-500/80 self-end mb-1.5">AC</span>
                    </div>
                </div>
            )}

            {isEnded && (
                <div className={`p-3 rounded-xl border shadow-sm grayscale-[0.2] ${isUnsold ? 'bg-neutral-500/5 border-neutral-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                    <span className={`text-[10px] uppercase font-bold tracking-wider mb-0.5 block ${isUnsold ? 'text-neutral-500' : 'text-amber-700 dark:text-amber-500'}`}>
                        {isUnsold ? 'Starting Price (Unsold)' : 'Final Sold Price'}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <span className={`text-2xl font-black tabular-nums ${isUnsold ? 'text-neutral-500' : 'text-amber-700 dark:text-amber-500'}`}>
                            {formatNumber(auction.currentBid > 0 ? auction.currentBid : auction.startPrice)}
                        </span>
                        <span className={`text-xs font-bold self-end mb-1.5 ${isUnsold ? 'text-neutral-400' : 'text-amber-600/60'}`}>AC</span>
                    </div>
                </div>
            )}

            {!isEnded && (
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {isLive ? "Ends In" : "Starts In"}
                        </span>
                        <span className="text-[10px] normal-case opacity-90 font-semibold bg-muted px-1.5 py-0.5 rounded border border-border">
                            {new Date(isLive ? auction.endTime : auction.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <CountdownTimer
                        targetDate={isLive ? auction.endTime : auction.startTime}
                        status={status}
                    />
                </div>
            )}

            {isEnded && (
                <div className="flex items-center gap-2 justify-center p-2 bg-muted/40 rounded-lg border border-border/40 text-muted-foreground text-xs font-medium">
                    <Clock className="h-4 w-4" />
                    <span>Auction Ended on {formatDate(auction.endTime)}</span>
                </div>
            )}

        </CardContent>
    );
};
