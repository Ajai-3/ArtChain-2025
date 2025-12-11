import { Badge } from "../../../../../components/ui/badge";
import { VerifiedArtistBadge } from "../../../../../components/shared/VerifiedArtistBadge";
import { CheckCircle2, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../components/ui/avatar";
import { TrendingUp } from "lucide-react";

interface AuctionHeroProps {
    auction: any;
    isLive: boolean;
    isEnded: boolean;
    isUnsold: boolean;
}

export const AuctionHero = ({ auction, isLive, isEnded, isUnsold }: AuctionHeroProps) => {
    return (
        <div className={`relative flex-1 rounded-2xl border-2 bg-card overflow-hidden group shadow-sm min-h-[400px] flex items-center justify-center ${isEnded ? 'border-border' : 'border-border'}`}>
            <img
                src={auction.signedImageUrl || auction.imageKey || "https://via.placeholder.com/800x600"}
                alt={auction.title}
                className={`w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02] ${isEnded ? 'grayscale-[0.3]' : ''}`}
            />

            {/* Overlay Details */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                {isLive && (
                    <Badge className="bg-emerald-500/90 hover:bg-emerald-600 backdrop-blur-md text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold shadow-lg animate-pulse border-0">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        LIVE NOW
                    </Badge>
                )}
                {isEnded && (
                    <Badge variant={isUnsold ? "destructive" : "secondary"} className={`backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold shadow-lg border-0 ${isUnsold ? 'bg-neutral-600/90 text-white hover:bg-neutral-700' : 'bg-amber-500/90 text-white hover:bg-amber-600'}`}>
                        {isUnsold ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                        {isUnsold ? "UNSOLD" : "SOLD"}
                    </Badge>
                )}
            </div>

            {/* Winner Overlay */}
            {isEnded && !isUnsold && auction.winner && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 pt-20 flex flex-col items-center justify-end text-center animate-in slide-in-from-bottom-5 pointer-events-none">
                    <p className="text-amber-300 font-bold tracking-widest uppercase text-xs mb-3 drop-shadow-md">🎉 Winning Bidder</p>
                    <div className="relative mb-3">
                        <Avatar className="h-20 w-20 border-4 border-amber-400 shadow-amber-500/30 shadow-2xl ring-4 ring-black/50">
                            <AvatarImage src={auction.winner?.profileImage} />
                            <AvatarFallback className="bg-amber-100 text-amber-800 text-2xl font-bold">{auction.winner?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 rounded-full p-1.5 shadow-lg border-2 border-black">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-white drop-shadow-xl mb-1 flex items-center gap-2">
                        {auction.winner?.name || auction.winner?.username}
                        <VerifiedArtistBadge 
                            isVerified={auction.winner?.isVerified} 
                            role={auction.winner?.role} 
                            showTooltip={false}
                            className="h-5 w-5 text-blue-500 fill-blue-500"
                        />
                    </h2>
                    <div className="flex items-center gap-2 text-white/90 font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                        <span className="text-xs uppercase text-white/60">Final Price</span>
                        <span className="text-emerald-400 font-bold text-lg">{auction.currentBid.toLocaleString()} AC</span>
                    </div>
                </div>
            )}
            
             {/* Unsold Overlay */}
             {isEnded && isUnsold && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-20 flex flex-col items-center justify-end text-center animate-in slide-in-from-bottom-5 pointer-events-none">
                     <div className="h-16 w-16 rounded-full bg-neutral-800/80 backdrop-blur-sm border-2 border-neutral-600 flex items-center justify-center mb-3 shadow-xl">
                        <XCircle className="h-8 w-8 text-neutral-400" />
                     </div>
                    <h2 className="text-xl font-bold text-white drop-shadow-xl mb-1">Auction Unsold</h2>
                    <p className="text-white/60 text-sm max-w-xs">Reserve price was not met or no bids were placed during the auction period.</p>
                </div>
            )}
        </div>
    );
};
