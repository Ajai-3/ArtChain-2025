import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useMyBids } from "../../hooks/bidding/useMyBids";
import PageFallback from "../../../../components/PageFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { ArrowLeft, ExternalLink, Timer, Gavel, Wallet } from "lucide-react";

export default function MyBidsPage() {
  const { data: bids = [], isLoading, error } = useMyBids();
  const navigate = useNavigate();

  if (isLoading) return <PageFallback />;
  if (error) return <div className="p-10 text-center text-destructive">Failed to load your bids.</div>;

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={() => navigate("/bidding")} className="hover:bg-muted">
                <ArrowLeft className="h-5 w-5" />
             </Button>
             <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">My Bidding History</h1>
                <p className="text-sm text-muted-foreground">Track all your active and past bids.</p>
             </div>
         </div>
      </div>

      {bids.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-muted/20 border border-dashed border-border/50">
            <div className="p-4 bg-background rounded-full shadow-sm mb-4">
                 <Gavel className="h-8 w-8 text-primary/60" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">No bids placed yet</h3>
            <p className="text-muted-foreground mt-2 max-w-xs text-center text-sm">
                Join the action! Explore active auctions and place your first bid to start your collection.
            </p>
            <Button className="mt-6 font-semibold" variant="main" onClick={() => navigate("/bidding")}>
                Explore Auctions
            </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {bids.map((bid: any) => (
            <Card key={bid.id} className="overflow-hidden bg-card border-border/50 hover:border-primary/50 transition-all duration-300 group hover:shadow-md">
                <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                    <img 
                        src={bid.auction?.imageKey || bid.auction?.artId?.url || "https://via.placeholder.com/400"} 
                        alt={bid.auction?.title} 
                        className="object-cover w-full h-full opacity-90 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    
                    <Badge className="absolute top-2 right-2 backdrop-blur-md border-0 shadow-sm text-xs font-semibold bg-emerald-600/90 text-white hover:bg-emerald-700" variant={bid.auction?.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {bid.auction?.status === 'ACTIVE' ? (
                            <span className="flex items-center gap-1.5 text-white">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                                </span>
                                Live
                            </span>
                        ) : bid.auction?.status}
                    </Badge>
                </div>
                
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">{bid.auction?.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="p-4 space-y-4 pt-0">
                    <div className="p-3 mt-2 bg-muted/40 rounded-lg border border-border/40 flex items-center justify-between">
                        <div>
                             <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-0.5">Your Bid</span>
                             <span className="font-bold text-lg text-primary tabular-nums">{bid.amount.toLocaleString()}</span>
                        </div>
                        <Wallet className="h-5 w-5 text-muted-foreground/30" />
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Timer className="h-3 w-3" /> {formatDistanceToNow(new Date(bid.createdAt))} ago</span>
                    </div>

                    <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full font-medium" 
                        onClick={() => navigate(`/bidding/${bid.auction?.id}`)}
                    >
                        View Auction <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
