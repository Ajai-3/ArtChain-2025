import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { useGetUserArt } from "../../hooks/profile/gallery/useGetUserArt";
import ArtCard from "../art/ArtCard";
import ArtCardSkeleton from "../skeletons/ArtCardSkeleton";
import { useMasonryLayout } from "../../../../hooks/useMasonryLayout";

interface GalleryTabProps {
  profileUser: { id: string; username: string };
}

const GalleryTab: React.FC = () => {
  const { profileUser } = useOutletContext<GalleryTabProps>();
  const targetUserId = profileUser.id;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useGetUserArt(targetUserId);

  const allItems = useMemo(
    () => data?.pages.flatMap((p) => p.data) || [],
    [data]
  );

  const { containerRef, rows } = useMasonryLayout(
    allItems,
    (item) => item.art.id,
    (item) => item.art.imageUrl
  );

  if (isLoading)
    return (
      <div className="text-center py-4">
        <ArtCardSkeleton />
      </div>
    );
  if (isError)
    return <div className="text-center py-4">Error: {error?.message}</div>;
  if (!data || data.pages[0].data.length === 0)
    return <div className="text-center py-4">No artwork found</div>;

  return (
    <div>
      <div ref={containerRef} className="w-full">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex"
            style={{ gap: "4px", marginBottom: "4px" }}
          >
            {row.items.map((item: any) => (
              <div
                key={item.art.id}
                style={{
                  width: `${item.calculatedWidth}px`,
                  height: `${item.calculatedHeight}px`,
                }}
              >
                <ArtCard item={item} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryTab;
