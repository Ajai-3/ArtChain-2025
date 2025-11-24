import ArtCard from "../art/ArtCard";
import React, { useRef, useCallback, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

import { useGetUserFavorites } from "../../hooks/profile/favorites/useGetUserFavorites";
import { useMasonryLayout } from "../../../../hooks/useMasonryLayout";

interface Props {
  profileUser: { id: string; username: string };
}

const FavoritesTab: React.FC = () => {
  const { profileUser } = useOutletContext<Props>();
  const targetUserId = profileUser.id;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useGetUserFavorites(targetUserId);

  // Observer for infinite scroll
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

  const { containerRef, rows } = useMasonryLayout(
    arts,
    (item) => item.art?.id || item._id,
    (item) => item.art?.imageUrl || item.imageUrl
  );

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (isError)
    return <div className="text-center mt-10">Error: {error?.message}</div>;

  if (arts.length === 0)
    return <div className="text-center mt-10">No favorites yet.</div>;

  return (
    <div ref={containerRef} className="w-full">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex"
          style={{ gap: "4px", marginBottom: "4px" }}
        >
          {row.items.map((item: any, itemIndex: number) => {
            const isLastItem =
              rowIndex === rows.length - 1 &&
              itemIndex === row.items.length - 1;
            return (
              <div
                key={item.art?.id || item._id}
                ref={isLastItem ? lastArtRef : null}
                style={{
                  width: `${item.calculatedWidth}px`,
                  height: `${item.calculatedHeight}px`,
                }}
              >
                <ArtCard item={item} />
              </div>
            );
          })}
        </div>
      ))}
      {isFetchingNextPage && (
        <div className="text-center col-span-full">Loading more...</div>
      )}
    </div>
  );
};

export default FavoritesTab;
