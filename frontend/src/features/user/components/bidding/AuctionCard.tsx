import { Card, CardHeader } from '../../../../components/ui/card';
import type { Auction } from '../../../../types/auction';
import { AuctionCardImage } from './AuctionCardImage';
import { AuctionCardDetails } from './AuctionCardDetails';
import { AuctionCardAction } from './AuctionCardAction';

interface AuctionCardProps {
  auction: Auction;
}

export const AuctionCard = ({ auction }: AuctionCardProps) => {
  // Sync status if needed, but respect backend status generally
  const now = new Date();
  const startTime = new Date(auction.startTime);
  const endTime = new Date(auction.endTime);

  // Refine Status Logic
  let status = auction.status;
  console.log('status', status);
  if (status === 'SCHEDULED' && now >= startTime) status = 'ACTIVE';
  if (status === 'ACTIVE' && now >= endTime) status = 'ENDED';

  const isLive = status === 'ACTIVE';
  const isEnded = status === 'ENDED';
  const isScheduled = status === 'SCHEDULED';
  const isUnsold =
    status === 'UNSOLD' && (!auction.bids || auction.bids.length === 0);

  return (
    <Card
      className={`overflow-hidden bg-card transition-all duration-300 hover:shadow-lg group flex flex-col h-full border ${
        isLive
          ? 'border-emerald-600/50 shadow-emerald-500/20'
          : isEnded
            ? 'border-yellow-600/50 shadow-yellow-500/20'
            : isScheduled
              ? 'border-indigo-600/50 shadow-indigo-500/20'
            : isUnsold
              ? 'border-neutral-600/50 shadow-neutral-500/20'
              : ''
      }`}
    >
      <AuctionCardImage
        auction={auction}
        isLive={isLive}
        isEnded={isEnded}
        isScheduled={isScheduled}
        isUnsold={isUnsold}
      />

      <CardHeader className="p-4 pb-2">
        <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
          {auction.title}
        </h3>
      </CardHeader>

      <AuctionCardDetails
        auction={auction}
        isLive={isLive}
        isEnded={isEnded}
        isScheduled={isScheduled}
        isUnsold={isUnsold}
        status={status}
      />

      <AuctionCardAction
        auction={auction}
        isLive={isLive}
        isEnded={isEnded}
        isScheduled={isScheduled}
        isUnsold={isUnsold}
      />
    </Card>
  );
};
