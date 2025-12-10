import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";

interface AuctionCardProps {
  auction: any;
}

export const AuctionCard = ({ auction }: AuctionCardProps) => {
  const navigate = useNavigate();
  const timeLeft = new Date(auction.endTime).getTime() - Date.now();
  const isExpired = timeLeft <= 0;

  return (
    <Card className="hover:shadow-lg transition-all dark:bg-card border-border">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full overflow-hidden rounded-t-lg">
          <img
            src={auction.artId?.url || "https://via.placeholder.com/400"} // Fallback or logic to fetch art image
            alt={auction.title}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge variant={auction.status === "ACTIVE" ? "default" : "secondary"}>
              {auction.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-xl line-clamp-1">{auction.title}</CardTitle>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Current Bid</span>
          <span className="font-bold text-primary text-lg">
            {auction.currentBid} Coins
          </span>
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Ends In</span>
            <span className={isExpired ? "text-destructive" : "text-green-500"}>
                {isExpired ? "Ended" : formatDistanceToNow(new Date(auction.endTime))}
            </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
            className="w-full" 
            onClick={() => navigate(`/bidding/${auction._id}`)}
            disabled={auction.status !== "ACTIVE"}
        >
          {auction.status === "ACTIVE" ? "Place Bid" : "View Details"}
        </Button>
      </CardFooter>
    </Card>
  );
};
