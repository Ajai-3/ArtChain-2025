import { Skeleton } from "../../../../../components/ui/skeleton";
import { Button } from "../../../../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BiddingDetailPageSkeleton = () => {
    const navigate = useNavigate();
    
    return (
        <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row gap-4 p-4 md:p-0 overflow-hidden max-w-[1600px] mx-auto">
            {/* Left Panel: Image & Key Info */}
            <div className="flex-1 flex flex-col gap-4 min-w-0 h-full">
                {/* Header / Nav */}
                <div className="flex justify-between items-center shrink-0">
                    <Button variant="ghost" size="sm" className="pl-0" disabled onClick={() => navigate("/bidding")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-32 rounded-md" /> { /* About Button */ }
                        <Skeleton className="h-9 w-20 rounded-md" /> { /* Status Badge */ }
                    </div>
                </div>

                {/* Main Image Area */}
                <div className="flex-1 relative rounded-2xl border-2 bg-card overflow-hidden group shadow-sm border-border">
                    <Skeleton className="w-full h-full" />
                </div>

                {/* Artist Mini-Card */}
                <div className="shrink-0 flex items-center gap-3 bg-card border border-border/60 p-3 rounded-xl shadow-sm">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 min-w-0 space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                </div>
            </div>

            {/* Right Panel: Action & Bids */}
            <div className="w-full md:w-[450px] lg:w-[500px] shrink-0 flex flex-col gap-4 h-full overflow-hidden">
                
                {/* Top Stats Card */}
                <div className="relative rounded-2xl p-4 shadow-xl h-[40%] shrink-0 flex flex-col gap-4 overflow-hidden border-2 bg-card border-border/50">
                    <div className="min-h-0 flex-1 flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-4 shrink-0">
                            <Skeleton className="h-8 w-3/4 rounded-md" /> { /* Title */ }
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border bg-muted/20">
                            <Skeleton className="h-3 w-20 mb-2" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                        <div className="p-4 rounded-xl border bg-muted/20">
                            <Skeleton className="h-3 w-20 mb-2" />
                            <Skeleton className="h-8 w-32" />
                        </div>
                    </div>

                    <Skeleton className="w-full h-14 rounded-md" /> { /* Main Action Button */ }
                </div>

                {/* Bidding Board */}
                <div className="flex-1 min-h-0 rounded-2xl overflow-hidden shadow-sm flex flex-col border-2 bg-card border-border/50">
                    <div className="p-4 border-b flex justify-between items-center shrink-0">
                         <Skeleton className="h-5 w-32" />
                         <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <div className="flex-1 p-4 space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-full rounded-md" />
                                    <Skeleton className="h-3 w-2/3 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
