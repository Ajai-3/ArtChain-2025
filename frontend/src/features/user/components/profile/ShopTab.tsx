import React, { useRef, useEffect } from "react";
import { useGetShopItemsByUser } from "../../hooks/shop/useGetShopItemsByUser";
import { useOutletContext } from "react-router-dom";
import ShopItemCard from "../shop/ShopItemCard";

const SkeletonCard = () => (
  <div className="rounded-xl flex flex-col bg-zinc-900/50 animate-pulse h-[320px] border border-white/5">
    <div className="w-full h-48 bg-zinc-800 rounded-t-xl mb-1" />
    <div className="p-4 flex-1 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="h-5 w-2/3 bg-zinc-800 rounded" />
        <div className="h-5 w-16 bg-zinc-800 rounded" />
      </div>
      <div className="flex items-center gap-3 mt-auto pt-3 border-t border-white/5">
        <div className="w-8 h-8 rounded-full bg-zinc-800" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-16 bg-zinc-800 rounded" />
          <div className="h-2 w-12 bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  </div>
);

interface ShopTabProps {
  profileUser: { id: string; username: string };
}

const ShopUser: React.FC = () => {
  const { profileUser } = useOutletContext<ShopTabProps>();
  const targetUserId = profileUser.id;
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetShopItemsByUser(targetUserId);

  const allArts = data?.pages?.flatMap((page: any) => page.data) || [];

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !hasNextPage || isFetchingNextPage) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 200) fetchNextPage();
    };

    const div = containerRef.current;
    div?.addEventListener("scroll", handleScroll);
    return () => div?.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 h-[calc(100vh-64px)] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
    >
      {isLoading &&
        Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}

      {!isLoading && allArts.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-400">
          <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🛍️</span>
          </div>
          <h3 className="text-lg font-medium text-white mb-1">No items yet</h3>
          <p className="text-sm">This user hasn't listed any items for sale.</p>
        </div>
      )}

      {!isLoading &&
        allArts.map((item: any) => (
          <div key={item.id} className="h-full">
            <ShopItemCard item={item} />
          </div>
        ))}

      {isFetchingNextPage && (
        <div className="col-span-full text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default ShopUser;
