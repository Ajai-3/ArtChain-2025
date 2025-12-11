import { useParams, useNavigate } from "react-router-dom";
import { useAuctionById } from "../../hooks/bidding/useAuctionById";
import { BiddingBoard } from "../../components/bidding/BiddingBoard";
import { PlaceBidModal } from "../../components/bidding/PlaceBidModal";
import PageFallback from "../../../../components/PageFallback";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { ArrowLeft, Share2, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { CountdownTimer } from "../../components/bidding/CountdownTimer";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { useDispatch } from "react-redux";
import { setBids } from "../../../../redux/slices/biddingSlice";

export default function BiddingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: auction, isLoading: loading, refetch } = useAuctionById(id);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (auction && auction.bids) {
        dispatch(setBids(auction.bids));
    }
  }, [auction, dispatch]);

  if (loading) return <PageFallback />;
  if (!auction) return <div className="h-full flex items-center justify-center text-muted-foreground">Auction not found</div>;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row gap-4 p-4 md:p-0 overflow-hidden max-w-[1600px] mx-auto">
        {/* Left Panel: Image & Key Info - Takes remaining height */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 h-full">
            {/* Header / Nav */}
            <div className="flex justify-between items-center shrink-0">
                 <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent hover:text-primary" onClick={() => navigate("/bidding")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Badge variant={auction.status === "ACTIVE" ? "default" : "secondary"} className={`uppercase tracking-wider ${auction.status === "ACTIVE" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}>
                    {auction.status}
                </Badge>
            </div>

            {/* Main Image Area */}
            <div className="flex-1 relative rounded-2xl border-2 border-border bg-card overflow-hidden group shadow-sm">
                <img
                  src={auction.signedImageUrl || auction.imageKey || "https://via.placeholder.com/800x600"}
                  alt={auction.title}
                  className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
                />
                
                {/* Overlay Details */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                     {auction.status === 'ACTIVE' && (
                        <div className="bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold shadow-lg animate-pulse">
                             <span className="relative flex h-2 w-2">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                             </span>
                             LIVE
                        </div>
                    )}
                </div>
            </div>

            {/* Artist Mini-Card */}
            <div className="shrink-0 flex items-center gap-3 bg-card border border-border/60 p-3 rounded-xl shadow-sm">
                 <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={auction.host?.profileImage} />
                    <AvatarFallback>{auction.host?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                     <p className="text-xs text-muted-foreground">Created by</p>
                     <p className="font-semibold text-sm truncate flex items-center gap-1">
                        {auction.host?.name || auction.host?.username}
                        <ShieldCheck className="h-3 w-3 text-blue-500" />
                     </p>
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8 ml-auto">
                    <Share2 className="h-4 w-4" />
                </Button>
            </div>
        </div>

        {/* Right Panel: Action & Bids */}
        <div className="w-full md:w-[450px] lg:w-[500px] shrink-0 flex flex-col gap-4 h-full overflow-hidden">
            
            {/* Top Stats Card - Dynamic Styling based on Status */}
            <div className={`
                relative rounded-2xl p-5 shadow-xl h-[45%] shrink-0 flex flex-col gap-4 overflow-hidden border-2
                ${auction.status === 'ACTIVE' 
                    ? 'bg-card border-emerald-500 shadow-emerald-500/10' 
                    : 'bg-card border-indigo-500 shadow-indigo-500/10'}
            `}>
                 {/* Decorative Gradient Blob */}
                 <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[50px] opacity-30 pointer-events-none 
                    ${auction.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                 />

                 <div className="min-h-0 flex-1 flex flex-col gap-2">
                     <div className="flex justify-between items-start gap-4 shrink-0">
                        <h1 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight line-clamp-2" title={auction.title}>
                            {auction.title}
                        </h1>
                        {auction.status === 'SCHEDULED' && (
                            <div className="shrink-0 p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                                <Clock className="h-5 w-5" />
                            </div>
                        )}
                     </div>
                     
                     <div className="relative group min-h-0 flex-1 border border-border/50 rounded-lg bg-muted/20 p-2">
                        <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-2">
                            <p className="text-sm font-medium text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                {auction.description}
                            </p>
                        </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div className={`p-4 rounded-xl border backdrop-blur-sm ${
                         auction.status === 'ACTIVE' 
                            ? 'bg-emerald-500/5 border-emerald-500/20' 
                            : 'bg-indigo-500/5 border-indigo-500/20'
                     }`}>
                         <span className={`text-[10px] uppercase font-bold tracking-wider mb-1 block ${
                             auction.status === 'ACTIVE' ? 'text-emerald-500' : 'text-indigo-500'
                         }`}>
                             {auction.status === 'ACTIVE' ? 'Current Highest Bid' : 'Starting Price'}
                         </span>
                         <div className="flex items-baseline gap-1">
                             <span className={`text-3xl font-black tabular-nums tracking-tighter ${
                                 auction.status === 'ACTIVE' ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'
                             }`}>
                                {((auction.currentBid || 0) > 0 ? (auction.currentBid || 0) : (auction.startPrice || 0)).toLocaleString()}
                             </span>
                             <span className="text-xs font-bold text-muted-foreground">Coins</span>
                         </div>
                     </div>
                     
                     <div className="p-4 bg-muted/30 rounded-xl border border-border/50 backdrop-blur-sm">
                         <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex justify-between items-center gap-1.5 mb-1">
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> 
                                {auction.status === 'ACTIVE' ? 'Ends In' : 'Starts'}
                            </span>
                             {auction.status !== 'ACTIVE' && (
                                <span className="text-[10px] normal-case opacity-70">
                                    {new Date(auction.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                </span>
                            )}
                         </span>
                         <div className="scale-105 origin-left mt-1">
                             <CountdownTimer 
                                targetDate={auction.status === 'ACTIVE' ? auction.endTime : auction.startTime} 
                                status={auction.status}
                                onTimerEnd={refetch}
                             />
                         </div>
                     </div>
                 </div>

                 <Button 
                    className={`
                        w-full h-14 text-lg font-bold shadow-lg transition-all active:scale-[0.99] uppercase tracking-wide
                        ${auction.status === 'ACTIVE' 
                            ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-emerald-500/20' 
                            : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/20 cursor-not-allowed opacity-90'}
                    `}
                    onClick={() => setIsModalOpen(true)}
                    disabled={auction.status !== "ACTIVE"}
                 >
                    {auction.status === "ACTIVE" ? (
                        <span className="flex items-center gap-2">
                             <span className="relative flex h-3 w-3">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-3 w-3 bg-white/80"></span>
                             </span>
                             Place Bid Now
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Clock className="h-5 w-5" /> Coming Soon
                        </span>
                    )}
                 </Button>
            </div>

            {/* Bidding Board - Dynamic Styling */}
            <div className={`flex-1 min-h-0 rounded-2xl overflow-hidden shadow-sm flex flex-col border-2 ${
                auction.status === 'ACTIVE' ? 'bg-card border-emerald-500/50' : 'bg-card border-indigo-500/50'
            }`}>
                <div className={`p-4 border-b flex justify-between items-center shrink-0 ${
                     auction.status === 'ACTIVE' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-indigo-500/5 border-indigo-500/10'
                }`}>
                    <h3 className="font-bold text-sm flex items-center gap-2">
                        {auction.status === 'ACTIVE' ? 'Live Bidding Feed' : 'Waiting Room'}
                        {auction.status === 'ACTIVE' && <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                    </h3>
                    <Badge variant="outline" className="bg-background/50">
                        {auction.bids?.length || 0} Bids
                    </Badge>
                </div>
                
                <div className="flex-1 min-h-0 relative">
                     <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                        {auction.status === 'SCHEDULED' && (!auction.bids || auction.bids.length === 0) ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground opacity-60">
                                <Clock className="h-10 w-10 mb-3 text-indigo-400" />
                                <p className="font-medium text-sm">Auction hasn't started yet.</p>
                                <p className="text-xs mt-1">Be ready to place the first bid!</p>
                            </div>
                        ) : (
                            <BiddingBoard auctionId={auction.id} initialBids={auction.bids} />
                        )}
                     </div>
                </div>
            </div>
        </div>

      <PlaceBidModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        auction={auction}
        onBidPlaced={refetch} 
      />
    </div>
  );
};
