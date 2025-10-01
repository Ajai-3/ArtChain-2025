import React from "react";
import { Skeleton } from "../../../../components/ui/skeleton";

type Ratio = "1:1" | "4:5" | "3:5" | "16:9";

const ratioValues: Record<Ratio, number> = {
  "1:1": 1,
  "4:5": 4 / 5,
  "3:5": 3 / 5,
  "16:9": 16 / 9,
};

const skeletonGrid: Ratio[][] = [
  ["1:1", "4:5", "3:5", "16:9", "4:5"],
  ["4:5", "1:1", "4:5", "16:9", "3:5"],
  ["16:9", "4:5", "3:5", "4:5", "1:1"],
];

const ArtCardSkeleton: React.FC = () => {
  const baseHeight = 280;

  return (
    <div className="flex flex-col gap-4">
      {skeletonGrid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-wrap gap-2 justify-start">
          {row.map((ratio, colIndex) => {
            const width = baseHeight * ratioValues[ratio];
            return (
              <div
                key={colIndex}
                style={{ width, height: baseHeight }}
                className="overflow-hidden"
              >
                <Skeleton className="w-full h-full animate-pulse bg-zinc-200 dark:bg-zinc-900/80 rounded-none" />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ArtCardSkeleton;
