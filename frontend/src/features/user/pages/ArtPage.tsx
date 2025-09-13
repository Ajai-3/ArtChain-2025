import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetArtByName } from "../hooks/art/useGetArtByName";
import CommentInputSection from "../components/art/CommentInputSection";
import CommentList from "../components/art/CommentList";

const ArtPage: React.FC = () => {
const { artname } = useParams<{ artname: string }>();
console.log(artname)
  const { data, isLoading, isError, error } = useGetArtByName(artname!);
  const [activeTab, setActiveTab] = useState<"description" | "favorites" | "comments" | "about">("description");
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const art = data?.data?.art;
  const actualUser = data?.data?.user;

  // Scroll to top **after data is loaded**
  useEffect(() => {
    if (art) {
      window.scrollTo(0, 0);
      if (containerRef.current) containerRef.current.scrollTop = 0;
    }
  }, [art]);

  // Get image dimensions
  useEffect(() => {
    if (art?.imageUrl) {
      const img = new Image();
      img.src = art.imageUrl;
      img.onload = () => setImageSize({ width: img.width, height: img.height });
    }
  }, [art?.imageUrl]);

  // Show loader until data is ready
  if (isLoading) return <div className="text-center mt-10">Loading art...</div>;
  if (isError) return <div className="text-center mt-10">Error: {error?.message}</div>;
  if (!art) return <div className="text-center mt-10">Art not found</div>;

  return (
    <div ref={containerRef} className="flex justify-center gap-6 p-4 min-h-screen">
      <div className="w-3/4 flex flex-col items-center">
        {/* Art Preview */}
        <div className="w-full flex justify-center">
          <img
            src={art.imageUrl}
            alt={art.title}
            className="max-h-[500px] w-full object-contain rounded shadow-lg"
          />
        </div>

        {/* Artist Info */}
        {actualUser && (
          <div className="flex items-center gap-4 mt-4 w-full px-20">
            {actualUser.profileImage ? (
              <img src={actualUser.profileImage} alt={actualUser.name} className="w-14 h-14 rounded-full border" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-zinc-600 dark:bg-zinc-700 flex items-center justify-center text-white text-2xl">
                {actualUser.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xl font-bold">{art.title}</span>
              <span className="text-gray-500">
                by{" "}
                <span
                  className="text-gray-200 hover:text-main-color hover:cursor-pointer"
                  onClick={() => navigate(`/${actualUser.username}`)}
                >
                  {actualUser.name}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="w-full mt-6 px-20">
          <div className="flex border-b border-gray-300">
            {["description", "favorites", "comments", "about"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 font-semibold ${
                  activeTab === tab
                    ? "border-b-2 border-main-color text-main-color"
                    : "text-gray-400 hover:text-main-color-dark"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-4 w-full">
            {activeTab === "description" && <p className="text-gray-400 break-words">{art.description || "No description available."}</p>}

            {activeTab === "favorites" && <p className="text-gray-400">Favorites feature will be implemented here.</p>}

            {activeTab === "comments" && (
              <div className="flex flex-col gap-4">
                <CommentInputSection postId={art.id} />
                <CommentList postId={art.id} />
              </div>
            )}

            {activeTab === "about" && (
              <div className="grid grid-cols-2 gap-4 text-gray-300">
                <div><strong>Art Type:</strong> {art.artType || "-"}</div>
                <div><strong>Aspect Ratio:</strong> {art.aspectRatio || "-"}</div>
                <div><strong>Artcoins:</strong> {art?.price?.artcoins || 0}</div>
                <div><strong>Fiat Price:</strong> {art?.price?.fiat || 0}</div>
                <div><strong>Is For Sale:</strong> {art.isForSale ? "Yes" : "No"}</div>
                <div><strong>Commenting Disabled:</strong> {art.commentingDisabled ? "Yes" : "No"}</div>
                <div><strong>Downloading Disabled:</strong> {art.downloadingDisabled ? "Yes" : "No"}</div>
                <div><strong>Private:</strong> {art.isPrivate ? "Yes" : "No"}</div>
                <div><strong>Sensitive:</strong> {art.isSensitive ? "Yes" : "No"}</div>
                <div><strong>Created At:</strong> {new Date(art.createdAt).toLocaleString()}</div>
                <div><strong>Updated At:</strong> {new Date(art.updatedAt).toLocaleString()}</div>
                <div><strong>Hashtags:</strong> {art.hashtags?.join(", ") || "-"}</div>
                {imageSize && <div><strong>Image Size:</strong> {imageSize.width} x {imageSize.height}px</div>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-1/4 bg-zinc-900 rounded p-4 text-white">
        <p>TO DO RECOMMENDATIONS</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recommendations go here.</p>
      </div>
    </div>
  );
};

export default ArtPage;
