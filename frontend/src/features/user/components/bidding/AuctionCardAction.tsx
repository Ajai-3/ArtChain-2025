import { Link } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { CardFooter } from "../../../../components/ui/card";
import type { Auction } from "../../../../types/auction";

interface AuctionCardActionProps {
    auction: Auction;
    isLive: boolean;
    isEnded: boolean;
    isScheduled: boolean;
    isUnsold: boolean;
}

export const AuctionCardAction = ({ auction, isLive, isEnded, isScheduled, isUnsold }: AuctionCardActionProps) => {
    return (
        <CardFooter className="p-4 pt-0">
            <Button
                asChild
                className={`w-full font-bold h-10 text-sm tracking-wide transition-all duration-300 shadow-md border-0 
                ${isLive ? '!bg-emerald-600 hover:!bg-emerald-700 !text-white !shadow-emerald-500/20 hover:shadow-lg hover:-translate-y-0.5' : ''}
                ${isScheduled ? '!bg-indigo-600 hover:!bg-indigo-700 !text-white !shadow-indigo-500/30 hover:shadow-lg hover:-translate-y-0.5' : ''}
                ${isEnded ? '!bg-neutral-800 hover:!bg-neutral-900 !text-white !shadow-none cursor-default' : ''}
            `}
                size="sm"
            >
                <Link to={`/bidding/${auction.id}`}>
                    {isLive ? "Place Bid Now" : isEnded ? (isUnsold ? "View Unsold Details" : "View Winner & Results") : "View Details"}
                </Link>
            </Button>
        </CardFooter>
    );
};
