import { Badge } from "../../../../../components/ui/badge";
import { Clock } from "lucide-react";
import { BiddingBoard } from "../BiddingBoard";
import type { Auction } from "../../../../../types/auction";

interface DetailBidFeedProps {
    auction: Auction;
    isLive: boolean;
    isEnded: boolean;
    isScheduled: boolean;
    isUnsold: boolean;
}

export const DetailBidFeed = ({ auction, isLive, isEnded, isScheduled, isUnsold }: DetailBidFeedProps) => {
    return (
        <div className={`flex-1 min-h-0 rounded-2xl overflow-hidden shadow-sm flex flex-col border-2 ${
            isLive 
                ? 'bg-card border-emerald-500/50' 
            : isEnded 
                ? (isUnsold ? 'bg-card border-neutral-500/50' : 'bg-card border-red-500/50')
                : 'bg-card border-indigo-500/50'
        }`}>
            <div className={`p-4 border-b flex justify-between items-center shrink-0 ${
                 isLive 
                    ? 'bg-emerald-500/5 border-emerald-500/10' 
                : isEnded 
                    ? (isUnsold ? 'bg-neutral-500/5 border-neutral-500/10' : 'bg-red-500/5 border-red-500/10')
                    : 'bg-indigo-500/5 border-indigo-500/10'
            }`}>
                <h3 className="font-bold text-sm flex items-center gap-2">
                    {isLive ? 'Live Bidding Feed' : isEnded ? 'Final Bids Log' : 'Waiting Room'}
                    {isLive && <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                </h3>
                <Badge variant="outline" className="bg-background/50">
                    {auction.bids?.length || 0} Bids
                </Badge>
            </div>
            
            <div className="flex-1 min-h-0 relative">
                 <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                    {isScheduled && (!auction.bids || auction.bids.length === 0) ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground opacity-60">
                            <Clock className="h-10 w-10 mb-3 text-indigo-400" />
                            <p className="font-medium text-sm">Auction hasn't started yet.</p>
                            <p className="text-xs mt-1">Be ready to place the first bid!</p>
                        </div>
                    ) : (
                        <BiddingBoard 
                            auctionId={auction.id} 
                            initialBids={auction.bids} 
                            isEnded={isEnded}
                        />
                    )}
                 </div>
            </div>
        </div>
    );
};
