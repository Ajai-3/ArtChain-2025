import { useState } from "react";
import { useMyBids } from "../../hooks/bidding/useMyBids";
import PageFallback from "../../../../components/PageFallback";
import { Button } from "../../../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Gavel } from "lucide-react";
import { BidCard } from "../../components/bidding/BidCard";



export default function MyBidsPage() {
    const [filter, setFilter] = useState("ALL");
    const { data: bids = [], isLoading, error } = useMyBids(filter);
    const navigate = useNavigate();

    if (isLoading) return <PageFallback />;
    if (error) return <div className="p-10 text-center text-destructive font-semibold">Failed to load history.</div>;

    return (
        <div className="container mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/bidding")} className="shrink-0">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Bidding History</h1>
                        <p className="text-sm text-muted-foreground">Auctions you've participated in.</p>
                    </div>
                </div>
                <Tabs value={filter} onValueChange={setFilter} className="w-full md:w-auto">
                    <TabsList className="grid grid-cols-3 md:flex w-full">
                        <TabsTrigger value="ALL">All</TabsTrigger>
                        <TabsTrigger value="ACTIVE">Live</TabsTrigger>
                        <TabsTrigger value="ENDED">Ended</TabsTrigger>
                        <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Empty */}
            {bids.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-3xl bg-muted/10 border-2 border-dashed border-border/50">
                    <Gavel className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium">No auctions found</h3>
                    <p className="text-muted-foreground text-sm mb-6">Try changing your filter or explore new arts.</p>
                    <Button variant="main" onClick={() => navigate("/bidding")}>Browse Auctions</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {bids.map((item: any) => (
                        <BidCard key={item.auction.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}