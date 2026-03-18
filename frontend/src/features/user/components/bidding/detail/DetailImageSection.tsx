import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../../../components/ui/avatar';
import { CheckCircle2, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { formatNumber } from '../../../../../libs/formatNumber';
import type { Auction } from '../../../../../types/auction';
import { useNavigate } from 'react-router-dom';

interface DetailImageSectionProps {
  auction: Auction;
  isLive: boolean;
  isEnded: boolean;
  isScheduled: boolean;
  isUnsold: boolean;
}

export const DetailImageSection = ({
  auction,
  isLive,
  isEnded,
  isScheduled,
  isUnsold,
}: DetailImageSectionProps) => {
  const navigate = useNavigate();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (auction.winner?.username) {
      navigate(`/${auction.winner.username}`);
    }
  };

  return (
    <div
      className={`flex-1 relative rounded-2xl border-2 bg-card overflow-hidden group shadow-sm ${
        isScheduled
          ? 'border-indigo-500/10 shadow-indigo-500/50'
          : isUnsold
            ? 'border-neutral-400/10 shadow-neutral-500/50'
            : isEnded
              ? 'border-amber-500/10 shadow-amber-500/50'
              : isLive
                ? 'border-emerald-500/10 shadow-emerald-500/50'
                : 'border-border'
      }`}
    >
      <img
        src={
          auction.signedImageUrl ||
          auction.imageKey ||
          'https://via.placeholder.com/800x600'
        }
        alt={auction.title}
        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
      />
{/*  */}

      {/* Winner Overlay */}
      {isEnded && !isUnsold && auction.winner && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 pt-12 flex flex-col items-center justify-end text-center animate-in slide-in-from-bottom-5">
          <p className="text-amber-300 font-bold tracking-widest uppercase text-sm mb-3 drop-shadow-md">
            🏆 Auction Winner
          </p>
          <div className="relative mb-3">
            <Avatar
              onClick={handleProfileClick}
              className="cursor-pointer h-20 w-20 border-4 border-amber-400 shadow-amber-500/30 shadow-2xl ring-4 ring-black/50"
            >
              <AvatarImage src={auction.winner?.profileImage} />
              <AvatarFallback className="bg-amber-100 text-amber-800 text-2xl font-bold">
                {auction.winner?.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 rounded-full p-1.5 shadow-lg border-2 border-black">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <h2
            onClick={handleProfileClick}
            className="cursor-pointer text-2xl font-black text-white drop-shadow-xl mb-1"
          >
            {auction.winner?.name || auction.winner?.username}
          </h2>
          <p className="text-white/80 font-medium">
            Won for{' '}
            <span className="text-emerald-400 font-bold">
              {formatNumber(auction.currentBid)} AC
            </span>
          </p>
        </div>
      )}

      {/* Unsold Overlay */}
      {isUnsold && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 pt-12 flex flex-col items-center justify-end text-center animate-in slide-in-from-bottom-5">
          <div className="bg-neutral-800 p-3 rounded-full mb-2">
            <Clock className="h-8 w-8 text-neutral-400" />
          </div>
          <h2 className="text-xl font-bold text-white drop-shadow-xl mb-1">
            Auction Unsold
          </h2>
          <p className="text-white/60 font-medium text-sm">
            Reserve not met or no bids placed.
          </p>
        </div>
      )}
    </div>
  );
};
