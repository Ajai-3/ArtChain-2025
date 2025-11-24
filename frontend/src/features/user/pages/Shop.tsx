import React, { useState, useEffect, useRef } from "react";
import { useGetAllShopItems } from "../hooks/shop/useGetAllShopItems";
import { useGetCategories } from "../hooks/art/useGetCategories";
import { Filter } from "lucide-react";
import ShopItemCard from "../components/shop/ShopItemCard";
import ShopFilters from "../components/shop/ShopFilters";

// Skeleton Loader
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

type FilterType = {
  category?: string[];
  priceOrder?: "asc" | "desc";
  titleOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
};

interface ShopItem {
  id: string;
  previewUrl: string;
  title: string;
  favoriteCount: number;
  priceType: "artcoin" | "fiat";
  artcoins?: number;
  fiatPrice?: number;
  artName: string;
  user?: {
    profileImage?: string;
    username: string;
  };
}

const Shop: React.FC = () => {
  const [filters, setFilters] = useState<FilterType>({});
  const [draftFilters, setDraftFilters] = useState<FilterType>({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetAllShopItems(filters);

  const { data: categories } = useGetCategories();

  const containerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isFetchingNextPage || !hasNextPage) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 200) fetchNextPage();
    };

    const div = containerRef.current;
    div?.addEventListener("scroll", handleScroll);
    return () => div?.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

  // Clear filters
  const clearAllFilters = () => {
    setDraftFilters({});
    setFilters({});
  };

  // Apply filters
  const applyFilters = () => {
    setFilters(draftFilters);
    setIsMobileFilterOpen(false);
  };

  const allArts: ShopItem[] =
    data?.pages.flatMap((page: any) => page.data) || [];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden relative">
      {/* Mobile Filter Toggle */}
      <button
        className="md:hidden fixed bottom-20 right-4 z-50 bg-main-color text-black p-3 rounded-full shadow-lg hover:bg-main-color-dark transition-colors"
        onClick={() => setIsMobileFilterOpen(true)}
      >
        <Filter size={24} />
      </button>

      {/* Filters Sidebar */}
      <ShopFilters
        filters={filters}
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        categories={categories || []}
        isMobileFilterOpen={isMobileFilterOpen}
        setIsMobileFilterOpen={setIsMobileFilterOpen}
        onApplyFilters={applyFilters}
        onClearFilters={clearAllFilters}
      />

      {/* Art Grid */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-transparent p-2 md:p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}

        {!isLoading && allArts.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-400">
            <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              No items found
            </h3>
            <p className="text-base">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
        )}

        {!isLoading &&
          allArts.map((item: ShopItem) => (
            <div key={item.id} className="h-full">
              <ShopItemCard item={item} />
            </div>
          ))}

        {isFetchingNextPage && (
          <div className="col-span-full text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-main-color border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;