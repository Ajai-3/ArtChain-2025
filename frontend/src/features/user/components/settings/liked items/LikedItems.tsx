import React, { useRef, useCallback, useMemo } from "react";
import { useGetUserLikedArts } from "../../../hooks/profile/likes/useGetUserLikedArts";
import { LikedArtCard } from "./LikedArtCard.tsx";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { Gem, AlertCircle } from "lucide-react";

const LikedItems: React.FC = () => {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetUserLikedArts();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastArtRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const arts = useMemo(
    () => data?.pages.flatMap((page: any) => page.data) ?? [],
    [data]
  );

  if (isLoading) return <LoadingGrid />;

  if (isError) return (
    <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
      <AlertCircle className="w-10 h-10 mb-2 opacity-20" />
      <p>Failed to load likes. Please try again.</p>
    </div>
  );

  return (
    <div className="w-full px-2 lg:px-4 pb-10">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Liked Arts
        </h1>
        <p className="text-zinc-500 text-sm">
          Arts you like will appear here.
        </p>
      </div>

      {/* Modern CSS Masonry */}
      {arts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
          <Gem className="w-12 h-12 mb-4 opacity-20" />
          <h3 className="text-3xl font-semibold">No liked items</h3>
          <p className="text-sm">Arts you like will appear here.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {arts.map((item, index) => (
            <div
              key={item.art?.id || index}
              ref={index === arts.length - 1 ? lastArtRef : null}
              className="break-inside-avoid"
            >
              <LikedArtCard item={item} />
            </div>
          ))}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="mt-8 flex justify-center">
          <LoadingGrid items={4} />
        </div>
      )}
    </div>
  );
};

const LoadingGrid = ({ items = 8 }) => (
  <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 px-4">
    {[...Array(items)].map((_, i) => (
      <Skeleton key={i} className="w-full h-[350px] rounded-2xl mb-4 bg-zinc-800/50" />
    ))}
  </div>
);

export default LikedItems;