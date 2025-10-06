import ArtCard from "../art/ArtCard";
import React, { useRef, useCallback } from "react";
import { useOutletContext } from "react-router-dom";

import { useGetUserFavorites } from "../../hooks/profile/favorites/useGetUserFavorites";

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

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (isError) return <div className="text-center mt-10">Error: {error?.message}</div>;

  // Flatten all pages
  const arts: any = data?.pages.flatMap((page: any) => page.data) ?? [];

  if (arts.length === 0) return <div className="text-center mt-10">No favorites yet.</div>;

  return (
    <div className="flex flex-wrap gap-2">
      {arts.map((art: any, index: any) => {
        const isLastArt = index === arts.length - 1;
        return <ArtCard key={art._id} item={art} lastArtRef={isLastArt ? lastArtRef : undefined} />;
      })}
      {isFetchingNextPage && <div className="text-center col-span-full">Loading more...</div>}
    </div>
  );
};

export default FavoritesTab;
