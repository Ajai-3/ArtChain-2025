import { useRef, useEffect } from "react";
import { VerifiedArtistBadge } from "../../../../components/shared/VerifiedArtistBadge";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";

interface BiddingBoardProps {
  auctionId: string;
  bids: any[];
  isEnded?: boolean;
}

export const BiddingBoard = ({ auctionId: _auctionId, bids, isEnded = false }: BiddingBoardProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Removed local socket hook usage, data is passed from parent
  // const { bids } = useBiddingSocket(auctionId); -> Lifted to DetailBidFeed using it via props

  useEffect(() => {
    // Redux setBids dispatch removed as it's handled by parent's socket hook or page load events
  }, []);

  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
      }
  }, [bids]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-transparent">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4" ref={scrollRef}>
        {bids.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 opacity-60">
            <span className="text-4xl">🏷️</span>
            <p className="text-sm font-medium">{isEnded ? "No bids were placed." : "No bids yet. Start the action!"}</p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {bids.map((bid: any, index: number) => {
                const isTopBid = index === 0;
                return (
                  <div 
                    key={bid.id || index} 
                    className={`
                        flex items-center justify-between p-3 rounded-xl transition-all duration-300
                        ${isTopBid 
                            ? isEnded
                                ? 'bg-amber-500/10 border border-amber-500/40 shadow-sm scale-[1.01]'
                                : 'bg-emerald-500/10 border border-emerald-500/30 shadow-sm scale-[1.01] mb-2' 
                            : 'bg-background/50 border border-border/40 hover:bg-accent/50'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                        <Avatar className={`h-8 w-8 border-2 ${isTopBid ? (isEnded ? 'border-amber-500' : 'border-emerald-500') : 'border-transparent'}`}>
                            <AvatarImage src={bid.bidder?.profileImage} />
                            <AvatarFallback>{bid.bidder?.username?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm flex items-center gap-1">
                                    {bid.bidder?.name || bid.bidder?.username || `User ${bid.bidderId?.slice(0, 4)}`}
                                    <VerifiedArtistBadge 
                                        isVerified={bid.bidder?.isVerified} 
                                        role={bid.bidder?.role} 
                                        showTooltip={false}
                                        className="h-3 w-3 text-blue-500 fill-blue-500"
                                    />
                                </span>
                                {isTopBid && (
                                    <Badge variant="secondary" className={`text-[9px] px-1.5 py-0 h-4 ${isEnded ? 'bg-amber-500/20 text-amber-600 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30'}`}>
                                        {isEnded ? "WINNER" : "HIGHEST"}
                                    </Badge>
                                )}
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                                {bid.createdAt ? formatDistanceToNow(new Date(bid.createdAt), { addSuffix: true }) : 'Just now'}
                            </span>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className={`font-bold tabular-nums ${isTopBid ? (isEnded ? 'text-lg text-amber-600' : 'text-lg text-emerald-600') : 'text-sm'}`}>
                            {bid.amount.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">AC</span>
                        </div>
                    </div>
                  </div>
                );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
