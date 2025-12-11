import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { ArrowLeft, Info, Wallet, Gavel, ExternalLink, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../../../../../components/ui/dialog";
import { formatNumber } from "../../../../../libs/formatNumber";
import type { Auction } from "../../../../../types/auction";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../components/ui/avatar";
import { VerifiedArtistBadge } from "../../../../../components/shared/VerifiedArtistBadge";

interface DetailNavigationProps {
    auction: Auction;
    navigate: (path: string) => void;
    isLive: boolean;
    isEnded: boolean;
    isUnsold: boolean;
}

export const DetailNavigation = ({ auction, navigate, isLive, isEnded, isUnsold }: DetailNavigationProps) => {
    return (
        <div className="flex justify-between items-center shrink-0">
             <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent hover:text-primary" onClick={() => navigate("/bidding")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <div className="flex gap-2">
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Info className="h-4 w-4" /> About Auction
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">{auction.title}</DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Hosted by {auction.host?.name || auction.host?.username}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 mt-2">
                             {/* Host Profile Section */}
                             <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border border-border/50">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                        <AvatarImage src={auction.host?.profileImage} />
                                        <AvatarFallback>{auction.host?.name?.[0] || auction.host?.username?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-semibold text-sm flex items-center gap-1.5">
                                            {auction.host?.name || auction.host?.username}
                                            <VerifiedArtistBadge 
                                                isVerified={auction.host?.isVerified} 
                                                role={auction.host?.role} 
                                                showTooltip={false}
                                                className="h-3 w-3 text-blue-500 fill-blue-500"
                                            />
                                        </h4>
                                        <p className="text-xs text-muted-foreground">@{auction.host?.username}</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="secondary" onClick={() => navigate(`/${auction.host?.username}`)}>
                                    View Profile <ExternalLink className="ml-2 h-3 w-3" />
                                </Button>
                             </div>

                            <div>
                                <h4 className="text-sm font-bold text-foreground mb-2">Description</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {auction.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                 <div>
                                    <span className="text-xs text-muted-foreground block">Start Time</span>
                                    <span className="text-sm font-medium">{new Date(auction.startTime).toLocaleString()}</span>
                                 </div>
                                 <div>
                                    <span className="text-xs text-muted-foreground block">End Time</span>
                                    <span className="text-sm font-medium">{new Date(auction.endTime).toLocaleString()}</span>
                                 </div>
                                 <div>
                                    <span className="text-xs text-muted-foreground block">Starting Price</span>
                                    <span className="text-sm font-medium">{formatNumber(auction.startPrice)} AC</span>
                                 </div>
                                 {isEnded && (
                                     <div>
                                        <span className="text-xs text-muted-foreground block">Final Price</span>
                                        <span className="text-sm font-medium">{formatNumber(auction.currentBid)} AC</span>
                                     </div>
                                 )}
                            </div>

                            {/* Auction Rules & Disclaimer */}
                            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
                                <h4 className="font-semibold text-sm flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                    <Shield className="h-4 w-4" /> Auction Rules & Safe Play
                                </h4>
                                <ul className="space-y-2.5">
                                    <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                                        <Wallet className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                        <span>
                                            <strong className="text-foreground"> funds are temporarily locked</strong> during bidding. If you are outbid, your funds are instantly returned to your wallet.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                                        <Gavel className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                        <span>
                                            <strong className="text-foreground">Winner Announcement:</strong> The highest bidder at the closing time is automatically declared the winner and the Art Asset is transferred.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                                        <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                        <span>
                                            Bids are binding and cannot be cancelled once placed. Ensure you check the artwork details before bidding.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                <Badge 
                    variant={isLive ? "default" : isEnded ? "destructive" : "secondary"} 
                    className={`uppercase tracking-wider ${isLive ? "bg-emerald-600 hover:bg-emerald-700" : isEnded ? "bg-red-600 hover:bg-red-700" : ""}`}
                >
                    {isUnsold ? "UNSOLD" : auction.status}
                </Badge>
            </div>
        </div>
    );
};
