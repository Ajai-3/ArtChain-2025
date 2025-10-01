import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useGetAllShopItems } from "../hooks/shop/useGetAllShopItems";
import { useGetCategories } from "../hooks/art/useGetCategories";
import { Star, User, IndianRupee, Coins } from "lucide-react";

// Skeleton Loader
const SkeletonCard = () => (
  <div className="rounded-sm flex flex-col bg-zinc-800 animate-pulse h-72">
    <div className="w-full h-48 bg-zinc-700 rounded-t-sm mb-1" />
    <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-2">
        <div className="h-4 w-12 bg-zinc-700 rounded" />
        <div className="h-4 w-16 bg-zinc-700 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-zinc-700" />
        <div className="flex flex-col gap-1">
          <div className="h-4 w-24 bg-zinc-700 rounded" />
          <div className="h-3 w-16 bg-zinc-700 rounded" />
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

interface Category {
  _id: string;
  name: string;
  count: number;
}

interface ShopItem {
  id: string;
  previewUrl: string;
  title: string;
  favoriteCount: number;
  priceType: "artcoin" | "fiat";
  artcoins?: number;
  fiatPrice?: number;
  user?: {
    profileImage?: string;
    username: string;
  };
}

const Shop: React.FC = () => {
  const [filters, setFilters] = useState<FilterType>({});
  const [draftFilters, setDraftFilters] = useState<FilterType>({});

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
    const allCategoryIds = categories.map((c: Category) => c._id);
    setDraftFilters((prev: FilterType) => ({
      ...prev,
      category:
        prev.category?.length === categories.length
          ? []
          : allCategoryIds,
    }));
  };

  const allArts: ShopItem[] = data?.pages.flatMap((page: any) => page.data) || [];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 text-white p-4 flex-shrink-0 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Filters</h2>

        {/* Categories */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Categories</label>
          <div className="max-h-40 overflow-y-auto flex flex-col gap-2 pr-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draftFilters.category?.length === categories?.length}
                onChange={toggleAllCategories}
              />
              <span>All Categories</span>
            </label>
            {categories
              ?.filter((cat: any) => cat.count > 0)
              .map((cat: any) => (
                <label key={cat._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={cat._id}
                    checked={draftFilters.category?.includes(cat._id) || false}
                    onChange={() => toggleCategory(cat._id)}
                  />
                  <span>
                    {cat.name}{" "}
                    <span className="text-gray-400">({cat.count})</span>
                  </span>
                </label>
              ))}
          </div>
        </div>

        {/* Price Order */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Price Order</label>
          <div className="flex flex-col gap-2">
            {["asc", "desc"].map((order) => (
              <label key={order} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priceOrder"
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
                <span>{order === "asc" ? "Low → High" : "High → Low"}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Title Order */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Title Order</label>
          <div className="flex flex-col gap-2">
            {["asc", "desc"].map((order) => (
              <label key={order} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="titleOrder"
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
                <span>{order === "asc" ? "A → Z" : "Z → A"}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6 flex gap-2">
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
            className="w-full"
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
            className="w-full"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <Button variant="default" className="w-full" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={clearAllFilters}
          >
            Clear All Filters
          </Button>
        </div>
      </aside>

      {/* Art Grid */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-transparent p-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
      >
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}

        {!isLoading && allArts.length === 0 && (
          <div className="col-span-full text-center py-10 text-white text-lg">
            No shop items found.
          </div>
        )}

        {!isLoading &&
          allArts.map((item: ShopItem) => (
            <div
              key={item.id}
              className="rounded-sm flex flex-col bg-zinc-900 hover:shadow-xl hover:scale-105 transition-transform duration-300 h-72"
            >
              <img
                src={item.previewUrl}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-sm mb-1"
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
                      {item.priceType === "artcoin"
                        ? item.artcoins
                        : item.fiatPrice}
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
                    <span className="text-white text-md font-medium">
                      {item.title}
                    </span>
                    <span className="text-gray-400 text-sm">
                      by {item.user?.username}
                    </span>
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
    </div>
  );
};

export default Shop;