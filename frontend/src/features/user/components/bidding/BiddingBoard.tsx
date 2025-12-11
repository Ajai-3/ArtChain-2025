import { useEffect, useRef } from "react";
import { useBiddingSocket } from "../../hooks/bidding/useBiddingSocket";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { useDispatch } from "react-redux";
import { setBids } from "../../../../redux/slices/biddingSlice";

interface BiddingBoardProps {
  auctionId: string;
  initialBids?: any[];
}

export const BiddingBoard = ({ auctionId, initialBids }: BiddingBoardProps) => {
  const dispatch = useDispatch();
  const { bids } = useBiddingSocket(auctionId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialBids && initialBids.length > 0) {
      // Dispatch initial bids from the fetched auction details
      // We use a small timeout to ensure this runs after useBiddingSocket's setActiveAuction
      // which might clear the state. Ideally logic should be consolidated.
      setTimeout(() => {
          dispatch(setBids(initialBids));
      }, 50);
    }
  }, [initialBids, dispatch]);

  useEffect(() => {
      // Auto scroll to top when new bid comes
      if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
      }
  }, [bids]);

  return (
    <div className="bg-card h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-muted/30 backdrop-blur-sm">
        <h3 className="font-semibold text-xl tracking-tight flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Live Bidding
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4" ref={scrollRef}>
        {bids.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 opacity-60">
            <span className="text-4xl">🏷️</span>
            <p>No bids yet. Start the action!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bids.map((bid: any, index: number) => {
                const isTopBid = index === 0;
                return (
                  <div 
                    key={bid.id || index} 
                    className={`
                        flex items-center justify-between p-4 rounded-xl transition-all duration-300
                        ${isTopBid 
                            ? 'bg-primary/5 border border-primary/20 shadow-sm scale-[1.02] mb-4' 
                            : 'bg-background/50 border border-border/40 hover:bg-accent/50'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                        <Avatar className={`border-2 ${isTopBid ? 'border-primary' : 'border-transparent'}`}>
                            <AvatarImage src={bid.bidder?.profileImage} />
                            <AvatarFallback>{bid.bidder?.username?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">
                                    {bid.bidder?.name || bid.bidder?.username || `User ${bid.bidderId?.slice(0, 4)}`}
                                </span>
                                {isTopBid && (
                                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                        Highest
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {bid.createdAt ? formatDistanceToNow(new Date(bid.createdAt), { addSuffix: true }) : 'Just now'}
                            </span>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className={`font-bold tabular-nums ${isTopBid ? 'text-xl text-primary' : 'text-base'}`}>
                            {bid.amount.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">Coins</span>
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
