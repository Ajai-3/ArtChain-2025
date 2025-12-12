import { Button } from "../../../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../components/ui/avatar";
import { ExternalLink } from "lucide-react";
import type { Auction } from "../../../../../types/auction";
import { useNavigate } from "react-router-dom";
import { VerifiedArtistBadge } from "../../../../../components/shared/VerifiedArtistBadge";

interface DetailHostInfoProps {
    auction: Auction;
}

export const DetailHostInfo = ({ auction }: DetailHostInfoProps) => {
    const navigate = useNavigate();
    return (
        <div className="shrink-0 flex items-center gap-3 bg-card border border-border/60 p-3 rounded-xl shadow-sm">
             <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={auction.host?.profileImage} />
                <AvatarFallback>{auction.host?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                 <p className="text-xs text-muted-foreground">Created by</p>
                 <p className="font-semibold text-sm truncate flex items-center gap-1">
                    {auction.host?.name || auction.host?.username}
                    <VerifiedArtistBadge 
                        isVerified={auction.host?.isVerified} 
                        role={auction.host?.role} 
                        showTooltip={false}
                        className="h-3 w-3 text-blue-500 fill-blue-500"
                    />
                 </p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => navigate(`/${auction.host?.username}`)}>
                                    View Profile <ExternalLink className="ml-2 h-3 w-3" />
                                </Button>
        </div>
    );
};
