import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { isAfter } from "date-fns";
import { Clock, TrendingUp } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";

interface AuctionCardProps {
  auction: {
    id: string;
    title: string;
    imageKey: string;
    currentBid: number;
    startPrice: number;
    startTime: string;
    endTime: string;
    status: string;
    host?: {
      id: string;
      username: string;
      name?: string;
      profileImage?: string;
    };
    bids?: any[];
  };
}

export const AuctionCard = ({ auction }: AuctionCardProps) => {
  // Calculate if it should be live based on time even if status implies scheduled (for client-side display)
  const now = new Date();
  const startTime = new Date(auction.startTime);
  const endTime = new Date(auction.endTime);
  const isActuallyLive = isAfter(now, startTime) && isAfter(endTime, now);

  const displayStatus = isActuallyLive ? 'ACTIVE' : auction.status;

  return (
    <Card className="overflow-hidden bg-card border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <img
          src={auction.imageKey || "https://via.placeholder.com/400"}
          alt={auction.title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
             {displayStatus === 'ACTIVE' ? (
                <Badge variant="default" className="bg-emerald-600/90 text-white backdrop-blur-md border-0 shadow-sm hover:bg-emerald-700 h-6 px-2 text-xs">
                    <span className="flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                        </span>
                        Live
                    </span>
                </Badge>
             ) : (
                <Badge variant="secondary" className="backdrop-blur-md shadow-sm h-6 px-2 text-xs bg-indigo-600/90 text-white hover:bg-indigo-700">
                    Upcoming
                </Badge>
             )}
        </div>

        {/* Host Avatar (Overlay) */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-white/20 shadow-sm">
                <AvatarImage src={auction.host?.profileImage} />
                <AvatarFallback className="text-xs font-bold">{auction.host?.username?.substring(0, 2).toUpperCase() || "H"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-white drop-shadow-md leading-none">
                    {auction.host?.name || auction.host?.username || "Unknown Host"}
                </span>
                <span className="text-[10px] text-white/80 font-medium drop-shadow-md leading-none mt-0.5">
                    Verified Host
                </span>
            </div>
        </div>
      </div>

      <CardHeader className="p-4 pb-2 space-y-1">
        <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {auction.title}
        </h3>
      </CardHeader>

      <CardContent className={`p-4 pt-0 space-y-4 flex-1`}>
        {displayStatus === 'ACTIVE' ? (
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-sm">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold tracking-wider mb-0.5 block">Current Highest Bid</span>
                <div className="flex items-center gap-1.5">
                     <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                     <span className="text-2xl font-black tabular-nums text-emerald-700 dark:text-emerald-400">{auction.currentBid > 0 ? auction.currentBid : auction.startPrice}</span>
                     <span className="text-xs font-bold text-emerald-600/80 dark:text-emerald-500/80 self-end mb-1.5">Coins</span>
                </div>
            </div>
        ) : (
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-sm">
                 <span className="text-[10px] text-indigo-700 dark:text-indigo-400 uppercase font-bold tracking-wider mb-0.5 block">Starting Price</span>
                 <div className="flex items-center gap-1.5">
                      <span className="text-2xl font-black tabular-nums text-indigo-700 dark:text-indigo-400">{auction.startPrice}</span>
                      <span className="text-xs font-bold text-indigo-600/80 dark:text-indigo-500/80 self-end mb-1.5">Coins</span>
                 </div>
            </div>
        )}

        <div className="space-y-1.5">
             <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> 
                    {displayStatus === 'ACTIVE' ? "Ends In" : "Starts"}
                </span>
                <span className="text-[10px] normal-case opacity-90 font-semibold bg-muted px-1.5 py-0.5 rounded">
                    {displayStatus === 'ACTIVE' 
                        ? `Started: ${new Date(auction.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                        : new Date(auction.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    }
                </span>
             </div>
            <CountdownTimer 
                targetDate={displayStatus === 'ACTIVE' ? auction.endTime : auction.startTime} 
                status={displayStatus} 
            />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
            asChild 
            className={`w-full font-bold h-10 text-sm tracking-wide transition-all duration-300 shadow-md border-0 ${
                displayStatus === 'ACTIVE' 
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-emerald-500/20 hover:shadow-lg hover:-translate-y-0.5' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30 hover:shadow-lg hover:-translate-y-0.5'
            }`} 
            size="sm"
        >
          <Link to={`/bidding/${auction.id}`}>
            {displayStatus === 'ACTIVE' ? "Place Bid Now" : "View Auction Details"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
