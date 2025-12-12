import { Skeleton } from "../../../../components/ui/skeleton";

export const AuctionCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-border shadow-sm flex flex-col h-[300px]">
      <div className="relative aspect-[16/9] bg-muted/60">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-3 space-y-2 flex-1">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <div className="space-y-1.5">
            <Skeleton className="h-10 w-full rounded-md" />
            <div className="flex justify-between items-center pt-1">
                <Skeleton className="h-3 w-1/3 rounded-md" />
                <Skeleton className="h-3 w-1/3 rounded-md" />
            </div>
        </div>
      </div>
      <div className="p-3 pt-0">
          <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
};
