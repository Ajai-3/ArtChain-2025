import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { useGetArtByName } from '../hooks/art/useGetArtByName';
import { useLikePost } from '../hooks/art/useLikePost';
import { useUnlikePost } from '../hooks/art/useUnlikePost';
import { useFavoritePost } from '../hooks/art/useFavoritePost';
import { useUnfavoritePost } from '../hooks/art/useUnfavoritePost';
import { useRelatedArtworks } from '../hooks/art/useRelatedArtworks';
import { useBuyArtMutation } from '../hooks/art/useBuyArtMutation';
import { useDownloadFileMutation } from '../hooks/art/useDownloadFileMutation';
import ArtPageSkeleton from '../components/skeletons/ArtPageSkeleton';
import ArtImageSection from '../components/art/details/ArtImageSection';
import ArtActions from '../components/art/details/ArtActions';
import ArtInfo from '../components/art/details/ArtInfo';
import Comments from '../components/art/details/Comments';
import ArtSidebar from '../components/art/details/ArtSidebar';
import ZoomOverlay from '../components/art/details/ZoomOverlay';
import BuyArtModal from '../components/art/details/BuyArtModal';
import { EditArtModal } from '../components/art/EditArtModal';
import { useDeleteArtPost } from '../hooks/art/useDeleteArtPost';
import ConfirmModal from '../../../components/modals/ConfirmModal';
import { ROUTES } from '../../../constants/routes';
import type { ArtWithUserResponse } from '../../../types/art';
import ContentUnavailable from '../../../components/ContentUnavailable';

const ArtPage: React.FC = () => {
  const { artname } = useParams<{ artname: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const wallet = useSelector((state: RootState) => state.wallet);

  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const favoritePost = useFavoritePost();
  const unfavoritePost = useUnfavoritePost();
  const buyArtMutation = useBuyArtMutation();
  const downloadArtMutation = useDownloadFileMutation();

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useGetArtByName(artname!);
  const data = apiResponse as unknown as { data: ArtWithUserResponse };

  const [zoomed, setZoomed] = useState(false);
  const [fullscreenZoom, setFullscreenZoom] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { mutate: deleteArt, isPending: isDeleting } = useDeleteArtPost();

  const {
    data: recommendedArts,
    fetchNextPage,
    hasNextPage,
    isLoading: isRecLoading,
  } = useRelatedArtworks(data?.data?.art?.artType, data?.data?.art?.id || '');

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
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
      <div className='text-center mt-10'>
        <ArtPageSkeleton />
      </div>
    );
  if (isError)
    return <ContentUnavailable />;
  if (!data?.data?.art)
    return <ContentUnavailable />;

  const art = data.data.art;
  const actualUser = data.data.user;
  const price = data.data.price;
  const purchaser = data.data.purchaser;

  const handleFavorite = () => {
    if (!user.isAuthenticated) return navigate(ROUTES.LOGIN);

    if (data.data.isFavorited) {
      unfavoritePost.mutate({ postId: art.id, artname: art.artName });
    } else {
      favoritePost.mutate({ postId: art.id, artname: art.artName });
    }
  };

  const handleLike = () => {
    if (!user.isAuthenticated) return navigate(ROUTES.LOGIN);

    if (data.data.isLiked) {
      unlikePost.mutate({ postId: art.id, artname: art.artName });
    } else {
      likePost.mutate({ postId: art.id, artname: art.artName });
    }
  };

  const handleShowFavorites = () => {
    if (!user.isAuthenticated) return navigate(ROUTES.LOGIN);
    setShowFavorites(true);
  };

  const handleShowLikes = () => {
    if (!user.isAuthenticated) return navigate(ROUTES.LOGIN);
    setShowLikes(true);
  };

  const handleBuy = () => {
    if (!user.isAuthenticated) return navigate(ROUTES.LOGIN);
    setShowBuyModal(true);
  };

  const confirmBuy = () => {
    buyArtMutation.mutate(art.id, {
      onSuccess: () => setShowBuyModal(false),
    });
  };

  const handleDownload = () => {
    if (!user.isAuthenticated) return navigate(ROUTES.LOGIN);

    const artId = art.id;

    if (!artId) {
      console.error('Critical: Art ID is missing from the object', art);
      return;
    }
    console.log(art.id, art);
    downloadArtMutation.mutate({
      id: artId,
      category: 'art',
    });
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

  const currentZoomedArt =
    currentImageIndex === 0
      ? { art, user: actualUser }
      : recommendedArts[currentImageIndex - 1];

  const formattedDate = new Date(art.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const isOwner = user.user?.id === (art.userId || actualUser.id);
  const isPurchaser = purchaser?.id === user.user?.id;

  const canBuy = art.isForSale && !isOwner;

  const isFree =
    !art.isForSale &&
    !purchaser &&
    !art.downloadingDisabled &&
    (!price?.artcoins || price?.artcoins === 0);
  const canDownload = isOwner || isPurchaser || isFree;

  return (
    <div className='flex flex-col lg:flex-row justify-center gap-6 p-3 sm:p-4 min-h-screen max-w-[1600px] mx-auto'>
      <div className='w-full lg:w-3/4 flex flex-col items-center relative'>
        <ArtImageSection
          imageUrl={art.imageUrl}
          title={art.title}
          onImageClick={handleImageClick}
        />

        <ArtActions
          art={{
            id: art.id,
            artName: art.artName,
            artType: art.artType,
            isForSale: canBuy,
            isSold: art.isSold ?? false,
            downloadingDisabled: !canDownload,
            price,
            userId: art.userId,
            purchaser,
          }}
          stats={{
            isLiked: data.data.isLiked,
            likeCount: data.data.likeCount || 0,
            isFavorited: data.data.isFavorited,
            favoriteCount: data.data.favoriteCount || 0,
            commentCount: data.data.commentCount || 0,
          }}
          user={{ isAuthenticated: user.isAuthenticated }}
          isOwner={isOwner}
          handlers={{
            onLike: handleLike,
            onFavorite: handleFavorite,
            onShowLikes: handleShowLikes,
            onShowFavorites: handleShowFavorites,
            onZoom: handleZoomIconClick,
            onCloseLikes: () => setShowLikes(false),
            onCloseFavorites: () => setShowFavorites(false),
            onReport: () => setShowReport(true),
            onCloseReport: () => setShowReport(false),
            onDownload: handleDownload,
            onBuy: handleBuy,
            onEdit: () => setIsEditModalOpen(true),
            onDelete: () => setIsDeleteConfirmOpen(true),
          }}
          modals={{ showLikes, showFavorites, showReport }}
          isDownloading={downloadArtMutation.isPending}
        />

        <ArtInfo
          art={{
            title: art.title,
            createdAt: art.createdAt,
            hashtags: art.hashtags,
            description: art.description,
          }}
          artist={{
            username: actualUser?.username || '',
            name: actualUser?.name || '',
            profileImage: actualUser?.profileImage,
          }}
          formattedDate={formattedDate}
          purchaser={purchaser}
        />

        <Comments
          artId={art.id}
          artName={art.artName}
          commentingDisabled={art.commentingDisabled}
        />
      </div>

      <ArtSidebar
        isForSale={canBuy}
        price={price}
        onBuy={() => handleBuy()}
        recommendedArts={recommendedArts}
        isRecLoading={isRecLoading}
        observerTarget={observerTarget as React.RefObject<HTMLDivElement>}
        isBuying={buyArtMutation.isPending}
      />

      <ZoomOverlay
        isOpen={zoomed}
        currentImageIndex={currentImageIndex}
        totalImages={recommendedArts.length}
        currentArt={currentZoomedArt}
        isFullscreen={fullscreenZoom}
        onClose={handleCloseZoom}
        onPrev={() =>
          currentImageIndex > 0 && setCurrentImageIndex(currentImageIndex - 1)
        }
        onNext={() =>
          currentImageIndex < recommendedArts.length &&
          setCurrentImageIndex(currentImageIndex + 1)
        }
        onGoHome={() => {
          handleCloseZoom();
          navigate(ROUTES.HOME);
        }}
      />

      <BuyArtModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        onConfirm={confirmBuy}
        artName={art.artName}
        price={price?.artcoins || 0}
        balance={wallet.balance || 0}
        isLoading={buyArtMutation.isPending}
      />

      {isOwner && isEditModalOpen && (
        <EditArtModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          art={{
            id: art.id,
            userId: art.userId,
            title: art.title,
            description: art.description,
            artType: art.artType,
            hashtags: art.hashtags || [],
            artName: art.artName,
            imageUrl: art.imageUrl,
            aspectRatio: art.aspectRatio || '1:1',
            commentingDisabled: art.commentingDisabled || false,
            downloadingDisabled: art.downloadingDisabled || false,
            isPrivate: false,
            isSensitive: false,
            isForSale: art.isForSale || false,
            priceType: (price?.type as 'artcoin' | 'fiat') || 'artcoin',
            artcoins: price?.artcoins,
            fiatPrice: price?.fiat,
            postType: (art.postType || 'original') as 'original' | 'repost' | 'purchased',
            createdAt: art.createdAt,
            updatedAt: art.updatedAt,
          }}
        />
      )}

      {isOwner && isDeleteConfirmOpen && (
        <ConfirmModal
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={() => {
            deleteArt(art.id, {
              onSuccess: () => {
                setIsDeleteConfirmOpen(false);
                navigate(ROUTES.HOME); // Or wherever you want to redirect after delete
              },
            });
          }}
          title="Delete Artwork"
          description="Are you sure you want to delete this artwork? This action cannot be undone."
          confirmText="Delete"
          confirmVariant="destructive"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default ArtPage;
