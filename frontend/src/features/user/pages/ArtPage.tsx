import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetArtByName } from "../hooks/art/useGetArtByName";
import CommentInputSection from "../components/art/CommentInputSection";
import CommentList from "../components/art/CommentList";
import {
  Star,
  MoreVertical,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ImageDown,
  User,
} from "lucide-react";
import { useLikePost } from "../hooks/art/useLikePost";
import { useUnlikePost } from "../hooks/art/useUnlikePost";
import { LikeButton } from "../components/art/LikeButton";
import { useFavoritePost } from "../hooks/art/useFavoritePost";
import { useUnfavoritePost } from "../hooks/art/useUnfavoritePost";
import FavoriteUsersModal from "../components/art/FavoriteUsersModal";
import LikeUsersModal from "../components/art/LikeUsersModal";
import { formatNumber } from "../../../libs/formatNumber";
import ArtPageSkeleton from "../components/skeletons/ArtPageSkeleton";

const ArtPage: React.FC = () => {
  const { artname } = useParams<{ artname: string }>();
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const favoritePost = useFavoritePost();
  const unfavoritePost = useUnfavoritePost();

  const { data, isLoading, isError, error } = useGetArtByName(artname!);
  const [zoomed, setZoomed] = useState(false);
  const [fullscreenZoom, setFullscreenZoom] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const navigate = useNavigate();

  const art = data?.data?.art;
  const actualUser = data?.data?.user;
  const price = data?.data.price;
  const commentCount = data?.data.commentCount;
  const isLiked = data?.data?.isLiked;
  const isFavorited = data?.data?.isFavorited;
  const favoriteCount = data?.data?.favoriteCount;

  if (isLoading) return <div className="text-center mt-10"><ArtPageSkeleton /></div>;
  if (isError)
    return <div className="text-center mt-10">Error: {error?.message}</div>;
  if (!art) return <div className="text-center mt-10">Art not found</div>;

  const handleFavorite = () => {
    if (!actualUser?.id) return;

    if (isFavorited) {
      unfavoritePost.mutate({ postId: art.id, artname: art.artName });
    } else {
      favoritePost.mutate({ postId: art.id, artname: art.artName });
    }
  };

  const handleLike = () => {
    if (isLiked) {
      unlikePost.mutate({ postId: art.id, artname: art.artName });
    } else {
      likePost.mutate({ postId: art.id, artname: art.artName });
    }
  };

  const handleImageClick = () => {
    setZoomed(true);
    setFullscreenZoom(false);
  };

  const handleZoomIconClick = () => {
    setZoomed(true);
    setFullscreenZoom(true);
    document.documentElement.requestFullscreen?.();
  };

  const handleCloseZoom = () => {
    setZoomed(false);
    setFullscreenZoom(false);
    document.fullscreenElement && document.exitFullscreen();
  };

  const formattedDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="flex flex-col md:flex-row justify-center gap-6 p-4 min-h-screen">
      {/* Main content */}
      <div className="w-full md:w-3/4 flex flex-col items-center relative">
        {/* Art image */}
        <div className="relative w-full flex justify-center items-center">
          {/* Left Arrow */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-900 dark:text-zinc-400 z-10 hover:bg-black/10 dark:hover:bg-white/10 rounded-full">
            <ChevronLeft size={50} />
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-900 dark:text-zinc-400 z-10 hover:bg-black/10 dark:hover:bg-white/10 rounded-full">
            <ChevronRight size={50} />
          </div>

          {/* Image */}
          <img
            src={art.imageUrl || "/placeholder.png"}
            alt={art.title}
            className="w-full max-h-[500px] sm:max-h-[400px] md:max-h-[500px] object-contain rounded cursor-zoom-in"
            onClick={handleImageClick}
          />
        </div>

        {/* Action buttons */}
        {/* Action buttons - below the image */}
        <div className="flex flex-wrap justify-between sm:justify-between items-center w-full mt-4 gap-3 sm:gap-6 sm:px-20">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <span
                className="cursor-pointer block sm:hidden"
                onClick={() => setShowFavorites(true)}
              >
                {formatNumber(favoriteCount || 0)}
              </span>
              <Star
                size={22}
                className={`transition-transform duration-300 cursor-pointer 
            ${
              isFavorited ? "text-yellow-500 fill-yellow-500" : "text-white/60"
            }`}
                onClick={handleFavorite}
              />

              <span
                className="hidden sm:inline cursor-pointer hover:text-yellow-400"
                onClick={() => setShowFavorites(true)}
              >
                {formatNumber(favoriteCount || 0)} Favorites
              </span>
            </div>

            <FavoriteUsersModal
              postId={art.id}
              isOpen={showFavorites}
              onClose={() => setShowFavorites(false)}
            />

            <div className="flex items-center gap-1 cursor-pointer hover:text-green-400">
              <span className="block sm:hidden">{formatNumber(commentCount || 0)}</span>
              <MessageSquare size={22} />
              <span className="hidden sm:inline">{formatNumber(commentCount || 0)} Comments</span>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex flex-wrap items-center gap-1">
            <span
              className="cursor-pointer block sm:hidden"
              onClick={() => setShowLikes(true)}
            >
              {formatNumber(data?.data.likeCount || 0)}
            </span>
            <LikeButton
              // @ts-ignore
              isLiked={isLiked}
              likeCount={data?.data.likeCount || 0}
              onClick={handleLike}
            />

            <div className="flex items-center gap-2 cursor-pointer hover:text-pink-500">
              <span
                className="hidden sm:inline"
                onClick={() => setShowLikes(true)}
              >
                {formatNumber(data?.data.likeCount || 0)} Likes
              </span>
            </div>

            <LikeUsersModal
              postId={art.id}
              isOpen={showLikes}
              onClose={() => setShowLikes(false)}
            />

            {art.isForSale && (
              <div className="bg-main-color/20 hover:bg-main-color/40 py-[.2rem] text-main-color px-3 rounded-full cursor-pointer text-sm sm:text-base">
                Buy {price?.artcoins} AC
              </div>
            )}
            {!art.downloadingDisabled && (
              <ImageDown className="cursor-pointer" />
            )}
            <button
              onClick={handleZoomIconClick}
              className="bg-main-color/20 hover:bg-main-color/40 p-2 rounded-full flex items-center justify-center"
            >
              <ZoomIn size={20} className="dark:text-gray-300" />
            </button>
            <MoreVertical
              className="cursor-pointer hover:text-gray-400"
              size={22}
            />
          </div>
        </div>

        {/* Artist info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mt-4 sm:px-20 gap-4">
          <div className="flex gap-4 items-center">
            {actualUser?.profileImage ? (
              <img
                src={actualUser.profileImage}
                alt={actualUser.username}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-zinc-600 dark:bg-zinc-800 flex items-center justify-center text-white">
                {actualUser?.name?.charAt(0).toUpperCase() || (
                  <User className="w-4 h-4" />
                )}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">{art.title}</h1>
              <p className="text-md font-medium">
                by{" "}
                <span
                  className="text-zinc-500 font-semibold cursor-pointer hover:text-main-color"
                  onClick={() => navigate(`/${actualUser?.username}`)}
                >
                  {actualUser?.username}
                </span>
              </p>
            </div>
          </div>

          <div className="text-gray-400 font-medium">
            Published At: {formattedDate(art.createdAt)}
          </div>
        </div>

        {/* Tags */}
        {art.hashtags?.length > 0 && (
          <div className="w-full mt-6 sm:px-20 flex flex-wrap gap-2">
            {art.hashtags.map((tag) => (
              <span
                key={tag}
                className="bg-main-color/20 hover:bg-main-color/40 text-main-color px-3 py-1 rounded-full cursor-pointer text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="w-full mt-6 sm:px-20 text-gray-400">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p>{art.description || "No description available."}</p>
        </div>

        {/* Comments section */}
        <div className="w-full mt-6 sm:px-20">
          <h2 className="text-lg font-semibold mb-2">Comments</h2>
          <CommentInputSection postId={art.id} artname={art.artName} />
          <CommentList postId={art.id} />
        </div>
      </div>

      {/* Recommendations sidebar */}
      <div className="w-full md:w-1/4 bg-zinc-900 rounded p-4 text-white mt-6 md:mt-0">
        <p className="font-semibold mb-2">Recommendations</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Recommendations go here.
        </p>
      </div>

      {/* Zoom overlay */}
      {zoomed && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50 p-6 overflow-auto">
          <div className="relative w-full flex justify-center items-center">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full z-10">
              <ChevronLeft size={50} />
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full z-10">
              <ChevronRight size={50} />
            </div>
            <img
              src={art.imageUrl || "/placeholder.png"}
              alt={art.title}
              className="max-h-[80vh] w-auto object-contain"
            />
          </div>

          {fullscreenZoom && actualUser && (
            <div className="mt-4 text-center text-white">
              <h3 className="text-2xl font-bold">{art.title}</h3>
              <p className="text-lg">by {actualUser.name}</p>
            </div>
          )}

          <button
            onClick={handleCloseZoom}
            className="absolute top-6 right-6 text-white hover:text-gray-400"
          >
            <X size={28} />
          </button>

          {fullscreenZoom && (
            <button
              onClick={() => {
                handleCloseZoom();
                navigate("/");
              }}
              className="absolute top-6 left-6 text-white hover:text-gray-400 flex items-center gap-1"
            >
              <ChevronLeft size={24} /> Home
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtPage;
