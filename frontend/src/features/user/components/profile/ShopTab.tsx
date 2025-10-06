import React, { useRef, useEffect } from "react";
import { useGetShopItemsByUser } from "../../hooks/shop/useGetShopItemsByUser";
import { Star, User, IndianRupee, Coins } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";

const SkeletonCard = () => (
  <div className="rounded-sm flex flex-col bg-zinc-800 animate-pulse h-72">
    <div className="w-full h-48 bg-zinc-700 rounded-t-sm mb-1" />
    <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
      <div className="h-4 w-12 bg-zinc-700 rounded mb-2" />
      <div className="flex items-center gap-2 mt-auto">
        <div className="w-12 h-12 rounded-full bg-zinc-700" />
        <div className="flex flex-col gap-1">
          <div className="h-4 w-24 bg-zinc-700 rounded" />
          <div className="h-3 w-16 bg-zinc-700 rounded" />
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
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetShopItemsByUser(targetUserId);
  const navigate = useNavigate()

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
      className="flex-1 overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 h-[calc(100vh-64px)]"
    >
      {isLoading &&
        Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}

      {!isLoading && allArts.length === 0 && (
        <div className="col-span-full text-center py-10 text-white text-lg">
          No shop items found.
        </div>
      )}

      {!isLoading &&
        allArts.map((item: any) => (
          <div
            key={item.id}
            className="rounded-sm flex flex-col bg-zinc-900 hover:shadow-xl hover:scale-105 transition-transform duration-300 h-72"
            onClick={() => navigate(`/${profileUser.username}/art/${item.artName}`)}
          >
            <img
              src={item.previewUrl}
              alt={item.title}
              className="w-full h-44 object-cover rounded-t-sm mb-1"
            />
            <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white text-sm flex items-center gap-1">
                  <Star size={16} /> {item.favoriteCount}
                </span>
                <div className="flex items-center gap-1 text-white font-semibold">
                  {item.priceType === "artcoin" ? (
                    <Coins className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <IndianRupee className="w-4 h-4 text-green-500" />
                  )}
                  <span className="text-white text-sm font-medium">
                    {item.priceType === "artcoin" ? item.artcoins : item.fiatPrice}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.user?.profileImage ? (
                  <img
                    src={item.user.profileImage}
                    alt={item.user.username}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-zinc-700">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-white text-md font-medium">{item.title}</span>
                  <span className="text-gray-400 text-sm">by {item.user?.username}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

      {isFetchingNextPage && (
        <div className="col-span-full text-center py-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-main-color"></div>
          <p className="text-white mt-2">Loading more artworks...</p>
        </div>
      )}
    </div>
  );
};

export default ShopUser;
