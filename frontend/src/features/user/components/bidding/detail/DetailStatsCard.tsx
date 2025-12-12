import { Button } from "../../../../../components/ui/button";
import { Clock, CheckCircle2 } from "lucide-react";
import { CountdownTimer } from "../CountdownTimer";
import { formatNumber } from "../../../../../libs/formatNumber";
import type { Auction } from "../../../../../types/auction";

interface DetailStatsCardProps {
    auction: Auction;
    isLive: boolean;
    isEnded: boolean;
    isScheduled: boolean;
    isUnsold: boolean;
    onPlaceBid: () => void;
    refetch: () => void;
}

export const DetailStatsCard = ({ auction, isLive, isEnded, isScheduled, isUnsold, onPlaceBid, refetch }: DetailStatsCardProps) => {
    return (
        <div className={`
            relative rounded-2xl p-4 shadow-xl h-[32%] shrink-0 flex flex-col gap-4 overflow-hidden border-2
            ${isLive 
                ? 'bg-card border-emerald-500 shadow-emerald-500/10' 
                : isEnded 
                   ? (isUnsold ? 'bg-card border-neutral-500 shadow-neutral-500/10' : 'bg-card border-red-500/50 shadow-red-500/10')
                   : 'bg-card border-indigo-500 shadow-indigo-500/10'}
        `}>
             {/* Decorative Gradient Blob */}
             <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[50px] opacity-30 pointer-events-none 
                ${isLive ? 'bg-emerald-500' : isEnded ? (isUnsold ? 'bg-neutral-500' : 'bg-red-500') : 'bg-indigo-500'}`} 
             />

             <div className="min-h-0 flex-1 flex flex-col gap-2">
                 <div className="flex justify-between items-start gap-4 shrink-0">
                    <h1 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight line-clamp-2" title={auction.title}>
                        {auction.title}
                    </h1>
                    {isScheduled && (
                        <div className="shrink-0 p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                            <Clock className="h-5 w-5" />
                        </div>
                    )}
                    {isEnded && (
                        <div className={`shrink-0 p-2 rounded-lg ${isUnsold ? 'bg-neutral-500/10 text-neutral-500' : 'bg-red-500/10 text-red-500'}`}>
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    )}
                 </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div className={`p-4 rounded-xl border backdrop-blur-sm ${
                     isLive 
                        ? 'bg-emerald-500/5 border-emerald-500/20' 
                     : isEnded 
                        ? (isUnsold ? 'bg-neutral-500/5 border-neutral-500/20' : 'bg-red-500/5 border-red-500/20')
                        : 'bg-indigo-500/5 border-indigo-500/20'
                 }`}>
                     <span className={`text-[10px] uppercase font-bold tracking-wider mb-1 block ${
                         isLive ? 'text-emerald-500' : isEnded ? (isUnsold ? 'text-neutral-500' : 'text-red-500') : 'text-indigo-500'
                     }`}>
                         {isLive ? 'Current Highest Bid' : isEnded ? (isUnsold ? 'Starting Price' : 'Final Sold Price') : 'Starting Price'}
                     </span>
                     <div className="flex items-baseline gap-1">
                         <span className={`text-3xl font-black tabular-nums tracking-tighter ${
                             isLive ? 'text-emerald-600 dark:text-emerald-400' : isEnded ? (isUnsold ? 'text-neutral-600 dark:text-neutral-400' : 'text-red-600 dark:text-red-400') : 'text-indigo-600 dark:text-indigo-400'
                         }`}>
                            {formatNumber((auction.currentBid || 0) > 0 ? (auction.currentBid || 0) : (auction.startPrice || 0))}
                         </span>
                         <span className="text-xs font-bold text-muted-foreground">AC</span>
                     </div>
                 </div>
                 
                 {/* Timer or Ended Status */}
                 <div className="px-4 py-2 bg-muted/30 rounded-xl border border-border/50 backdrop-blur-sm">
                     {isEnded ? (
                        <div className="h-full flex flex-col justify-center">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Status</span>
                            <span className={`font-bold flex items-center gap-1.5 ${isUnsold ? 'text-neutral-600' : 'text-red-600 dark:text-red-400'}`}>
                                {isUnsold ? "Auction Unsold" : "Auction Closed"}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-1">
                                Ended {new Date(auction.endTime).toLocaleDateString()}
                            </span>
                        </div>
                     ) : (
                         <>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex justify-between items-center gap-1.5 mb-1">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> 
                                    {isLive ? 'Ends In' : 'Starts In'}
                                </span>
                                {!isLive && (
                                    <span className="text-[10px] normal-case opacity-70">
                                        {new Date(auction.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                    </span>
                                )}
                            </span>
                            <div className="scale-105 origin-left mt-1">
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

             <Button 
                className={`
                    w-full h-14 text-lg font-bold shadow-lg transition-all active:scale-[0.99] uppercase tracking-wide
                    ${isLive 
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-emerald-500/20' 
                    : isEnded
                        ? 'bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900 cursor-not-allowed opacity-100 text-muted-foreground shadow-none border border-border'
                        : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/20 cursor-not-allowed opacity-90'}
                `}
                onClick={onPlaceBid}
                disabled={!isLive}
             >
                {isLive ? (
                    <span className="flex items-center gap-2">
                         <span className="relative flex h-3 w-3">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-3 w-3 bg-white/80"></span>
                         </span>
                         Place Bid Now
                    </span>
                ) : isEnded ? (
                     <span className="flex items-center gap-2">
                        {isUnsold ? <Clock className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                        {isUnsold ? "Auction Unsold" : "Sold to Winner"}
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Clock className="h-5 w-5" /> Coming Soon
                    </span>
                )}
             </Button>
        </div>
    );
};
