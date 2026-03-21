import { Badge } from '../../../../../components/ui/badge';
import { Clock, Users } from 'lucide-react';
import { BiddingBoard } from '../BiddingBoard';
import type { Auction } from '../../../../../types/auction';
import { useBiddingSocket } from '../../../hooks/bidding/useBiddingSocket';

interface DetailBidFeedProps {
  auction: Auction;
  isLive: boolean;
  isEnded: boolean;
  isScheduled: boolean;
  isCanceled: boolean;
  isUnsold: boolean;
  initialBids?: any[];
}

export const DetailBidFeed = ({
  auction,
  isLive,
  isEnded,
  isScheduled,
  isCanceled,
  isUnsold,
  initialBids,
}: DetailBidFeedProps) => {
  const { bids, activeUsers } = useBiddingSocket(auction.id, initialBids);

  const getContainerClass = () => {
    if (isLive) return 'border-emerald-500/50';
    if (isScheduled) return 'border-indigo-500/50';
    if (isUnsold) return 'border-neutral-500/50';
    if (isEnded) return 'border-amber-500/50';
    if (isCanceled) return 'border-red-500/50';
    return 'border-border';
  };

  const getHeaderClass = () => {
    if (isLive) return 'bg-emerald-500/5 border-emerald-500/10';
    if (isScheduled) return 'bg-indigo-500/5 border-indigo-500/10';
    if (isUnsold) return 'bg-neutral-500/5 border-neutral-500/10';
    if (isEnded) return 'bg-amber-500/5 border-amber-500/10';
    if (isCanceled) return 'bg-red-500/5 border-red-500/10';
    return 'bg-muted/5 border-border';
  };

  const getTitle = () => {
    if (isLive) return 'Live Bidding Feed';
    if (isScheduled) return 'Waiting Room';
    if (isUnsold) return 'Final Bids Log';
    if (isEnded) return 'Final Bids Log';
    if (isCanceled) return 'Canceled Bids Log';
    return 'Bids';
  };

  return (
    <div
      className={`flex-1 min-h-[400px] md:min-h-0 rounded-2xl overflow-hidden shadow-sm flex flex-col border-2 bg-card ${getContainerClass()}`}
    >
      <div
        className={`p-4 border-b flex justify-between items-center shrink-0 ${getHeaderClass()}`}
      >
        <h3 className="font-bold text-sm flex items-center gap-2">
          {getTitle()}
          {isLive && (
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </h3>
        <div className="flex items-center gap-2">
          {isLive && (
            <Badge
              variant="secondary"
              className="bg-background/50 gap-1 hidden sm:flex"
            >
              <Users className="h-3 w-3" />
              {activeUsers}
            </Badge>
          )}
          <Badge variant="outline" className="bg-background/50">
            {bids?.length || 0} Bids
          </Badge>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
          {isScheduled && (!bids || bids.length === 0) ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground opacity-60">
              <Clock className="h-10 w-10 mb-3 text-indigo-400" />
              <p className="font-medium text-sm">Auction hasn't started yet.</p>
              <p className="text-xs mt-1">Be ready to place the first bid!</p>
              {activeUsers > 0 && (
                <p className="text-[10px] mt-2 text-indigo-400">
                  {activeUsers} users waiting
                </p>
              )}
            </div>
          ) : (
            <BiddingBoard
              auctionId={auction.id}
              bids={bids}
              isEnded={isEnded}
            />
          )}
        </div>
      </div>
    </div>
  );
};
