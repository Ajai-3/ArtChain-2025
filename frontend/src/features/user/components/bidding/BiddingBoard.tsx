import { useBiddingSocket } from "../../hooks/bidding/useBiddingSocket";

import { formatDistanceToNow } from "date-fns";

interface BiddingBoardProps {
  auctionId: string;
}

export const BiddingBoard = ({ auctionId }: BiddingBoardProps) => {
  const { bids } = useBiddingSocket(auctionId);

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm h-[400px] flex flex-col">
      <div className="p-4 border-b border-border bg-muted/50">
        <h3 className="font-semibold text-lg">Live Bids</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {bids.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No bids yet. Be the first!
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid: any, index: number) => (
              <div 
                key={bid._id || index} 
                className={`flex justify-between items-center p-3 rounded-lg ${index === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-background border border-border'}`}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm">User {bid.bidderId?.slice(0, 4)}...</span>
                  <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(bid.createdAt || Date.now()), { addSuffix: true })}</span>
                </div>
                <div className="font-bold text-primary">
                  {bid.amount} Coins
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
