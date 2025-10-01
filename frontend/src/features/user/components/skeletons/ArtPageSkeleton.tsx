import React from "react";
import { Skeleton } from "../../../../components/ui/skeleton";

const ArtPageSkeleton: React.FC = () => {
  const base = "animate-pulse";
  const bg = "bg-zinc-200 dark:bg-zinc-900";

  return (
    <div className="flex flex-col md:flex-row justify-center gap-6 p-4 min-h-screen">
      {/* Main content */}
      <div className="w-full md:w-3/4 flex flex-col items-center relative">
        {/* Art image */}
        <Skeleton
          className={`w-full h-[500px] sm:h-[400px] md:h-[500px] ${base} ${bg} rounded-md`}
        />

        {/* Action buttons */}
        <div className="flex flex-wrap justify-between sm:justify-between items-center w-full mt-4 gap-3 sm:gap-6 sm:px-20">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className={`h-6 w-16 ${base} ${bg} rounded-md`} />
            <Skeleton className={`h-6 w-16 ${base} ${bg} rounded-md`} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className={`h-6 w-16 ${base} ${bg} rounded-md`} />
            <Skeleton className={`h-6 w-16 ${base} ${bg} rounded-md`} />
          </div>
        </div>

        {/* Artist info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mt-4 sm:px-20 gap-4">
          <div className="flex gap-4 items-center">
            <Skeleton className={`w-12 h-12 rounded-full ${base} ${bg}`} />
            <div className="flex flex-col gap-2">
              <Skeleton className={`h-5 w-32 ${base} ${bg} rounded-md`} />
              <Skeleton className={`h-4 w-24 ${base} ${bg} rounded-md`} />
            </div>
          </div>
          <Skeleton className={`h-4 w-32 ${base} ${bg} rounded-md`} />
        </div>

        {/* Tags */}
        <div className="w-full mt-6 sm:px-20 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-6 w-20 ${base} ${bg} rounded-full`}
            />
          ))}
        </div>

        {/* Description */}
        <div className="w-full mt-6 sm:px-20">
          <Skeleton className={`h-6 w-40 ${base} ${bg} rounded-md mb-2`} />
          <Skeleton className={`h-4 w-full ${base} ${bg} rounded-md mb-1`} />
          <Skeleton className={`h-4 w-full ${base} ${bg} rounded-md mb-1`} />
          <Skeleton className={`h-4 w-3/4 ${base} ${bg} rounded-md`} />
        </div>

        {/* Comments */}
        <div className="w-full mt-6 sm:px-20 flex flex-col gap-3">
          <Skeleton className={`h-6 w-32 ${base} ${bg} rounded-md`} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              <Skeleton className={`w-10 h-10 rounded-full ${base} ${bg}`} />
              <div className="flex flex-col gap-1 flex-1">
                <Skeleton className={`h-4 w-1/2 ${base} ${bg} rounded-md`} />
                <Skeleton className={`h-4 w-full ${base} ${bg} rounded-md`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-zinc-900 dark:bg-zinc-950 rounded-md p-4 mt-6 md:mt-0 flex flex-col gap-3">
        <Skeleton className={`h-6 w-32 ${base} ${bg} rounded-md`} />
        <Skeleton className={`h-4 w-full ${base} ${bg} rounded-md`} />
        <Skeleton className={`h-4 w-full ${base} ${bg} rounded-md`} />
        <Skeleton className={`h-4 w-3/4 ${base} ${bg} rounded-md`} />
      </div>
    </div>
  );
};

export default ArtPageSkeleton;
