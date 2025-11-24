import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useGetAllShopItems } from "../hooks/shop/useGetAllShopItems";
import { useGetCategories } from "../hooks/art/useGetCategories";
import { Filter, X } from "lucide-react";
import ShopItemCard from "../components/shop/ShopItemCard";

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

  // Toggle single category
  const toggleCategory = (id: string) => {
    setDraftFilters((prev: FilterType) => {
      const selected = prev.category || [];
      if (selected.includes(id)) {
        return { ...prev, category: selected.filter((c) => c !== id) };
      }
      return { ...prev, category: [...selected, id] };
    });
  };

  // Select / Deselect all categories
  const toggleAllCategories = () => {
    if (!categories) return;
    const allCategoryIds = categories.map((c: any) => c._id);
    setDraftFilters((prev: FilterType) => ({
      ...prev,
      category:
        prev.category?.length === categories.length ? [] : allCategoryIds,
    }));
  };

  const allArts: ShopItem[] =
    data?.pages.flatMap((page: any) => page.data) || [];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden relative">
      {/* Mobile Filter Toggle */}
      <button
        className="md:hidden fixed bottom-20 right-4 z-50 bg-green-500 text-black p-3 rounded-full shadow-lg"
        onClick={() => setIsMobileFilterOpen(true)}
      >
        <Filter size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
        fixed md:relative inset-y-0 left-0 z-40 w-72 bg-background/95 backdrop-blur-xl md:bg-transparent border-r border-white/5 p-6 flex-shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out
        ${isMobileFilterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Filter size={20} className="text-green-500" /> Filters
          </h2>
          <button
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Categories
          </label>
          <div className="max-h-48 overflow-y-auto flex flex-col gap-2 pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer appearance-none w-4 h-4 border border-zinc-600 rounded bg-transparent checked:bg-green-500 checked:border-green-500 transition-colors"
                  checked={draftFilters.category?.length === categories?.length}
                  onChange={toggleAllCategories}
                />
                <svg
                  className="absolute w-3 h-3 text-black pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-zinc-300 group-hover:text-white transition-colors">
                All Categories
              </span>
            </label>
            {categories
              ?.filter((cat: any) => cat.count > 0)
              .map((cat: any) => (
                <label
                  key={cat._id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-4 h-4 border border-zinc-600 rounded bg-transparent checked:bg-green-500 checked:border-green-500 transition-colors"
                      value={cat._id}
                      checked={
                        draftFilters.category?.includes(cat._id) || false
                      }
                      onChange={() => toggleCategory(cat._id)}
                    />
                    <svg
                      className="absolute w-3 h-3 text-black pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-zinc-300 group-hover:text-white transition-colors flex-1">
                    {cat.name}
                  </span>
                  <span className="text-zinc-500 text-xs bg-zinc-800/50 px-1.5 py-0.5 rounded">
                    {cat.count}
                  </span>
                </label>
              ))}
          </div>
        </div>

        {/* Price Order */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Price Order
          </label>
          <div className="flex flex-col gap-2">
            {["asc", "desc"].map((order) => (
              <label
                key={order}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    name="priceOrder"
                    className="peer appearance-none w-4 h-4 border border-zinc-600 rounded-full bg-transparent checked:border-green-500 checked:border-4 transition-all"
                    value={order}
                    checked={draftFilters.priceOrder === order}
                    onChange={() =>
                      setDraftFilters((prev: FilterType) => ({
                        ...prev,
                        priceOrder:
                          prev.priceOrder === order
                            ? undefined
                            : (order as "asc" | "desc"),
                      }))
                    }
                  />
                </div>
                <span className="text-zinc-300 group-hover:text-white transition-colors">
                  {order === "asc" ? "Low → High" : "High → Low"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Title Order */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Title Order
          </label>
          <div className="flex flex-col gap-2">
            {["asc", "desc"].map((order) => (
              <label
                key={order}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    name="titleOrder"
                    className="peer appearance-none w-4 h-4 border border-zinc-600 rounded-full bg-transparent checked:border-green-500 checked:border-4 transition-all"
                    value={order}
                    checked={draftFilters.titleOrder === order}
                    onChange={() =>
                      setDraftFilters((prev: FilterType) => ({
                        ...prev,
                        titleOrder:
                          prev.titleOrder === order
                            ? undefined
                            : (order as "asc" | "desc"),
                      }))
                    }
                  />
                </div>
                <span className="text-zinc-300 group-hover:text-white transition-colors">
                  {order === "asc" ? "A → Z" : "Z → A"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
            Price Range
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={draftFilters.minPrice || ""}
              onChange={(e) =>
                setDraftFilters((prev: FilterType) => ({
                  ...prev,
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full bg-zinc-900/50 border-zinc-700 focus:border-green-500 transition-colors"
            />
            <Input
              type="number"
              placeholder="Max"
              value={draftFilters.maxPrice || ""}
              onChange={(e) =>
                setDraftFilters((prev: FilterType) => ({
                  ...prev,
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full bg-zinc-900/50 border-zinc-700 focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-auto">
          <Button
            variant="outline"
            className="w-full bg-green-600 text-white font-medium py-6"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white py-6"
            onClick={clearAllFilters}
          >
            Clear All Filters
          </Button>
        </div>
      </aside>

      {/* Art Grid */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-transparent p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
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
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;