import { Badge } from "../../../../../components/ui/badge";
import { Button } from "../../../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../components/ui/avatar";
import { Share2, Clock, MapPin, Calendar } from "lucide-react";
import { VerifiedArtistBadge } from "../../../../../components/shared/VerifiedArtistBadge";

interface AuctionInfoPanelProps {
    auction: any;
    navigate: (path: string) => void;
}

export const AuctionInfoPanel = ({ auction, navigate }: AuctionInfoPanelProps) => {
    return (
        <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="space-y-4">
                 <div className="flex items-start justify-between gap-4">
                    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-foreground/90">
                        {auction.title}
                    </h1>
                     <Button variant="outline" size="icon" className="shrink-0 h-10 w-10 rounded-full">
                        <Share2 className="h-4 w-4" />
                    </Button>
                 </div>
                 
                 <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Created {new Date(auction.createdAt).toLocaleDateString()}</span>
                    </div>
                     <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{auction.status === 'ACTIVE' ? 'Ends' : 'Started'} {new Date(auction.status === 'ACTIVE' ? auction.endTime : auction.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                 </div>
            </div>

            {/* Artist Card */}
            <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl shadow-sm hover:border-primary/20 transition-colors cursor-pointer" onClick={() => navigate(`/profile/${auction.hostId}`)}>
                <Avatar className="h-12 w-12 border-2 border-background ring-2 ring-border/50">
                    <AvatarImage src={auction.host?.profileImage} />
                    <AvatarFallback>{auction.host?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-base truncate">{auction.host?.name || auction.host?.username}</span>
                        <VerifiedArtistBadge 
                            isVerified={auction.host?.isVerified} 
                            role={auction.host?.role} 
                            showTooltip={false}
                            className="h-4 w-4 text-blue-500 fill-blue-500/10"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Auction Host & Creator</p>
                </div>
                <Button variant="secondary" size="sm" className="font-semibold h-8">View Profile</Button>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    About this Art
                </h3>
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                     <p className="whitespace-pre-wrap">{auction.description}</p>
                </div>
            </div>
        </div>
    );
};
