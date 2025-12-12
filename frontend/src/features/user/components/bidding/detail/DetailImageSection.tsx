import { Avatar, AvatarFallback, AvatarImage } from "../../../../../components/ui/avatar";
import { CheckCircle2, TrendingUp, Clock } from "lucide-react";
import { formatNumber } from "../../../../../libs/formatNumber";
import type { Auction } from "../../../../../types/auction";

interface DetailImageSectionProps {
    auction: Auction;
    isLive: boolean;
    isEnded: boolean;
    isUnsold: boolean;
}

export const DetailImageSection = ({ auction, isLive, isEnded, isUnsold }: DetailImageSectionProps) => {
    return (
        <div className={`flex-1 relative rounded-2xl border-2 bg-card overflow-hidden group shadow-sm ${isEnded ? 'grayscale-[0.5] border-border' : 'border-border'}`}>
            <img
              src={auction.signedImageUrl || auction.imageKey || "https://via.placeholder.com/800x600"}
              alt={auction.title}
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
            />
            
            {/* Overlay Details */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                 {isLive && (
                    <div className="bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold shadow-lg animate-pulse">
                         <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                         </span>
                         LIVE
                    </div>
                )}
                {isEnded && (
                     <div className={`${isUnsold ? 'bg-neutral-600/90' : 'bg-red-500/90'} backdrop-blur-md text-white px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold shadow-lg`}>
                         <CheckCircle2 className="h-4 w-4" />
                         {isUnsold ? "Ended (Unsold)" : "Ended"}
                    </div>
                )}
            </div>

            {/* Big Winner Overlay on Image for Impact */}
            {isEnded && !isUnsold && auction.winner && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 pt-12 flex flex-col items-center justify-end text-center animate-in slide-in-from-bottom-5">
                   <p className="text-amber-300 font-bold tracking-widest uppercase text-sm mb-3 drop-shadow-md">🏆 Auction Winner</p>
                   <div className="relative mb-3">
                       <Avatar className="h-20 w-20 border-4 border-amber-400 shadow-amber-500/30 shadow-2xl ring-4 ring-black/50">
                           <AvatarImage src={auction.winner?.profileImage} />
                           <AvatarFallback className="bg-amber-100 text-amber-800 text-2xl font-bold">{auction.winner?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                       </Avatar>
                       <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 rounded-full p-1.5 shadow-lg border-2 border-black">
                           <TrendingUp className="h-4 w-4" />
                       </div>
                   </div>
                   <h2 className="text-2xl font-black text-white drop-shadow-xl mb-1">{auction.winner?.name || auction.winner?.username}</h2>
                   <p className="text-white/80 font-medium">Won for <span className="text-emerald-400 font-bold">{formatNumber(auction.currentBid)} AC</span></p>
                </div>
            )}
            
            {/* Unsold Overlay */}
            {isEnded && isUnsold && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 pt-12 flex flex-col items-center justify-end text-center animate-in slide-in-from-bottom-5">
                   <div className="bg-neutral-800 p-3 rounded-full mb-2">
                       <Clock className="h-8 w-8 text-neutral-400" />
                   </div>
                   <h2 className="text-xl font-bold text-white drop-shadow-xl mb-1">Auction Unsold</h2>
                   <p className="text-white/60 font-medium text-sm">Reserve not met or no bids placed.</p>
                </div>
            )}
        </div>
    );
};
