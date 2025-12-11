import { Badge } from "../../../../components/ui/badge";
import { VerifiedArtistBadge } from "../../../../components/shared/VerifiedArtistBadge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Clock, TrendingUp } from "lucide-react";
import type { Auction } from "../../../../types/auction"; 

interface AuctionCardImageProps {
  auction: Auction;
  isLive: boolean;
  isEnded: boolean;
  isScheduled: boolean;
  isUnsold: boolean;
}

export const AuctionCardImage = ({ auction, isLive, isEnded, isScheduled, isUnsold }: AuctionCardImageProps) => {
  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <img
          src={auction.imageKey || "https://via.placeholder.com/400"}
          alt={auction.title}
          className={`object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 ${isEnded ? 'grayscale-[0.5]' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
             {isLive && (
                <Badge className="!bg-emerald-600 hover:!bg-emerald-700 !text-white border-0 shadow-lg h-6 px-2.5 text-xs font-bold tracking-wide">
                    <span className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        Live Now
                    </span>
                </Badge>
             )}
             {isScheduled && (
                <Badge className="!bg-indigo-600 hover:!bg-indigo-700 !text-white border-0 shadow-sm h-6 px-2.5 text-xs font-bold tracking-wide">
                    Upcoming
                </Badge>
             )}
             {isEnded && (
                <Badge className={`!text-white border-0 shadow-sm h-6 px-2.5 text-xs font-bold tracking-wide ${isUnsold ? '!bg-neutral-800 hover:!bg-neutral-900' : '!bg-red-600 hover:!bg-red-700'}`}>
                    {isUnsold ? 'Unsold' : 'Ended'}
                </Badge>
             )}
        </div>

        {/* Host Avatar (Overlay) */}
        {!isEnded && (
          <div className="absolute bottom-2 left-2 flex items-center gap-2 z-10">
              <Avatar className="h-8 w-8 border-2 border-white/20 shadow-sm">
                  <AvatarImage src={auction.host?.profileImage} />
                  <AvatarFallback className="text-xs font-bold">{auction.host?.username?.substring(0, 2).toUpperCase() || "H"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white drop-shadow-md leading-none max-w-[120px] truncate">
                          {auction.host?.name || auction.host?.username || "Unknown Host"}
                      </span>
                      <VerifiedArtistBadge 
                        isVerified={auction.host?.isVerified} 
                        role={auction.host?.role} 
                        showTooltip={false}
                        className="h-3 w-3 text-blue-500 fill-blue-500"
                      />
                  </div>
                  <span className="text-[10px] text-white/80 font-medium drop-shadow-md leading-none mt-0.5 uppercase tracking-wider">
                      {auction.host?.role === 'artist' ? 'Artist' : 'Host'}
                  </span>
              </div>
          </div>
        )}

        {/* Winner Overlay for Ended Auctions (IF SOLD) */}
        {isEnded && !isUnsold && (auction as any).winner && (
           <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8 flex items-center gap-3 animate-in slide-in-from-bottom-2">
              <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-amber-400 shadow-amber-500/20 shadow-lg">
                      <AvatarImage src={(auction as any).winner?.profileImage} />
                      <AvatarFallback className="text-amber-700 bg-amber-100 font-bold">W</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-900 rounded-full p-0.5 shadow-sm">
                      <TrendingUp className="h-3 w-3" />
                  </div>
              </div>
              <div className="flex flex-col">
                   <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Winner</span>
                   <span className="text-sm font-bold text-white">{(auction as any).winner?.name || (auction as any).winner?.username}</span>
              </div>
           </div>
        )}
        
        {/* Unsold Overlay */}
         {isEnded && isUnsold && (
            <div className="absolute bottom-2 left-2 flex items-center gap-2 z-10 opacity-80">
                 <div className="p-1.5 rounded-full bg-neutral-800/80 border border-neutral-600">
                    <Clock className="h-4 w-4 text-white" />
                 </div>
                 <span className="text-xs font-medium text-white/80 drop-shadow-md">No Bids Placed</span>
            </div>
         )}
      </div>
  );
};
