import React, { useState, useRef, useEffect } from "react";
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
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useRelatedArtworks } from "../hooks/art/useRelatedArtworks";
import RecommendedArtCard from "../components/art/RecommendedArtCard";

const ArtPage: React.FC = () => {
  const { artname } = useParams<{ artname: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const favoritePost = useFavoritePost();
  const unfavoritePost = useUnfavoritePost();

  const { data, isLoading, isError, error } = useGetArtByName(artname!);

  const [zoomed, setZoomed] = useState(false);
  const [fullscreenZoom, setFullscreenZoom] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  // Recommendations Hook
  const {
    data: recommendedArts,
    fetchNextPage,
    hasNextPage,
    isLoading: isRecLoading,
  } = useRelatedArtworks(data?.data?.art?.artType, data?.data?.art?.id || "");

  // Intersection Observer for Infinite Scroll
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, hasNextPage, fetchNextPage]);

  if (isLoading)
    return (
      <div className="text-center mt-10">
        <ArtPageSkeleton />
      </div>
    );
  if (isError)
    return <div className="text-center mt-10">Error: {error?.message}</div>;
  if (!data?.data?.art)
    return <div className="text-center mt-10">Art not found</div>;

  const art = data.data.art;
  const actualUser = data.data.user;
  const price = data.data.price;
  const commentCount = data.data.commentCount;
  const isLiked = data.data.isLiked;
  const isFavorited = data.data.isFavorited;
  const favoriteCount = data.data.favoriteCount;

  const handleFavorite = () => {
    if (!user.isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isFavorited) {
      unfavoritePost.mutate({ postId: art.id, artname: art.artName });
    } else {
      favoritePost.mutate({ postId: art.id, artname: art.artName });
    }
  };

  const handleLike = () => {
    if (!user.isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isLiked) {
      unlikePost.mutate({ postId: art.id, artname: art.artName });
    } else {
      likePost.mutate({ postId: art.id, artname: art.artName });
    }
  };

  const handleShowFavorites = () => {
    if (!user.isAuthenticated) {
      navigate("/login");
      return;
    }
    setShowFavorites(true);
  };

  const handleShowLikes = () => {
    if (!user.isAuthenticated) {
      navigate("/login");
      return;
    }
    setShowLikes(true);
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
    <div className="flex flex-col lg:flex-row justify-center gap-6 p-3 sm:p-4 min-h-screen">
      {/* Main content */}
      <div className="w-full lg:w-3/4 flex flex-col items-center relative">
        {/* Art image */}
        <div className="relative w-full flex justify-center items-center">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-900 dark:text-zinc-400 z-10 hover:bg-black/10 dark:hover:bg-white/10 rounded-full">
            <ChevronLeft size={50} />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-900 dark:text-zinc-400 z-10 hover:bg-black/10 dark:hover:bg-white/10 rounded-full">
            <ChevronRight size={50} />
          </div>
          <img
            src={art.imageUrl || "/placeholder.png"}
            alt={art.title}
            className="w-full max-h-[500px] sm:max-h-[400px] md:max-h-[500px] object-contain rounded cursor-zoom-in"
            onClick={handleImageClick}
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-between sm:justify-between items-center w-full mt-4 gap-3 sm:gap-6 sm:px-20">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <span
                className="cursor-pointer block sm:hidden"
                onClick={handleShowFavorites}
              >
                {formatNumber(favoriteCount || 0)}
              </span>
              <Star
                size={22}
                className={`transition-transform duration-300 cursor-pointer ${
                  isFavorited
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-white/60"
                }`}
                onClick={handleFavorite}
              />
              <span
                className="hidden sm:inline cursor-pointer hover:text-yellow-400"
                onClick={handleShowFavorites}
              >
                {formatNumber(favoriteCount || 0)} Favorites
              </span>
            </div>

            {user.isAuthenticated && (
              <FavoriteUsersModal
                postId={art.id}
                isOpen={showFavorites}
                onClose={() => setShowFavorites(false)}
              />
            )}

            <div className="flex items-center gap-1 cursor-pointer hover:text-green-400">
              <span className="block sm:hidden">
                {formatNumber(commentCount || 0)}
              </span>
              <MessageSquare size={22} />
              <span className="hidden sm:inline">
                {formatNumber(commentCount || 0)} Comments
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <span
              className="cursor-pointer block sm:hidden"
              onClick={handleShowLikes}
            >
              {formatNumber(data?.data.likeCount || 0)}
            </span>
            <LikeButton
              isLiked={isLiked}
              likeCount={data?.data.likeCount || 0}
              onClick={handleLike}
            />
            <div className="flex items-center gap-2 cursor-pointer hover:text-pink-500">
              <span className="hidden sm:inline" onClick={handleShowLikes}>
                {formatNumber(data?.data.likeCount || 0)} Likes
              </span>
            </div>

            {user.isAuthenticated && (
              <LikeUsersModal
                postId={art.id}
                isOpen={showLikes}
                onClose={() => setShowLikes(false)}
              />
            )}

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
      <div className="w-full lg:w-1/4 p-4 mt-6 lg:mt-0">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Recommended
        </h3>
        <div className="flex flex-col gap-4">
          {recommendedArts.map((item) => (
            <RecommendedArtCard
              key={item.art.id}
              art={item.art}
              username={item.user?.username || ""}
            />
          ))}
          {isRecLoading && (
            <div className="text-center text-gray-400 py-4">Loading...</div>
          )}
          {!isRecLoading && recommendedArts.length === 0 && (
             <div className="text-center text-gray-400 py-4">No recommendations found.</div>
          )}
          <div ref={observerTarget} className="h-4 w-full" />
        </div>
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
