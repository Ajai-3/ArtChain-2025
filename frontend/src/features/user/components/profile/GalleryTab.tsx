// components/profile/GalleryTab.tsx
import React from "react";
import { useGetUserArt } from "../../hooks/profile/gallery/useGetUserArt";
import { useParams } from "react-router-dom";
import { useProfileData } from "../../hooks/profile/useProfileData";

interface GalleryTabProps {
  username?: string; 
}

const GalleryTab: React.FC<GalleryTabProps> = ({ username }) => {
  const { username: urlUsername } = useParams(); 
  const { profileUser, isLoading: profileLoading } = useProfileData(urlUsername || username);

  // Get the target user ID from the profile data
  const targetUserId = profileUser?.id || "";

  // Use the hook with the user ID
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading, 
    isError,
    error 
  } = useGetUserArt(targetUserId);

  // Show loading states
  if (profileLoading) return <div className="text-center py-4">Loading profile...</div>;
  if (isLoading) return <div className="text-center py-4">Loading gallery...</div>;
  if (isError) return <div className="text-center py-4">Error loading gallery: {error?.message}</div>;
  
  // Check if data exists and has artwork
  if (!data || !data.pages || data.pages.length === 0 || data.pages[0].data.length === 0) {
    return <div className="text-center py-4">No artwork found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.pages.map((page, pageIndex) =>
          page.data.map((artWithUser) => (
            <div key={artWithUser.art.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={artWithUser.art.imageUrl}
                alt={artWithUser.art.title}
                className="w-full h-64 object-cover cursor-pointer"
                onClick={() => window.open(`/${artWithUser.user?.username}/art/${artWithUser.art.artName}`, '_blank')}
              />
              <div className="p-3">
                <h3 className="text-sm font-bold truncate">{artWithUser.art.title}</h3>
                <p className="text-xs text-gray-500 truncate">
                  {artWithUser.art.description || "No description"}
                </p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                  <span>Likes: {artWithUser.likeCount}</span>
                  <span>Comments: {artWithUser.commentCount}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {hasNextPage && (
        <div className="flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryTab;