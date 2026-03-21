import React from "react";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* KPI Cards Grid Skeleton */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="relative rounded-xl border bg-card p-5 shadow-sm dark:bg-zinc-900/50 dark:border-main-color/30 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <Skeleton className="h-10 w-10 rounded-lg bg-zinc-800" />
              <Skeleton className="h-5 w-12 rounded-full bg-zinc-800" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-zinc-800" />
              <Skeleton className="h-8 w-32 bg-zinc-800" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-3 w-full bg-zinc-800/60" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Section Skeleton */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-7 mb-6">
        <Card className="col-span-4 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 bg-zinc-800" />
              <Skeleton className="h-4 w-48 bg-zinc-800" />
            </div>
            <Skeleton className="h-8 w-32 bg-zinc-800" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full bg-zinc-800/40 rounded-lg" />
          </CardContent>
        </Card>

        <Card className="col-span-3 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader>
             <Skeleton className="h-5 w-32 bg-zinc-800" />
             <Skeleton className="h-4 w-48 bg-zinc-800 mt-2" />
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <Skeleton className="h-[250px] w-[250px] rounded-full bg-zinc-800/40" />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section Table Skeletons */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader>
            <Skeleton className="h-5 w-40 bg-zinc-800" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded bg-zinc-800" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                  <Skeleton className="h-3 w-1/2 bg-zinc-800" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader>
            <Skeleton className="h-5 w-40 bg-zinc-800" />
          </CardHeader>
          <CardContent className="space-y-4">
             <Skeleton className="h-[250px] w-full bg-zinc-800/20" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
