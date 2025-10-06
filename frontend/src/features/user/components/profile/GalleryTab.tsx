import React from "react";
import { useOutletContext } from "react-router-dom";
import { useGetUserArt } from "../../hooks/profile/gallery/useGetUserArt";
import ArtCard from "../art/ArtCard";
import ArtCardSkeleton from "../skeletons/ArtCardSkeleton";

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

  if (isLoading)
    return <div className="text-center py-4"><ArtCardSkeleton /></div>;
  if (isError)
    return <div className="text-center py-4">Error: {error?.message}</div>;
  if (!data || data.pages[0].data.length === 0)
    return <div className="text-center py-4">No artwork found</div>;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {data?.pages.map((page) =>
          page.data.map((artItem) => (
            <div key={artItem.art.id} className="">
              <ArtCard
                item={artItem}
              />
            </div>
          ))
        )}
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
