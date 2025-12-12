import { Button } from "../../../../../components/ui/button";
import { CheckCircle2, Clock, XCircle, Gavel, AlertCircle } from "lucide-react";
import { CountdownTimer } from "../CountdownTimer";

interface AuctionActionPanelProps {
    auction: any;
    isLive: boolean;
    isEnded: boolean;
    isUnsold: boolean;
    onPlaceBid: () => void;
    onTimerEnd: () => void;
}

export const AuctionActionPanel = ({ 
    auction, 
    isLive, 
    isEnded, 
    isUnsold, 
    onPlaceBid,
    onTimerEnd 
}: AuctionActionPanelProps) => {
    
    // Theme determination
    const borderColor = isLive ? "border-emerald-500/20" : isEnded ? (isUnsold ? "border-neutral-500/20" : "border-amber-500/20") : "border-indigo-500/20";
    const bgColor = isLive ? "bg-emerald-500/5" : isEnded ? (isUnsold ? "bg-neutral-500/5" : "bg-amber-500/5") : "bg-indigo-500/5";

    return (
        <div className={`rounded-2xl border-2 p-5 flex flex-col gap-6 shadow-xl relative overflow-hidden bg-card ${isLive ? 'border-emerald-500/40 shadow-emerald-500/10' : isEnded ? (isUnsold ? 'border-neutral-500/30' : 'border-amber-500/40 shadow-amber-500/10') : 'border-indigo-500/40 shadow-indigo-500/10'}`}>
             
             {/* Decorative BG Blob */}
             <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] opacity-20 pointer-events-none 
                ${isLive ? 'bg-emerald-500' : isEnded ? (isUnsold ? 'bg-neutral-500' : 'bg-amber-500') : 'bg-indigo-500'}`} 
             />

            {/* Price & Timer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {/* Price Card */}
                <div className={`p-4 rounded-xl border backdrop-blur-sm flex flex-col justify-center ${bgColor} ${borderColor}`}>
                    <span className={`text-[10px] uppercase font-bold tracking-wider mb-1 block opacity-80 ${
                        isLive ? 'text-emerald-600 dark:text-emerald-400' : isEnded ? (isUnsold ? 'text-neutral-500' : 'text-amber-600 dark:text-amber-400') : 'text-indigo-600 dark:text-indigo-400'
                    }`}>
                        {isLive ? 'Current Highest Bid' : isEnded ? (isUnsold ? 'Starting Price' : 'Winning Bid') : 'Starting Price'}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                        <span className={`text-3xl font-black tabular-nums tracking-tight ${
                             isLive ? 'text-emerald-700 dark:text-emerald-400' : isEnded ? (isUnsold ? 'text-neutral-500' : 'text-amber-600 dark:text-amber-400') : 'text-indigo-600 dark:text-indigo-400'
                        }`}>
                           {((auction.currentBid > 0 ? auction.currentBid : auction.startPrice) || 0).toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground uppercase">AC</span>
                    </div>
                    {isUnsold && (
                        <span className="text-[10px] text-destructive font-medium mt-1 flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> Reserve Not Met
                        </span>
                    )}
                </div>

                {/* Status/Timer Card */}
                <div className="p-4 bg-muted/30 rounded-xl border border-border/60 backdrop-blur-sm flex flex-col justify-center">
                    {isEnded ? (
                         <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Final Status</span>
                            <span className={`font-bold flex items-center gap-2 ${isUnsold ? 'text-neutral-500' : 'text-amber-600 dark:text-amber-400'}`}>
                                {isUnsold ? (
                                    <>Auction Closed (Unsold)</>
                                ) : (
                                    <>Sold to Winner</>
                                )}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-1 opacity-70">
                                Ended {new Date(auction.endTime).toLocaleDateString()}
                            </span>
                        </div>
                    ) : (
                        <>
                             <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex justify-between items-center gap-1.5 mb-1">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-3 w-3" /> 
                                    {isLive ? 'Ends In' : 'Starts In'}
                                </span>
                            </span>
                            <div className="scale-105 origin-left">
                                <CountdownTimer 
                                    targetDate={isLive ? auction.endTime : auction.startTime} 
                                    status={auction.status}
                                    onTimerEnd={onTimerEnd}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <Button 
                className={`
                    w-full h-12 text-base font-bold shadow-lg transition-all active:scale-[0.99] uppercase tracking-wide
                    ${isLive 
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-emerald-500/20' 
                    : isEnded
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed shadow-none border border-border'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 opacity-90'}
                `}
                onClick={onPlaceBid}
                disabled={!isLive}
            >
                {isLive ? (
                    <span className="flex items-center gap-2">
                        <Gavel className="h-4 w-4" /> Place Bid Now
                    </span>
                ) : isEnded ? (
                        <span className="flex items-center gap-2">
                        {isUnsold ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                        {isUnsold ? "Auction Unsold" : "Auction Ended"}
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Coming Soon
                    </span>
                )}
            </Button>
        </div>
    );
};
