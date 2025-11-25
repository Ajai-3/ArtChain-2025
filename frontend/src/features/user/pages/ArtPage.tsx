import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useGetArtByName } from "../hooks/art/useGetArtByName";
import { useLikePost } from "../hooks/art/useLikePost";
import { useUnlikePost } from "../hooks/art/useUnlikePost";
import { useFavoritePost } from "../hooks/art/useFavoritePost";
import { useUnfavoritePost } from "../hooks/art/useUnfavoritePost";
import { useRelatedArtworks } from "../hooks/art/useRelatedArtworks";
import ArtPageSkeleton from "../components/skeletons/ArtPageSkeleton";
import ArtImageSection from "../components/art/details/ArtImageSection";
import ArtActions from "../components/art/details/ArtActions";
import ArtInfo from "../components/art/details/ArtInfo";
import Comments from "../components/art/details/Comments";
import ArtSidebar from "../components/art/details/ArtSidebar";
import ZoomOverlay from "../components/art/details/ZoomOverlay";

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
  const [showReport, setShowReport] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    data: recommendedArts,
    fetchNextPage,
    hasNextPage,
    isLoading: isRecLoading,
  } = useRelatedArtworks(data?.data?.art?.artType, data?.data?.art?.id || "");

  const observerTarget = useRef<HTMLDivElement>(null);

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

  if (isLoading) return <div className="text-center mt-10"><ArtPageSkeleton /></div>;
  if (isError) return <div className="text-center mt-10">Error: {error?.message}</div>;
  if (!data?.data?.art) return <div className="text-center mt-10">Art not found</div>;

  const art = data.data.art;
  const actualUser = data.data.user;
  const price = data.data.price;

  const handleFavorite = () => {
    if (!user.isAuthenticated) return navigate("/login");
    data.data.isFavorited
      ? unfavoritePost.mutate({ postId: art.id, artname: art.artName })
      : favoritePost.mutate({ postId: art.id, artname: art.artName });
  };

  const handleLike = () => {
    if (!user.isAuthenticated) return navigate("/login");
    data.data.isLiked
      ? unlikePost.mutate({ postId: art.id, artname: art.artName })
      : likePost.mutate({ postId: art.id, artname: art.artName });
  };

  const handleShowFavorites = () => {
    if (!user.isAuthenticated) return navigate("/login");
    setShowFavorites(true);
  };

  const handleShowLikes = () => {
    if (!user.isAuthenticated) return navigate("/login");
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
    setCurrentImageIndex(0);
    document.fullscreenElement && document.exitFullscreen();
  };

  const currentZoomedArt = currentImageIndex === 0 
    ? { art, user: actualUser }
    : recommendedArts[currentImageIndex - 1];

  const formattedDate = new Date(art.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-6 p-3 sm:p-4 min-h-screen max-w-[1600px] mx-auto">
      <div className="w-full lg:w-3/4 flex flex-col items-center relative">
        <ArtImageSection imageUrl={art.imageUrl} title={art.title} onImageClick={handleImageClick} />

        <ArtActions
          art={{ id: art.id, artName: art.artName, isForSale: art.isForSale, downloadingDisabled: art.downloadingDisabled, price }}
          stats={{ isLiked: data.data.isLiked, likeCount: data.data.likeCount || 0, isFavorited: data.data.isFavorited, favoriteCount: data.data.favoriteCount || 0, commentCount: data.data.commentCount || 0 }}
          user={{ isAuthenticated: user.isAuthenticated }}
          handlers={{ 
            onLike: handleLike, 
            onFavorite: handleFavorite, 
            onShowLikes: handleShowLikes, 
            onShowFavorites: handleShowFavorites, 
            onZoom: handleZoomIconClick, 
            onCloseLikes: () => setShowLikes(false), 
            onCloseFavorites: () => setShowFavorites(false),
            onReport: () => setShowReport(true),
            onCloseReport: () => setShowReport(false)
          }}
          modals={{ showLikes, showFavorites, showReport }}
        />

        <ArtInfo
          art={{ title: art.title, createdAt: art.createdAt, hashtags: art.hashtags, description: art.description }}
          artist={{ username: actualUser?.username || "", name: actualUser?.name || "", profileImage: actualUser?.profileImage }}
          formattedDate={formattedDate}
        />

        <Comments artId={art.id} artName={art.artName} commentingDisabled={art.commentingDisabled} />
      </div>

      <ArtSidebar
        isForSale={art.isForSale}
        price={price}
        onBuy={() => console.log("Buy clicked")}
        recommendedArts={recommendedArts}
        isRecLoading={isRecLoading}
        observerTarget={observerTarget as React.RefObject<HTMLDivElement>}
      />

      <ZoomOverlay
        isOpen={zoomed}
        currentImageIndex={currentImageIndex}
        totalImages={recommendedArts.length}
        currentArt={currentZoomedArt}
        isFullscreen={fullscreenZoom}
        onClose={handleCloseZoom}
        onPrev={() => currentImageIndex > 0 && setCurrentImageIndex(currentImageIndex - 1)}
        onNext={() => currentImageIndex < recommendedArts.length && setCurrentImageIndex(currentImageIndex + 1)}
        onGoHome={() => { handleCloseZoom(); navigate("/"); }}
      />
    </div>
  );
};

export default ArtPage;
